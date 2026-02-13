import { useState } from 'react';

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

interface ArtistGalleryGridProps {
  posts: Post[];
  accentColor: string;
}

export default function ArtistGalleryGrid({ posts, accentColor }: ArtistGalleryGridProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-white/20 text-sm">
        Portfolio coming soon
      </div>
    );
  }

  return (
    <>
      <div
        className="columns-2 sm:columns-3 gap-3 space-y-3"
        data-stagger-wave
      >
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="w-full break-inside-avoid mb-3 rounded-[16px] overflow-hidden
                       bg-white/[0.03] border border-white/[0.05]
                       transition-all duration-500 ease-out
                       hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
                       hover:scale-[1.02]
                       group relative block"
            data-wave-item
          >
            <img
              src={post.imageUrl}
              srcSet={post.srcSet}
              alt={post.featuredWork?.title || post.caption || 'Tattoo work'}
              className="w-full h-auto object-cover
                       transition-transform duration-700 ease-out
                       group-hover:scale-110"
              loading="lazy"
              {...post.attributes}
            />

            {/* Hover overlay with style badge */}
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

      {/* Lightbox */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-pointer"
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px) saturate(0.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(0.8)',
          }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] rounded-[20px] overflow-hidden
                       shadow-[0_32px_80px_rgba(0,0,0,0.6)]
                       border border-white/[0.06]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPost.imageUrl}
              srcSet={selectedPost.srcSet}
              alt={selectedPost.featuredWork?.title || selectedPost.caption || 'Tattoo work'}
              className="w-full h-full object-contain"
              {...selectedPost.attributes}
              width={undefined}
              height={undefined}
            />

            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full
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
              className="absolute bottom-0 left-0 right-0 p-5"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
              }}
            >
              {selectedPost.featuredWork ? (
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-white">
                    {selectedPost.featuredWork.title}
                  </h3>
                  <p className="text-sm text-white/60 font-light line-clamp-2">
                    {selectedPost.featuredWork.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPost.featuredWork.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          background: `${accentColor}20`,
                          color: accentColor,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                selectedPost.caption && (
                  <p className="text-sm text-white/70 font-light line-clamp-2">
                    {selectedPost.caption}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
