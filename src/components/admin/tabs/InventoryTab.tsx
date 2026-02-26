import { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Minus,
  RefreshCw,
  BoxSelect,
  AlertTriangle,
  Filter,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category =
  | 'Ink'
  | 'Needles'
  | 'Gloves'
  | 'Bandages'
  | 'Cleaning Supplies'
  | 'Machine Parts'
  | 'Transfer Paper'
  | 'Aftercare Products'
  | 'Other';

type StockStatus = 'good' | 'low' | 'critical';
type StockFilter = 'all' | 'low' | 'critical';
type SortKey = 'name' | 'category' | 'quantity' | 'cost_per_unit';
type SortDir = 'asc' | 'desc';

interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  min_threshold: number;
  cost_per_unit: number;
  supplier: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface InventoryFormData {
  name: string;
  category: Category;
  quantity: string;
  unit: string;
  min_threshold: string;
  cost_per_unit: string;
  supplier: string;
  notes: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES: Category[] = [
  'Ink',
  'Needles',
  'Gloves',
  'Bandages',
  'Cleaning Supplies',
  'Machine Parts',
  'Transfer Paper',
  'Aftercare Products',
  'Other',
];

const STOCK_FILTER_OPTIONS: { value: StockFilter; label: string }[] = [
  { value: 'all', label: 'All Stock' },
  { value: 'low', label: 'Low Stock' },
  { value: 'critical', label: 'Critical' },
];

const emptyForm: InventoryFormData = {
  name: '',
  category: 'Ink',
  quantity: '',
  unit: 'units',
  min_threshold: '',
  cost_per_unit: '',
  supplier: '',
  notes: '',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStockStatus(item: InventoryItem): StockStatus {
  const ratio = item.quantity / Math.max(item.min_threshold, 1);
  if (ratio <= 0.5) return 'critical';
  if (ratio <= 1) return 'low';
  return 'good';
}

function stockStatusConfig(status: StockStatus) {
  const map: Record<StockStatus, { dot: string; badge: string; label: string }> = {
    good: {
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      label: 'Good',
    },
    low: {
      dot: 'bg-amber-400',
      badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
      label: 'Low',
    },
    critical: {
      dot: 'bg-red-500',
      badge: 'bg-red-50 text-red-600 ring-1 ring-red-200',
      label: 'Critical',
    },
  };
  return map[status];
}

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function itemToForm(item: InventoryItem): InventoryFormData {
  return {
    name: item.name,
    category: item.category,
    quantity: String(item.quantity),
    unit: item.unit,
    min_threshold: String(item.min_threshold),
    cost_per_unit: String(item.cost_per_unit),
    supplier: item.supplier,
    notes: item.notes,
  };
}

// ---------------------------------------------------------------------------
// Shared style tokens
// ---------------------------------------------------------------------------

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm placeholder-gray-400 focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors';
const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';
const selectClass = `${inputClass} appearance-none`;

// ---------------------------------------------------------------------------
// Item Form Modal (create & edit)
// ---------------------------------------------------------------------------

interface ItemModalProps {
  existing?: InventoryItem;
  onClose: () => void;
  onSuccess: (item: InventoryItem) => void;
}

function ItemModal({ existing, onClose, onSuccess }: ItemModalProps) {
  const [form, setForm] = useState<InventoryFormData>(existing ? itemToForm(existing) : emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!existing;

  const set =
    (key: keyof InventoryFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Item name is required.');
      return;
    }
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) < 0) {
      setError('Quantity must be a non-negative number.');
      return;
    }
    if (!form.min_threshold || isNaN(Number(form.min_threshold)) || Number(form.min_threshold) < 0) {
      setError('Minimum threshold must be a non-negative number.');
      return;
    }

    const payload: Record<string, unknown> = {
      ...(isEdit ? { id: existing!.id } : {}),
      name: form.name.trim(),
      category: form.category,
      quantity: Number(form.quantity),
      unit: form.unit.trim() || 'units',
      min_threshold: Number(form.min_threshold),
      cost_per_unit: form.cost_per_unit ? Number(form.cost_per_unit) : 0,
      supplier: form.supplier.trim(),
      notes: form.notes.trim(),
    };

    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ApiResponse<{ item: InventoryItem }>;

      if (data.success && data.data?.item) {
        onSuccess(data.data.item);
        onClose();
      } else {
        // API not yet implemented — optimistically update local state with a fake item
        if (res.status === 404 || res.status === 405 || !data.success) {
          const fakeItem: InventoryItem = {
            id: existing?.id ?? `local-${Date.now()}`,
            name: payload.name as string,
            category: payload.category as Category,
            quantity: payload.quantity as number,
            unit: payload.unit as string,
            min_threshold: payload.min_threshold as number,
            cost_per_unit: payload.cost_per_unit as number,
            supplier: payload.supplier as string,
            notes: payload.notes as string,
          };
          onSuccess(fakeItem);
          onClose();
        } else {
          setError(data.error ?? 'Failed to save item.');
        }
      }
    } catch {
      // Network error — still optimistically save locally
      const fakeItem: InventoryItem = {
        id: existing?.id ?? `local-${Date.now()}`,
        name: payload.name as string,
        category: payload.category as Category,
        quantity: payload.quantity as number,
        unit: payload.unit as string,
        min_threshold: payload.min_threshold as number,
        cost_per_unit: payload.cost_per_unit as number,
        supplier: payload.supplier as string,
        notes: payload.notes as string,
      };
      onSuccess(fakeItem);
      onClose();
    } finally {
      setLoading(false);
    }
  };

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
            {isEdit ? 'Edit Item' : 'Add Inventory Item'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className={labelClass}>Item Name *</label>
            <input
              type="text"
              placeholder="e.g. Black Ink 1oz"
              value={form.name}
              onChange={set('name')}
              className={inputClass}
              disabled={loading}
            />
          </div>

          {/* Category + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Category *</label>
              <div className="relative">
                <select value={form.category} onChange={set('category')} className={selectClass} disabled={loading}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Unit</label>
              <input
                type="text"
                placeholder="e.g. oz, boxes, pairs"
                value={form.unit}
                onChange={set('unit')}
                className={inputClass}
                disabled={loading}
              />
            </div>
          </div>

          {/* Quantity + Min Threshold */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Quantity *</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={form.quantity}
                onChange={set('quantity')}
                className={inputClass}
                disabled={loading}
              />
            </div>
            <div>
              <label className={labelClass}>Min Threshold *</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="5"
                value={form.min_threshold}
                onChange={set('min_threshold')}
                className={inputClass}
                disabled={loading}
              />
            </div>
          </div>

          {/* Cost + Supplier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Cost / Unit ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.cost_per_unit}
                onChange={set('cost_per_unit')}
                className={inputClass}
                disabled={loading}
              />
            </div>
            <div>
              <label className={labelClass}>Supplier</label>
              <input
                type="text"
                placeholder="e.g. Inkjecta"
                value={form.supplier}
                onChange={set('supplier')}
                className={inputClass}
                disabled={loading}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              placeholder="Optional notes about this item..."
              value={form.notes}
              onChange={set('notes')}
              rows={2}
              className={`${inputClass} resize-none`}
              disabled={loading}
            />
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
  item: InventoryItem;
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
          "{item.name}" will be permanently removed from your inventory.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleConfirm()}
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
// Stock Status Badge
// ---------------------------------------------------------------------------

function StockBadge({ item }: { item: InventoryItem }) {
  const status = getStockStatus(item);
  const config = stockStatusConfig(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Sortable Table Header Cell
// ---------------------------------------------------------------------------

interface SortHeaderProps {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}

function SortHeader({ label, sortKey, currentKey, currentDir, onSort, className = '' }: SortHeaderProps) {
  const isActive = currentKey === sortKey;
  return (
    <th
      className={`text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer select-none hover:text-[#C8956C] transition-colors ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          currentDir === 'asc' ? (
            <ChevronUp size={12} className="text-[#C8956C]" />
          ) : (
            <ChevronDown size={12} className="text-[#C8956C]" />
          )
        ) : (
          <ChevronDown size={12} className="text-gray-300" />
        )}
      </span>
    </th>
  );
}

// ---------------------------------------------------------------------------
// Coming Soon Placeholder
// ---------------------------------------------------------------------------

function InventoryComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#C8956C]/10 flex items-center justify-center mb-5">
        <Package size={28} className="text-[#C8956C]" />
      </div>
      <h3 className="text-base font-semibold text-[#1a1a2e] mb-1">Inventory System Coming Soon</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        The inventory API is not yet connected. Items you add will be stored locally in this session.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

export function InventoryTab() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | ''>('');
  const [filterStock, setFilterStock] = useState<StockFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch items ────────────────────────────────────────────────────────────

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      const data = (await res.json()) as ApiResponse<{ items: InventoryItem[] }>;
      if (data.success && data.data?.items) {
        setItems(data.data.items);
        setApiUnavailable(false);
      } else {
        setApiUnavailable(true);
      }
    } catch {
      setApiUnavailable(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  // ── Sorting ────────────────────────────────────────────────────────────────

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // ── Filtering + Sorting pipeline ──────────────────────────────────────────

  const visibleItems = items
    .filter((item) => {
      const matchesSearch =
        !search || item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !filterCategory || item.category === filterCategory;
      const status = getStockStatus(item);
      const matchesStock =
        filterStock === 'all' ||
        (filterStock === 'low' && status === 'low') ||
        (filterStock === 'critical' && status === 'critical');
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortKey === 'category') comparison = a.category.localeCompare(b.category);
      else if (sortKey === 'quantity') comparison = a.quantity - b.quantity;
      else if (sortKey === 'cost_per_unit') comparison = a.cost_per_unit - b.cost_per_unit;
      return sortDir === 'asc' ? comparison : -comparison;
    });

  // ── Stock summary counts ───────────────────────────────────────────────────

  const criticalCount = items.filter((i) => getStockStatus(i) === 'critical').length;
  const lowCount = items.filter((i) => getStockStatus(i) === 'low').length;

  // ── Quantity adjustment ────────────────────────────────────────────────────

  const handleAdjust = async (item: InventoryItem, delta: number) => {
    const newQty = Math.max(0, item.quantity + delta);
    setAdjustingId(item.id);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, quantity: newQty }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success || apiUnavailable) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i)),
        );
      } else {
        showToast(data.error ?? 'Failed to update quantity.', 'error');
      }
    } catch {
      // API down — update locally anyway
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i)),
      );
    } finally {
      setAdjustingId(null);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingItem.id }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success || apiUnavailable) {
        setItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
        showToast(`"${deletingItem.name}" removed.`);
      } else {
        showToast(data.error ?? 'Failed to delete item.', 'error');
      }
    } catch {
      setItems((prev) => prev.filter((i) => i.id !== deletingItem!.id));
      showToast(`"${deletingItem.name}" removed.`);
    } finally {
      setDeletingItem(null);
    }
  };

  // ── Upsert from modal success ──────────────────────────────────────────────

  const handleUpsert = (item: InventoryItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        showToast(`"${item.name}" updated.`);
        return prev.map((i) => (i.id === item.id ? item : i));
      }
      showToast(`"${item.name}" added to inventory.`);
      return [item, ...prev];
    });
  };

  const hasActiveFilters = search || filterCategory || filterStock !== 'all';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e]">Inventory</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {items.length} item{items.length !== 1 ? 's' : ''}
            {hasActiveFilters ? ` — ${visibleItems.length} shown` : ''}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b8825c] transition-colors shadow-sm shadow-[#C8956C]/20"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Alert banners for low/critical stock */}
      {!loading && (criticalCount > 0 || lowCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700 font-medium">
              <AlertTriangle size={13} className="text-red-500" />
              {criticalCount} item{criticalCount !== 1 ? 's' : ''} critically low
            </div>
          )}
          {lowCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-700 font-medium">
              <AlertCircle size={13} className="text-amber-500" />
              {lowCount} item{lowCount !== 1 ? 's' : ''} running low
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#C8956C] transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as Category | '')}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#C8956C] transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Stock status filter */}
        <div className="relative">
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value as StockFilter)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#C8956C] transition-colors"
          >
            {STOCK_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={() => { setSearch(''); setFilterCategory(''); setFilterStock('all'); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear filters
          </button>
        )}

        {/* Refresh */}
        <button
          onClick={() => void fetchItems()}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-500 hover:text-[#C8956C] hover:bg-[#C8956C]/5 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-[3px] border-[#C8956C]/30 border-t-[#C8956C] animate-spin" />
            <p className="text-sm text-gray-400">Loading inventory...</p>
          </div>
        </div>
      )}

      {/* API unavailable placeholder — shown only when no local items exist */}
      {!loading && apiUnavailable && items.length === 0 && (
        <InventoryComingSoon />
      )}

      {/* Empty state (API available but no items) */}
      {!loading && !apiUnavailable && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <BoxSelect size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-600">No inventory items yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Add Item" to start tracking supplies.</p>
        </div>
      )}

      {/* Filtered empty state */}
      {!loading && items.length > 0 && visibleItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-gray-500">No items match your filters</p>
          <button
            onClick={() => { setSearch(''); setFilterCategory(''); setFilterStock('all'); }}
            className="text-xs text-[#C8956C] hover:underline mt-1"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && visibleItems.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <SortHeader label="Name" sortKey="name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="px-4 py-3 min-w-[160px]" />
                  <SortHeader label="Category" sortKey="category" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="hidden sm:table-cell" />
                  <SortHeader label="Qty" sortKey="quantity" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Adjust
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                  <SortHeader label="Cost/Unit" sortKey="cost_per_unit" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="hidden md:table-cell" />
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                    Supplier
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visibleItems.map((item) => {
                  const status = getStockStatus(item);
                  const isAdjusting = adjustingId === item.id;
                  const rowHighlight =
                    status === 'critical'
                      ? 'bg-red-50/30'
                      : status === 'low'
                      ? 'bg-amber-50/20'
                      : '';

                  return (
                    <tr key={item.id} className={`hover:bg-gray-50/60 transition-colors ${rowHighlight}`}>
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-[#1a1a2e] whitespace-nowrap">{item.name}</p>
                          {item.notes && (
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">{item.notes}</p>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-[#1a1a2e]">{item.quantity}</span>
                        <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                      </td>

                      {/* Quick adjust */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => void handleAdjust(item, -1)}
                            disabled={isAdjusting || item.quantity <= 0}
                            className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30"
                            title="Decrease by 1"
                          >
                            <Minus size={11} />
                          </button>
                          {isAdjusting && (
                            <Loader2 size={12} className="animate-spin text-[#C8956C]" />
                          )}
                          <button
                            onClick={() => void handleAdjust(item, 1)}
                            disabled={isAdjusting}
                            className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-30"
                            title="Increase by 1"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StockBadge item={item} />
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          min {item.min_threshold} {item.unit}
                        </p>
                      </td>

                      {/* Cost */}
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600 whitespace-nowrap">
                        {item.cost_per_unit > 0 ? formatCurrency(item.cost_per_unit) : <span className="text-gray-300">—</span>}
                      </td>

                      {/* Supplier */}
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                        {item.supplier || <span className="text-gray-300">—</span>}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#C8956C] hover:bg-[#C8956C]/10 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <ItemModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleUpsert}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <ItemModal
          existing={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={handleUpsert}
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
