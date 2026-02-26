import { useStore } from '@nanostores/react';
import { $activeSection } from '@/store';
import {
  Home, Megaphone, Users, LayoutGrid, CalendarDays,
  Phone, Instagram, ChevronUp,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback, type ElementType } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────

const GOLD = '#C8956C';
const GOLD_GLOW = 'rgba(200, 149, 108, 0.4)';
const GLASS_BG = 'rgba(18, 18, 20, 0.72)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.08)';
const TEXT_DIM = 'rgba(250, 248, 245, 0.32)';
const TEXT_MID = 'rgba(250, 248, 245, 0.55)';
const SPRING = 'cubic-bezier(0.23, 1, 0.32, 1)';

interface NavItem {
  id: string;
  icon: ElementType;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero',       icon: Home,         label: 'Home'    },
  { id: 'promotions', icon: Megaphone,    label: 'Promos'  },
  { id: 'artists',    icon: Users,        label: 'Artists'  },
  { id: 'gallery',    icon: LayoutGrid,   label: 'Gallery'  },
  { id: 'booking',    icon: CalendarDays, label: 'Book'     },
];

// ─── Magnification helpers ───────────────────────────────────────────────────

function getItemScale(hoveredIdx: number | null, idx: number): number {
  if (hoveredIdx === null) return 1;
  const d = Math.abs(idx - hoveredIdx);
  if (d === 0) return 1.22;
  if (d === 1) return 1.09;
  if (d === 2) return 1.03;
  return 1;
}

