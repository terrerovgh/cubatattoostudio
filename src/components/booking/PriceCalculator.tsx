import { useState, useEffect, useRef } from 'react';
import type { PriceEstimate } from '../../types/booking';

interface Props {
  estimate: PriceEstimate | null;
  artistName?: string;
  artistImage?: string;
  artistAccent?: string;
  className?: string;
}

function AnimatedNumber({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) return;
    const from = prevRef.current;
    const to = value;
    const duration = 400;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    prevRef.current = value;
  }, [value]);

  return <span>{prefix}{display.toLocaleString()}</span>;
}

export function PriceCalculator({ estimate, artistName, artistImage, artistAccent, className = '' }: Props) {
  const [expanded, setExpanded] = useState(false);
  const accent = artistAccent || '#C8956C';

  if (!estimate) {
    return (
      <div className={`liquid-glass rounded-2xl p-5 ${className}`}>
        <div className="flex items-center gap-3 text-white/30">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Price updates as you build your booking</span>
        </div>
      </div>
    );
  }

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  };

  return (
    <>
      {/* Desktop: Sidebar Panel */}
      <div className={`hidden lg:block liquid-glass rounded-2xl overflow-hidden ${className}`}>
        {/* Header with accent stripe */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />
        <div className="p-5 space-y-4">
          {/* Artist mini avatar */}
          {artistName && (
            <div className="flex items-center gap-3 pb-3 border-b border-white/8">
              {artistImage && (
                <div
                  className="w-8 h-8 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${artistImage})` }}
                />
              )}
              <span className="text-sm text-white/60">with <span className="text-white font-medium">{artistName}</span></span>
            </div>
          )}

          {/* Price range */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Estimated Price</p>
            <div className="text-2xl font-bold text-white">
              <AnimatedNumber value={estimate.total_min} />
              <span className="text-white/30 mx-1">–</span>
              <AnimatedNumber value={estimate.total_max} />
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-sm text-white/50">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>~{formatDuration(estimate.estimated_duration)}</span>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 pt-2 border-t border-white/8">
            {estimate.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-white/50">{item.label}</span>
                <span className={item.amount < 0 ? 'text-green-400' : 'text-white/70'}>
                  {item.amount < 0 ? '-' : '+'}${Math.abs(item.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Deposit highlight */}
          <div
            className="p-3 rounded-xl text-center"
            style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
          >
            <p className="text-xs text-white/50 mb-0.5">Deposit to Secure</p>
            <p className="text-xl font-bold" style={{ color: accent }}>
              <AnimatedNumber value={estimate.deposit_required} />
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: Floating Bottom Pill */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full liquid-glass-elevated rounded-2xl overflow-hidden"
        >
          <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />

          {/* Collapsed view */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {artistImage && (
                <div
                  className="w-7 h-7 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${artistImage})` }}
                />
              )}
              <div className="text-left">
                <p className="text-xs text-white/40">Estimated</p>
                <p className="text-sm font-bold text-white">
                  ${estimate.total_min.toLocaleString()} – ${estimate.total_max.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-white/40">Deposit</p>
                <p className="text-sm font-bold" style={{ color: accent }}>
                  ${estimate.deposit_required}
                </p>
              </div>
              <svg
                className={`w-4 h-4 text-white/40 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </div>
          </div>

          {/* Expanded breakdown */}
          {expanded && (
            <div className="px-4 pb-3 pt-1 border-t border-white/8 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ~{formatDuration(estimate.estimated_duration)}
              </div>
              {estimate.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-white/40">{item.label}</span>
                  <span className={item.amount < 0 ? 'text-green-400' : 'text-white/60'}>
                    {item.amount < 0 ? '-' : '+'}${Math.abs(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </button>
      </div>
    </>
  );
}
