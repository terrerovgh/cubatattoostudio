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
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(200, 149, 108, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 90%, rgba(200, 149, 108, 0.03) 0%, transparent 50%),
            linear-gradient(to bottom,
              rgba(10, 10, 12, 0.5) 0%,
              rgba(10, 10, 12, 0.3) 30%,
              rgba(10, 10, 12, 0.35) 60%,
              rgba(10, 10, 12, 0.7) 100%
            )
          `,
        }}
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