function getItemLift(hoveredIdx: number | null, idx: number): number {
  if (hoveredIdx === null) return 0;
  const d = Math.abs(idx - hoveredIdx);
  if (d === 0) return -6;
  if (d === 1) return -2;
  return 0;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FloatingDock() {
  const activeSection = useStore($activeSection);

  const [isVisible, setIsVisible] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const lastScrollYRef = useRef(0);
  const rafRef = useRef(0);
  const tickingRef = useRef(false);
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  // ── Scroll handler — runs once, uses refs to avoid stale closures ───────
  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const lastY = lastScrollYRef.current;
        const docH = document.documentElement.scrollHeight - window.innerHeight;

        setScrollProgress(docH > 0 ? Math.min(y / docH, 1) : 0);
        setShowScrollTop(y > window.innerHeight * 0.5);

        if (y < 100) {
          setIsVisible(true);
        } else if (y > lastY + 15) {
          setIsVisible(false);
        } else if (y < lastY - 15) {
          setIsVisible(true);
        }

        lastScrollYRef.current = y;
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Mobile detection ────────────────────────────────────────────────────
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // ── Navigation ──────────────────────────────────────────────────────────
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Dynamic sizes ───────────────────────────────────────────────────────
  const itemW = isMobile ? 44 : 50;
  const itemH = isMobile ? 48 : 54;
  const actionSize = isMobile ? 34 : 38;
  const iconSz = isMobile ? 17 : 19;
  const actIconSz = isMobile ? 15 : 16;
  const lblSz = isMobile ? '7.5px' : '8.5px';
  const actLblSz = isMobile ? '7px' : '8px';
  const dockPad = isMobile ? '5px 6px' : '6px 10px';
  const dockRadius = isMobile ? 18 : 22;
  const blurVal = isMobile
    ? 'blur(32px) saturate(1.5)'
    : 'blur(50px) saturate(1.8) brightness(1.1)';

  // Shared styles for action items
  const actionBase = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 3,
    width: actionSize,
    height: actionSize + 12,
    borderRadius: isMobile ? 9 : 11,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none' as const,
    transition: 'background 0.2s ease',
    flexShrink: 0 as const,
  };

  const actionLabelStyle = {
    fontSize: actLblSz,
    fontWeight: 600 as const,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    color: TEXT_DIM,
    lineHeight: 1 as const,
    userSelect: 'none' as const,
  };

  const hoverIn = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
  };
  const hoverOut = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.background = 'transparent';
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
        left: '50%',
        transform: `translateX(-50%) translateY(${isVisible ? '0' : 'calc(100% + 24px)'})`,
        transition: `transform 0.45s ${SPRING}, opacity 0.3s ease`,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 0,
        padding: dockPad,
        borderRadius: dockRadius,
        background: GLASS_BG,
        backdropFilter: blurVal,
        WebkitBackdropFilter: blurVal,
        border: `1px solid ${GLASS_BORDER}`,
        boxShadow: [
          'inset 0 1px 0 0 rgba(255,255,255,0.06)',
          'inset 0 -1px 0 0 rgba(0,0,0,0.1)',
          '0 8px 40px rgba(0,0,0,0.5)',
          '0 2px 8px rgba(0,0,0,0.3)',
          '0 0 80px rgba(200,149,108,0.04)',
        ].join(', '),
        overflow: 'hidden',
      }}
    >
      {/* ── Ambient glow ──────────────────────────────────────────── */}
      {!reducedMotion.current && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-30px',
            background: 'radial-gradient(ellipse at center, rgba(200,149,108,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: -1,
            animation: 'subtlePulse 6s ease-in-out infinite',
          }}
        />
      )}

      {/* ── Progress bar ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 10,
          right: 10,
          height: 2,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 1,
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${scrollProgress * 100}%`,
            background: `linear-gradient(90deg, ${GOLD}, #DABA8F)`,
            borderRadius: 1,
            transition: 'width 0.12s linear',
            boxShadow: `0 0 8px ${GOLD_GLOW}`,
          }}
        />
      </div>

      {/* ── Nav items ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMobile ? 1 : 2 }}>
        {NAV_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isBooking = item.id === 'booking';

          const doMagnify = !isMobile && !reducedMotion.current;
          const scale = doMagnify ? getItemScale(hoveredIndex, i) : 1;
          const lift = doMagnify ? getItemLift(hoveredIndex, i) : 0;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              onMouseEnter={() => { if (!isMobile) setHoveredIndex(i); }}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={item.label}
              aria-current={isActive ? 'true' : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                width: itemW,
                height: itemH,
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                borderRadius: isMobile ? 10 : 13,
                background: isActive
                  ? isBooking
                    ? 'rgba(200, 149, 108, 0.15)'
                    : 'rgba(255, 255, 255, 0.07)'
                  : 'transparent',
                transform: `scale(${scale}) translateY(${lift}px)`,
                transition: `transform 0.28s ${SPRING}, background 0.25s ease`,
                transformOrigin: 'bottom center',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <Icon
                size={iconSz}
                strokeWidth={isActive ? 2.2 : 1.6}
                style={{
                  color: isActive
                    ? isBooking ? GOLD : 'rgba(255,255,255,0.95)'
                    : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.25s ease',
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  fontSize: lblSz,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  lineHeight: 1,
                  color: isActive
                    ? isBooking ? GOLD : TEXT_MID
                    : TEXT_DIM,
                  transition: 'color 0.25s ease',
                  whiteSpace: 'nowrap' as const,
                  userSelect: 'none' as const,
                }}
              >
                {item.label}
              </span>

              {/* Active indicator pill */}
              {isActive && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 14,
                    height: 3,
                    borderRadius: 2,
                    background: isBooking ? GOLD : 'rgba(255,255,255,0.6)',
                    boxShadow: isBooking
                      ? '0 0 10px rgba(200,149,108,0.5)'
                      : '0 0 8px rgba(255,255,255,0.25)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Separator ─────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          width: 1,
          height: 24,
          background: 'rgba(255,255,255,0.06)',
          margin: `0 ${isMobile ? 5 : 8}px`,
          flexShrink: 0,
          alignSelf: 'center',
        }}
      />

      {/* ── Quick actions ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 2 : 4 }}>
        {/* Phone */}
        <a
          href="tel:+15054929806"
          aria-label="Call Cuba Tattoo Studio"
          style={actionBase}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          <Phone size={actIconSz} strokeWidth={1.6} style={{ color: GOLD, flexShrink: 0 }} />
          <span style={actionLabelStyle}>Call</span>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com/cubatattoostudio"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Cuba Tattoo Studio on Instagram"
          style={actionBase}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          <Instagram size={actIconSz} strokeWidth={1.6} style={{ color: 'rgba(250,248,245,0.45)', flexShrink: 0 }} />
          <span style={actionLabelStyle}>IG</span>
        </a>

        {/* Scroll to top — animates width in/out */}
        <div
          aria-hidden={!showScrollTop}
          style={{
            overflow: 'hidden',
            maxWidth: showScrollTop ? 44 : 0,
            opacity: showScrollTop ? 1 : 0,
            transition: `max-width 0.35s ${SPRING}, opacity 0.25s ease`,
          }}
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            tabIndex={showScrollTop ? 0 : -1}
            style={actionBase as React.CSSProperties}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            <ChevronUp size={actIconSz} strokeWidth={1.8} style={{ color: 'rgba(250,248,245,0.4)', flexShrink: 0 }} />
            <span style={actionLabelStyle}>Top</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
