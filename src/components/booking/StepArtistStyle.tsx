import { useState } from 'react';
import type { BookingFormData } from '../../types/booking';
import { ArtistMatcher } from './ArtistMatcher';

interface Props {
  form: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
}

const ARTISTS = [
  {
    id: 'david',
    name: 'David',
    role: 'Founder & Lead Artist',
    image: '/artists/david.jpg',
    specialties: ['Color Realism', 'Black & Grey Realism', 'Neo-Traditional', 'Cover-ups', 'Portraits'],
    accent: '#E8793A',
    portfolioImages: ['/gallery/david-1.webp', '/gallery/david-2.webp', '/gallery/david-3.webp'],
  },
  {
    id: 'nina',
    name: 'Nina',
    role: 'Fine Line, Dotwork & Ornamental',
    image: '/artists/nina.jpg',
    specialties: ['Fine Line', 'Dotwork', 'Ornamental', 'Geometric Blackwork', 'Mandalas', 'Micro Tattoos'],
    accent: '#feb4b4',
    portfolioImages: ['/gallery/nina-1.webp', '/gallery/nina-2.webp', '/gallery/nina-3.webp'],
  },
  {
    id: 'karli',
    name: 'Karli',
    role: 'Black & Grey Realism & Mythology',
    image: '/artists/karli.jpg',
    specialties: ['Black & Grey Realism', 'Greek Mythology', 'Pet Portraits', 'Floral & Botanical', 'Cover-ups'],
    accent: '#4A9EBF',
    portfolioImages: ['/gallery/karli-1.webp', '/gallery/karli-2.webp', '/gallery/karli-3.webp'],
  },
];

const STYLES = [
  { id: 'Custom Tattoos', label: 'Custom Design', icon: '✨' },
  { id: 'Color Realism', label: 'Color Realism', icon: '🎨' },
  { id: 'Black & Grey Realism', label: 'Black & Grey', icon: '🖤' },
  { id: 'Fine Line & Dotwork', label: 'Fine Line & Dotwork', icon: '✒️' },
  { id: 'Cover-ups', label: 'Cover-up', icon: '🔄' },
  { id: 'Neo-Traditional', label: 'Neo-Traditional', icon: '⚡' },
  { id: 'Floral & Botanical', label: 'Floral & Botanical', icon: '🌸' },
  { id: 'Pet Tattoos', label: 'Pet Portrait', icon: '🐾' },
  { id: 'Flash', label: 'Flash Design', icon: '⚡' },
];

