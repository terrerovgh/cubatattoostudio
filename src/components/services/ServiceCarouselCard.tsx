import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Service {
  name: string;
  description: string;
  fullDescription: string;
  priceList: { item: string; price: string }[];
  galleryImages: string[];
  videos?: string[];
  reviews: { author: string; comment: string; rating: number }[];
  type?: 'service';
  id?: string;
  imageUrl?: string;
  price?: string;
}

interface ServiceCarouselCardProps {
  item: Service;
  onClick: () => void;
}

export default function ServiceCarouselCard({ item, onClick }: ServiceCarouselCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const media = [
    ...(item.videos || []).map(src => ({ type: 'video' as const, src })),
    ...(item.galleryImages || []).map(src => ({ type: 'image' as const, src }))
  ];

  // Auto-rotate logic
  useEffect(() => {
    if (media.length <= 1 || isHovering) return;

    // Randomize interval between 4s and 7s to avoid synchronized switching
    const randomInterval = Math.floor(Math.random() * 3000) + 4000;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, randomInterval);

    return () => clearInterval(interval);
  }, [media.length, isHovering]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  if (media.length === 0) return null;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="w-full break-inside-avoid mb-4 rounded-[18px] overflow-hidden
                  bg-white/[0.03] border border-white/[0.05]
                  transition-all duration-500 ease-out
                  hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
                  hover:scale-[1.02]
                  group relative block text-left cursor-pointer aspect-[4/5]"
    >
      {/* Carousel Media */}
      <div className="absolute inset-0 bg-black">
        {media.map((m, i) => (
          <div
            key={`${item.id || item.name}-media-${i}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                       ${i === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {m.type === 'video' ? (
              <video
                src={m.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={m.src}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        ))}
        {/* Overlay gradient always on top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />
      </div>

      {/* Navigation Arrows (Visible on Hover) */}
      {media.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm transform -translate-x-2 group-hover:translate-x-0`}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm transform translate-x-2 group-hover:translate-x-0`}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicators */}
          <div className="absolute top-3 right-3 z-30 flex gap-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {media.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white scale-110' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 z-30 flex flex-col justify-end p-5 pointer-events-none">
        <h3 className="text-white font-bold text-xl leading-tight mb-2 drop-shadow-lg transform translate-y-0 transition-transform duration-300 group-hover:-translate-y-1">
          {item.name}
        </h3>
        <p className="text-white/90 text-sm font-light line-clamp-2 drop-shadow-md mb-3 transform translate-y-0 transition-transform duration-300 group-hover:-translate-y-1 delay-75">
          {item.description}
        </p>
        <div className="flex items-center text-[10px] uppercase tracking-wider font-bold text-[var(--color-gold)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 delay-100">
          <span className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded border border-white/10">View Services</span>
        </div>
      </div>
    </div>
  );
}
