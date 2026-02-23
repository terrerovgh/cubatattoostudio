import { useState, useEffect } from 'react';
import { cleanExpired } from '@/lib/imageCache';
import CachedImage from '@/components/CachedImage';
import ServiceCarouselCard, { type Service } from '../services/ServiceCarouselCard';
import ServiceModal from '../services/ServiceModal';

interface Post {
  id: string;
  imageUrl: string;
  caption?: string;
  permalink?: string;
  artist?: string;
  isLocal?: boolean;
  srcSet?: string;
  attributes?: any;
  type?: 'post';
}

interface ArtistData {
  profile: {
    username?: string;
    fullName?: string;
    localProfilePic?: string;
  } | null;
  posts: Post[];
}

interface GallerySectionProps {
  initialPosts: Post[];
  initialArtists: Record<string, ArtistData>;
  services?: Service[];
}

const ARTIST_LABELS: Record<string, string> = {
  all: 'All',
  studio: 'Studio',
  david: 'David',
  nina: 'Nina',
  karli: 'Karli',
};

type GalleryServiceItem = Service & {
  type: 'service';
  id: string;
  imageUrl: string;
  caption?: string;
  artist?: string;
  isLocal?: boolean;
  srcSet?: string;
  attributes?: any;
};

type GalleryItem = (Post & { type: 'post' }) | GalleryServiceItem;

