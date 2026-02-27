import { useState, useEffect } from 'react';
import { cleanExpired } from '@/lib/imageCache';
import CachedImage from '@/components/CachedImage';
import PhotoLightbox from './PhotoLightbox';
import type { LightboxItem, ArtistProfile } from './PhotoLightbox';
import ServiceCarouselCard, { type Service } from '../services/ServiceCarouselCard';
import ServiceModal from '../services/ServiceModal';

// ─── Types ───────────────────────────────────────────────────────

export interface GalleryPost {
  id: string;
  imageUrl: string;
  caption?: string;
  permalink?: string;
  artist?: string;
  isLocal?: boolean;
  srcSet?: string;
  attributes?: any;
  featuredWork?: {
    title: string;
    description: string;
    style: string;
    tags: string[];
  };
}

export interface GalleryArtistData {
  profile: {
    username?: string;
    fullName?: string;
    localProfilePic?: string;
  } | null;
  posts: GalleryPost[];
}

type GalleryServiceItem = Service & {
  type: 'service';
  id: string;
  imageUrl: string;
};

type GalleryItem =
  | (GalleryPost & { type: 'post' })
  | GalleryServiceItem;

// ─── Props ───────────────────────────────────────────────────────

interface PhotoGalleryProps {
  /** Posts to display */
  posts: GalleryPost[];
  /** Artist data keyed by artist ID — enables filter tabs */
  artists?: Record<string, GalleryArtistData>;
  /** Services to interleave (main gallery only) */
  services?: Service[];
  /** Accent color for active states and lightbox */
  accentColor?: string;
  /** Artist profile to show in lightbox sidebar */
  artistProfile?: ArtistProfile;
  /** Map of artist keys to display labels */
  artistLabels?: Record<string, string>;
  /** Number of items per page */
  itemsPerPage?: number;
}

const DEFAULT_LABELS: Record<string, string> = {
  all: 'All',
  studio: 'Studio',
  david: 'David',
  nina: 'Nina',
  karli: 'Karli',
};

// ─── Component ───────────────────────────────────────────────────

