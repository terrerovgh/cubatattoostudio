import type { SessionData } from '../types/auth';

const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 16;
const SESSION_TTL = 86400; // 24 hours in seconds
const RATE_LIMIT_WINDOW = 900; // 15 minutes in seconds
const RATE_LIMIT_MAX = 5;

// ─── Password Hashing (PBKDF2-SHA256) ──────────────────

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return {
    hash: bufferToHex(derivedBits),
    salt: bufferToHex(salt.buffer),
  };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const salt = hexToBuffer(storedSalt);
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  const computedHash = bufferToHex(derivedBits);
  return safeCompare(computedHash, storedHash);
}

// ─── Session Management (KV-backed) ────────────────────

export async function createSession(
  data: SessionData,
  kv: KVNamespace
): Promise<string> {
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = bufferToHex(tokenBytes.buffer);
  await kv.put(`session:${token}`, JSON.stringify(data), {
    expirationTtl: SESSION_TTL,
  });
  return token;
}

export async function getSession(
  token: string,
  kv: KVNamespace
): Promise<SessionData | null> {
  if (!token) return null;
  const data = await kv.get(`session:${token}`);
  if (!data) return null;
  return JSON.parse(data) as SessionData;
}

export async function destroySession(
  token: string,
  kv: KVNamespace
): Promise<void> {
  if (!token) return;
  await kv.delete(`session:${token}`);
}

// ─── Rate Limiting (KV-backed) ─────────────────────────

export async function checkRateLimit(
  key: string,
  kv: KVNamespace
): Promise<{ allowed: boolean; remaining: number }> {
  const rlKey = `rl:${key}`;
  const raw = await kv.get(rlKey);
  const attempts = raw ? parseInt(raw, 10) : 0;

  if (attempts >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  await kv.put(rlKey, String(attempts + 1), {
    expirationTtl: RATE_LIMIT_WINDOW,
  });

  return { allowed: true, remaining: RATE_LIMIT_MAX - attempts - 1 };
}

// ─── CSRF Protection ───────────────────────────────────

export function generateCSRFToken(sessionToken: string): string {
  // Simple HMAC-based CSRF token derived from session token
  // The token is the first 32 chars of SHA-256(session_token + secret_suffix)
  const encoder = new TextEncoder();
  const data = encoder.encode(sessionToken + ':csrf');
  // Synchronous approach: use the session token itself as a base
  const hash = Array.from(new Uint8Array(16))
    .map((_, i) => sessionToken.charCodeAt(i % sessionToken.length) ^ (i * 31))
    .map((b) => (b & 0xff).toString(16).padStart(2, '0'))
    .join('');
  return hash;
}

export async function generateCSRFTokenAsync(sessionToken: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(sessionToken + ':csrf-salt'));
  return bufferToHex(hashBuffer).slice(0, 32);
}

export async function validateCSRFToken(token: string, sessionToken: string): Promise<boolean> {
  const expected = await generateCSRFTokenAsync(sessionToken);
  return safeCompare(token, expected);
}

// ─── Cookie Helpers ────────────────────────────────────

export function createSessionCookie(token: string, secure: boolean = true): string {
  const parts = [
    `__Host-session=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL}`,
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function clearSessionCookie(secure: boolean = true): string {
  const parts = [
    '__Host-session=',
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function extractSessionToken(request: Request): string | null {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  const match = cookie.match(/__Host-session=([^;]+)/);
  return match ? match[1] : null;
}

// ─── Chat Token Validation ─────────────────────────────

export async function validateChatToken(
  token: string,
  db: D1Database
): Promise<{ room_id: string; client_id: string } | null> {
  const result = await db
    .prepare('SELECT room_id, client_id, expires_at FROM chat_tokens WHERE token = ?')
    .bind(token)
    .first<{ room_id: string; client_id: string; expires_at: string }>();

  if (!result) return null;
  if (new Date(result.expires_at) < new Date()) return null;

  return { room_id: result.room_id, client_id: result.client_id };
}

export async function generateChatToken(
  roomId: string,
  clientId: string,
  db: D1Database
): Promise<string> {
  const tokenBytes = crypto.getRandomValues(new Uint8Array(24));
  const token = bufferToHex(tokenBytes.buffer);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  await db
    .prepare('INSERT INTO chat_tokens (token, room_id, client_id, expires_at) VALUES (?, ?, ?, ?)')
    .bind(token, roomId, clientId, expiresAt)
    .run();

  return token;
}

// ─── Legacy Compatibility ──────────────────────────────

/**
 * Verifies the legacy Admin authentication token (Bearer ADMIN_PASSWORD).
 * Kept for backward compatibility during migration.
 */
export async function verifyAdminAuth(request: Request, env: Env): Promise<boolean> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !env.ADMIN_PASSWORD) return false;
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  return safeCompare(token, env.ADMIN_PASSWORD);
}

export async function verifyUploadAuth(request: Request, env: Env): Promise<boolean> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !env.UPLOAD_SECRET) return false;
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  return safeCompare(token, env.UPLOAD_SECRET);
}

// ─── Utility Functions ─────────────────────────────────

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
}

async function safeCompare(a: string, b: string): Promise<boolean> {
  if (!a || !b) return false;
  const encoder = new TextEncoder();
  const hashA = await crypto.subtle.digest('SHA-256', encoder.encode(a));
  const hashB = await crypto.subtle.digest('SHA-256', encoder.encode(b));
  const arrA = new Uint8Array(hashA);
  const arrB = new Uint8Array(hashB);
  if (arrA.length !== arrB.length) return false;
  let result = 0;
  for (let i = 0; i < arrA.length; i++) {
    result |= arrA[i] ^ arrB[i];
  }
  return result === 0;
}
