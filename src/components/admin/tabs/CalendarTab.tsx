import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, CalendarDays } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendarBooking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  artist_id: string;
  first_name: string;
  last_name: string;
  status: string;
}

type ArtistFilter = 'all' | 'david' | 'nina' | 'karli';

// ─── Constants ────────────────────────────────────────────────────────────────

const ARTIST_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; text: string }> = {
  david: {
    label: 'David',
    color: '#C8956C',
    bg: 'bg-[#C8956C]/15',
    border: 'border-[#C8956C]/40',
    text: 'text-[#9E7048]',
  },
  nina: {
    label: 'Nina',
    color: '#8B5CF6',
    bg: 'bg-[#8B5CF6]/12',
    border: 'border-[#8B5CF6]/35',
    text: 'text-[#7C3AED]',
  },
  karli: {
    label: 'Karli',
    color: '#3B82F6',
    bg: 'bg-[#3B82F6]/12',
    border: 'border-[#3B82F6]/35',
    text: 'text-[#2563EB]',
  },
};

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  deposit_paid: 'bg-sky-100 text-sky-700',
  in_progress: 'bg-violet-100 text-violet-700',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
  no_show: 'bg-red-50 text-red-500',
  rescheduled: 'bg-orange-100 text-orange-600',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISODate(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Returns ISO YYYY-MM-DD for today in local time. */
function todayISO(): string {
  const t = new Date();
  return toISODate(t.getFullYear(), t.getMonth(), t.getDate());
}

/** Format "09:30" -> "9:30" */
function fmtTime(t: string): string {
  const [h, m] = t.split(':');
  return `${parseInt(h, 10)}:${m}`;
}

/** Shorten client name: "María Rodríguez" -> "María R." */
function shortName(first: string, last: string): string {
  return `${first} ${last.charAt(0).toUpperCase()}.`;
}

/**
 * Build a 6-week (42 cell) grid for a given month.
 * Each cell: { date: YYYY-MM-DD | null, day: number, inMonth: boolean }
 */
interface CalCell {
  date: string;
  day: number;
  inMonth: boolean;
}

function buildCalendarGrid(year: number, month: number): CalCell[] {
  const cells: CalCell[] = [];

  // First day of month (0=Sun … 6=Sat), convert to Mon-based (0=Mon … 6=Sun)
  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = (firstDow + 6) % 7; // Mon = 0

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Prefix cells from previous month
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    cells.push({ date: toISODate(year, month - 1, d), day: d, inMonth: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: toISODate(year, month, d), day: d, inMonth: true });
  }

  // Suffix cells from next month to fill 42 slots (6 rows)
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: toISODate(year, month + 1, d), day: d, inMonth: false });
  }

  return cells;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface BookingPillProps {
  booking: CalendarBooking;
}

function BookingPill({ booking }: BookingPillProps) {
  const artistKey = booking.artist_id.toLowerCase() as keyof typeof ARTIST_CONFIG;
  const config = ARTIST_CONFIG[artistKey] ?? ARTIST_CONFIG['david'];

  return (
    <div
      title={`${booking.first_name} ${booking.last_name} — ${booking.scheduled_time} (${booking.status})`}
      className={`
        flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium
        border truncate min-w-0
        ${config.bg} ${config.border} ${config.text}
      `}
    >
      <span className="shrink-0 w-1 h-1 rounded-full inline-block" style={{ backgroundColor: config.color }} />
      <span className="truncate">{fmtTime(booking.scheduled_time)}</span>
      <span className="truncate hidden sm:inline">{shortName(booking.first_name, booking.last_name)}</span>
    </div>
  );
}

interface ArtistToggleProps {
  value: ArtistFilter;
  onChange: (v: ArtistFilter) => void;
}

