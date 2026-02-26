import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  User,
  Ban,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  X,
  AlertCircle,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Booking {
  id: string;
  client_id: string;
  scheduled_date: string;
  scheduled_time: string;
  estimated_duration: number | null;
  status: string;
  service_type: string | null;
  description: string | null;
  first_name: string;
  last_name: string;
  client_email: string;
}

interface ScheduleOverride {
  id: string;
  artist_id: string;
  override_date: string;
  is_available: boolean | number;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  created_at: string;
}

interface CalendarData {
  overrides: ScheduleOverride[];
  bookings: Booking[];
}

interface OverrideFormState {
  is_available: boolean;
  start_time: string;
  end_time: string;
  reason: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  deposit_paid: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-red-100 text-red-700',
  rescheduled: 'bg-gray-100 text-gray-600',
};

const STATUS_DOT_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400',
  confirmed: 'bg-blue-400',
  deposit_paid: 'bg-blue-400',
  in_progress: 'bg-indigo-400',
  completed: 'bg-green-400',
  cancelled: 'bg-red-400',
  no_show: 'bg-red-400',
  rescheduled: 'bg-gray-400',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

function formatTime(time: string | null): string {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${suffix}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-[#C8956C]/30 border-t-[#C8956C] rounded-full animate-spin" />
  );
}

interface BookingPillProps {
  booking: Booking;
}

