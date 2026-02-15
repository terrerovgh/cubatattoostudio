import { useState, useEffect, useCallback } from 'react';

interface FeaturedWork {
  image: string;
  title: string;
  description: string;
  style: string;
  tags: string[];
}

interface Post {
  id: string;
  imageUrl: string;
  caption?: string;
  isLocal?: boolean;
  srcSet?: string;
  attributes?: any;
  featuredWork?: FeaturedWork;
}

interface ArtistProfile {
  name: string;
  image: string;
  role: string;
  id: string;
}

interface ArtistGalleryGridProps {
  posts: Post[];
  accentColor: string;
  artistProfile?: ArtistProfile;
}

export default function ArtistGalleryGrid({ posts, accentColor, artistProfile }: ArtistGalleryGridProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [page, setPage] = useState(1);
  const POSTS_PER_PAGE = 12;

  const displayedPosts = posts.slice(0, page * POSTS_PER_PAGE);
  const hasMore = displayedPosts.length < posts.length;

  useEffect(() => {
    setZoomLevel(1);
  }, [selectedPost]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedPost]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedPost) return;
    const currentIndex = posts.findIndex(p => p.id === selectedPost.id);
    const nextIndex = (currentIndex + 1) % posts.length;
    setSelectedPost(posts[nextIndex]);
  }, [selectedPost, posts]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedPost) return;
    const currentIndex = posts.findIndex(p => p.id === selectedPost.id);
    const prevIndex = (currentIndex - 1 + posts.length) % posts.length;
    setSelectedPost(posts[prevIndex]);
  }, [selectedPost, posts]);

  useEffect(() => {
    if (!selectedPost) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedPost(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost, handleNext, handlePrev]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-white/20 text-sm">
        Portfolio coming soon
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 sm:columns-3 gap-2.5 sm:gap-3" data-stagger-wave>
        {displayedPosts.map((post, index) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className={`
              w-full break-inside-avoid mb-2.5 sm:mb-3 overflow-hidden
              bg-white/[0.03] border border-white/[0.05]
              transition-all duration-500 ease-out
              hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
              group relative block
              ${index === 0 ? 'rounded-[20px]' : 'rounded-[14px]'}
            `}
            data-wave-item
          >
            <img
              src={post.imageUrl}
              srcSet={post.srcSet}
              alt={post.featuredWork?.title || post.caption || 'Tattoo work'}
              className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading={index < 4 ? 'eager' : 'lazy'}
              {...post.attributes}
            />

            {post.featuredWork && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-end">
                <span
                  className="m-2 px-2.5 py-1 rounded-lg text-[10px] font-medium
                             opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                             transition-all duration-300"
                  style={{
                    background: `${accentColor}30`,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: accentColor,
                  }}
                >
                  {post.featuredWork.style}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-2.5 rounded-full border bg-white/5 hover:bg-white/10 transition-all text-sm font-medium"
            style={{ borderColor: `${accentColor}40`, color: accentColor }}
          >
            Load More Works
          </button>
        </div>
      )}

      {/* Lightbox */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          onClick={() => setSelectedPost(null)}
          style={{ animation: 'lightboxFadeIn 200ms ease-out' }}
        >
          <div className="relative w-full h-full flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
            {/* Image Area */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 overflow-hidden bg-black/20">
              <div
                className="relative transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={selectedPost.imageUrl}
                  srcSet={selectedPost.srcSet}
                  alt={selectedPost.featuredWork?.title || selectedPost.caption || 'Tattoo work'}
                  className="max-w-full max-h-[55vh] md:max-h-[90vh] object-contain shadow-2xl rounded-lg"
                  {...selectedPost.attributes}
                />
              </div>

              {/* Nav Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full
                           bg-black/50 hover:bg-white/10 text-white/70 hover:text-white
                           flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full
                           bg-black/50 hover:bg-white/10 text-white/70 hover:text-white
                           flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200"
                aria-label="Next image"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                <button onClick={handleZoomOut} disabled={zoomLevel <= 1}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-white/10 disabled:opacity-30 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
                <div className="px-3 py-2 rounded-full bg-black/50 border border-white/10 text-white/90 text-sm font-medium backdrop-blur-md">
                  {Math.round(zoomLevel * 100)}%
                </div>
                <button onClick={handleZoomIn} disabled={zoomLevel >= 3}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-white/10 disabled:opacity-30 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>

            {/* Sidebar / Bottom Sheet */}
            <div className="w-full md:w-[360px] bg-neutral-900/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-white/5
              flex flex-col p-5 sm:p-6 z-20 max-h-[40vh] md:max-h-none overflow-y-auto md:h-full">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-3 md:top-4 md:right-4 text-white/40 hover:text-white transition-colors z-30"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex-1 pr-2 space-y-5 mt-4 md:mt-2">
                {artistProfile && (
                  <div className="flex items-center gap-3 pb-5 border-b border-white/5">
                    <img src={artistProfile.image} alt={artistProfile.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    <div>
                      <h4 className="text-white font-medium text-sm">{artistProfile.name}</h4>
                      <p className="text-white/40 text-xs">{artistProfile.role}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {selectedPost.featuredWork ? (
                    <>
                      <div>
                        <span className="text-xs font-medium tracking-wider uppercase opacity-50 text-white mb-1 block">Title</span>
                        <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">{selectedPost.featuredWork.title}</h2>
                      </div>
                      <div>
                        <span className="text-xs font-medium tracking-wider uppercase opacity-50 text-white mb-1 block">Style</span>
                        <span className="px-2.5 py-1 rounded text-xs font-medium inline-block"
                          style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}>
                          {selectedPost.featuredWork.style}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-medium tracking-wider uppercase opacity-50 text-white mb-1 block">Description</span>
                        <p className="text-white/70 text-sm font-light leading-relaxed">{selectedPost.featuredWork.description}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium tracking-wider uppercase opacity-50 text-white mb-2 block">Tags</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedPost.featuredWork.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 rounded-md text-[10px] font-medium bg-white/5 text-white/60 border border-white/5">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 md:py-12">
                      <p className="text-white/50 text-sm italic">{selectedPost.caption || 'No description available for this work.'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 sm:pt-6 border-t border-white/5 mt-auto space-y-3">
                <a href="/booking" className="block w-full py-3.5 rounded-xl text-center text-sm font-semibold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: accentColor }}>
                  Book this Style
                </a>
                {artistProfile && (
                  <a href={`/artists/${artistProfile.id}`}
                    className="block w-full py-3.5 rounded-xl text-center text-sm font-medium text-white/70 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                    View Artist Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes lightboxFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
