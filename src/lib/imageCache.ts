import { openDB, type IDBPDatabase } from 'idb';

interface CachedImage {
  id: string;
  blob: Blob;
  mimeType: string;
  size: number;
  artist?: string;
  cachedAt: number;
  expiresAt: number;
  source: 'r2' | 'static' | 'network';
}

interface CacheStats {
  count: number;
  totalSize: number;
  oldestEntry: number | null;
  newestEntry: number | null;
}

interface ImageCacheDB {
  images: {
    key: string;
    value: CachedImage;
    indexes: {
      'by-expiry': number;
      'by-artist': string;
      'by-cached-at': number;
    };
  };
}

const DB_NAME = 'cubatattoo-images';
const DB_VERSION = 1;
const STORE_NAME = 'images';
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_CACHE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

let dbPromise: Promise<IDBPDatabase<ImageCacheDB>> | null = null;

function getDB(): Promise<IDBPDatabase<ImageCacheDB>> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in SSR'));
  }
  if (!dbPromise) {
    dbPromise = openDB<ImageCacheDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by-expiry', 'expiresAt');
        store.createIndex('by-artist', 'artist');
        store.createIndex('by-cached-at', 'cachedAt');
      },
    });
  }
  return dbPromise;
}

export async function getCachedImage(id: string): Promise<CachedImage | undefined> {
  const db = await getDB();
  const entry = await db.get(STORE_NAME, id);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    await db.delete(STORE_NAME, id);
    return undefined;
  }
  return entry;
}

export async function putCachedImage(
  id: string,
  blob: Blob,
  options: {
    mimeType?: string;
    artist?: string;
    source?: CachedImage['source'];
    ttlMs?: number;
  } = {},
): Promise<void> {
  const db = await getDB();
  const now = Date.now();
  const entry: CachedImage = {
    id,
    blob,
    mimeType: options.mimeType || blob.type || 'image/jpeg',
    size: blob.size,
    artist: options.artist,
    cachedAt: now,
    expiresAt: now + (options.ttlMs ?? DEFAULT_TTL_MS),
    source: options.source || 'network',
  };
  await evictIfNeeded(entry.size);
  await db.put(STORE_NAME, entry);
}

export async function deleteCachedImage(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function getAllCachedImages(): Promise<CachedImage[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function clearCache(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

export async function getCacheStats(): Promise<CacheStats> {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);
  if (all.length === 0) {
    return { count: 0, totalSize: 0, oldestEntry: null, newestEntry: null };
  }
  let totalSize = 0;
  let oldest = Infinity;
  let newest = 0;
  for (const entry of all) {
    totalSize += entry.size;
    if (entry.cachedAt < oldest) oldest = entry.cachedAt;
    if (entry.cachedAt > newest) newest = entry.cachedAt;
  }
  return {
    count: all.length,
    totalSize,
    oldestEntry: oldest === Infinity ? null : oldest,
    newestEntry: newest === 0 ? null : newest,
  };
}

export async function cleanExpired(): Promise<number> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const index = tx.store.index('by-expiry');
  const now = Date.now();
  let deleted = 0;
  let cursor = await index.openCursor(IDBKeyRange.upperBound(now));
  while (cursor) {
    await cursor.delete();
    deleted++;
    cursor = await cursor.continue();
  }
  await tx.done;
  return deleted;
}

async function evictIfNeeded(incomingSize: number): Promise<void> {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);
  let totalSize = all.reduce((sum, e) => sum + e.size, 0);
  if (totalSize + incomingSize <= MAX_CACHE_SIZE_BYTES) return;

  all.sort((a, b) => a.cachedAt - b.cachedAt);
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const entry of all) {
    if (totalSize + incomingSize <= MAX_CACHE_SIZE_BYTES) break;
    await tx.store.delete(entry.id);
    totalSize -= entry.size;
  }
  await tx.done;
}

export type { CachedImage, CacheStats };
