import { useState, useEffect, useCallback } from 'react';
import {
  Tag, Plus, X, Loader2, AlertCircle, CheckCircle2, ChevronDown,
  Pencil, Trash2, ToggleLeft, ToggleRight, Calendar, Percent,
  Hash, Users, RefreshCw, Shuffle,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Promotion {
  id: string;
  artist_id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date?: string;
  end_date?: string;
  max_uses?: number;
  used_count?: number;
  promo_code?: string;
  is_active: number;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ARTIST_OPTIONS = [
  { id: '', label: 'All Artists' },
  { id: 'david', label: 'David' },
  { id: 'nina', label: 'Nina' },
  { id: 'karli', label: 'Karli' },
];

const ACTIVE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isExpired(endDate: string | undefined): boolean {
  if (!endDate) return false;
  return new Date(endDate) < new Date();
}

function isUpcoming(startDate: string | undefined): boolean {
  if (!startDate) return false;
  return new Date(startDate) > new Date();
}

function generatePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [4, 4].map(() =>
    Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(''),
  );
  return segments.join('-');
}

function discountLabel(type: Promotion['discount_type'], value: number): string {
  return type === 'percentage' ? `${value}% off` : `$${value} off`;
}

function promotionStatus(p: Promotion): 'active' | 'inactive' | 'expired' | 'upcoming' {
  if (!p.is_active) return 'inactive';
  if (isExpired(p.end_date)) return 'expired';
  if (isUpcoming(p.start_date)) return 'upcoming';
  return 'active';
}

function statusBadgeClass(status: ReturnType<typeof promotionStatus>): string {
  const map = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-gray-100 text-gray-500 border-gray-200',
    expired: 'bg-red-50 text-red-600 border-red-200',
    upcoming: 'bg-sky-50 text-sky-600 border-sky-200',
  };
  return map[status];
}

// ---------------------------------------------------------------------------
// Promotion Form
// ---------------------------------------------------------------------------

interface PromotionFormData {
  artist_id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  start_date: string;
  end_date: string;
  max_uses: string;
  promo_code: string;
}

const emptyForm: PromotionFormData = {
  artist_id: 'david',
  title: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  start_date: '',
  end_date: '',
  max_uses: '',
  promo_code: '',
};

