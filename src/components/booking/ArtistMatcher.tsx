import { useState, useCallback, useRef } from 'react';
import type { ArtistMatchResult } from '../../types/booking';

interface ArtistData {
  id: string;
  name: string;
  role: string;
  image: string;
  accent: string;
  specialties: string[];
  keywords: string[];
}

const ARTISTS: ArtistData[] = [
  {
    id: 'david',
    name: 'David',
    role: 'Founder & Lead Artist',
    image: '/artists/david.jpg',
    accent: '#E8793A',
    specialties: ['Color Realism', 'Black & Grey Realism', 'Neo-Traditional', 'Cover-ups', 'Portraits'],
    keywords: ['color', 'realism', 'realistic', 'portrait', 'vibrant', 'neon', 'hyperrealistic', 'neo-traditional', 'new school', 'cover-up', 'coverup', 'religious', 'bold', 'dramatic', 'jesus', 'cross', 'skull', 'dragon', 'lion', 'tiger', 'sleeve'],
  },
  {
    id: 'nina',
    name: 'Nina',
    role: 'Fine Line, Dotwork & Ornamental',
    image: '/artists/nina.jpg',
    accent: '#feb4b4',
    specialties: ['Fine Line', 'Dotwork', 'Ornamental', 'Geometric Blackwork', 'Mandalas', 'Micro Tattoos'],
    keywords: ['fine line', 'fineline', 'dotwork', 'dots', 'mandala', 'geometric', 'ornamental', 'minimal', 'minimalist', 'delicate', 'thin', 'small', 'tiny', 'micro', 'dainty', 'elegant', 'botanical', 'flower', 'floral', 'freehand', 'blackwork', 'pattern', 'sacred geometry', 'moon', 'sun', 'butterfly', 'star'],
  },
  {
    id: 'karli',
    name: 'Karli',
    role: 'Black & Grey Realism & Mythology',
    image: '/artists/karli.jpg',
    accent: '#4A9EBF',
    specialties: ['Black & Grey Realism', 'Greek Mythology', 'Pet Portraits', 'Floral & Botanical', 'Cover-ups'],
    keywords: ['black and grey', 'black & grey', 'b&g', 'mythology', 'greek', 'zeus', 'medusa', 'athena', 'poseidon', 'god', 'goddess', 'pet', 'dog', 'cat', 'animal', 'realistic pet', 'portrait pet', 'mythology', 'statue', 'sculpture', 'classical', 'dark', 'shadow'],
  },
];

function matchArtist(text: string): ArtistMatchResult | null {
  if (!text || text.length < 3) return null;

  const lower = text.toLowerCase();
  const scores: { artist: ArtistData; score: number; matched: string[] }[] = [];

  for (const artist of ARTISTS) {
    let score = 0;
    const matched: string[] = [];

    for (const keyword of artist.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length > 5 ? 3 : 2;
        matched.push(keyword);
      }
    }

    for (const spec of artist.specialties) {
      if (lower.includes(spec.toLowerCase())) {
        score += 5;
        matched.push(spec);
      }
    }

    if (score > 0) {
      scores.push({ artist, score, matched });
    }
  }

  if (scores.length === 0) return null;

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];
  const maxPossible = best.artist.keywords.length * 3;
  const confidence = Math.min(Math.round((best.score / Math.max(maxPossible, 1)) * 100), 95);

  return {
    artist_id: best.artist.id,
    confidence: Math.max(confidence, 40),
    matchedKeywords: [...new Set(best.matched)].slice(0, 3),
    reason: `Best match for ${[...new Set(best.matched)].slice(0, 2).join(' & ')}`,
  };
}

interface Props {
  onSelect: (artistId: string, description: string) => void;
  accentColor?: string;
}

export function ArtistMatcher({ onSelect, accentColor = '#C8956C' }: Props) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ArtistMatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const analyze = useCallback((value: string) => {
    setText(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setResult(null);
      return;
    }

    setIsAnalyzing(true);
    debounceRef.current = setTimeout(() => {
      const match = matchArtist(value);
      setResult(match);
      setIsAnalyzing(false);
    }, 300);
  }, []);

  const matchedArtist = result ? ARTISTS.find(a => a.id === result.artist_id) : null;

  const placeholders = [
    'A realistic portrait of my dog with flowers...',
    'Small geometric mandala on my wrist...',
    'Greek mythology sleeve with Zeus and Poseidon...',
    'Colorful neon skull with roses...',
    'Fine line butterfly with dotwork details...',
    'Black and grey medusa with snakes...',
  ];

  const [placeholderIdx] = useState(() => Math.floor(Math.random() * placeholders.length));

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => analyze(e.target.value)}
          placeholder={placeholders[placeholderIdx]}
          rows={2}
          className="input-premium text-sm resize-none pr-10"
          maxLength={500}
        />
        {isAnalyzing && (
          <div className="absolute right-3 top-3">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute right-3 bottom-3 text-xs text-white/20">
          {text.length}/500
        </div>
      </div>

      {/* Match result card */}
      {matchedArtist && result && (
        <div
          className="p-4 rounded-xl border transition-all duration-300 animate-[fadeIn_300ms_ease]"
          style={{
            background: `${matchedArtist.accent}10`,
            borderColor: `${matchedArtist.accent}30`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center ring-2"
                style={{
                  backgroundImage: `url(${matchedArtist.image})`,
                  ringColor: matchedArtist.accent,
                }}
              />
              <div>
                <p className="text-sm font-bold text-white">{matchedArtist.name}</p>
                <p className="text-xs text-white/45">{matchedArtist.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="h-1.5 w-12 rounded-full overflow-hidden bg-white/10"
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${result.confidence}%`,
                    background: matchedArtist.accent,
                  }}
                />
              </div>
              <span className="text-xs text-white/40">{result.confidence}%</span>
            </div>
          </div>

          <p className="text-xs text-white/50 mb-3">
            {result.reason}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.matchedKeywords.map(kw => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ background: `${matchedArtist.accent}20`, color: matchedArtist.accent }}
              >
                {kw}
              </span>
            ))}
          </div>

          <button
            onClick={() => onSelect(matchedArtist.id, text)}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-black transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: matchedArtist.accent }}
          >
            Select {matchedArtist.name}
          </button>
        </div>
      )}

      {text.length >= 3 && !result && !isAnalyzing && (
        <p className="text-xs text-white/30 text-center">
          Try being more specific — mention a style, subject, or placement
        </p>
      )}
    </div>
  );
}
