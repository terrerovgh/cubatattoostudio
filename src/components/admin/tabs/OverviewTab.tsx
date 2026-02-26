import { useState, useEffect } from 'react';
import {
  CalendarDays,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle,
  BarChart2,
  Loader2,
  User,
  RefreshCw,
} from 'lucide-react';
import type { DashboardStats } from '../../../types/booking';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RevenueByArtist {
  artist_id: string;
  revenue: number;
  bookings: number;
}

interface BookingByStatus {
  status: string;
  count: number;
}

interface RecentBooking {
  id: string;
  first_name: string;
  last_name: string;
  artist_id: string;
  service_type: string;
  scheduled_date: string;
  status: string;
}

interface AnalyticsData {
  stats: DashboardStats;
  revenue_by_artist: RecentBooking[];
  bookings_by_status: BookingByStatus[];
  recent_bookings: RecentBooking[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function capitalize(str: string): string {
  if (!str) return '—';
  return str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
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
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {capitalize(status)}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: string;
}

function StatCard({ label, value, icon: Icon, accent = 'text-gray-400' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <div className={`${accent}`}>
          <Icon size={16} strokeWidth={1.75} />
        </div>
      </div>
      <p className="text-xl font-bold text-[#1a1a2e] leading-none">{value}</p>
    </div>
  );
}

// ─── Revenue Bar ──────────────────────────────────────────────────────────────

function RevenueBar({
  artistId,
  revenue,
  bookings,
  maxRevenue,
}: {
  artistId: string;
  revenue: number;
  bookings: number;
  maxRevenue: number;
}) {
  const pct = maxRevenue > 0 ? Math.round((revenue / maxRevenue) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-20 text-sm font-medium text-[#1a1a2e] capitalize shrink-0 truncate">
        {capitalize(artistId)}
      </span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-[#C8956C] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-20 text-sm font-semibold text-[#1a1a2e] text-right shrink-0">
        {formatCurrency(revenue)}
      </span>
      <span className="w-16 text-xs text-gray-400 text-right shrink-0">
        {bookings} {bookings === 1 ? 'booking' : 'bookings'}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OverviewTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/analytics');
      const json = (await res.json()) as { success: boolean; data?: AnalyticsData; error?: string };
      if (!json.success || !json.data) {
        throw new Error(json.error ?? 'Failed to load analytics');
      }
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#C8956C]" />
          <p className="text-sm text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={22} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a2e]">Could not load analytics</p>
            <p className="text-xs text-gray-500 mt-1">{error ?? 'Unknown error'}</p>
          </div>
          <button
            onClick={() => void fetchData()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#2a2a4e] transition-colors"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, revenue_by_artist, recent_bookings } = data;
  const maxRevenue = Math.max(...(revenue_by_artist as unknown as RevenueByArtist[]).map((a) => a.revenue), 1);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1a1a2e]">Business Overview</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Stats and activity as of {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => void fetchData()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C8956C] transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Bookings"
          value={stats.total_bookings.toLocaleString()}
          icon={CalendarDays}
          accent="text-[#C8956C]"
        />
        <StatCard
          label="Today"
          value={stats.bookings_today}
          icon={Clock}
          accent="text-blue-400"
        />
        <StatCard
          label="Revenue (Month)"
          value={formatCurrency(stats.revenue_month)}
          icon={TrendingUp}
          accent="text-emerald-500"
        />
        <StatCard
          label="Revenue (Today)"
          value={formatCurrency(stats.revenue_today)}
          icon={DollarSign}
          accent="text-emerald-400"
        />
        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</span>
            <AlertCircle size={16} strokeWidth={1.75} className="text-amber-400" />
          </div>
          <p className="text-xl font-bold text-amber-600 leading-none">{stats.pending_bookings}</p>
        </div>
        <StatCard
          label="Avg Value"
          value={formatCurrency(stats.avg_booking_value)}
          icon={BarChart2}
          accent="text-violet-400"
        />
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">No-Show Rate</span>
            <BarChart2 size={16} strokeWidth={1.75} className="text-red-300" />
          </div>
          <p className="text-xl font-bold text-[#1a1a2e] leading-none">
            {(stats.no_show_rate * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Top Artist</span>
            <User size={16} strokeWidth={1.75} className="text-[#C8956C]" />
          </div>
          <p className="text-xl font-bold text-[#1a1a2e] leading-none capitalize">
            {capitalize(stats.top_artist)}
          </p>
        </div>
      </div>

      {/* Revenue by Artist */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-[#1a1a2e]">Revenue by Artist</h3>
          <span className="text-xs text-gray-400">Excluding cancelled bookings</span>
        </div>
        {(revenue_by_artist as unknown as RevenueByArtist[]).length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No revenue data available.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {(revenue_by_artist as unknown as RevenueByArtist[])
              .sort((a, b) => b.revenue - a.revenue)
              .map((artist) => (
                <RevenueBar
                  key={artist.artist_id}
                  artistId={artist.artist_id}
                  revenue={artist.revenue}
                  bookings={artist.bookings}
                  maxRevenue={maxRevenue}
                />
              ))}
          </div>
        )}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1a1a2e]">Recent Bookings</h3>
          <span className="text-xs text-gray-400">Last 10 created</span>
        </div>
        {recent_bookings.length === 0 ? (
          <p className="text-sm text-gray-400 py-10 text-center">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Client
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                    Artist
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                    Service
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent_bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-3 font-medium text-[#1a1a2e] whitespace-nowrap">
                      {booking.first_name} {booking.last_name}
                    </td>
                    <td className="px-6 py-3 text-gray-600 capitalize whitespace-nowrap hidden sm:table-cell">
                      {capitalize(booking.artist_id)}
                    </td>
                    <td className="px-6 py-3 text-gray-600 whitespace-nowrap hidden md:table-cell">
                      {capitalize(booking.service_type)}
                    </td>
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap hidden lg:table-cell">
                      {formatDate(booking.scheduled_date)}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