function promoToForm(p: Promotion): PromotionFormData {
  return {
    artist_id: p.artist_id,
    title: p.title,
    description: p.description ?? '',
    discount_type: p.discount_type,
    discount_value: String(p.discount_value),
    start_date: p.start_date ? p.start_date.slice(0, 16) : '',
    end_date: p.end_date ? p.end_date.slice(0, 16) : '',
    max_uses: p.max_uses != null ? String(p.max_uses) : '',
    promo_code: p.promo_code ?? '',
  };
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

interface PromotionModalProps {
  existing?: Promotion;
  onClose: () => void;
  onSuccess: () => void;
}

function PromotionModal({ existing, onClose, onSuccess }: PromotionModalProps) {
  const [form, setForm] = useState<PromotionFormData>(existing ? promoToForm(existing) : emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!existing;

  const set =
    (key: keyof PromotionFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.artist_id || !form.discount_value) {
      setError('Title, artist, and discount value are required.');
      return;
    }

    const discountNum = parseFloat(form.discount_value);
    if (isNaN(discountNum) || discountNum <= 0) {
      setError('Discount value must be a positive number.');
      return;
    }
    if (form.discount_type === 'percentage' && discountNum > 100) {
      setError('Percentage discount cannot exceed 100%.');
      return;
    }

    const payload = {
      ...(isEdit ? { id: existing!.id } : {}),
      artist_id: form.artist_id,
      title: form.title,
      description: form.description || undefined,
      discount_type: form.discount_type,
      discount_value: discountNum,
      start_date: form.start_date || undefined,
      end_date: form.end_date || undefined,
      max_uses: form.max_uses ? parseInt(form.max_uses) : undefined,
      promo_code: form.promo_code || undefined,
    };

    setLoading(true);
    try {
      const res = await fetch('/api/admin/promotions', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error ?? 'Failed to save promotion.');
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
            {isEdit ? 'Edit Promotion' : 'Create Promotion'}
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
            <input
              type="text"
              placeholder="e.g. Summer Flash Sale"
              value={form.title}
              onChange={set('title')}
              className={inputClass}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              placeholder="Optional details about this promotion..."
              value={form.description}
              onChange={set('description')}
              rows={2}
              className={`${inputClass} resize-none`}
              disabled={loading}
            />
          </div>

          {/* Artist */}
          <div>
            <label className={labelClass}>Artist *</label>
            <div className="relative">
              <select
                value={form.artist_id}
                onChange={set('artist_id')}
                className={`${selectClass} pr-8`}
                disabled={loading}
              >
                {ARTIST_OPTIONS.filter((a) => a.id).map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Discount type + value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Discount Type *</label>
              <div className="relative">
                <select
                  value={form.discount_type}
                  onChange={set('discount_type')}
                  className={`${selectClass} pr-8`}
                  disabled={loading}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Value * {form.discount_type === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                min="0"
                max={form.discount_type === 'percentage' ? '100' : undefined}
                step="0.01"
                placeholder={form.discount_type === 'percentage' ? '20' : '50'}
                value={form.discount_value}
                onChange={set('discount_value')}
                className={inputClass}
                disabled={loading}
              />
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="datetime-local"
                value={form.start_date}
                onChange={set('start_date')}
                className={inputClass}
                disabled={loading}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="datetime-local"
                value={form.end_date}
                onChange={set('end_date')}
                className={inputClass}
                disabled={loading}
              />
            </div>
          </div>

          {/* Max uses + Promo code */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Max Uses</label>
              <input
                type="number"
                min="1"
                placeholder="Unlimited"
                value={form.max_uses}
                onChange={set('max_uses')}
                className={inputClass}
                disabled={loading}
              />
            </div>
            <div>
              <label className={labelClass}>Promo Code</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. SUMMER24"
                  value={form.promo_code}
                  onChange={(e) => setForm((p) => ({ ...p, promo_code: e.target.value.toUpperCase() }))}
                  className={`${inputClass} pr-10 font-mono uppercase`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, promo_code: generatePromoCode() }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C8956C] transition-colors"
                  title="Generate random code"
                  disabled={loading}
                >
                  <Shuffle size={13} />
                </button>
              </div>
            </div>
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
                  Saving...
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Create Promotion'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Delete Confirm Dialog
// ---------------------------------------------------------------------------

interface DeleteDialogProps {
  promotion: Promotion;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

function DeleteDialog({ promotion, onConfirm, onCancel }: DeleteDialogProps) {
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
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
          <Trash2 size={18} className="text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-[#1a1a2e] mb-1">Delete Promotion?</h3>
        <p className="text-sm text-gray-500 mb-5">
          "{promotion.title}" will be permanently deleted and can no longer be used.
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
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Promotion Card
// ---------------------------------------------------------------------------

interface PromotionCardProps {
  promotion: Promotion;
  onEdit: (p: Promotion) => void;
  onDelete: (p: Promotion) => void;
  onToggleActive: (p: Promotion) => void;
  toggling: boolean;
}

function PromotionCard({ promotion, onEdit, onDelete, onToggleActive, toggling }: PromotionCardProps) {
  const status = promotionStatus(promotion);
  const usagePercent =
    promotion.max_uses && promotion.used_count != null
      ? Math.min(100, Math.round((promotion.used_count / promotion.max_uses) * 100))
      : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1a1a2e] truncate">{promotion.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">Artist: {promotion.artist_id}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${statusBadgeClass(status)}`}
        >
          {status}
        </span>
      </div>

      {/* Discount badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C8956C]/10 border border-[#C8956C]/20">
          {promotion.discount_type === 'percentage' ? (
            <Percent size={14} className="text-[#C8956C]" />
          ) : (
            <Tag size={14} className="text-[#C8956C]" />
          )}
          <span className="text-sm font-bold text-[#C8956C]">
            {discountLabel(promotion.discount_type, promotion.discount_value)}
          </span>
        </div>
        {promotion.promo_code && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
            <Hash size={11} className="text-gray-400" />
            <span className="text-xs font-mono font-semibold text-gray-600">{promotion.promo_code}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {promotion.description && (
        <p className="text-xs text-gray-500 leading-relaxed">{promotion.description}</p>
      )}

      {/* Date range */}
      {(promotion.start_date || promotion.end_date) && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar size={12} className="shrink-0" />
          <span>
            {formatDate(promotion.start_date)}
            {promotion.start_date && promotion.end_date ? ' — ' : ''}
            {formatDate(promotion.end_date)}
          </span>
        </div>
      )}

      {/* Usage */}
      {promotion.max_uses != null && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Users size={11} />
              Usage
            </span>
            <span className="text-[#1a1a2e] font-medium">
              {promotion.used_count ?? 0} / {promotion.max_uses}
            </span>
          </div>
          {usagePercent !== null && (
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C8956C] transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(promotion)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Pencil size={12} />
          Edit
        </button>
        <button
          onClick={() => onToggleActive(promotion)}
          disabled={toggling}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${
            promotion.is_active
              ? 'text-gray-500 border-gray-200 hover:bg-gray-50'
              : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          {toggling ? (
            <Loader2 size={12} className="animate-spin" />
          ) : promotion.is_active ? (
            <ToggleRight size={13} />
          ) : (
            <ToggleLeft size={13} />
          )}
          {promotion.is_active ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={() => onDelete(promotion)}
          className="flex items-center justify-center p-1.5 rounded-lg text-red-400 border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function PromotionsTab() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [filterArtist, setFilterArtist] = useState('');
  const [filterActive, setFilterActive] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filterArtist) params.set('artist_id', filterArtist);
      if (filterActive !== '') params.set('is_active', filterActive);

      const res = await fetch(`/api/admin/promotions${params.toString() ? `?${params}` : ''}`);
      const data = (await res.json()) as ApiResponse<{ promotions: Promotion[] }>;

      if (data.success && data.data) {
        setPromotions(data.data.promotions);
      } else {
        setError(data.error ?? 'Failed to load promotions.');
      }
    } catch {
      setError('Network error. Could not load promotions.');
    } finally {
      setLoading(false);
    }
  }, [filterArtist, filterActive]);

  useEffect(() => {
    void fetchPromotions();
  }, [fetchPromotions]);

  const handleToggleActive = async (promotion: Promotion) => {
    setTogglingId(promotion.id);
    const newValue = promotion.is_active ? 0 : 1;
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promotion.id, is_active: newValue }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        setPromotions((prev) =>
          prev.map((p) => (p.id === promotion.id ? { ...p, is_active: newValue } : p)),
        );
        showToast(newValue ? 'Promotion activated.' : 'Promotion deactivated.');
      } else {
        showToast(data.error ?? 'Update failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingPromotion) return;
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingPromotion.id }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        setPromotions((prev) => prev.filter((p) => p.id !== deletingPromotion.id));
        showToast('Promotion deleted.');
      } else {
        showToast(data.error ?? 'Delete failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setDeletingPromotion(null);
    }
  };

  const activeCount = promotions.filter((p) => p.is_active).length;

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
          <h2 className="text-xl font-bold text-[#1a1a2e]">Promotions</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading
              ? 'Loading...'
              : `${promotions.length} promotion${promotions.length !== 1 ? 's' : ''} — ${activeCount} active`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void fetchPromotions()}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b8825c] transition-colors shadow-sm shadow-[#C8956C]/20"
          >
            <Plus size={16} />
            Create Promotion
          </button>
        </div>
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
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className={selectClass}
          >
            {ACTIVE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {(filterArtist || filterActive) && (
          <button
            onClick={() => { setFilterArtist(''); setFilterActive(''); }}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="h-5 w-14 bg-gray-200 rounded-full" />
              </div>
              <div className="h-8 bg-gray-100 rounded-xl w-24 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && promotions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Tag size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-600">No promotions found</p>
          <p className="text-xs text-gray-400 mt-1">
            {filterArtist || filterActive
              ? 'Try clearing the filters.'
              : 'Click "Create Promotion" to add one.'}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && promotions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((promo) => (
            <PromotionCard
              key={promo.id}
              promotion={promo}
              onEdit={setEditingPromotion}
              onDelete={setDeletingPromotion}
              onToggleActive={handleToggleActive}
              toggling={togglingId === promo.id}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <PromotionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            void fetchPromotions();
            showToast('Promotion created successfully.');
          }}
        />
      )}

      {/* Edit Modal */}
      {editingPromotion && (
        <PromotionModal
          existing={editingPromotion}
          onClose={() => setEditingPromotion(null)}
          onSuccess={() => {
            void fetchPromotions();
            showToast('Promotion updated.');
          }}
        />
      )}

      {/* Delete Dialog */}
      {deletingPromotion && (
        <DeleteDialog
          promotion={deletingPromotion}
          onConfirm={handleDelete}
          onCancel={() => setDeletingPromotion(null)}
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