export default function GallerySection({ initialPosts, initialArtists, services = [] }: GallerySectionProps) {
  const posts = initialPosts || [];
  const artists = initialArtists || {};

  const normalizedServices: GalleryItem[] = services.map((s, i) => ({
    ...s,
    type: 'service',
    id: s.id || `service-${i}`,
    imageUrl: s.galleryImages?.[0] || '',
    caption: s.description,
    artist: 'studio',
    isLocal: true,
  }));

  const normalizedPosts: GalleryItem[] = posts.map(p => ({ ...p, type: 'post' }));

  const [displayedItems, setDisplayedItems] = useState<GalleryItem[]>([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    cleanExpired().catch(() => { });
  }, []);

  const availableFilters = ['all'];
  const hasStudioPosts = posts.some(p => p.artist === 'studio');
  if (hasStudioPosts) availableFilters.push('studio');

  if (artists) {
    for (const key of Object.keys(artists)) {
      if (artists[key]?.posts?.length) availableFilters.push(key);
    }
  }

  const filteredItems = (activeFilter === 'all' ? [...normalizedServices, ...normalizedPosts] : normalizedPosts)
    .filter((item) => {
      if (activeFilter === 'all') return true;
      if (item.type === 'service') return false;
      return item.artist === activeFilter;
    });

  useEffect(() => {
    const sliced = filteredItems.slice(0, page * ITEMS_PER_PAGE);
    setDisplayedItems(sliced);
  }, [activeFilter, page, posts, services]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  const hasMore = displayedItems.length < filteredItems.length;

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const placeholders: GalleryItem[] = Array.from({ length: 6 }, (_, i) => ({
    id: `placeholder-${i}`,
    imageUrl: '',
    caption: 'Coming soon',
    artist: undefined,
    isLocal: false,
    srcSet: undefined,
    attributes: undefined,
    type: 'post'
  }));

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const items = displayedItems.length > 0 ? displayedItems : (isLoading ? [] : placeholders);
  const showFilters = availableFilters.length > 2;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedItem]);

  return (
    <>
      {/* Artist filter tabs — horizontal scroll on mobile */}
      {showFilters && (
        <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 sm:justify-center sm:flex-wrap scrollbar-hide"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {availableFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-300 whitespace-nowrap shrink-0"
              style={{
                background:
                  activeFilter === filter
                    ? 'rgba(200, 149, 108, 0.15)'
                    : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${activeFilter === filter
                  ? 'rgba(200, 149, 108, 0.3)'
                  : 'rgba(255, 255, 255, 0.06)'
                  }`,
                color:
                  activeFilter === filter
                    ? '#C8956C'
                    : 'rgba(255, 255, 255, 0.45)',
              }}
            >
              {ARTIST_LABELS[filter] || filter}
            </button>
          ))}
        </div>
      )}

      {/* Image grid - Masonry Layout */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4" data-stagger-wave>
        {items.map((item) => (
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
              className={`w-full break-inside-avoid mb-3 sm:mb-4 rounded-[14px] sm:rounded-[18px] overflow-hidden
                        bg-white/[0.03] border border-white/[0.05]
                        transition-all duration-500 ease-out
                        hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
                        hover:scale-[1.02]
                        group relative block text-left`}
              data-wave-item
            >
                {item.imageUrl ? (
                  item.isLocal ? (
                    <img
                      src={item.imageUrl}
                      srcSet={item.srcSet}
                      alt={item.caption || `Tattoo artwork by ${item.artist ? ARTIST_LABELS[item.artist] || item.artist : 'Cuba Tattoo Studio'}`}
                      className="w-full h-auto object-cover
                               transition-transform duration-700 ease-out
                               group-hover:scale-105"
                      loading="lazy"
                      {...item.attributes}
                    />
                  ) : (
                    <CachedImage
                      imageId={item.id}
                      src={item.imageUrl}
                      alt={item.caption || `Custom tattoo design by ${item.artist ? ARTIST_LABELS[item.artist] || item.artist : 'our artists'}`}
                      artist={item.artist}
                      className="w-full h-auto object-cover
                               transition-transform duration-700 ease-out
                               group-hover:scale-105"
                      loading="lazy"
                    />
                  )
                ) : (
                <div className="w-full aspect-square flex items-center justify-center text-white/15">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Hover overlay for Posts */}
              {item.type === 'post' && item.imageUrl && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-end">
                  {item.artist && (
                    <span
                      className="m-1.5 sm:m-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-medium
                                opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                                transition-all duration-300"
                      style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {ARTIST_LABELS[item.artist] || item.artist}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && items.length > 0 && items[0].id !== 'placeholder-0' && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={handleLoadMore}
            className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs sm:text-sm font-medium active:scale-[0.97]"
          >
            Load More
          </button>
        </div>
      )}

      {/* Instagram CTA */}
      <div className="text-center mt-8 sm:mt-10">
        <a
          href="https://instagram.com/cubatattoostudio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[var(--color-gold)] hover:text-[var(--color-gold-light)]
                     transition-all duration-300 font-medium text-xs sm:text-sm"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          Follow @cubatattoostudio
        </a>
      </div>

      {/* Lightbox / Service Modal */}
      {selectedItem && (
        selectedItem.type === 'service' ? (
          <ServiceModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        ) : (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 cursor-pointer"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px) saturate(0.8)',
              WebkitBackdropFilter: 'blur(20px) saturate(0.8)',
            }}
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative w-full max-w-3xl max-h-[85vh] rounded-[16px] sm:rounded-[20px] overflow-hidden
                         shadow-[0_32px_80px_rgba(0,0,0,0.6)]
                         border border-white/[0.06]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.isLocal ? (
                <img
                  src={selectedItem.imageUrl}
                  srcSet={selectedItem.srcSet}
                  alt={selectedItem.caption || `Tattoo artwork by ${selectedItem.artist ? ARTIST_LABELS[selectedItem.artist] || selectedItem.artist : 'Cuba Tattoo Studio'}`}
                  className="w-full h-full object-contain"
                  {...selectedItem.attributes}
                  width={undefined}
                  height={undefined}
                />
              ) : (
                <CachedImage
                  imageId={selectedItem.id}
                  src={selectedItem.imageUrl}
                  alt={selectedItem.caption || `Custom tattoo design by ${selectedItem.artist ? ARTIST_LABELS[selectedItem.artist] || selectedItem.artist : 'our artists'}`}
                  artist={selectedItem.artist}
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full
                           flex items-center justify-center
                           text-white/60 hover:text-white transition-all duration-300"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Bottom info bar */}
              <div
                className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 flex items-end justify-between gap-3"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                }}
              >
                <div className="flex-1 min-w-0">
                  {selectedItem.caption && (
                    <p className="text-xs sm:text-sm text-white/70 font-light line-clamp-2">{selectedItem.caption}</p>
                  )}
                </div>
                {selectedItem.artist && (
                  <span
                    className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium shrink-0"
                    style={{
                      background: 'rgba(200, 149, 108, 0.2)',
                      border: '1px solid rgba(200, 149, 108, 0.3)',
                      color: '#C8956C',
                    }}
                  >
                    {ARTIST_LABELS[selectedItem.artist] || selectedItem.artist}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
