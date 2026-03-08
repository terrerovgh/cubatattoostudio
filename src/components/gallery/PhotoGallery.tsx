import { useState, useEffect } from 'react';
import { cleanExpired } from '@/lib/imageCache';
import CachedImage from '@/components/CachedImage';
import PhotoLightbox from './PhotoLightbox';
import type { LightboxItem, ArtistProfile } from './PhotoLightbox';
import ServiceModal from '../services/ServiceModal';
import type { Service } from '../services/ServiceCarouselCard';
import { Button } from '@cloudflare/kumo';
import { Image as ImageIcon, ArrowRight } from '@phosphor-icons/react';

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
  posts: GalleryPost[];
  artists?: Record<string, GalleryArtistData>;
  services?: Service[];
  accentColor?: string;
  artistProfile?: ArtistProfile;
  artistLabels?: Record<string, string>;
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

  useEffect(() => {
    cleanExpired().catch(() => { });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  // Filters
  const availableFilters = ['all'];
  if (posts.some(p => p.artist === 'studio')) availableFilters.push('studio');
  if (artists) {
    for (const key of Object.keys(artists)) {
      if (artists[key]?.posts?.length) availableFilters.push(key);
    }
  }
  const showFilters = availableFilters.length > 2;

  // Normalized
  const normalizedServices: GalleryServiceItem[] = services.map((s, i) => ({
    ...s,
    type: 'service',
    id: s.id || `service-${i}`,
    imageUrl: s.galleryImages?.[0] || '',
  }));

  const normalizedPosts: (GalleryPost & { type: 'post' })[] = posts.map(p => ({
    ...p,
    type: 'post',
  }));

  const filteredPosts = normalizedPosts.filter(item => {
    if (activeFilter === 'all') return true;
    return item.artist === activeFilter;
  });

  const displayedPosts = filteredPosts.slice(0, page * itemsPerPage);
  const hasMore = displayedPosts.length < filteredPosts.length;

  const photoItems: LightboxItem[] = filteredPosts
    .filter(i => !!i.imageUrl)
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

  const displayServices = activeFilter === 'all' ? normalizedServices.slice(0, 6) : [];

  return (
    <div className="flex flex-col gap-10 sm:gap-16">

      {/* ── Filter Tabs ── */}
      {showFilters && (
        <div className="flex justify-center -mb-4 sm:-mb-6 relative z-20">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md overflow-x-auto scrollbar-hide max-w-full">
            {availableFilters.map(filter => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-500 whitespace-nowrap shrink-0 border-0 cursor-pointer outline-none`}
                  style={{
                    background: isActive ? `${accentColor}20` : 'transparent',
                    color: isActive ? accentColor : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: isActive ? `0 4px 15px ${accentColor}10` : 'none',
                  }}
                >
                  {artistLabels[filter] || filter}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Services Interactive Accordion (Editorial Layout) ── */}
      {displayServices.length > 0 && !isLoading && (
        <div className="w-full flex flex-col md:flex-row gap-3 h-[600px] md:h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden">
          {displayServices.map((service, idx) => (
            <button
              key={service.id}
              onClick={() => setSelectedItem(service)}
              className="group relative flex-1 md:hover:flex-[4] h-full overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] min-h-[80px] p-0 text-left outline-none"
            >
              {service.imageUrl && (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 md:opacity-40 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                />
              )}
              {/* Gradient Scrims */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700"></div>

              {/* Vertical Title (Hidden on Hover Desktop) */}
              <div className="absolute inset-y-0 left-0 flex items-center justify-center w-full px-4 md:opacity-100 md:group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <h3 className="text-white/90 font-bold text-sm sm:text-lg tracking-widest uppercase md:-rotate-90 whitespace-nowrap drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {service.name}
                </h3>
              </div>

              {/* Expanded Content Box (Visible on Hover Desktop) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:opacity-0 md:group-hover:opacity-100 transition-all duration-700 md:translate-y-8 md:group-hover:translate-y-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight drop-shadow-md">
                  {service.name}
                </h3>
                <div className="w-8 h-1 bg-[var(--color-gold)] mb-4 rounded-full"></div>
                <p className="text-white/70 text-sm hidden md:line-clamp-3 leading-relaxed max-w-sm drop-shadow-lg">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center text-[10px] sm:text-xs text-[var(--color-gold)] uppercase tracking-[0.2em] font-semibold">
                  <span>Explore this style</span>
                  <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Masonry Grid for Posts ── */}
      {displayedPosts.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 mt-4" data-stagger-wave>
          {displayedPosts.map((post, index) => (
            <button
              key={post.id}
              className="w-full break-inside-avoid mb-4 sm:mb-6 rounded-2xl sm:rounded-[2rem] overflow-hidden
                         bg-white/[0.02] border border-white/[0.04] p-1.5 sm:p-2
                         transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                         hover:border-white/[0.15] hover:bg-white/[0.04]
                         group relative outline outline-1 outline-transparent hover:outline-white/10 outline-offset-[-1px] card-hover-lift cursor-pointer block text-left outline-none"
              onClick={() => post.imageUrl && setSelectedItem(post)}
              aria-label={post.caption || `View tattoo by ${post.artist || 'studio'}`}
              aria-haspopup="dialog"
            >
              <div className="relative w-full rounded-xl sm:rounded-[1.5rem] overflow-hidden bg-black/50 aspect-auto">
                {post.imageUrl ? (
                  post.isLocal ? (
                    <img
                      src={post.imageUrl}
                      srcSet={post.srcSet}
                      alt={post.caption || `Tattoo ${index} by ${post.artist || 'studio'}`}
                      className="w-full h-auto object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
                      loading={index < 6 ? 'eager' : 'lazy'}
                      {...post.attributes}
                    />
                  ) : (
                    <CachedImage
                      imageId={post.id}
                      src={post.imageUrl}
                      alt={post.caption || `Tattoo ${index} by ${post.artist || 'studio'}`}
                      artist={post.artist}
                      className="w-full h-auto object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
                      loading={index < 6 ? 'eager' : 'lazy'}
                    />
                  )
                ) : (
                  <div className="w-full aspect-square bg-white/5 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white/10" weight="thin" />
                  </div>
                )}

                {/* Elegant Hover State */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex flex-col justify-end p-4 sm:p-5 pointer-events-none">
                  {(post.artist || post.featuredWork?.style) && (
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <span className="inline-block px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-widest bg-white/10 backdrop-blur-md text-white/90 uppercase">
                        {post.featuredWork?.style || (post.artist && (artistLabels[post.artist] || post.artist))}
                      </span>
                    </div>
                  )}
                  {post.caption && (
                    <p className="mt-3 text-white/70 text-sm line-clamp-2 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-[600ms] ease-out">
                      {post.featuredWork?.title || post.caption}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        !isLoading && activeFilter !== 'all' && (
          <div className="text-center py-20 text-white/40">No work available for this filter yet.</div>
        )
      )}

      {/* ── Instagram CTA ── */}
      {showFilters && (
        <div className="flex justify-center -mt-2 mb-4">
          <a
            href="https://instagram.com/cubatattoostudio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white/30 hover:text-white transition-colors uppercase group"
          >
            <span className="w-8 h-[1px] bg-white/10 group-hover:bg-white/30 transition-colors"></span>
            Follow @cubatattoostudio
            <span className="w-8 h-[1px] bg-white/10 group-hover:bg-white/30 transition-colors"></span>
          </a>
        </div>
      )}

      {/* ── Load More ── */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => setPage(prev => prev + 1)}
            variant="outline"
            className="px-8 py-3 sm:py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20
                       transition-all duration-300 text-xs sm:text-sm font-semibold tracking-widest uppercase active:scale-[0.98]"
            style={{ color: accentColor }}
          >
            Load More
          </Button>
        </div>
      )}

      {/* ── Lightbox / Service Modal ── */}
      {selectedItem && (
        selectedItem.type === 'service' ? (
          <ServiceModal item={selectedItem} onClose={() => setSelectedItem(null)} />
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
              const found = filteredPosts.find(i => i.id === next.id);
              if (found) setSelectedItem(found);
            }}
            accentColor={accentColor}
            artistProfile={artistProfile}
            artistLabels={artistLabels}
          />
        ) : null
      )}
    </div>
  );
}
