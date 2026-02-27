import { useState, useEffect, useCallback } from 'react';
import CachedImage from '@/components/CachedImage';

export interface LightboxItem {
  id: string;
  imageUrl: string;
  caption?: string;
  isLocal?: boolean;
  srcSet?: string;
  attributes?: any;
  artist?: string;
  featuredWork?: {
    title: string;
    description: string;
    style: string;
    tags: string[];
  };
}

export interface ArtistProfile {
  name: string;
  image: string;
  role: string;
  id: string;
}

interface PhotoLightboxProps {
  item: LightboxItem;
  items: LightboxItem[];
  onClose: () => void;
  onNavigate: (item: LightboxItem) => void;
  accentColor?: string;
  artistProfile?: ArtistProfile;
  artistLabels?: Record<string, string>;
}

export default function PhotoLightbox({
  item,
  items,
  onClose,
  onNavigate,
  accentColor = '#C8956C',
  artistProfile,
  artistLabels = {},
}: PhotoLightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const currentIndex = items.findIndex(p => p.id === item.id);

  // Reset zoom on item change
  useEffect(() => {
    setZoomLevel(1);
  }, [item.id]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextIndex = (currentIndex + 1) % items.length;
    onNavigate(items[nextIndex]);
  }, [currentIndex, items, onNavigate]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onNavigate(items[prevIndex]);
  }, [currentIndex, items, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const artistLabel = item.artist
    ? artistLabels[item.artist] || artistProfile?.name || item.artist
    : artistProfile?.name;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(24px) saturate(0.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(0.8)',
        animation: 'lightboxFadeIn 250ms ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Image Area ────────────────────────────────── */}
        <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
          <div
            className="relative transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {item.isLocal ? (
              <img
                src={item.imageUrl}
                srcSet={item.srcSet}
                alt={item.featuredWork?.title || item.caption || 'Tattoo artwork'}
                className="max-w-full max-h-[50vh] md:max-h-[88vh] object-contain rounded-lg shadow-2xl"
                {...item.attributes}
                width={undefined}
                height={undefined}
              />
            ) : (
              <CachedImage
                imageId={item.id}
                src={item.imageUrl}
                alt={item.featuredWork?.title || item.caption || 'Tattoo artwork'}
                artist={item.artist}
                className="max-w-full max-h-[50vh] md:max-h-[88vh] object-contain rounded-lg shadow-2xl"
                loading="eager"
              />
            )}
          </div>

          {/* Navigation Arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full
                           bg-black/50 hover:bg-white/10 text-white/60 hover:text-white
                           flex items-center justify-center backdrop-blur-md border border-white/10
                           transition-all duration-200 active:scale-95"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full
                           bg-black/50 hover:bg-white/10 text-white/60 hover:text-white
                           flex items-center justify-center backdrop-blur-md border border-white/10
                           transition-all duration-200 active:scale-95"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-white/10 disabled:opacity-30
                         text-white/70 hover:text-white flex items-center justify-center
                         backdrop-blur-md border border-white/10 transition-all"
              aria-label="Zoom out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <div className="px-2.5 py-1.5 rounded-full bg-black/50 border border-white/10 text-white/80 text-xs font-medium backdrop-blur-md min-w-[52px] text-center">
              {Math.round(zoomLevel * 100)}%
            </div>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-white/10 disabled:opacity-30
                         text-white/70 hover:text-white flex items-center justify-center
                         backdrop-blur-md border border-white/10 transition-all"
              aria-label="Zoom in"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Counter */}
          {items.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 text-white/60 text-xs font-medium backdrop-blur-md">
              {currentIndex + 1} / {items.length}
            </div>
          )}
        </div>

        {/* ── Sidebar (Desktop) / Bottom Sheet (Mobile) ── */}
        <div className="w-full md:w-[340px] lg:w-[380px] bg-neutral-950/95 backdrop-blur-md
                        border-t md:border-t-0 md:border-l border-white/[0.06]
                        flex flex-col p-5 md:p-6 z-20
                        max-h-[42vh] md:max-h-none overflow-y-auto md:h-full">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 rounded-full
                       bg-white/[0.05] hover:bg-white/[0.1]
                       text-white/40 hover:text-white transition-all z-30
                       flex items-center justify-center"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex-1 space-y-5 mt-1 md:mt-2">
            {/* Artist Profile Card */}
            {artistProfile && (
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                <img
                  src={artistProfile.image}
                  alt={artistProfile.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-white font-medium text-sm">{artistProfile.name}</h4>
                  <p className="text-white/40 text-xs">{artistProfile.role}</p>
                </div>
              </div>
            )}

            {/* Artist badge (when no profile but artist label exists) */}
            {!artistProfile && artistLabel && (
              <div className="pb-4 border-b border-white/[0.06]">
                <span
                  className="inline-flex px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: `${accentColor}15`,
                    color: accentColor,
                    border: `1px solid ${accentColor}25`,
                  }}
                >
                  {artistLabel}
                </span>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-4">
              {item.featuredWork ? (
                <>
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-white/35 mb-1 block">
                      Title
                    </span>
                    <h2 className="text-lg font-bold text-white leading-tight">
                      {item.featuredWork.title}
                    </h2>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-white/35 mb-1.5 block">
                      Style
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-medium inline-block"
                      style={{
                        background: `${accentColor}12`,
                        color: accentColor,
                        border: `1px solid ${accentColor}25`,
                      }}
                    >
                      {item.featuredWork.style}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-white/35 mb-1 block">
                      Description
                    </span>
                    <p className="text-white/60 text-sm font-light leading-relaxed">
                      {item.featuredWork.description}
                    </p>
                  </div>
                  {item.featuredWork.tags.length > 0 && (
                    <div>
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-white/35 mb-2 block">
                        Tags
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.featuredWork.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] text-white/50 border border-white/[0.06]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-4 md:py-8">
                  {item.caption ? (
                    <p className="text-white/50 text-sm leading-relaxed">{item.caption}</p>
                  ) : (
                    <p className="text-white/30 text-sm italic text-center">No description available.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-4 border-t border-white/[0.06] mt-auto space-y-2.5">
            <a
              href="/booking"
              className="block w-full py-3 rounded-xl text-center text-sm font-semibold text-black
                         transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: accentColor }}
            >
              Book this Style
            </a>
            {artistProfile && (
              <a
                href={`/artists/${artistProfile.id}`}
                className="block w-full py-3 rounded-xl text-center text-sm font-medium
                           text-white/60 hover:text-white bg-white/[0.04] border border-white/[0.06]
                           hover:bg-white/[0.08] transition-all"
              >
                View Artist Profile
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lightboxFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
