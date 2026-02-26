import { useState, useEffect, useCallback } from 'react';
import {
  Plus, X, Loader2, AlertCircle, CheckCircle2, ChevronDown,
  Zap, Archive, Pencil, ImageOff, BadgeDollarSign, Users,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FlashDesign {
  id: string;
  artist_id: string;
  title: string;
  description?: string;
  image_url: string;
  style?: string;
  size_category?: string;
  price: number;
  original_price?: number;
  is_drop: number;
  drop_date?: string;
  drop_quantity: number;
  claimed_count: number;
  status: 'available' | 'claimed' | 'expired' | 'archived';
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

type StatusFilter = '' | 'available' | 'claimed' | 'expired' | 'archived';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ARTIST_OPTIONS = [
  { id: '', label: 'All Artists' },
  { id: 'david', label: 'David' },
  { id: 'nina', label: 'Nina' },
  { id: 'karli', label: 'Karli' },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'available', label: 'Available' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'expired', label: 'Expired' },
  { value: 'archived', label: 'Archived' },
];

const SIZE_CATEGORIES = ['small', 'medium', 'large', 'extra-large'];
const STYLES = ['blackwork', 'fine-line', 'geometric', 'traditional', 'realism', 'watercolor', 'neo-traditional', 'other'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusBadgeClass(status: FlashDesign['status']) {
  const map: Record<FlashDesign['status'], string> = {
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    claimed: 'bg-sky-50 text-sky-700 border-sky-200',
    expired: 'bg-amber-50 text-amber-700 border-amber-200',
    archived: 'bg-gray-100 text-gray-500 border-gray-200',
  };
  return map[status] ?? 'bg-gray-100 text-gray-500 border-gray-200';
}

// ---------------------------------------------------------------------------
// Flash Form (shared by Create and Edit modal)
// ---------------------------------------------------------------------------

interface FlashFormData {
  title: string;
  description: string;
  image_url: string;
  artist_id: string;
  price: string;
  original_price: string;
  style: string;
  size_category: string;
  is_drop: boolean;
  drop_date: string;
  drop_quantity: string;
  early_bird_discount: string;
  early_bird_slots: string;
}

const emptyForm: FlashFormData = {
  title: '',
  description: '',
  image_url: '',
  artist_id: 'david',
  price: '',
  original_price: '',
  style: '',
  size_category: '',
  is_drop: false,
  drop_date: '',
  drop_quantity: '',
  early_bird_discount: '',
  early_bird_slots: '',
};

function designToForm(d: FlashDesign): FlashFormData {
  return {
    title: d.title,
    description: d.description ?? '',
    image_url: d.image_url,
    artist_id: d.artist_id,
    price: String(d.price),
    original_price: d.original_price != null ? String(d.original_price) : '',
    style: d.style ?? '',
    size_category: d.size_category ?? '',
    is_drop: d.is_drop === 1,
    drop_date: d.drop_date ?? '',
    drop_quantity: d.drop_quantity ? String(d.drop_quantity) : '',
    early_bird_discount: '',
    early_bird_slots: '',
  };
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

interface FlashModalProps {
  existing?: FlashDesign;
  onClose: () => void;
  onSuccess: () => void;
}

function FlashModal({ existing, onClose, onSuccess }: FlashModalProps) {
  const [form, setForm] = useState<FlashFormData>(existing ? designToForm(existing) : emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!existing;

  const set = (key: keyof FlashFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.image_url || !form.artist_id || !form.price) {
      setError('Title, image URL, artist, and price are required.');
      return;
    }

    const payload = {
      ...(isEdit ? { id: existing!.id } : {}),
      title: form.title,
      description: form.description || undefined,
      image_url: form.image_url,
      artist_id: form.artist_id,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : undefined,
      style: form.style || undefined,
      size_category: form.size_category || undefined,
      is_drop: form.is_drop,
      drop_date: form.drop_date || undefined,
      drop_quantity: form.drop_quantity ? parseInt(form.drop_quantity) : undefined,
      early_bird_discount: form.early_bird_discount ? parseFloat(form.early_bird_discount) : undefined,
      early_bird_slots: form.early_bird_slots ? parseInt(form.early_bird_slots) : undefined,
    };

    setLoading(true);
    try {
      const res = await fetch('/api/admin/flash', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error ?? 'Failed to save flash design.');
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
  const selectClass = `${inputClass} appearance-none`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#1a1a2e]">
            {isEdit ? 'Edit Flash Design' : 'Create Flash Design'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input type="text" placeholder="e.g. Serpent Dagger" value={form.title} onChange={set('title')} className={inputClass} disabled={loading} />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              placeholder="Short description of the design..."
              value={form.description}
              onChange={set('description')}
              rows={2}
              className={`${inputClass} resize-none`}
              disabled={loading}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className={labelClass}>Image URL *</label>
            <input type="url" placeholder="https://..." value={form.image_url} onChange={set('image_url')} className={inputClass} disabled={loading} />
          </div>

          {/* Artist + Style */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Artist *</label>
              <div className="relative">
                <select value={form.artist_id} onChange={set('artist_id')} className={selectClass} disabled={loading}>
                  {ARTIST_OPTIONS.filter((a) => a.id).map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Style</label>
              <div className="relative">
                <select value={form.style} onChange={set('style')} className={selectClass} disabled={loading}>
                  <option value="">Select style</option>
                  {STYLES.map((s) => <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Price + Original price + Size */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Price ($) *</label>
              <input type="number" min="0" step="0.01" placeholder="150" value={form.price} onChange={set('price')} className={inputClass} disabled={loading} />
            </div>
            <div>
              <label className={labelClass}>Original ($)</label>
              <input type="number" min="0" step="0.01" placeholder="200" value={form.original_price} onChange={set('original_price')} className={inputClass} disabled={loading} />
            </div>
            <div>
              <label className={labelClass}>Size</label>
              <div className="relative">
                <select value={form.size_category} onChange={set('size_category')} className={selectClass} disabled={loading}>
                  <option value="">Any size</option>
                  {SIZE_CATEGORIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Is Drop toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
            <div>
              <p className="text-sm font-medium text-[#1a1a2e]">Flash Drop</p>
              <p className="text-xs text-gray-400">Enable limited-time drop release</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, is_drop: !p.is_drop }))}
              className={`relative w-10 h-5.5 rounded-full transition-colors ${form.is_drop ? 'bg-[#C8956C]' : 'bg-gray-200'}`}
            >
              <span
                className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${form.is_drop ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>

          {/* Drop fields */}
          {form.is_drop && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Drop Date</label>
                <input type="datetime-local" value={form.drop_date} onChange={set('drop_date')} className={inputClass} disabled={loading} />
              </div>
              <div>
                <label className={labelClass}>Quantity</label>
                <input type="number" min="1" placeholder="10" value={form.drop_quantity} onChange={set('drop_quantity')} className={inputClass} disabled={loading} />
              </div>
              <div>
                <label className={labelClass}>Early Bird Discount (%)</label>
                <input type="number" min="0" max="100" placeholder="20" value={form.early_bird_discount} onChange={set('early_bird_discount')} className={inputClass} disabled={loading} />
              </div>
              <div>
                <label className={labelClass}>Early Bird Slots</label>
                <input type="number" min="0" placeholder="3" value={form.early_bird_slots} onChange={set('early_bird_slots')} className={inputClass} disabled={loading} />
              </div>
            </div>
          )}

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
                  Saving...
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Create Design'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Archive Confirm Dialog
// ---------------------------------------------------------------------------

interface ArchiveDialogProps {
  design: FlashDesign;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

function ArchiveDialog({ design, onConfirm, onCancel }: ArchiveDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
          <Archive size={18} className="text-amber-500" />
        </div>
        <h3 className="text-base font-semibold text-[#1a1a2e] mb-1">Archive Design?</h3>
        <p className="text-sm text-gray-500 mb-5">
          "{design.title}" will be archived and hidden from the public. This can be reversed via PATCH.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flash Card
// ---------------------------------------------------------------------------

interface FlashCardProps {
  design: FlashDesign;
  onEdit: (d: FlashDesign) => void;
  onArchive: (d: FlashDesign) => void;
}

function FlashCard({ design, onEdit, onArchive }: FlashCardProps) {
  const [imgError, setImgError] = useState(false);

  const claimedRatio =
    design.drop_quantity > 0
      ? `${design.claimed_count}/${design.drop_quantity}`
      : `${design.claimed_count} claimed`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-square bg-gray-100">
        {imgError || !design.image_url ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff size={24} className="text-gray-300" />
          </div>
        ) : (
          <img
            src={design.image_url}
            alt={design.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {/* Drop badge */}
        {design.is_drop === 1 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#C8956C] text-white text-[10px] font-bold">
            DROP
          </span>
        )}
        {/* Status badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadgeClass(design.status)}`}
        >
          {design.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-sm font-semibold text-[#1a1a2e] leading-snug">{design.title}</p>
          <p className="text-xs text-gray-400 capitalize mt-0.5">
            {design.artist_id}{design.style ? ` — ${design.style.replace(/-/g, ' ')}` : ''}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {design.original_price && design.original_price > design.price && (
              <p className="text-xs text-gray-300 line-through">${design.original_price}</p>
            )}
            <p className="text-sm font-bold text-[#C8956C] flex items-center gap-1">
              <BadgeDollarSign size={13} />
              ${design.price}
            </p>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Users size={11} />
            {claimedRatio}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
          <button
            onClick={() => onEdit(design)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={12} />
            Edit
          </button>
          {design.status !== 'archived' && (
            <button
              onClick={() => onArchive(design)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-amber-600 border border-amber-200 hover:bg-amber-50 transition-colors"
            >
              <Archive size={12} />
              Archive
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function FlashTab() {
  const [designs, setDesigns] = useState<FlashDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterArtist, setFilterArtist] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState<FlashDesign | null>(null);
  const [archivingDesign, setArchivingDesign] = useState<FlashDesign | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchDesigns = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ per_page: '100' });
      if (filterArtist) params.set('artist_id', filterArtist);
      if (filterStatus) params.set('status', filterStatus);

      const res = await fetch(`/api/admin/flash?${params}`);
      const data = (await res.json()) as ApiResponse<{ flash_designs: FlashDesign[] }>;

      if (data.success && data.data) {
        setDesigns(data.data.flash_designs);
      } else {
        setError(data.error ?? 'Failed to load flash designs.');
      }
    } catch {
      setError('Network error. Could not load flash designs.');
    } finally {
      setLoading(false);
    }
  }, [filterArtist, filterStatus]);

  useEffect(() => {
    void fetchDesigns();
  }, [fetchDesigns]);

  const handleArchive = async () => {
    if (!archivingDesign) return;
    try {
      const res = await fetch('/api/admin/flash', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: archivingDesign.id }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        setDesigns((prev) =>
          prev.map((d) => (d.id === archivingDesign.id ? { ...d, status: 'archived' as const } : d)),
        );
        showToast('Design archived.');
      } else {
        showToast(data.error ?? 'Archive failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setArchivingDesign(null);
    }
  };

  const selectClass =
    'pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] appearance-none focus:outline-none focus:border-[#C8956C] transition-colors';

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e]">Flash Designs</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {designs.length} design{designs.length !== 1 ? 's' : ''}
            {filterArtist || filterStatus ? ' (filtered)' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b8825c] transition-colors shadow-sm shadow-[#C8956C]/20"
        >
          <Plus size={16} />
          Create Flash
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={filterArtist}
            onChange={(e) => setFilterArtist(e.target.value)}
            className={selectClass}
          >
            {ARTIST_OPTIONS.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
            className={selectClass}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {(filterArtist || filterStatus) && (
          <button
            onClick={() => { setFilterArtist(''); setFilterStatus(''); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear filters
          </button>
        )}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && designs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Zap size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-600">No flash designs found</p>
          <p className="text-xs text-gray-400 mt-1">
            {filterArtist || filterStatus ? 'Try clearing the filters.' : 'Click "Create Flash" to add one.'}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && designs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {designs.map((design) => (
            <FlashCard
              key={design.id}
              design={design}
              onEdit={(d) => setEditingDesign(d)}
              onArchive={(d) => setArchivingDesign(d)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <FlashModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            void fetchDesigns();
            showToast('Flash design created.');
          }}
        />
      )}

      {/* Edit Modal */}
      {editingDesign && (
        <FlashModal
          existing={editingDesign}
          onClose={() => setEditingDesign(null)}
          onSuccess={() => {
            void fetchDesigns();
            showToast('Flash design updated.');
          }}
        />
      )}

      {/* Archive Dialog */}
      {archivingDesign && (
        <ArchiveDialog
          design={archivingDesign}
          onConfirm={handleArchive}
          onCancel={() => setArchivingDesign(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === 'success' ? 'bg-[#1a1a2e] text-white' : 'bg-red-600 text-white'
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