export default function PhotoGallery({
  posts,
  artists,
  services = [],
  accentColor = '#C8956C',
  artistProfile,
  artistLabels = DEFAULT_LABELS,
  itemsPerPage = 12,
}: PhotoGalleryProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clean expired cache on mount
  useEffect(() => {
    cleanExpired().catch(() => {});
  }, []);

  // Loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  // ── Build filter list ────────────────────────────────────────
  const availableFilters = ['all'];
  if (posts.some(p => p.artist === 'studio')) availableFilters.push('studio');
  if (artists) {
    for (const key of Object.keys(artists)) {
      if (artists[key]?.posts?.length) availableFilters.push(key);
    }
  }
  const showFilters = availableFilters.length > 2;

  // ── Build items list ─────────────────────────────────────────
  const normalizedServices: GalleryItem[] = services.map((s, i) => ({
    ...s,
    type: 'service' as const,
    id: s.id || `service-${i}`,
    imageUrl: s.galleryImages?.[0] || '',
  }));

  const normalizedPosts: GalleryItem[] = posts.map(p => ({
    ...p,
    type: 'post' as const,
  }));

  const filteredItems = (
    activeFilter === 'all'
      ? [...normalizedServices, ...normalizedPosts]
      : normalizedPosts
  ).filter(item => {
    if (activeFilter === 'all') return true;
    if (item.type === 'service') return false;
    return item.artist === activeFilter;
  });

  const displayedItems = filteredItems.slice(0, page * itemsPerPage);
  const hasMore = displayedItems.length < filteredItems.length;

  // For lightbox: only photo items (not services)
  const photoItems: LightboxItem[] = displayedItems
    .filter((i): i is GalleryPost & { type: 'post' } => i.type === 'post' && !!i.imageUrl)
    .map(i => ({
      id: i.id,
      imageUrl: i.imageUrl,
      caption: i.caption,
      isLocal: i.isLocal,
      srcSet: i.srcSet,
      attributes: i.attributes,
      artist: i.artist,
      featuredWork: i.featuredWork,
    }));

  // Placeholders for empty state
  const placeholders: GalleryItem[] = Array.from({ length: 6 }, (_, i) => ({
    id: `placeholder-${i}`,
    imageUrl: '',
    type: 'post' as const,
  }));

  const items = displayedItems.length > 0 ? displayedItems : (isLoading ? [] : placeholders);

  return (
    <>
      {/* ── Filter Tabs ──────────────────────────────────── */}
      {showFilters && (
        <div
          className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 sm:justify-center sm:flex-wrap"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {availableFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-300 whitespace-nowrap shrink-0"
              style={{
                background: activeFilter === filter
                  ? `${accentColor}18`
                  : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${activeFilter === filter
                  ? `${accentColor}40`
                  : 'rgba(255, 255, 255, 0.06)'
                }`,
                color: activeFilter === filter
                  ? accentColor
                  : 'rgba(255, 255, 255, 0.45)',
              }}
            >
              {artistLabels[filter] || filter}
            </button>
          ))}
        </div>
      )}

      {/* ── Masonry Grid ─────────────────────────────────── */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-3.5" data-stagger-wave>
        {items.map((item, index) => (
          item.type === 'service' ? (
            <ServiceCarouselCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ) : (
            <button
              key={item.id}
              onClick={() => item.imageUrl && setSelectedItem(item)}
              className="w-full break-inside-avoid mb-3 sm:mb-3.5 rounded-2xl overflow-hidden
                         bg-white/[0.03] border border-white/[0.05]
                         transition-all duration-500 ease-out
                         hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                         hover:scale-[1.025]
                         group relative block text-left"
              data-wave-item
            >
              {item.imageUrl ? (
                item.isLocal ? (
                  <img
                    src={item.imageUrl}
                    srcSet={item.srcSet}
                    alt={item.featuredWork?.title || item.caption || `Tattoo artwork by ${item.artist ? artistLabels[item.artist] || item.artist : 'Cuba Tattoo Studio'}`}
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    loading={index < 4 ? 'eager' : 'lazy'}
                    {...item.attributes}
                  />
                ) : (
                  <CachedImage
                    imageId={item.id}
                    src={item.imageUrl}
                    alt={item.featuredWork?.title || item.caption || 'Custom tattoo design'}
                    artist={item.artist}
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                )
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-white/10">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Hover overlay with artist badge */}
              {item.imageUrl && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 flex items-end pointer-events-none">
                  {(item.artist || item.featuredWork?.style) && (
                    <span
                      className="m-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-medium
                                 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                                 transition-all duration-300"
                      style={{
                        background: 'rgba(0, 0, 0, 0.55)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: 'rgba(255, 255, 255, 0.75)',
                      }}
                    >
                      {item.featuredWork?.style || (item.artist && (artistLabels[item.artist] || item.artist))}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        ))}
      </div>

      {/* ── Load More ────────────────────────────────────── */}
      {hasMore && items.length > 0 && items[0].id !== 'placeholder-0' && (
        <div className="flex justify-center mt-7 sm:mt-9">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="px-6 py-2.5 rounded-full border bg-white/[0.04] hover:bg-white/[0.08]
                       transition-all text-sm font-medium active:scale-[0.97]"
            style={{
              borderColor: `${accentColor}30`,
              color: accentColor,
            }}
          >
            Load More
          </button>
        </div>
      )}

      {/* ── Instagram CTA (only on main gallery) ─────────── */}
      {showFilters && (
        <div className="text-center mt-8 sm:mt-10">
          <a
            href="https://instagram.com/cubatattoostudio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-all duration-300 font-medium text-xs sm:text-sm"
            style={{ color: accentColor }}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Follow @cubatattoostudio
          </a>
        </div>
      )}

      {/* ── Lightbox / Service Modal ─────────────────────── */}
      {selectedItem && (
        selectedItem.type === 'service' ? (
          <ServiceModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        ) : selectedItem.imageUrl ? (
          <PhotoLightbox
            item={{
              id: selectedItem.id,
              imageUrl: selectedItem.imageUrl,
              caption: selectedItem.caption,
              isLocal: selectedItem.isLocal,
              srcSet: selectedItem.srcSet,
              attributes: selectedItem.attributes,
              artist: selectedItem.artist,
              featuredWork: selectedItem.featuredWork,
            }}
            items={photoItems}
            onClose={() => setSelectedItem(null)}
            onNavigate={(next) => {
              const found = displayedItems.find(i => i.id === next.id);
              if (found) setSelectedItem(found);
            }}
            accentColor={accentColor}
            artistProfile={artistProfile}
            artistLabels={artistLabels}
          />
        ) : null
      )}
    </>
  );
}
