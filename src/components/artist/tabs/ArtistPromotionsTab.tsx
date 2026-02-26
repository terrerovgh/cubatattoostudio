import { useState, useEffect, useCallback } from 'react';
import {
  Tag,
  Plus,
  X,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Copy,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  CalendarDays,
  ChevronDown,
  Percent,
  DollarSign,
  Users,
  Ticket,
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
  is_active: number;
  uses_count: number;
  max_uses?: number;
  promo_code?: string;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

type FilterKey = 'all' | 'active' | 'inactive';

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

function isExpired(end_date?: string): boolean {
  if (!end_date) return false;
  return new Date(end_date) < new Date();
}

function getPromotionStatus(promo: Promotion): 'active' | 'inactive' | 'expired' {
  if (isExpired(promo.end_date)) return 'expired';
  if (promo.is_active === 1) return 'active';
  return 'inactive';
}

function generatePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function formatDiscount(promo: Promotion): string {
  if (promo.discount_type === 'percentage') return `${promo.discount_value}% OFF`;
  return `$${promo.discount_value} OFF`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'expired';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const map = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-gray-100 text-gray-500 border-gray-200',
    expired: 'bg-amber-50 text-amber-700 border-amber-200',
  } as const;

  const dotMap = {
    active: 'bg-emerald-500',
    inactive: 'bg-gray-400',
    expired: 'bg-amber-500',
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

interface PromotionFormData {
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
  title: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  start_date: '',
  end_date: '',
  max_uses: '',
  promo_code: '',
};

function promotionToForm(p: Promotion): PromotionFormData {
  return {
    title: p.title,
    description: p.description ?? '',
    discount_type: p.discount_type,
    discount_value: String(p.discount_value),
    start_date: p.start_date ?? '',
    end_date: p.end_date ?? '',
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
  const [form, setForm] = useState<PromotionFormData>(
    existing ? promotionToForm(existing) : emptyForm,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!existing;

  const set =
    (key: keyof PromotionFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleGenerateCode = () => {
    setForm((p) => ({ ...p, promo_code: generatePromoCode() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!form.discount_value || isNaN(Number(form.discount_value)) || Number(form.discount_value) <= 0) {
      setError('A valid discount value greater than 0 is required.');
      return;
    }
    if (form.discount_type === 'percentage' && Number(form.discount_value) > 100) {
      setError('Percentage discount cannot exceed 100%.');
      return;
    }
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      setError('End date must be on or after start date.');
      return;
    }

    const payload = {
      ...(isEdit ? { id: existing!.id } : {}),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      start_date: form.start_date || undefined,
      end_date: form.end_date || undefined,
      max_uses: form.max_uses ? parseInt(form.max_uses) : undefined,
      promo_code: form.promo_code.trim() || undefined,
    };

    setLoading(true);
    try {
      const res = await fetch('/api/artist/promotions', {
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
              placeholder="e.g. Summer Flash Deal"
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
              placeholder="Short description visible to clients..."
              value={form.description}
              onChange={set('description')}
              rows={2}
              className={`${inputClass} resize-none`}
              disabled={loading}
            />
          </div>

          {/* Discount type + value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Discount Type *</label>
              <div className="relative">
                <select
                  value={form.discount_type}
                  onChange={set('discount_type')}
                  className={selectClass}
                  disabled={loading}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Discount Value *{' '}
                <span className="normal-case font-normal text-gray-400">
                  ({form.discount_type === 'percentage' ? '%' : '$'})
                </span>
              </label>
              <input
                type="number"
                min="0.01"
                step={form.discount_type === 'percentage' ? '1' : '0.01'}
                max={form.discount_type === 'percentage' ? '100' : undefined}
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
                type="date"
                value={form.start_date}
                onChange={set('start_date')}
                className={inputClass}
                disabled={loading}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                value={form.end_date}
                onChange={set('end_date')}
                className={inputClass}
                disabled={loading}
              />
            </div>
          </div>

          {/* Max uses */}
          <div>
            <label className={labelClass}>Max Uses</label>
            <input
              type="number"
              min="1"
              placeholder="Leave blank for unlimited"
              value={form.max_uses}
              onChange={set('max_uses')}
              className={inputClass}
              disabled={loading}
            />
          </div>

          {/* Promo code */}
          <div>
            <label className={labelClass}>Promo Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. SUMMER20"
                value={form.promo_code}
                onChange={set('promo_code')}
                className={`${inputClass} uppercase`}
                disabled={loading}
                style={{ textTransform: 'uppercase' }}
              />
              <button
                type="button"
                onClick={handleGenerateCode}
                disabled={loading}
                title="Auto-generate code"
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#C8956C] transition-colors text-xs font-medium whitespace-nowrap shrink-0"
              >
                Generate
              </button>
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
          "{promotion.title}" will be permanently removed. This action cannot be undone.
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
  promo: Promotion;
  onEdit: (p: Promotion) => void;
  onDelete: (p: Promotion) => void;
  onToggle: (p: Promotion) => Promise<void>;
  onCopyCode: (code: string) => void;
}

function PromotionCard({ promo, onEdit, onDelete, onToggle, onCopyCode }: PromotionCardProps) {
  const [toggling, setToggling] = useState(false);
  const status = getPromotionStatus(promo);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(promo);
    setToggling(false);
  };

  const discountLabel = formatDiscount(promo);
  const discountBg =
    promo.discount_type === 'percentage'
      ? 'bg-[#C8956C]/10 text-[#C8956C] border-[#C8956C]/20'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      {/* Top: title + discount badge + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#1a1a2e] leading-snug truncate">{promo.title}</p>
          {promo.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
              {promo.description}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${discountBg}`}
        >
          {promo.discount_type === 'percentage' ? (
            <Percent size={10} />
          ) : (
            <DollarSign size={10} />
          )}
          {discountLabel}
        </span>
      </div>

      {/* Status badge */}
      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={status} />
        {promo.promo_code && (
          <button
            onClick={() => onCopyCode(promo.promo_code!)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600 hover:bg-gray-100 hover:text-[#C8956C] transition-colors"
            title="Copy promo code"
          >
            <Ticket size={11} />
            {promo.promo_code}
            <Copy size={10} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Meta row: dates + uses */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400">
        {(promo.start_date || promo.end_date) && (
          <span className="flex items-center gap-1">
            <CalendarDays size={11} className="text-gray-300 shrink-0" />
            {promo.start_date ? formatDate(promo.start_date) : 'Open'}
            {' — '}
            {promo.end_date ? formatDate(promo.end_date) : 'No expiry'}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users size={11} className="text-gray-300 shrink-0" />
          {promo.uses_count}{promo.max_uses != null ? `/${promo.max_uses}` : ''} uses
        </span>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
        {/* Toggle active */}
        <button
          onClick={handleToggle}
          disabled={toggling || status === 'expired'}
          title={status === 'expired' ? 'Expired promotions cannot be toggled' : promo.is_active === 1 ? 'Deactivate' : 'Activate'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            promo.is_active === 1
              ? 'text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
              : 'text-gray-500 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
          }`}
        >
          {toggling ? (
            <Loader2 size={12} className="animate-spin" />
          ) : promo.is_active === 1 ? (
            <ToggleRight size={13} />
          ) : (
            <ToggleLeft size={13} />
          )}
          {promo.is_active === 1 ? 'Deactivate' : 'Activate'}
        </button>

        <div className="flex-1" />

        {/* Edit */}
        <button
          onClick={() => onEdit(promo)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Pencil size={12} />
          Edit
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(promo)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter Pills
// ---------------------------------------------------------------------------

interface FilterPillsProps {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
  counts: Record<FilterKey, number>;
}

function FilterPills({ active, onChange, counts }: FilterPillsProps) {
  const options: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
            active === key
              ? 'bg-[#C8956C] text-white border-[#C8956C]'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#1a1a2e]'
          }`}
        >
          {label}
          {counts[key] > 0 && (
            <span
              className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                active === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {counts[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function ArtistPromotionsTab() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filter, setFilter] = useState<FilterKey>('all');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [deletingPromo, setDeletingPromo] = useState<Promotion | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filter === 'active') params.set('is_active', 'true');
      if (filter === 'inactive') params.set('is_active', 'false');

      const res = await fetch(`/api/artist/promotions?${params}`);
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
  }, [filter]);

  useEffect(() => {
    void fetchPromotions();
  }, [fetchPromotions]);

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  const handleToggle = async (promo: Promotion) => {
    const newValue = promo.is_active === 1 ? 0 : 1;
    try {
      const res = await fetch('/api/artist/promotions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promo.id, is_active: newValue === 1 }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        setPromotions((prev) =>
          prev.map((p) => (p.id === promo.id ? { ...p, is_active: newValue } : p)),
        );
        showToast(newValue === 1 ? 'Promotion activated.' : 'Promotion deactivated.');
      } else {
        showToast(data.error ?? 'Update failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingPromo) return;
    try {
      const res = await fetch('/api/artist/promotions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingPromo.id }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        setPromotions((prev) => prev.filter((p) => p.id !== deletingPromo.id));
        showToast('Promotion deleted.');
      } else {
        showToast(data.error ?? 'Delete failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setDeletingPromo(null);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      showToast(`Code "${code}" copied to clipboard.`);
    } catch {
      showToast('Could not copy to clipboard.', 'error');
    }
  };

  // -------------------------------------------------------------------------
  // Derived state
  // -------------------------------------------------------------------------

  const allPromotions = promotions;

  // When filter=all we still display everything fetched.
  // For client-side count badges we derive from the full list when on "all".
  const activeCount = promotions.filter(
    (p) => p.is_active === 1 && !isExpired(p.end_date),
  ).length;
  const inactiveCount = promotions.filter(
    (p) => p.is_active !== 1 || isExpired(p.end_date),
  ).length;

  const counts: Record<FilterKey, number> = {
    all: promotions.length,
    active: activeCount,
    inactive: inactiveCount,
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e]">Promotions</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {allPromotions.length} promotion{allPromotions.length !== 1 ? 's' : ''}
            {filter !== 'all' ? ` (${filter})` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void fetchPromotions()}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#C8956C]/10 text-[#C8956C] hover:bg-[#C8956C]/20 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b8825c] transition-colors shadow-sm shadow-[#C8956C]/20"
          >
            <Plus size={16} />
            New Promotion
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterPills active={filter} onChange={setFilter} counts={counts} />

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
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full shrink-0" />
              </div>
              <div className="h-5 w-16 bg-gray-100 rounded-full mb-3" />
              <div className="flex gap-3">
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                <div className="h-7 bg-gray-100 rounded-lg flex-1" />
                <div className="h-7 bg-gray-100 rounded-lg w-16" />
                <div className="h-7 bg-gray-100 rounded-lg w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && allPromotions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Tag size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-600">No promotions found</p>
          <p className="text-xs text-gray-400 mt-1">
            {filter !== 'all'
              ? `No ${filter} promotions. Try switching the filter.`
              : 'Click "New Promotion" to create your first deal.'}
          </p>
        </div>
      )}

      {/* Promotions grid */}
      {!loading && allPromotions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPromotions.map((promo) => (
            <PromotionCard
              key={promo.id}
              promo={promo}
              onEdit={(p) => setEditingPromo(p)}
              onDelete={(p) => setDeletingPromo(p)}
              onToggle={handleToggle}
              onCopyCode={handleCopyCode}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreateModal && (
        <PromotionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            void fetchPromotions();
            showToast('Promotion created successfully.');
          }}
        />
      )}

      {/* Edit modal */}
      {editingPromo && (
        <PromotionModal
          existing={editingPromo}
          onClose={() => setEditingPromo(null)}
          onSuccess={() => {
            void fetchPromotions();
            showToast('Promotion updated successfully.');
          }}
        />
      )}

      {/* Delete confirm dialog */}
      {deletingPromo && (
        <DeleteDialog
          promotion={deletingPromo}
          onConfirm={handleDelete}
          onCancel={() => setDeletingPromo(null)}
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
