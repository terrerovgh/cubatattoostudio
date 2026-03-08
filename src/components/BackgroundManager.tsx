import { useStore } from '@nanostores/react';
import { $currentBackground } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function BackgroundManager() {
  const currentBg = useStore($currentBackground);
  const [displayedBg, setDisplayedBg] = useState(currentBg);
  const [nextBg, setNextBg] = useState<string | null>(null);
  
  const currentLayerRef = useRef<HTMLDivElement>(null);
  const nextLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentBg === displayedBg) return;

    // Preload next image
    const img = new Image();
    img.onload = () => {
      setNextBg(currentBg);
      
      const ctx = gsap.context(() => {
        // Fade in next layer
        gsap.to(nextLayerRef.current, {
          opacity: 1,
          scale: 1.05,
          duration: 1.5,
          ease: 'power2.inOut',
          onComplete: () => {
            setDisplayedBg(currentBg);
            setNextBg(null);
            // Reset current layer opacity for next transition
            gsap.set(currentLayerRef.current, { opacity: 1, scale: 1.05 });
          }
        });

        // Fade out current layer slightly later for smoother blend
        gsap.to(currentLayerRef.current, {
          opacity: 0,
          scale: 1.1,
          duration: 1.2,
          ease: 'power2.inOut'
        });
      }, containerRef);

      return () => ctx.revert();
    };
    img.src = currentBg;
  }, [currentBg, displayedBg]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true" ref={containerRef}>
      {/* Current background layer */}
      <div
        ref={currentLayerRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url(${displayedBg})`,
          transform: 'scale(1.05)',
        }}
      />

      {/* Next background layer (crossfade) */}
      {nextBg && (
        <div
          ref={nextLayerRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 will-change-transform"
          style={{
            backgroundImage: `url(${nextBg})`,
            transform: 'scale(1.02)',
          }}
        />
      )}

      {/* Mesh gradient overlay — depth & atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(10, 10, 12, 0.4) 0%, rgba(5, 5, 8, 0.8) 100%),
            linear-gradient(to bottom,
              rgba(5, 5, 8, 0.6) 0%,
              rgba(5, 5, 8, 0.4) 40%,
              rgba(5, 5, 8, 0.5) 60%,
              rgba(5, 5, 8, 0.9) 100%
            )
          `,
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Glass/Contrast Filter */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 bg-black/20"
        style={{ backdropFilter: 'brightness(0.8) contrast(1.05)' }}
      />

      {/* Noise texture — subtle film grain */}
      <div
        className="absolute inset-0 opacity-[0.02] z-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  );
}
