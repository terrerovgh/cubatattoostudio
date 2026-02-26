import { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Filter,
} from 'lucide-react';
import type { BookingStatus } from '../../../types/booking';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingRow {
  id: string;
  first_name: string;
  last_name: string;
  artist_id: string;
  service_type: string;
  scheduled_date: string;
  scheduled_time: string;
  deposit_amount: number;
  deposit_paid: boolean | number;
  status: BookingStatus;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages?: number;
}

type StatusFilter =
  | ''
  | 'pending'
  | 'confirmed'
  | 'deposit_paid'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

type ArtistFilter = '' | 'david' | 'nina' | 'karli';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h ?? '0', 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m ?? '00'} ${ampm}`;
}

function capitalize(str: string): string {
  if (!str) return '—';
  return str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function isDepositPaid(val: boolean | number): boolean {
  return val === true || val === 1;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    confirmed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    deposit_paid: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    no_show: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    in_progress: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    rescheduled: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200',
  };
  const cls = colors[status] ?? 'bg-gray-50 text-gray-600 ring-1 ring-gray-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}>
      {capitalize(status)}
    </span>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant: 'green' | 'blue' | 'red';
}

function ActionButton({ label, onClick, disabled, variant }: ActionButtonProps) {
  const variantCls = {
    green: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    red: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200',
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border transition-colors
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantCls}
      `}
    >
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BookingsTab() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [artistFilter, setArtistFilter] = useState<ArtistFilter>('');
  const [page, setPage] = useState(1);

  const LIMIT = 20;

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchBookings = useCallback(async (opts?: { page?: number; status?: StatusFilter; artist?: ArtistFilter }) => {
    setLoading(true);
    setError(null);

    const currentPage = opts?.page ?? page;
    const currentStatus = opts?.status !== undefined ? opts.status : statusFilter;
    const currentArtist = opts?.artist !== undefined ? opts.artist : artistFilter;

    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(LIMIT),
    });
    if (currentStatus) params.set('status', currentStatus);
    if (currentArtist) params.set('artist_id', currentArtist);

    try {
      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const json = (await res.json()) as {
        success: boolean;
        data?: { bookings: BookingRow[]; pagination: Pagination };
        error?: string;
      };
      if (!json.success || !json.data) {
        throw new Error(json.error ?? 'Failed to load bookings');
      }
      setBookings(json.data.bookings);
      setPagination(json.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, artistFilter]);

  useEffect(() => {
    void fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, artistFilter]);

  // ── Status Update ──────────────────────────────────────────────────────────

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setActionLoading(bookingId + newStatus);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, status: newStatus }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        throw new Error(json.error ?? 'Update failed');
      }
      // Optimistically update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update booking');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Filter Handlers ────────────────────────────────────────────────────────

  const handleStatusChange = (val: StatusFilter) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleArtistChange = (val: ArtistFilter) => {
    setArtistFilter(val);
    setPage(1);
  };

  const handleRefresh = () => {
    void fetchBookings({ page, status: statusFilter, artist: artistFilter });
  };

  // ── Pagination ─────────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  const goToPrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  // ── Terminal statuses (no further actions) ─────────────────────────────────
  const terminalStatuses: BookingStatus[] = ['completed', 'cancelled', 'no_show'];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1a1a2e]">Bookings</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {pagination.total > 0
              ? `${pagination.total} booking${pagination.total !== 1 ? 's' : ''} total`
              : 'Manage all studio bookings'}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter size={15} />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filters</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white hover:border-gray-300 focus:outline-none focus:border-[#C8956C] transition-colors cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="deposit_paid">Deposit Paid</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>

          {/* Artist Filter */}
          <select
            value={artistFilter}
            onChange={(e) => handleArtistChange(e.target.value as ArtistFilter)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white hover:border-gray-300 focus:outline-none focus:border-[#C8956C] transition-colors cursor-pointer"
          >
            <option value="">All Artists</option>
            <option value="david">David</option>
            <option value="nina">Nina</option>
            <option value="karli">Karli</option>
          </select>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C8956C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Loading overlay */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={26} className="animate-spin text-[#C8956C]" />
              <p className="text-sm text-gray-500">Loading bookings...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4 text-center max-w-xs">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">Could not load bookings</p>
                <p className="text-xs text-gray-500 mt-1">{error}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#2a2a4e] transition-colors"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <CalendarDays size={22} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-[#1a1a2e]">No bookings found</p>
              <p className="text-xs text-gray-400">
                {statusFilter || artistFilter ? 'Try adjusting your filters.' : 'Bookings will appear here once created.'}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && bookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Client
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Artist
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Service
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Time
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Deposit
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => {
                  const isActing = actionLoading !== null && actionLoading.startsWith(booking.id);
                  const status = booking.status;

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* Client */}
                      <td className="px-5 py-3.5 font-medium text-[#1a1a2e] whitespace-nowrap">
                        {booking.first_name} {booking.last_name}
                      </td>

                      {/* Artist */}
                      <td className="px-5 py-3.5 text-gray-600 capitalize whitespace-nowrap">
                        {capitalize(booking.artist_id)}
                      </td>

                      {/* Service */}
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {capitalize(booking.service_type)}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                        {formatDate(booking.scheduled_date)}
                      </td>

                      {/* Time */}
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                        {formatTime(booking.scheduled_time)}
                      </td>

                      {/* Deposit */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isDepositPaid(booking.deposit_paid) ? (
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0" />
                          )}
                          <span className={`text-sm ${isDepositPaid(booking.deposit_paid) ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                            ${booking.deposit_amount ?? 0}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">

                          {/* Confirm: only for pending */}
                          {status === 'pending' && (
                            <ActionButton
                              label="Confirm"
                              variant="green"
                              disabled={isActing}
                              onClick={() => void updateBookingStatus(booking.id, 'confirmed')}
                            />
                          )}

                          {/* Start: for confirmed or deposit_paid */}
                          {(status === 'confirmed' || status === 'deposit_paid') && (
                            <ActionButton
                              label="Start"
                              variant="blue"
                              disabled={isActing}
                              onClick={() => void updateBookingStatus(booking.id, 'in_progress')}
                            />
                          )}

                          {/* Complete: for in_progress */}
                          {status === 'in_progress' && (
                            <ActionButton
                              label="Complete"
                              variant="green"
                              disabled={isActing}
                              onClick={() => void updateBookingStatus(booking.id, 'completed')}
                            />
                          )}

                          {/* No-show: for confirmed or deposit_paid */}
                          {(status === 'confirmed' || status === 'deposit_paid') && (
                            <ActionButton
                              label="No-show"
                              variant="red"
                              disabled={isActing}
                              onClick={() => void updateBookingStatus(booking.id, 'no_show')}
                            />
                          )}

                          {/* Cancel: for any non-terminal status */}
                          {!terminalStatuses.includes(status) && (
                            <ActionButton
                              label="Cancel"
                              variant="red"
                              disabled={isActing}
                              onClick={() => void updateBookingStatus(booking.id, 'cancelled')}
                            />
                          )}

                          {/* Terminal state indicator */}
                          {terminalStatuses.includes(status) && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Check size={12} />
                              Done
                            </span>
                          )}

                          {/* Loading spinner for row */}
                          {isActing && (
                            <Loader2 size={14} className="animate-spin text-[#C8956C] shrink-0" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && pagination.total > 0 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3">
          <p className="text-sm text-gray-500">
            Page <span className="font-semibold text-[#1a1a2e]">{page}</span> of{' '}
            <span className="font-semibold text-[#1a1a2e]">{totalPages}</span>
            <span className="text-gray-400 ml-2">({pagination.total} total)</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C8956C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} />
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C8956C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
