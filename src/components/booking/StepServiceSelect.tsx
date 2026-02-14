import { useState } from 'react';
import type { BookingFormData } from '../../types/booking';

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
    accent: '#C8956C',
  },
  {
    id: 'nina',
    name: 'Nina',
    role: 'Fine Line, Dotwork & Ornamental',
    image: '/artists/nina.jpg',
    specialties: ['Fine Line & Dotwork', 'Mandalas', 'Geometric Blackwork', 'Micro Tattoos', 'Floral & Botanical'],
    accent: '#B49AD4',
  },
  {
    id: 'karli',
    name: 'Karli',
    role: 'Black & Grey Realism & Mythology',
    image: '/artists/karli.jpg',
    specialties: ['Black & Grey Realism', 'Greek Mythology', 'Pet Tattoos', 'Floral & Botanical', 'Cover-ups'],
    accent: '#D4A5A5',
  },
];

const SERVICES = [
  { id: 'Custom Tattoos', label: 'Custom Tattoo', desc: 'Unique design created exclusively for you' },
  { id: 'Color Realism', label: 'Color Realism', desc: 'Hyper-realistic with vibrant colors and neon lighting' },
  { id: 'Black & Grey Realism', label: 'Black & Grey', desc: 'Grayscale realism with cinematic depth' },
  { id: 'Fine Line & Dotwork', label: 'Fine Line & Dotwork', desc: 'Delicate lines, mandalas, geometric designs' },
  { id: 'Cover-ups', label: 'Cover-up', desc: 'Transform existing tattoos into new art' },
  { id: 'Neo-Traditional', label: 'Neo-Traditional', desc: 'Bold contrast with dark symbolism' },
  { id: 'Floral & Botanical', label: 'Floral & Botanical', desc: 'Botanical designs with soul and meaning' },
  { id: 'Pet Tattoos', label: 'Pet Portrait', desc: 'Realistic portraits of your companion' },
  { id: 'Flash', label: 'Flash Design', desc: 'Pre-drawn designs at special prices' },
  { id: 'Free Consultation', label: 'Free Consultation', desc: 'Plan your perfect piece — no cost' },
];

export function StepServiceSelect({ form, updateForm, onNext }: Props) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [ideaText, setIdeaText] = useState('');

  const selectedArtist = ARTISTS.find((a) => a.id === form.artist_id);

  const canProceed = form.artist_id && form.service_type;

  // Simple AI matching: suggest artist based on service
  const suggestArtist = () => {
    if (!form.service_type) return;
    const service = form.service_type;

    if (['Color Realism', 'Neo-Traditional'].includes(service)) {
      updateForm({ artist_id: 'david' });
    } else if (['Fine Line & Dotwork', 'Floral & Botanical'].includes(service)) {
      updateForm({ artist_id: 'nina' });
    } else if (['Black & Grey Realism', 'Pet Tattoos'].includes(service)) {
      updateForm({ artist_id: 'karli' });
    }
    setShowSuggestion(true);
  };

  return (
    <div className="space-y-10">
      {/* Artist Selection */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Choose Your Artist</h3>
        <p className="text-white/50 text-sm mb-6">Each artist brings a unique style and vision</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ARTISTS.map((artist) => (
            <button
              key={artist.id}
              onClick={() => updateForm({ artist_id: artist.id })}
              className={`
                relative p-6 rounded-2xl text-left transition-all duration-300
                ${form.artist_id === artist.id
                  ? 'bg-white/10 border-2 ring-1'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }
              `}
              style={{
                borderColor: form.artist_id === artist.id ? artist.accent : undefined,
                ringColor: form.artist_id === artist.id ? `${artist.accent}40` : undefined,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${artist.image})` }}
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-lg">{artist.name}</h4>
                  <p className="text-white/50 text-xs mt-0.5">{artist.role}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {artist.specialties.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/60"
                  >
                    {s}
                  </span>
                ))}
                {artist.specialties.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/40">
                    +{artist.specialties.length - 3}
                  </span>
                )}
              </div>
              {form.artist_id === artist.id && (
                <div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs text-black font-bold"
                  style={{ backgroundColor: artist.accent }}
                >
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <p className="text-sm text-white/60 mb-3">Not sure which artist? Describe your tattoo idea:</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder="e.g., A realistic portrait of my dog with flowers..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#C8956C]/50"
          />
          <button
            onClick={() => {
              // Simple keyword matching
              const text = ideaText.toLowerCase();
              if (text.match(/color|neon|portrait|vibrant|realism/)) {
                updateForm({ artist_id: 'david', description: ideaText });
              } else if (text.match(/fine line|mandala|geometric|dotwork|ornamental|minimal|delicate/)) {
                updateForm({ artist_id: 'nina', description: ideaText });
              } else if (text.match(/mythology|greek|zeus|medusa|black.*grey|pet|dog|cat/)) {
                updateForm({ artist_id: 'karli', description: ideaText });
              } else {
                updateForm({ artist_id: 'david', description: ideaText });
              }
              setShowSuggestion(true);
            }}
            className="px-5 py-3 rounded-xl bg-[#C8956C]/20 text-[#C8956C] font-medium text-sm hover:bg-[#C8956C]/30 transition-colors whitespace-nowrap"
          >
            Match Me
          </button>
        </div>
        {showSuggestion && selectedArtist && (
          <p className="mt-3 text-sm text-[#C8956C]">
            We recommend <strong>{selectedArtist.name}</strong> — {selectedArtist.role}
          </p>
        )}
      </div>

      {/* Service Selection */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Select Service</h3>
        <p className="text-white/50 text-sm mb-6">What type of tattoo are you looking for?</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                updateForm({ service_type: service.id, style: service.id });
                if (!form.artist_id) suggestArtist();
              }}
              className={`
                p-4 rounded-xl text-left transition-all duration-300
                ${form.service_type === service.id
                  ? 'bg-[#C8956C]/15 border border-[#C8956C]/40'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }
              `}
            >
              <h4 className={`font-semibold text-sm ${form.service_type === service.id ? 'text-[#C8956C]' : 'text-white'}`}>
                {service.label}
              </h4>
              <p className="text-white/40 text-xs mt-1">{service.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300
            ${canProceed
              ? 'bg-[#C8956C] text-black hover:bg-[#D4A574]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
            }
          `}
        >
          Continue to Details →
        </button>
      </div>
    </div>
  );
}
