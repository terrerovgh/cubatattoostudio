import { useImageCache } from '@/hooks/useImageCache';

interface Props {
  imageId: string;
  src: string;
  alt: string;
  artist?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export default function CachedImage({
  imageId,
  src,
  alt,
  artist,
  className,
  loading = 'lazy',
}: Props) {
  const isR2Image = src.startsWith('/api/images/');
  const { imageUrl, loading: cacheLoading, fromCache } = useImageCache(
    imageId,
    src,
    { artist, enabled: isR2Image },
  );

  const resolvedSrc = isR2Image ? (imageUrl || '') : src;

  return (
    <div className="relative w-full h-full">
      {cacheLoading && isR2Image ? (
        <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
          <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
        </div>
      ) : (
        <img
          src={resolvedSrc}
          alt={alt}
          className={className}
          loading={loading}
        />
      )}
      {fromCache && isR2Image && (
        <span
          className="absolute top-1 left-1 px-1 py-0.5 rounded text-[8px]
                     bg-black/40 text-green-400/70 backdrop-blur-sm
                     pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        >
          cached
        </span>
      )}
    </div>
  );
}