function ArtistToggle({ value, onChange }: ArtistToggleProps) {
  const filters: { id: ArtistFilter; label: string; accent?: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'david', label: 'David', accent: '#C8956C' },
    { id: 'nina', label: 'Nina', accent: '#8B5CF6' },
    { id: 'karli', label: 'Karli', accent: '#3B82F6' },
  ];

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {filters.map((f) => {
        const active = value === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150
              ${active
                ? 'border-transparent text-white shadow-sm'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
            style={active ? { backgroundColor: f.accent ?? '#1a1a2e' } : undefined}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CalendarTab() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [filter, setFilter] = useState<ArtistFilter>('all');
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayStr = todayISO();
  const cells = buildCalendarGrid(year, month);

  // Date range for the displayed grid
  const firstCell = cells[0].date;
  const lastCell = cells[cells.length - 1].date;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        date_from: firstCell,
        date_to: lastCell,
        limit: '200',
      });
      if (filter !== 'all') {
        params.set('artist_id', filter);
      }
      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as {
        success: boolean;
        data?: { bookings: CalendarBooking[] };
        error?: string;
      };
      if (!json.success) throw new Error(json.error ?? 'Failed to load bookings');
      setBookings(json.data?.bookings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, filter]);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else { setMonth(m => m - 1); }
    setSelectedDate(null);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else { setMonth(m => m + 1); }
    setSelectedDate(null);
  }

  // Group bookings by date for O(1) lookup
  const byDate = bookings.reduce<Record<string, CalendarBooking[]>>((acc, b) => {
    const d = b.scheduled_date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(b);
    return acc;
  }, {});

  // Selected date detail
  const selectedBookings = selectedDate ? (byDate[selectedDate] ?? []) : [];

  return (
    <div className="space-y-5">
      {/* ── Header card ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Month nav */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-lg font-semibold text-[#1a1a2e] min-w-[160px] text-center">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              aria-label="Next month"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            {loading && <Loader2 size={15} className="text-[#C8956C] animate-spin ml-1" />}
          </div>

          {/* Artist filter */}
          <div className="sm:ml-auto">
            <ArtistToggle value={filter} onChange={setFilter} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* ── Calendar grid ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Day cells — 6 rows */}
        <div className="grid grid-cols-7">
          {cells.map((cell, idx) => {
            const cellBookings = byDate[cell.date] ?? [];
            const isToday = cell.date === todayStr;
            const isSelected = cell.date === selectedDate;
            const isWeekend = idx % 7 >= 5;

            return (
              <button
                key={cell.date}
                onClick={() => setSelectedDate(isSelected ? null : cell.date)}
                className={`
                  relative min-h-[80px] sm:min-h-[96px] p-1.5 sm:p-2 text-left border-b border-r border-gray-100
                  transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8956C]/40
                  last:border-r-0
                  ${!cell.inMonth ? 'bg-gray-50/60' : isWeekend ? 'bg-orange-50/20' : 'bg-white'}
                  ${isSelected ? 'ring-2 ring-inset ring-[#C8956C]/50 bg-[#C8956C]/5' : 'hover:bg-gray-50'}
                `}
              >
                {/* Date number */}
                <span
                  className={`
                    inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1
                    ${isToday
                      ? 'bg-[#C8956C] text-white ring-2 ring-[#C8956C]/30'
                      : cell.inMonth
                        ? 'text-[#1a1a2e]'
                        : 'text-gray-300'
                    }
                  `}
                >
                  {cell.day}
                </span>

                {/* Booking pills */}
                <div className="space-y-0.5 overflow-hidden">
                  {cellBookings.slice(0, 3).map((b) => (
                    <BookingPill key={b.id} booking={b} />
                  ))}
                  {cellBookings.length > 3 && (
                    <div className="text-[10px] text-gray-400 font-medium px-1">
                      +{cellBookings.length - 3} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Selected day detail panel ── */}
      {selectedDate !== null && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[#C8956C]" />
              <h3 className="font-semibold text-[#1a1a2e] text-sm">
                {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                {selectedBookings.length} {selectedBookings.length === 1 ? 'booking' : 'bookings'}
              </span>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
            >
              Close
            </button>
          </div>

          {selectedBookings.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              No bookings on this day
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {selectedBookings
                .slice()
                .sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time))
                .map((b) => {
                  const artistKey = b.artist_id.toLowerCase() as keyof typeof ARTIST_CONFIG;
                  const config = ARTIST_CONFIG[artistKey] ?? ARTIST_CONFIG['david'];
                  const statusCls = STATUS_COLORS[b.status] ?? 'bg-gray-100 text-gray-500';

                  return (
                    <li key={b.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                      {/* Artist color bar */}
                      <div
                        className="w-1 h-10 rounded-full shrink-0"
                        style={{ backgroundColor: config.color }}
                      />

                      {/* Time */}
                      <div className="w-14 shrink-0">
                        <span className="text-sm font-semibold text-[#1a1a2e]">
                          {fmtTime(b.scheduled_time)}
                        </span>
                      </div>

                      {/* Client */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1a1a2e] truncate">
                          {b.first_name} {b.last_name}
                        </p>
                        <p className={`text-xs font-medium mt-0.5 ${config.text}`}>
                          {config.label}
                        </p>
                      </div>

                      {/* Status */}
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusCls}`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      )}

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 flex-wrap px-1">
        {Object.entries(ARTIST_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
            <span className="text-xs text-gray-500">{cfg.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2">
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#C8956C] text-white text-[10px] font-bold">7</span>
          <span className="text-xs text-gray-500">Today</span>
        </div>
      </div>
    </div>
  );
}
