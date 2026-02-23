import { useStore } from '@nanostores/react';
import { $activeSection } from '@/store';
import { Home, Users, LayoutGrid, CalendarDays, Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';

const dockItems = [
  { id: 'hero', icon: Home, label: 'Home' },
  { id: 'promotions', icon: Megaphone, label: 'Promos' },
  { id: 'artists', icon: Users, label: 'Artists' },
  { id: 'gallery', icon: LayoutGrid, label: 'Gallery' },
  { id: 'booking', icon: CalendarDays, label: 'Book', accent: true, href: '/booking' },
];

export default function FloatingDock() {
  const activeSection = useStore($activeSection);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => setIsNavigating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  // Hide dock on scroll down, show on scroll up (mobile UX pattern)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY < 100) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY + 10) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY - 10) {
            setIsVisible(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollTo = (id: string, href?: string) => {
    setIsNavigating(true);
    if (href) {
      window.location.href = href;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed left-1/2 -translate-x-1/2 z-50
                 rounded-[18px] sm:rounded-[22px] px-1 sm:px-1.5 py-1 sm:py-1.5
                 flex items-center gap-0"
      style={{
        bottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
        background: 'rgba(18, 18, 20, 0.65)',
        backdropFilter: 'blur(50px) saturate(1.8) brightness(1.1)',
        WebkitBackdropFilter: 'blur(50px) saturate(1.8) brightness(1.1)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow:
          'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 0 rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25)',
        opacity: isNavigating ? 0.7 : 1,
        transform: `translateX(-50%) translateY(${isVisible ? '0' : '80px'})`,
        transition: 'opacity 0.2s ease, transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {dockItems.map(({ id, icon: Icon, label, accent, href }) => {
        const isActive = activeSection === id;
        const isHovered = hoveredId === id;

        return (
          <button
            key={id}
            onClick={() => scrollTo(id, href)}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative flex flex-col items-center justify-center
                       rounded-xl sm:rounded-2xl transition-all duration-300 ease-out
                       group cursor-pointer"
            style={{
              width: accent ? 46 : 40,
              height: accent ? 46 : 40,
              minWidth: 40,
              minHeight: 40,
              transform: isHovered ? 'scale(1.12) translateY(-2px)' : 'scale(1)',
              background: isActive
                ? accent
                  ? 'rgba(200, 149, 108, 0.2)'
                  : 'rgba(255, 255, 255, 0.08)'
                : 'transparent',
              borderWidth: accent ? 1 : 0,
              borderStyle: 'solid',
              borderColor: accent
                ? isActive
                  ? 'rgba(200, 149, 108, 0.4)'
                  : 'rgba(200, 149, 108, 0.2)'
                : 'transparent',
            }}
            aria-label={label}
            aria-current={isActive ? 'true' : undefined}
          >
            <Icon
              size={accent ? 18 : 16}
              strokeWidth={1.8}
              style={{
                color: accent
                  ? '#C8956C'
                  : isActive
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'rgba(255, 255, 255, 0.4)',
                transition: 'color 0.3s ease',
              }}
            />

            {/* Label — visible on hover or active */}
            <span
              className="text-[7px] sm:text-[8px] font-medium tracking-wide mt-0.5 transition-all duration-300 select-none"
              style={{
                color: accent ? '#C8956C' : 'rgba(255, 255, 255, 0.5)',
                opacity: isHovered || isActive ? 1 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(2px)',
              }}
            >
              {label}
            </span>

            {/* Active indicator */}
            {isActive && (
              <span
                className="absolute -bottom-0.5 rounded-full transition-all duration-300"
                style={{
                  width: 3,
                  height: 3,
                  background: accent
                    ? '#C8956C'
                    : 'rgba(255, 255, 255, 0.6)',
                  boxShadow: accent
                    ? '0 0 8px rgba(200, 149, 108, 0.5)'
                    : '0 0 6px rgba(255, 255, 255, 0.3)',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
