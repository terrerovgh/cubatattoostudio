import { useStore } from '@nanostores/react';
import { $currentBackground } from '@/store';
import { useEffect, useRef, useState } from 'react';

export default function BackgroundManager() {
  const currentBg = useStore($currentBackground);
  const [displayedBg, setDisplayedBg] = useState(currentBg);
  const [nextBg, setNextBg] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (currentBg === displayedBg) return;

    const img = new Image();
    img.onload = () => {
      setNextBg(currentBg);
      setTransitioning(true);

      timeoutRef.current = setTimeout(() => {
        setDisplayedBg(currentBg);
        setNextBg(null);
        setTransitioning(false);
      }, 1400);
    };
    img.src = currentBg;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentBg, displayedBg]);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      {/* Current background layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2000ms] ease-out"
        style={{
          backgroundImage: `url(${displayedBg})`,
          transform: 'scale(1.05)',
        }}
      />

      {/* Next background layer (crossfade) */}
      {nextBg && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${nextBg})`,
            opacity: transitioning ? 1 : 0,
            transform: 'scale(1.05)',
            transition: 'opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      )}

      {/* Mesh gradient overlay — depth & atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
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
      <div 
        className="absolute inset-0 pointer-events-none bg-black/30"
        style={{ backdropFilter: 'brightness(0.7) contrast(1.1)' }}
      />

      {/* Noise texture — subtle film grain */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  );
}
