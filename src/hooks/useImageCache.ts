import { useState, useEffect, useRef } from 'react';
import { getCachedImage, putCachedImage } from '@/lib/imageCache';

interface UseImageCacheResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

export function useImageCache(
  imageId: string,
  networkUrl: string,
  options?: { artist?: string; enabled?: boolean },
): UseImageCacheResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const objectUrlRef = useRef<string | null>(null);
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled || !imageId || !networkUrl) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function resolve() {
      try {
        const cached = await getCachedImage(imageId);
        if (cached && !cancelled) {
          const url = URL.createObjectURL(cached.blob);
          objectUrlRef.current = url;
          setImageUrl(url);
          setFromCache(true);
          setLoading(false);
          return;
        }

        if (cancelled) return;
        const response = await fetch(networkUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        if (cancelled) return;

        await putCachedImage(imageId, blob, {
          mimeType: blob.type,
          artist: options?.artist,
          source: networkUrl.startsWith('/api/') ? 'r2' : 'static',
        });

        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        setImageUrl(url);
        setFromCache(false);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setImageUrl(networkUrl);
          setFromCache(false);
          setError(err instanceof Error ? err.message : 'Cache error');
          setLoading(false);
        }
      }
    }

    resolve();

    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [imageId, networkUrl, enabled, options?.artist]);

  return { imageUrl, loading, error, fromCache };
}
