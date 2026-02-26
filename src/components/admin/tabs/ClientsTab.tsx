import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Loader2, AlertCircle, ChevronDown, ChevronUp,
  Users, Phone, Mail, Star, Clock, DollarSign, BookOpen, FileText,
} from 'lucide-react';
import type { Client, LoyaltyTier, Booking } from '../../../types/booking';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientDetail {
  client: Client;
  bookings: Booking[];
  payments: unknown[];
  loyalty_history: unknown[];
  consent_forms: unknown[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<LoyaltyTier, { label: string; bg: string; text: string; border: string; icon: string }> = {
  vip: {
    label: 'VIP',
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: '★',
  },
  gold: {
    label: 'Gold',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    icon: '◆',
  },
  silver: {
    label: 'Silver',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
    icon: '◇',
  },
  standard: {
    label: 'Standard',
    bg: 'bg-white',
    text: 'text-gray-500',
    border: 'border-gray-200',
    icon: '○',
  },
};

const BOOKING_STATUS_COLORS: Record<string, string> = {
  confirmed: 'text-emerald-600 bg-emerald-50',
  pending: 'text-amber-600 bg-amber-50',
  deposit_paid: 'text-sky-600 bg-sky-50',
  in_progress: 'text-violet-600 bg-violet-50',
  completed: 'text-gray-500 bg-gray-100',
  cancelled: 'text-red-600 bg-red-50',
  no_show: 'text-red-500 bg-red-50',
  rescheduled: 'text-orange-600 bg-orange-50',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TierBadgeProps {
  tier: LoyaltyTier;
}

function TierBadge({ tier }: TierBadgeProps) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className="text-[9px]">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

interface ExpandedDetailProps {
  clientId: string;
}

function ExpandedDetail({ clientId }: ExpandedDetailProps) {
  const [detail, setDetail] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/clients?id=${encodeURIComponent(clientId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json() as { success: boolean; data?: ClientDetail; error?: string };
        if (!json.success) throw new Error(json.error ?? 'Failed to load');
        if (!cancelled) setDetail(json.data ?? null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load client details');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={18} className="text-[#C8956C] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 text-sm text-red-600">
        <AlertCircle size={14} />
        {error}
      </div>
    );
  }

  if (!detail) return null;

  const { client, bookings } = detail;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-5 bg-gray-50/60 border-t border-gray-100">
      {/* ── Client info ── */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
          <FileText size={12} />
          Profile Details
        </h4>

        <dl className="space-y-2.5">
          {client.date_of_birth && (
            <div className="flex items-start gap-2">
              <dt className="text-xs text-gray-400 w-28 shrink-0 pt-0.5">Date of Birth</dt>
              <dd className="text-xs text-[#1a1a2e] font-medium">{fmtDate(client.date_of_birth)}</dd>
            </div>
          )}
          {client.preferred_artist && (
            <div className="flex items-start gap-2">
              <dt className="text-xs text-gray-400 w-28 shrink-0 pt-0.5">Preferred Artist</dt>
              <dd className="text-xs text-[#1a1a2e] font-medium capitalize">{client.preferred_artist}</dd>
            </div>
          )}
          {client.referral_source && (
            <div className="flex items-start gap-2">
              <dt className="text-xs text-gray-400 w-28 shrink-0 pt-0.5">Referred By</dt>
              <dd className="text-xs text-[#1a1a2e] font-medium capitalize">{client.referral_source}</dd>
            </div>
          )}
          <div className="flex items-start gap-2">
            <dt className="text-xs text-gray-400 w-28 shrink-0 pt-0.5">Client Since</dt>
            <dd className="text-xs text-[#1a1a2e] font-medium">{fmtDate(client.created_at)}</dd>
          </div>
        </dl>

        {/* Medical notes */}
        {(client.medical_notes || client.allergies) && (
          <div className="mt-3 space-y-2">
            {client.allergies && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-1">Allergies</p>
                <p className="text-xs text-amber-800">{client.allergies}</p>
              </div>
            )}
            {client.medical_notes && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wide mb-1">Medical Notes</p>
                <p className="text-xs text-red-800">{client.medical_notes}</p>
              </div>
            )}
          </div>
        )}

        {/* General notes */}
        {client.notes && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">Notes</p>
            <p className="text-xs text-blue-800">{client.notes}</p>
          </div>
        )}
      </div>

      {/* ── Booking history ── */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-3">
          <BookOpen size={12} />
          Booking History
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500 text-[10px]">
            {bookings.length}
          </span>
        </h4>

        {bookings.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">No bookings found</p>
        ) : (
          <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {bookings.map((b) => {
              const statusCls = BOOKING_STATUS_COLORS[b.status] ?? 'text-gray-500 bg-gray-100';
              return (
                <li
                  key={b.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1a1a2e] truncate capitalize">
                      {b.service_type.replace(/_/g, ' ')}
                      {b.style ? ` — ${b.style}` : ''}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {fmtDate(b.scheduled_date)} at {b.scheduled_time}
                    </p>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    <span className={`block text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusCls}`}>
                      {b.status.replace('_', ' ')}
                    </span>
                    {(b.final_price ?? b.estimated_price_min) && (
                      <p className="text-[10px] text-gray-500">
                        {fmtCurrency(b.final_price ?? b.estimated_price_min ?? 0)}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ClientsTab() {
  const [searchInput, setSearchInput] = useState('');
  const [committedSearch, setCommittedSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchClients = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (q.trim()) params.set('search', q.trim());
      const res = await fetch(`/api/admin/clients?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as { success: boolean; data?: { clients: Client[] }; error?: string };
      if (!json.success) throw new Error(json.error ?? 'Failed to load clients');
      setClients(json.data?.clients ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    void fetchClients('');
  }, [fetchClients]);

  function handleSearch() {
    setCommittedSearch(searchInput);
    setExpandedId(null);
    void fetchClients(searchInput);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  function toggleRow(id: string) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  return (
    <div className="space-y-5">
      {/* ── Search bar card ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              ref={searchRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d50] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </button>
        </div>

        {/* Active search indicator */}
        {committedSearch && (
          <p className="mt-2.5 text-xs text-gray-400">
            Showing results for{' '}
            <span className="font-semibold text-[#C8956C]">"{committedSearch}"</span>
            {' '}&mdash;{' '}
            <button
              onClick={() => { setSearchInput(''); setCommittedSearch(''); void fetchClients(''); }}
              className="text-gray-500 hover:text-[#1a1a2e] underline underline-offset-2 transition-colors"
            >
              Clear
            </button>
          </p>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {/* ── Table card ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Table header summary */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#C8956C]" />
            <h3 className="font-semibold text-[#1a1a2e] text-sm">Clients</h3>
            {!loading && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                {clients.length}
              </span>
            )}
          </div>
          {loading && <Loader2 size={15} className="text-[#C8956C] animate-spin" />}
        </div>

        {/* Scrollable table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">
                  Name
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">
                  <span className="flex items-center gap-1"><Mail size={11} />Email</span>
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">
                  <span className="flex items-center gap-1"><Phone size={11} />Phone</span>
                </th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">
                  <span className="flex items-center justify-end gap-1"><Clock size={11} />Visits</span>
                </th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">
                  <span className="flex items-center justify-end gap-1"><DollarSign size={11} />Spent</span>
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">
                  <span className="flex items-center gap-1"><Star size={11} />Tier</span>
                </th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">
                  Points
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {/* Loading state */}
              {loading && clients.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Loader2 size={24} className="text-[#C8956C] animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Loading clients...</p>
                  </td>
                </tr>
              )}

              {/* Empty state */}
              {!loading && clients.length === 0 && !error && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Users size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">No clients found</p>
                    {committedSearch && (
                      <p className="text-xs text-gray-400 mt-1">
                        Try a different search term
                      </p>
                    )}
                  </td>
                </tr>
              )}

              {/* Client rows */}
              {clients.map((client) => {
                const isExpanded = expandedId === client.id;
                return (
                  <>
                    <tr
                      key={client.id}
                      onClick={() => toggleRow(client.id)}
                      className={`
                        cursor-pointer transition-colors duration-100 group
                        ${isExpanded ? 'bg-[#C8956C]/5' : 'hover:bg-gray-50'}
                      `}
                    >
                      {/* Name + expand toggle */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8956C]/20 to-[#C8956C]/5 flex items-center justify-center shrink-0 border border-[#C8956C]/15">
                            <span className="text-[11px] font-bold text-[#C8956C]">
                              {client.first_name.charAt(0).toUpperCase()}
                              {client.last_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-[#1a1a2e] text-sm leading-tight">
                              {client.first_name} {client.last_name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              ID: {client.id.slice(0, 8)}...
                            </p>
                          </div>
                          <span className="ml-auto text-gray-300 group-hover:text-gray-400 transition-colors">
                            {isExpanded
                              ? <ChevronUp size={14} />
                              : <ChevronDown size={14} />
                            }
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-600 truncate max-w-[180px] block">
                          {client.email}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-600">
                          {client.phone ?? <span className="text-gray-300">—</span>}
                        </span>
                      </td>

                      {/* Visits */}
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm font-semibold text-[#1a1a2e]">
                          {client.visit_count}
                        </span>
                      </td>

                      {/* Total spent */}
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm font-semibold text-[#1a1a2e]">
                          {fmtCurrency(client.total_spent)}
                        </span>
                      </td>

                      {/* Tier */}
                      <td className="px-4 py-3.5">
                        <TierBadge tier={client.loyalty_tier} />
                      </td>

                      {/* Points */}
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-sm font-medium text-[#C8956C]">
                          {client.loyalty_points.toLocaleString()}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr key={`${client.id}-detail`}>
                        <td colSpan={7} className="p-0">
                          <ExpandedDetail clientId={client.id} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
