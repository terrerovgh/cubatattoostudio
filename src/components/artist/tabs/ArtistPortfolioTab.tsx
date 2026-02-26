import { useState, useEffect, useCallback } from 'react';
import {
  Plus, X, Pencil, Star, Trash2, Loader2, ImageOff,
  AlertCircle, CheckCircle2, ChevronDown, Images,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PortfolioItem {
  id: string;
  artist_id: string;
  title: string;
  description?: string;
  image_url: string;
  style?: string;
  tags?: string[];
  is_featured: boolean | number;
  sort_order: number;
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

const STYLE_OPTIONS = [
  'Traditional',
  'Neo-Traditional',
  'Japanese',
  'Blackwork',
  'Realism',
  'Watercolor',
  'Dotwork',
  'Geometric',
  'Minimalist',
  'Lettering',
  'New School',
  'Trash Polka',
  'Tribal',
  'Fine Line',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isFeatured(val: boolean | number | undefined): boolean {
  return val === true || val === 1;
}

function normalizeTags(raw: string[] | string | undefined | null): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Form types and helpers
// ---------------------------------------------------------------------------

interface PortfolioFormData {
  title: string;
  description: string;
  image_url: string;
  style: string;
  tags: string; // comma-separated input
  is_featured: boolean;
  sort_order: string;
}

const emptyForm: PortfolioFormData = {
  title: '',
  description: '',
  image_url: '',
  style: '',
  tags: '',
  is_featured: false,
  sort_order: '0',
};

function itemToForm(item: PortfolioItem): PortfolioFormData {
  return {
    title: item.title,
    description: item.description ?? '',
    image_url: item.image_url,
    style: item.style ?? '',
    tags: normalizeTags(item.tags).join(', '),
    is_featured: isFeatured(item.is_featured),
    sort_order: String(item.sort_order ?? 0),
  };
}

// ---------------------------------------------------------------------------
// Portfolio Modal (shared by Create and Edit)
// ---------------------------------------------------------------------------

interface PortfolioModalProps {
  existing?: PortfolioItem;
  onClose: () => void;
  onSuccess: () => void;
}

function PortfolioModal({ existing, onClose, onSuccess }: PortfolioModalProps) {
  const [form, setForm] = useState<PortfolioFormData>(
    existing ? itemToForm(existing) : emptyForm,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!existing;

  const set =
    (key: keyof PortfolioFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!form.image_url.trim()) {
      setError('Image URL is required.');
      return;
    }

    const payload = {
      ...(isEdit ? { id: existing!.id } : {}),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      image_url: form.image_url.trim(),
      style: form.style || undefined,
      tags: normalizeTags(form.tags),
      is_featured: form.is_featured,
      sort_order: parseInt(form.sort_order, 10) || 0,
    };

    setLoading(true);
    try {
      const res = await fetch('/api/artist/portfolio', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error ?? 'Failed to save portfolio item.');
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
            {isEdit ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
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
              placeholder="e.g. Dragon Sleeve"
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
              placeholder="Brief description of the piece..."
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
            <input
              type="text"
              placeholder="https://..."
              value={form.image_url}
              onChange={set('image_url')}
              className={inputClass}
              disabled={loading}
            />
          </div>

          {/* Style + Sort Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Style</label>
              <div className="relative">
                <select
                  value={form.style}
                  onChange={set('style')}
                  className={selectClass}
                  disabled={loading}
                >
                  <option value="">Select style</option>
                  {STYLE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.sort_order}
                onChange={set('sort_order')}
                className={inputClass}
                disabled={loading}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags</label>
            <input
              type="text"
              placeholder="snake, dagger, black — comma separated"
              value={form.tags}
              onChange={set('tags')}
              className={inputClass}
              disabled={loading}
            />
          </div>

          {/* Featured toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
            <div>
              <p className="text-sm font-medium text-[#1a1a2e]">Featured</p>
              <p className="text-xs text-gray-400">Pin this piece to the top of your portfolio</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, is_featured: !prev.is_featured }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                form.is_featured ? 'bg-[#C8956C]' : 'bg-gray-200'
              }`}
              disabled={loading}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  form.is_featured ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
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
                'Add Item'
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
  item: PortfolioItem;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

function DeleteDialog({ item, onConfirm, onCancel }: DeleteDialogProps) {
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
        <h3 className="text-base font-semibold text-[#1a1a2e] mb-1">Delete Item?</h3>
        <p className="text-sm text-gray-500 mb-5">
          "{item.title}" will be permanently removed from your portfolio. This cannot be undone.
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
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Portfolio Card
// ---------------------------------------------------------------------------

interface PortfolioCardProps {
  item: PortfolioItem;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (item: PortfolioItem) => void;
  onToggleFeatured: (item: PortfolioItem) => void;
  togglingId: string | null;
}

function PortfolioCard({ item, onEdit, onDelete, onToggleFeatured, togglingId }: PortfolioCardProps) {
  const [imgError, setImgError] = useState(false);
  const featured = isFeatured(item.is_featured);
  const tags = normalizeTags(item.tags);
  const isToggling = togglingId === item.id;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow flex flex-col group">
      {/* Thumbnail */}
      <div className="relative aspect-square bg-gray-100">
        {imgError || !item.image_url ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff size={24} className="text-gray-300" />
          </div>
        ) : (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}

        {/* Featured badge */}
        {featured && (
          <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C8956C] text-white text-[10px] font-bold">
            <Star size={9} className="fill-white" />
            Featured
          </span>
        )}

        {/* Style badge */}
        {item.style && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium backdrop-blur-sm">
            {item.style}
          </span>
        )}

        {/* Hover overlay with quick actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#1a1a2e] hover:bg-gray-100 transition-colors shadow-sm"
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onToggleFeatured(item)}
            disabled={isToggling}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors shadow-sm ${
              featured
                ? 'bg-[#C8956C] text-white hover:bg-[#b8825c]'
                : 'bg-white text-gray-400 hover:bg-gray-100 hover:text-[#C8956C]'
            }`}
            title={featured ? 'Unfeature' : 'Feature'}
          >
            {isToggling ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Star size={13} className={featured ? 'fill-white' : ''} />
            )}
          </button>
          <button
            onClick={() => onDelete(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-sm font-semibold text-[#1a1a2e] leading-snug line-clamp-1">{item.title}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-400">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer actions — always-visible on mobile where hover doesn't work */}
        <div className="flex gap-1.5 mt-auto pt-2 border-t border-gray-100 sm:hidden">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={11} />
            Edit
          </button>
          <button
            onClick={() => onToggleFeatured(item)}
            disabled={isToggling}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              featured
                ? 'text-[#C8956C] border-[#C8956C]/30 bg-[#C8956C]/5 hover:bg-[#C8956C]/10'
                : 'text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {isToggling ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Star size={11} className={featured ? 'fill-[#C8956C] text-[#C8956C]' : ''} />
            )}
            {featured ? 'Unfeature' : 'Feature'}
          </button>
          <button
            onClick={() => onDelete(item)}
            className="px-2.5 flex items-center justify-center rounded-lg text-red-400 border border-red-100 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function ArtistPortfolioTab() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<PortfolioItem | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filter state
  const [filterStyle, setFilterStyle] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/artist/portfolio');
      const data = (await res.json()) as ApiResponse<{ portfolio_items: PortfolioItem[] }>;
      if (data.success && data.data) {
        setItems(data.data.portfolio_items);
      } else {
        setError(data.error ?? 'Failed to load portfolio.');
      }
    } catch {
      setError('Network error. Could not load portfolio.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      const res = await fetch('/api/artist/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingItem.id }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        setItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
        showToast('Item deleted.');
      } else {
        showToast(data.error ?? 'Delete failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setDeletingItem(null);
    }
  };

  const handleToggleFeatured = async (item: PortfolioItem) => {
    setTogglingId(item.id);
    const newFeatured = !isFeatured(item.is_featured);
    try {
      const res = await fetch('/api/artist/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_featured: newFeatured }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_featured: newFeatured } : i)),
        );
        showToast(newFeatured ? 'Marked as featured.' : 'Removed from featured.');
      } else {
        showToast(data.error ?? 'Update failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // Derived: filtered + sorted items (featured first, then by sort_order)
  const displayedItems = items
    .filter((item) => {
      if (filterStyle && item.style !== filterStyle) return false;
      if (filterFeatured === 'featured' && !isFeatured(item.is_featured)) return false;
      if (filterFeatured === 'regular' && isFeatured(item.is_featured)) return false;
      return true;
    })
    .sort((a, b) => {
      const aFeat = isFeatured(a.is_featured) ? 0 : 1;
      const bFeat = isFeatured(b.is_featured) ? 0 : 1;
      if (aFeat !== bFeat) return aFeat - bFeat;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });

  const hasFilters = filterStyle !== '' || filterFeatured !== '';

  const selectClass =
    'pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] appearance-none focus:outline-none focus:border-[#C8956C] transition-colors';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e]">Portfolio</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {items.length} item{items.length !== 1 ? 's' : ''}
            {hasFilters ? ` — ${displayedItems.length} shown` : ''}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b8825c] transition-colors shadow-sm shadow-[#C8956C]/20"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={filterStyle}
            onChange={(e) => setFilterStyle(e.target.value)}
            className={selectClass}
          >
            <option value="">All Styles</option>
            {STYLE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filterFeatured}
            onChange={(e) => setFilterFeatured(e.target.value)}
            className={selectClass}
          >
            <option value="">All Items</option>
            <option value="featured">Featured only</option>
            <option value="regular">Regular only</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {hasFilters && (
          <button
            onClick={() => { setFilterStyle(''); setFilterFeatured(''); }}
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
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && displayedItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Images size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-600">No portfolio items found</p>
          <p className="text-xs text-gray-400 mt-1">
            {hasFilters ? 'Try clearing the filters.' : 'Click "Add Item" to showcase your work.'}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && displayedItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedItems.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onEdit={(i) => setEditingItem(i)}
              onDelete={(i) => setDeletingItem(i)}
              onToggleFeatured={handleToggleFeatured}
              togglingId={togglingId}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <PortfolioModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            void fetchItems();
            showToast('Portfolio item added.');
          }}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <PortfolioModal
          existing={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            void fetchItems();
            showToast('Portfolio item updated.');
          }}
        />
      )}

      {/* Delete Dialog */}
      {deletingItem && (
        <DeleteDialog
          item={deletingItem}
          onConfirm={handleDelete}
          onCancel={() => setDeletingItem(null)}
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
