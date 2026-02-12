import { useStore } from '@nanostores/react';
import { $activeSection } from '@/store';
import { Home, Users, Palette, LayoutGrid, CalendarDays } from 'lucide-react';
import { useState } from 'react';

const dockItems = [
  { id: 'hero', icon: Home, label: 'Home' },
  { id: 'artists', icon: Users, label: 'Artists' },
  { id: 'services', icon: Palette, label: 'Services' },
  { id: 'gallery', icon: LayoutGrid, label: 'Gallery' },
  { id: 'booking', icon: CalendarDays, label: 'Book', accent: true },
];

export default function FloatingDock() {
  const activeSection = useStore($activeSection);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50
                 rounded-[22px] px-1.5 py-1.5
                 flex items-center gap-0.5"
      style={{
        background: 'rgba(18, 18, 20, 0.55)',
        backdropFilter: 'blur(50px) saturate(1.8) brightness(1.1)',
        WebkitBackdropFilter: 'blur(50px) saturate(1.8) brightness(1.1)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow:
          'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 0 rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
      aria-label="Main navigation"
    >
      {dockItems.map(({ id, icon: Icon, label, accent }) => {
        const isActive = activeSection === id;
        const isHovered = hoveredId === id;

        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative flex flex-col items-center justify-center
                       rounded-2xl transition-all duration-300 ease-out
                       group cursor-pointer"
            style={{
              width: accent ? 52 : 46,
              height: accent ? 52 : 46,
              transform: isHovered ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
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
              size={accent ? 20 : 18}
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

            {/* Label — visible on hover */}
            <span
              className="text-[8px] font-medium tracking-wide mt-0.5 transition-all duration-300"
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
                  width: 4,
                  height: 4,
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
