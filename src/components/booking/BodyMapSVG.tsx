import { useState } from 'react';
import type { BodyView } from '../../types/booking';

interface BodyZone {
  id: string;
  label: string;
  category: string;
  // SVG path data for front view
  frontPath?: string;
  // SVG path data for back view
  backPath?: string;
}

const BODY_ZONES: BodyZone[] = [
  // Head & Neck
  { id: 'head', label: 'Head', category: 'head_neck', frontPath: 'M85,18 C85,8 95,2 100,2 C105,2 115,8 115,18 C115,28 110,35 100,35 C90,35 85,28 85,18Z', backPath: 'M85,18 C85,8 95,2 100,2 C105,2 115,8 115,18 C115,28 110,35 100,35 C90,35 85,28 85,18Z' },
  { id: 'neck', label: 'Neck', category: 'head_neck', frontPath: 'M93,35 L107,35 L108,45 L92,45Z', backPath: 'M93,35 L107,35 L108,45 L92,45Z' },
  // Shoulders
  { id: 'left_shoulder', label: 'Left Shoulder', category: 'shoulders', frontPath: 'M68,45 L92,45 L90,58 L65,55Z', backPath: 'M68,45 L92,45 L90,58 L65,55Z' },
  { id: 'right_shoulder', label: 'Right Shoulder', category: 'shoulders', frontPath: 'M108,45 L132,45 L135,55 L110,58Z', backPath: 'M108,45 L132,45 L135,55 L110,58Z' },
  // Torso
  { id: 'chest', label: 'Chest', category: 'torso', frontPath: 'M78,55 L122,55 L120,80 L80,80Z' },
  { id: 'upper_back', label: 'Upper Back', category: 'torso', backPath: 'M78,55 L122,55 L120,80 L80,80Z' },
  { id: 'stomach', label: 'Stomach', category: 'torso', frontPath: 'M80,80 L120,80 L118,105 L82,105Z' },
  { id: 'lower_back', label: 'Lower Back', category: 'torso', backPath: 'M80,80 L120,80 L118,105 L82,105Z' },
  { id: 'ribs_left', label: 'Left Ribs', category: 'torso', frontPath: 'M65,58 L80,58 L80,95 L68,90Z' },
  { id: 'ribs_right', label: 'Right Ribs', category: 'torso', frontPath: 'M120,58 L135,58 L132,90 L120,95Z' },
  // Arms
  { id: 'left_upper_arm', label: 'Left Upper Arm', category: 'arms', frontPath: 'M55,55 L68,55 L65,85 L52,82Z', backPath: 'M55,55 L68,55 L65,85 L52,82Z' },
  { id: 'right_upper_arm', label: 'Right Upper Arm', category: 'arms', frontPath: 'M132,55 L145,55 L148,82 L135,85Z', backPath: 'M132,55 L145,55 L148,82 L135,85Z' },
  { id: 'left_forearm', label: 'Left Forearm', category: 'arms', frontPath: 'M48,85 L62,85 L58,120 L45,118Z', backPath: 'M48,85 L62,85 L58,120 L45,118Z' },
  { id: 'right_forearm', label: 'Right Forearm', category: 'arms', frontPath: 'M138,85 L152,85 L155,118 L142,120Z', backPath: 'M138,85 L152,85 L155,118 L142,120Z' },
  { id: 'left_hand', label: 'Left Hand', category: 'arms', frontPath: 'M42,118 L58,118 L56,132 L40,130Z', backPath: 'M42,118 L58,118 L56,132 L40,130Z' },
  { id: 'right_hand', label: 'Right Hand', category: 'arms', frontPath: 'M142,118 L158,118 L160,130 L144,132Z', backPath: 'M142,118 L158,118 L160,130 L144,132Z' },
  // Legs
  { id: 'left_thigh', label: 'Left Thigh', category: 'legs', frontPath: 'M78,108 L98,108 L95,148 L75,148Z', backPath: 'M78,108 L98,108 L95,148 L75,148Z' },
  { id: 'right_thigh', label: 'Right Thigh', category: 'legs', frontPath: 'M102,108 L122,108 L125,148 L105,148Z', backPath: 'M102,108 L122,108 L125,148 L105,148Z' },
  { id: 'left_knee', label: 'Left Knee', category: 'legs', frontPath: 'M75,148 L95,148 L94,162 L76,162Z', backPath: 'M75,148 L95,148 L94,162 L76,162Z' },
  { id: 'right_knee', label: 'Right Knee', category: 'legs', frontPath: 'M105,148 L125,148 L124,162 L106,162Z', backPath: 'M105,148 L125,148 L124,162 L106,162Z' },
  { id: 'left_calf', label: 'Left Calf', category: 'legs', frontPath: 'M76,162 L94,162 L92,198 L78,198Z', backPath: 'M76,162 L94,162 L92,198 L78,198Z' },
  { id: 'right_calf', label: 'Right Calf', category: 'legs', frontPath: 'M106,162 L124,162 L122,198 L108,198Z', backPath: 'M106,162 L124,162 L122,198 L108,198Z' },
  { id: 'left_ankle_foot', label: 'Left Ankle/Foot', category: 'legs', frontPath: 'M78,198 L92,198 L94,212 L76,212Z', backPath: 'M78,198 L92,198 L94,212 L76,212Z' },
  { id: 'right_ankle_foot', label: 'Right Ankle/Foot', category: 'legs', frontPath: 'M108,198 L122,198 L124,212 L106,212Z', backPath: 'M108,198 L122,198 L124,212 L106,212Z' },
];

