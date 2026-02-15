import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Service } from './ServiceCarouselCard';

interface ServiceModalProps {
  item: Service;
  onClose: () => void;
}

export default function ServiceModal({ item, onClose }: ServiceModalProps) {
  const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video', src: string } | null>(null);

  const media = [
    ...(item.videos || []).map(src => ({ type: 'video' as const, src })),
    ...(item.galleryImages || []).map(src => ({ type: 'image' as const, src }))
  ];

  useEffect(() => {
    if (media.length > 0) {
      setActiveMedia(media[0]);
    }
  }, [item]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 cursor-pointer"
      style={{
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(20px) saturate(0.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(0.8)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] rounded-[24px] overflow-hidden
                   shadow-[0_40px_100px_rgba(0,0,0,0.7)]
                   border border-white/[0.08] bg-[#0A0A0A] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side: Image/Video Gallery */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-black/50 relative group flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            {activeMedia && (
              activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeMedia.src}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )
            )}
          </div>

          {/* Thumbnails overlay */}
          <div className="bg-black/40 backdrop-blur-md border-t border-white/10 p-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {media.map((m, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMedia(m);
                }}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all relative
                          ${activeMedia?.src === m.src ? 'border-[var(--color-gold)] opacity-100' : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/60'}`}
              >
                {m.type === 'video' ? (
                  <video
                    src={m.src}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img src={m.src} className="w-full h-full object-cover" />
                )}
                {m.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right side: Content */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col h-[60vh] md:h-auto">
          <h2 className="text-3xl font-bold text-gradient-gold mb-2">{item.name}</h2>
          <div className="w-12 h-1 bg-[var(--color-gold)] mb-6 rounded-full opacity-50 shrink-0"></div>

          <p className="text-white/80 leading-relaxed mb-8 whitespace-pre-line text-sm md:text-base">
            {item.fullDescription}
          </p>

          {/* Pricing */}
          {item.priceList && item.priceList.length > 0 && (
            <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-gold)] mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] mr-2"></span>
                Pricing
              </h4>
              <div className="space-y-3">
                {item.priceList.map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-dashed border-white/10 pb-2 last:border-0 last:pb-0">
                    <span className="text-white/60">{p.item}</span>
                    <span className="font-medium text-white">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews (if any) */}
          {item.reviews && item.reviews.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Reviews</h4>
              {item.reviews.map((rev, i) => (
                <blockquote key={i} className="text-sm text-white/60 italic border-l-2 border-[var(--color-gold)] pl-4 py-1 mb-2 last:mb-0">
                  "{rev.comment}" <span className="block text-xs font-normal text-white/40 not-italic mt-1">- {rev.author}</span>
                </blockquote>
              ))}
            </div>
          )}

          <div className="mt-auto pt-6">
            <a
              href="#booking"
              onClick={onClose}
              className="w-full block text-center bg-[var(--color-gold)] text-black font-bold py-3 rounded-xl hover:bg-[#D4A37D] transition-colors"
            >
              Book This Service
            </a>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full
                     flex items-center justify-center
                     text-white/50 hover:text-white bg-black/20 hover:bg-black/60 transition-all backdrop-blur-sm"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
