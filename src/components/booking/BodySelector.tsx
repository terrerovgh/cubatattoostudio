import { useState } from 'react';

interface Props {
  selected: string;
  onSelect: (placement: string) => void;
}

const BODY_REGIONS = [
  { id: 'head-face', label: 'Head / Face', icon: '👤' },
  { id: 'neck', label: 'Neck', icon: '◯' },
  { id: 'chest', label: 'Chest', icon: '▭' },
  { id: 'upper-arm-left', label: 'Upper Arm (L)', icon: '💪' },
  { id: 'upper-arm-right', label: 'Upper Arm (R)', icon: '💪' },
  { id: 'forearm-left', label: 'Forearm (L)', icon: '▬' },
  { id: 'forearm-right', label: 'Forearm (R)', icon: '▬' },
  { id: 'wrist-left', label: 'Wrist (L)', icon: '⌚' },
  { id: 'wrist-right', label: 'Wrist (R)', icon: '⌚' },
  { id: 'hand-left', label: 'Hand (L)', icon: '✋' },
  { id: 'hand-right', label: 'Hand (R)', icon: '✋' },
  { id: 'fingers', label: 'Fingers', icon: '☝' },
  { id: 'back-upper', label: 'Upper Back', icon: '▮' },
  { id: 'back-lower', label: 'Lower Back', icon: '▯' },
  { id: 'full-back', label: 'Full Back', icon: '⬛' },
  { id: 'ribs-left', label: 'Ribs (L)', icon: '▥' },
  { id: 'ribs-right', label: 'Ribs (R)', icon: '▥' },
  { id: 'stomach', label: 'Stomach', icon: '◻' },
  { id: 'hip', label: 'Hip', icon: '◈' },
  { id: 'thigh-left', label: 'Thigh (L)', icon: '▰' },
  { id: 'thigh-right', label: 'Thigh (R)', icon: '▰' },
  { id: 'calf-left', label: 'Calf (L)', icon: '▱' },
  { id: 'calf-right', label: 'Calf (R)', icon: '▱' },
  { id: 'ankle-left', label: 'Ankle (L)', icon: '◦' },
  { id: 'ankle-right', label: 'Ankle (R)', icon: '◦' },
  { id: 'foot', label: 'Foot', icon: '👣' },
  { id: 'shoulder-left', label: 'Shoulder (L)', icon: '⊿' },
  { id: 'shoulder-right', label: 'Shoulder (R)', icon: '⊿' },
  { id: 'collarbone', label: 'Collarbone', icon: '⌒' },
  { id: 'behind-ear', label: 'Behind Ear', icon: '👂' },
  { id: 'full-sleeve', label: 'Full Sleeve', icon: '▐' },
  { id: 'half-sleeve', label: 'Half Sleeve', icon: '▌' },
];

const CATEGORIES = [
  { label: 'Arms', ids: ['upper-arm-left', 'upper-arm-right', 'forearm-left', 'forearm-right', 'wrist-left', 'wrist-right', 'hand-left', 'hand-right', 'fingers', 'full-sleeve', 'half-sleeve'] },
  { label: 'Torso', ids: ['chest', 'ribs-left', 'ribs-right', 'stomach', 'back-upper', 'back-lower', 'full-back'] },
  { label: 'Head & Neck', ids: ['head-face', 'neck', 'behind-ear', 'collarbone'] },
  { label: 'Shoulders', ids: ['shoulder-left', 'shoulder-right'] },
  { label: 'Legs', ids: ['hip', 'thigh-left', 'thigh-right', 'calf-left', 'calf-right', 'ankle-left', 'ankle-right', 'foot'] },
];

export function BodySelector({ selected, onSelect }: Props) {
  const [activeCategory, setActiveCategory] = useState('Arms');

  const activeCat = CATEGORIES.find((c) => c.label === activeCategory);
  const visibleRegions = BODY_REGIONS.filter((r) => activeCat?.ids.includes(r.id));

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.label)}
            className={`
              px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all
              ${activeCategory === cat.label
                ? 'bg-[#C8956C]/20 text-[#C8956C] border border-[#C8956C]/30'
                : 'bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white/70'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Region Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {visibleRegions.map((region) => (
          <button
            key={region.id}
            onClick={() => onSelect(region.label)}
            className={`
              p-3 rounded-xl text-center transition-all duration-200
              ${selected === region.label
                ? 'bg-[#C8956C]/15 border border-[#C8956C]/40 ring-1 ring-[#C8956C]/20'
                : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
              }
            `}
          >
            <span className="block text-lg mb-1">{region.icon}</span>
            <span className={`block text-[11px] font-medium ${selected === region.label ? 'text-[#C8956C]' : 'text-white/70'}`}>
              {region.label}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Display */}
      {selected && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#C8956C]/10 border border-[#C8956C]/20">
          <span className="text-[#C8956C] text-sm font-medium">Selected:</span>
          <span className="text-white text-sm">{selected}</span>
        </div>
      )}
    </div>
  );
}