function BookingPill({ booking }: BookingPillProps) {
  const dotColor = STATUS_DOT_COLORS[booking.status] ?? 'bg-gray-400';
  return (
    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#C8956C]/10 text-[#C8956C] text-[10px] font-medium leading-tight truncate">
      <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="truncate">{booking.first_name}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Day Detail Panel
// ---------------------------------------------------------------------------

interface DayDetailPanelProps {
  date: string;
  bookings: Booking[];
  overrides: ScheduleOverride[];
  onClose: () => void;
  onAddOverride: (form: OverrideFormState) => Promise<void>;
  onDeleteOverride: (id: string) => Promise<void>;
  submitting: boolean;
}

function DayDetailPanel({
  date,
  bookings,
  overrides,
  onClose,
  onAddOverride,
  onDeleteOverride,
  submitting,
}: DayDetailPanelProps) {
  const [form, setForm] = useState<OverrideFormState>({
    is_available: false,
    start_time: '',
    end_time: '',
    reason: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleSubmit = async () => {
    setFormError('');
    if (!form.is_available && !form.start_time && !form.reason) {
      // Blocking the whole day - OK, proceed
    }
    if (form.start_time && form.end_time && form.start_time >= form.end_time) {
      setFormError('End time must be after start time.');
      return;
    }
    await onAddOverride(form);
    setShowForm(false);
    setForm({ is_available: false, start_time: '', end_time: '', reason: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-[#1a1a2e] text-base">{displayDate}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} &bull; {overrides.length} override{overrides.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Bookings section */}
          {bookings.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Appointments
              </h4>
              <div className="space-y-2">
                {bookings.map((b) => (
                  <div key={b.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#C8956C]/10 flex items-center justify-center">
                          <User size={13} className="text-[#C8956C]" />
                        </div>
                        <p className="text-sm font-medium text-[#1a1a2e]">
                          {b.first_name} {b.last_name}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          STATUS_COLORS[b.status] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {b.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 pl-9">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatTime(b.scheduled_time)}
                        {b.estimated_duration ? ` (${b.estimated_duration}h)` : ''}
                      </span>
                      {b.service_type && (
                        <span className="flex items-center gap-1">
                          <CalendarDays size={11} />
                          {b.service_type}
                        </span>
                      )}
                    </div>
                    {b.description && (
                      <p className="mt-1.5 pl-9 text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {b.description}
                      </p>
                    )}
                    <p className="mt-1 pl-9 text-[11px] text-gray-400">{b.client_email}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Overrides section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Schedule Overrides
              </h4>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#C8956C]/10 text-[#C8956C] hover:bg-[#C8956C]/20 transition-colors"
                >
                  <Plus size={12} />
                  Add Override
                </button>
              )}
            </div>

            {overrides.length > 0 && (
              <div className="space-y-2 mb-3">
                {overrides.map((ov) => {
                  const isAvail = Boolean(ov.is_available);
                  return (
                    <div
                      key={ov.id}
                      className={`flex items-center justify-between rounded-xl border p-3 ${
                        isAvail
                          ? 'border-green-200 bg-green-50/60'
                          : 'border-red-200 bg-red-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isAvail ? (
                          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                        ) : (
                          <Ban size={16} className="text-red-500 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${isAvail ? 'text-green-800' : 'text-red-700'}`}>
                            {isAvail ? 'Marked Available' : 'Blocked Off'}
                          </p>
                          {(ov.start_time || ov.end_time) && (
                            <p className="text-xs text-gray-500">
                              {formatTime(ov.start_time)} {ov.end_time ? `– ${formatTime(ov.end_time)}` : ''}
                            </p>
                          )}
                          {ov.reason && (
                            <p className="text-xs text-gray-400 truncate">{ov.reason}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteOverride(ov.id)}
                        disabled={submitting}
                        className="ml-2 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors flex-shrink-0 disabled:opacity-40"
                        aria-label="Delete override"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {overrides.length === 0 && !showForm && (
              <p className="text-xs text-gray-400 py-2">No overrides for this day.</p>
            )}

            {/* Add Override Form */}
            {showForm && (
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-600">New Override</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setForm((f) => ({ ...f, is_available: false }))}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      !form.is_available
                        ? 'bg-red-50 border-red-300 text-red-600'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Ban size={12} />
                    Block Off
                  </button>
                  <button
                    onClick={() => setForm((f) => ({ ...f, is_available: true }))}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      form.is_available
                        ? 'bg-green-50 border-green-300 text-green-600'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    Mark Available
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Start time (optional)</label>
                    <input
                      type="time"
                      value={form.start_time}
                      onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#C8956C]/50 focus:border-[#C8956C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">End time (optional)</label>
                    <input
                      type="time"
                      value={form.end_time}
                      onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#C8956C]/50 focus:border-[#C8956C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Reason (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Personal appointment, Travel..."
                    value={form.reason}
                    onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#C8956C]/50 focus:border-[#C8956C]"
                  />
                </div>

                {formError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle size={12} />
                    {formError}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-[#C8956C] text-white hover:bg-[#b8845c] transition-colors disabled:opacity-50"
                  >
                    {submitting ? <Spinner /> : 'Save Override'}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormError('');
                    }}
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Empty state */}
          {bookings.length === 0 && overrides.length === 0 && !showForm && (
            <div className="text-center py-4">
              <CalendarDays size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Nothing scheduled for this day.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ArtistCalendarTab() {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [calendarData, setCalendarData] = useState<CalendarData>({ overrides: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  // Compute the first and last day strings for the visible month
  const startDate = formatDateStr(currentYear, currentMonth, 1);
  const endDate = formatDateStr(currentYear, currentMonth, getDaysInMonth(currentYear, currentMonth));

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
      const res = await fetch(`/api/artist/calendar?${params}`);
      const data = await res.json() as { success: boolean; data?: CalendarData; error?: string };
      if (data.success && data.data) {
        setCalendarData(data.data);
      } else {
        setError(data.error ?? 'Failed to load calendar data');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  // Navigation
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Build day index maps for fast lookup
  const bookingsByDate = calendarData.bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    const key = b.scheduled_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  const overridesByDate = calendarData.overrides.reduce<Record<string, ScheduleOverride[]>>((acc, ov) => {
    const key = ov.override_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ov);
    return acc;
  }, {});

  // API actions
  const handleAddOverride = async (form: OverrideFormState) => {
    if (!selectedDate) return;
    setSubmitting(true);
    setActionError('');
    try {
      const body: Record<string, unknown> = {
        override_date: selectedDate,
        is_available: form.is_available,
      };
      if (form.start_time) body.start_time = form.start_time;
      if (form.end_time) body.end_time = form.end_time;
      if (form.reason) body.reason = form.reason;

      const res = await fetch('/api/artist/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (!data.success) {
        setActionError(data.error ?? 'Failed to add override');
      } else {
        await fetchCalendar();
      }
    } catch {
      setActionError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOverride = async (id: string) => {
    setSubmitting(true);
    setActionError('');
    try {
      const res = await fetch('/api/artist/calendar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (!data.success) {
        setActionError(data.error ?? 'Failed to delete override');
      } else {
        await fetchCalendar();
      }
    } catch {
      setActionError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calendar grid calculations
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth); // 0 = Sunday

  const todayStr = formatDateStr(now.getFullYear(), now.getMonth(), now.getDate());
  const isCurrentMonthView = currentYear === now.getFullYear() && currentMonth === now.getMonth();

  return (
    <div className="space-y-4">
      {/* Calendar card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Calendar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-base font-semibold text-[#1a1a2e] min-w-[160px] text-center">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={goToNextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isCurrentMonthView && (
              <button
                onClick={goToToday}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Today
              </button>
            )}
            <button
              onClick={fetchCalendar}
              disabled={loading}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#C8956C]/10 hover:text-[#C8956C] transition-colors disabled:opacity-40"
              aria-label="Refresh calendar"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 px-5 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {actionError && (
          <div className="flex items-center gap-2 px-5 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600">
            <AlertCircle size={15} />
            {actionError}
          </div>
        )}

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAY_HEADERS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {/* Leading empty cells */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-start-${i}`} className="min-h-[90px] border-b border-r border-gray-50" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dateStr = formatDateStr(currentYear, currentMonth, day);
              const dayBookings = bookingsByDate[dateStr] ?? [];
              const dayOverrides = overridesByDate[dateStr] ?? [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const hasContent = dayBookings.length > 0 || dayOverrides.length > 0;

              // Determine if this day is blocked (any non-available override present)
              const hasBlock = dayOverrides.some((ov) => !Boolean(ov.is_available));
              const hasAvailMark = dayOverrides.some((ov) => Boolean(ov.is_available));

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`
                    min-h-[90px] p-1.5 border-b border-r border-gray-100 text-left
                    flex flex-col gap-1 transition-colors duration-100
                    ${isSelected
                      ? 'bg-[#C8956C]/8 ring-2 ring-inset ring-[#C8956C]/40'
                      : hasContent
                        ? 'hover:bg-[#C8956C]/5 cursor-pointer'
                        : 'hover:bg-gray-50 cursor-pointer'
                    }
                  `}
                  aria-label={`${dateStr}${isToday ? ', today' : ''}${hasContent ? `, ${dayBookings.length} booking(s)` : ''}`}
                >
                  {/* Day number */}
                  <span
                    className={`
                      w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold flex-shrink-0
                      ${isToday
                        ? 'bg-[#C8956C] text-white'
                        : isSelected
                          ? 'text-[#C8956C]'
                          : 'text-[#1a1a2e]'
                      }
                    `}
                  >
                    {day}
                  </span>

                  {/* Override indicators */}
                  <div className="flex flex-col gap-0.5 w-full">
                    {hasBlock && (
                      <div className="flex items-center gap-1 px-1 py-0.5 rounded bg-red-100 text-red-600 text-[9px] font-medium">
                        <Ban size={8} />
                        <span>Off</span>
                      </div>
                    )}
                    {hasAvailMark && !hasBlock && (
                      <div className="flex items-center gap-1 px-1 py-0.5 rounded bg-green-100 text-green-700 text-[9px] font-medium">
                        <CheckCircle2 size={8} />
                        <span>Avail</span>
                      </div>
                    )}

                    {/* Booking pills — show up to 2, then +N more */}
                    {dayBookings.slice(0, 2).map((b) => (
                      <BookingPill key={b.id} booking={b} />
                    ))}
                    {dayBookings.length > 2 && (
                      <span className="text-[9px] text-gray-400 font-medium px-1">
                        +{dayBookings.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Trailing empty cells to complete the last row */}
            {(() => {
              const totalCells = firstDayOfWeek + daysInMonth;
              const remainder = totalCells % 7;
              const trailing = remainder === 0 ? 0 : 7 - remainder;
              return Array.from({ length: trailing }).map((_, i) => (
                <div key={`empty-end-${i}`} className="min-h-[90px] border-b border-r border-gray-50" />
              ));
            })()}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8956C]" />
            Today
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2.5 h-2.5 rounded bg-yellow-400" />
            Pending
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2.5 h-2.5 rounded bg-blue-400" />
            Confirmed
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2.5 h-2.5 rounded bg-green-400" />
            Completed
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <Ban size={10} className="text-red-500" />
            Blocked
          </div>
          <div className="ml-auto text-[11px] text-gray-400">
            Click any day to view details or manage overrides
          </div>
        </div>
      </div>

      {/* Upcoming bookings strip */}
      {!loading && calendarData.bookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-[#1a1a2e] mb-3">
            This Month — {calendarData.bookings.length} Appointment{calendarData.bookings.length !== 1 ? 's' : ''}
          </h3>
          <div className="space-y-2">
            {calendarData.bookings
              .slice()
              .sort((a, b) => {
                const dateCompare = a.scheduled_date.localeCompare(b.scheduled_date);
                if (dateCompare !== 0) return dateCompare;
                return (a.scheduled_time ?? '').localeCompare(b.scheduled_time ?? '');
              })
              .map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedDate(b.scheduled_date)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-[#C8956C]/5 hover:border-[#C8956C]/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#C8956C]/10 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-[#C8956C]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1a1a2e] truncate">
                        {b.first_name} {b.last_name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {b.service_type ?? 'Service'} &bull; {b.client_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <div className="text-right">
                      <p className="text-xs font-medium text-[#1a1a2e]">{b.scheduled_date}</p>
                      <p className="text-xs text-gray-400">{formatTime(b.scheduled_time)}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium hidden sm:inline-flex ${
                        STATUS_COLORS[b.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {b.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Day Detail Panel (modal) */}
      {selectedDate && (
        <DayDetailPanel
          date={selectedDate}
          bookings={bookingsByDate[selectedDate] ?? []}
          overrides={overridesByDate[selectedDate] ?? []}
          onClose={() => setSelectedDate(null)}
          onAddOverride={handleAddOverride}
          onDeleteOverride={handleDeleteOverride}
          submitting={submitting}
        />
      )}
    </div>
  );
}