export function StepArtistStyle({ form, updateForm, onNext }: Props) {
  const [matchMode, setMatchMode] = useState(!form.artist_id);

  const selectedArtist = ARTISTS.find(a => a.id === form.artist_id);
  const canProceed = form.artist_id && form.service_type;

  const filteredStyles = selectedArtist
    ? STYLES.filter(s =>
        selectedArtist.specialties.some(spec =>
          s.id.toLowerCase().includes(spec.toLowerCase().split(' ')[0]) ||
          spec.toLowerCase().includes(s.id.toLowerCase().split(' ')[0])
        ) || s.id === 'Custom Tattoos' || s.id === 'Flash'
      )
    : STYLES;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          Choose Your Artist & Style
        </h2>
        <p className="text-white/45 text-sm">Find the perfect artist for your vision</p>
      </div>

      {/* Smart Matcher Toggle */}
      <div className="flex gap-2 p-1 rounded-xl bg-white/5">
        <button
          onClick={() => setMatchMode(true)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            matchMode ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <span className="mr-1.5">🎯</span> Smart Match
        </button>
        <button
          onClick={() => setMatchMode(false)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            !matchMode ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <span className="mr-1.5">👤</span> Choose Myself
        </button>
      </div>

      {/* Smart Artist Matcher */}
      {matchMode && (
        <div className="space-y-3">
          <p className="text-sm text-white/55">Describe your tattoo idea and we'll suggest the best artist:</p>
          <ArtistMatcher
            onSelect={(artistId, description) => {
              updateForm({ artist_id: artistId, description });
              setMatchMode(false);
            }}
          />
        </div>
      )}

      {/* Manual Artist Selection */}
      {!matchMode && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Select Artist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ARTISTS.map(artist => {
              const isSelected = form.artist_id === artist.id;
              return (
                <button
                  key={artist.id}
                  onClick={() => updateForm({ artist_id: artist.id })}
                  className={`relative p-4 rounded-2xl text-left transition-all duration-300 group ${
                    isSelected
                      ? 'ring-2 bg-white/8'
                      : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
                  }`}
                  style={{
                    ringColor: isSelected ? artist.accent : undefined,
                    boxShadow: isSelected ? `0 0 20px ${artist.accent}20` : undefined,
                  }}
                >
                  {/* Artist photo */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0 transition-all ${
                        isSelected ? 'ring-2' : 'ring-1 ring-white/10'
                      }`}
                      style={{
                        backgroundImage: `url(${artist.image})`,
                        ringColor: isSelected ? artist.accent : undefined,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white">{artist.name}</h4>
                      <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{artist.role}</p>
                    </div>
                  </div>

                  {/* Mini portfolio */}
                  <div className="flex gap-1.5 mb-3">
                    {artist.portfolioImages.map((img, i) => (
                      <div
                        key={i}
                        className="flex-1 aspect-square rounded-lg bg-cover bg-center bg-white/5"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ))}
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1">
                    {artist.specialties.slice(0, 3).map(s => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/50"
                      >
                        {s}
                      </span>
                    ))}
                    {artist.specialties.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/30">
                        +{artist.specialties.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Selected check */}
                  {isSelected && (
                    <div
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-sm text-black font-bold"
                      style={{ backgroundColor: artist.accent }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Style Selection */}
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">
          Select Style
          {selectedArtist && (
            <span className="normal-case font-normal text-white/30">
              {' '}— filtered for {selectedArtist.name}
            </span>
          )}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredStyles.map(style => {
            const isSelected = form.service_type === style.id;
            const accent = selectedArtist?.accent || '#C8956C';
            return (
              <button
                key={style.id}
                onClick={() => updateForm({ service_type: style.id, style: style.id })}
                className={`p-3 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? 'border'
                    : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }`}
                style={isSelected ? {
                  background: `${accent}12`,
                  borderColor: `${accent}40`,
                } : undefined}
              >
                <span className="text-lg mb-1 block">{style.icon}</span>
                <span className={`text-sm font-medium ${isSelected ? '' : 'text-white/80'}`}
                  style={isSelected ? { color: accent } : undefined}
                >
                  {style.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cover-up / Touch-up toggles */}
      <div className="flex gap-3">
        <button
          onClick={() => updateForm({ is_cover_up: !form.is_cover_up, is_touch_up: false })}
          className={`flex-1 p-3 rounded-xl text-sm text-left transition-all ${
            form.is_cover_up
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              : 'bg-white/[0.03] border border-white/[0.06] text-white/50 hover:bg-white/[0.06]'
          }`}
        >
          <span className="block font-medium">🔄 Cover-up</span>
          <span className="text-xs opacity-60">Transform existing tattoo (+40%)</span>
        </button>
        <button
          onClick={() => updateForm({ is_touch_up: !form.is_touch_up, is_cover_up: false })}
          className={`flex-1 p-3 rounded-xl text-sm text-left transition-all ${
            form.is_touch_up
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-white/[0.03] border border-white/[0.06] text-white/50 hover:bg-white/[0.06]'
          }`}
        >
          <span className="block font-medium">✨ Touch-up</span>
          <span className="text-xs opacity-60">Refresh existing work (-50%)</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full sm:w-auto px-8 py-4 sm:py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            canProceed
              ? 'text-black hover:brightness-110 active:scale-[0.98]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          style={canProceed ? {
            background: selectedArtist?.accent || '#C8956C',
          } : undefined}
        >
          Continue to Your Vision →
        </button>
      </div>
    </div>
  );
}