const CATEGORIES = [
  { id: 'head_neck', label: 'Head & Neck', icon: '🗣' },
  { id: 'shoulders', label: 'Shoulders', icon: '💪' },
  { id: 'torso', label: 'Torso', icon: '👕' },
  { id: 'arms', label: 'Arms', icon: '🤚' },
  { id: 'legs', label: 'Legs', icon: '🦵' },
];

interface Props {
  value: string;
  onChange: (region: string, label: string) => void;
  accentColor?: string;
}

export function BodyMapSVG({ value, onChange, accentColor = '#C8956C' }: Props) {
  const [view, setView] = useState<BodyView>('front');
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const selectedZone = BODY_ZONES.find(z => z.id === value);

  const visibleZones = BODY_ZONES.filter(z => {
    const hasPath = view === 'front' ? z.frontPath : z.backPath;
    if (!hasPath) return false;
    if (activeCategory) return z.category === activeCategory;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 rounded-lg bg-white/5">
          <button
            onClick={() => setView('front')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              view === 'front' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setView('back')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              view === 'back' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            Back
          </button>
        </div>

        {selectedZone && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: `${accentColor}20`, color: accentColor }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {selectedZone.label}
          </div>
        )}
      </div>

      {/* SVG Body Map */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 200 220"
          className="w-full max-w-[260px] h-auto"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.3))' }}
        >
          {/* Body outline */}
          <path
            d="M100,2 C108,2 116,10 116,20 C116,30 110,36 100,36 C90,36 84,30 84,20 C84,10 92,2 100,2
               M92,36 L108,36 L108,46 L132,46 L145,55 L155,85 L160,130 L144,132 L142,120 L138,85 L135,60
               L122,55 L120,80 L118,105 L122,108 L125,148 L124,162 L122,198 L124,212 L106,212 L108,198
               L106,162 L105,148 L102,108 L100,108 L98,108 L95,148 L94,162 L92,198 L94,212 L76,212
               L78,198 L76,162 L75,148 L78,108 L82,105 L80,80 L78,55 L65,60 L62,85 L58,120 L56,132
               L40,130 L45,85 L55,55 L68,46 L92,46Z"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />

          {/* Interactive zones */}
          {visibleZones.map(zone => {
            const path = view === 'front' ? zone.frontPath : zone.backPath;
            if (!path) return null;
            const isSelected = value === zone.id;
            const isHovered = hoveredZone === zone.id;

            return (
              <path
                key={zone.id}
                d={path}
                fill={
                  isSelected
                    ? `${accentColor}40`
                    : isHovered
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.02)'
                }
                stroke={isSelected ? accentColor : isHovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.06)'}
                strokeWidth={isSelected ? '1.5' : '0.5'}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onChange(zone.id, zone.label)}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                role="button"
                aria-label={zone.label}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(zone.id, zone.label);
                  }
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Hovered zone label tooltip */}
      {hoveredZone && !selectedZone && (
        <p className="text-center text-xs text-white/40">
          {BODY_ZONES.find(z => z.id === hoveredZone)?.label}
        </p>
      )}

      {/* Category tabs fallback */}
      <div>
        <p className="text-xs text-white/30 mb-2 text-center">Or select by area:</p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-white/15 text-white'
                  : 'bg-white/5 text-white/40 hover:text-white/60'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Region buttons for active category */}
        {activeCategory && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {BODY_ZONES.filter(z => z.category === activeCategory).map(zone => (
              <button
                key={zone.id}
                onClick={() => onChange(zone.id, zone.label)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  value === zone.id
                    ? 'font-medium'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
                style={value === zone.id ? {
                  background: `${accentColor}20`,
                  color: accentColor,
                  border: `1px solid ${accentColor}40`,
                } : undefined}
              >
                {zone.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
