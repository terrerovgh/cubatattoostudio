import { useState, useEffect, useCallback } from 'react';
import {
  Plus, X, Loader2, AlertCircle, CheckCircle2, UserRound,
  Calendar, Briefcase, ToggleLeft, ToggleRight, ChevronDown,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Artist {
  id: string;
  email: string;
  display_name: string;
  artist_id: string;
  is_active: number;
  created_at: string;
  booking_count?: number;
  portfolio_count?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRESET_SLUGS = ['david', 'nina', 'karli'] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function avatarInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface BadgeProps {
  active: boolean;
}

function StatusBadge({ active }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        active
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-gray-100 text-gray-500 border border-gray-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AddArtistModal({ onClose, onSuccess }: ModalProps) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    display_name: '',
    artist_id: '',
  });
  const [slugMode, setSlugMode] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState('david');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const effectiveArtistId = slugMode === 'preset' ? selectedPreset : form.artist_id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password || !form.display_name || !effectiveArtistId) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, artist_id: effectiveArtistId }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error ?? 'Failed to create artist.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm placeholder-gray-400 focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors';
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#1a1a2e]">Add Artist Account</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className={labelClass}>Display Name</label>
            <input
              type="text"
              placeholder="e.g. David Reyes"
              value={form.display_name}
              onChange={(e) => setForm((p) => ({ ...p, display_name: e.target.value }))}
              className={inputClass}
              disabled={loading}
            />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              placeholder="artist@cubatattoostudio.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className={inputClass}
              disabled={loading}
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className={inputClass}
              disabled={loading}
            />
          </div>

          <div>
            <label className={labelClass}>Artist Slug (ID)</label>

            {/* Slug mode toggle */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => setSlugMode('preset')}
                className={`flex-1 py-2 transition-colors ${
                  slugMode === 'preset'
                    ? 'bg-[#C8956C] text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                Preset
              </button>
              <button
                type="button"
                onClick={() => setSlugMode('custom')}
                className={`flex-1 py-2 transition-colors ${
                  slugMode === 'custom'
                    ? 'bg-[#C8956C] text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                Custom
              </button>
            </div>

            {slugMode === 'preset' ? (
              <div className="relative">
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className={`${inputClass} appearance-none pr-8`}
                  disabled={loading}
                >
                  {PRESET_SLUGS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            ) : (
              <input
                type="text"
                placeholder="e.g. marco (lowercase, no spaces)"
                value={form.artist_id}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    artist_id: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
                  }))
                }
                className={inputClass}
                disabled={loading}
              />
            )}

            <p className="text-xs text-gray-400 mt-1">
              Used in URLs and route matching. Cannot be changed later.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b8825c] transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Artist'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Artist Card
// ---------------------------------------------------------------------------

interface ArtistCardProps {
  artist: Artist;
  onToggle: (id: string, current: number) => Promise<void>;
}

function ArtistCard({ artist, onToggle }: ArtistCardProps) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(artist.id, artist.is_active);
    setToggling(false);
  };

  const avatarColors = [
    'bg-violet-100 text-violet-700',
    'bg-sky-100 text-sky-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-emerald-100 text-emerald-700',
    'bg-[#C8956C]/15 text-[#C8956C]',
  ];
  const colorClass = avatarColors[artist.display_name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${colorClass}`}
          >
            {avatarInitial(artist.display_name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1a1a2e] truncate">{artist.display_name}</p>
            <p className="text-xs text-gray-400 font-mono">@{artist.artist_id}</p>
          </div>
        </div>
        <StatusBadge active={artist.is_active === 1} />
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <UserRound size={12} className="shrink-0 text-gray-300" />
          <span className="truncate">{artist.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Briefcase size={12} className="shrink-0 text-gray-300" />
          <span>{artist.booking_count ?? 0} bookings</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={12} className="shrink-0 text-gray-300" />
          <span>Joined {formatDate(artist.created_at)}</span>
        </div>
      </div>

      {/* Toggle */}
      <div className="pt-1 border-t border-gray-100">
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors ${
            artist.is_active === 1
              ? 'text-gray-500 hover:bg-red-50 hover:text-red-600'
              : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {toggling ? (
            <Loader2 size={13} className="animate-spin" />
          ) : artist.is_active === 1 ? (
            <ToggleRight size={14} />
          ) : (
            <ToggleLeft size={14} />
          )}
          {artist.is_active === 1 ? 'Deactivate Account' : 'Activate Account'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function ArtistsTab() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/artists');
      const data = (await res.json()) as ApiResponse<{ artists: Artist[] }>;
      if (data.success && data.data) {
        setArtists(data.data.artists);
      } else {
        setError(data.error ?? 'Failed to load artists.');
      }
    } catch {
      setError('Network error. Could not load artists.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchArtists();
  }, [fetchArtists]);

  const handleToggleActive = async (id: string, current: number) => {
    const newValue = current === 1 ? 0 : 1;
    try {
      const res = await fetch('/api/admin/artists', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: newValue }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        setArtists((prev) =>
          prev.map((a) => (a.id === id ? { ...a, is_active: newValue } : a)),
        );
        showToast(newValue === 1 ? 'Artist activated.' : 'Artist deactivated.');
      } else {
        showToast(data.error ?? 'Update failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e]">Artist Accounts</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {artists.length} artist{artists.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b8825c] transition-colors shadow-sm shadow-[#C8956C]/20"
        >
          <Plus size={16} />
          Add Artist
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && artists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <UserRound size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-600">No artist accounts yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Add Artist" to create the first one.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && artists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} onToggle={handleToggleActive} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddArtistModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            void fetchArtists();
            showToast('Artist account created successfully.');
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-[#1a1a2e] text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={15} className="text-[#C8956C]" />
          ) : (
            <AlertCircle size={15} />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
