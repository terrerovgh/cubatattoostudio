import { useState, useEffect, useMemo, useCallback } from 'react';
import type { BookingFormData, CalendarDay, TimeSlot } from '../../types/booking';
import { estimateDuration, getDateModifier, getTimeModifier } from '../../lib/pricing';

interface Props {
  form: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  accentColor?: string;
}

// Artist schedules — sourced from content collections
const ARTIST_SCHEDULES: Record<string, Record<string, { start: string; end: string } | null>> = {
  david: {
    monday: { start: '10:00', end: '18:00' },
    tuesday: { start: '10:00', end: '18:00' },
    wednesday: null,
    thursday: { start: '10:00', end: '18:00' },
    friday: { start: '10:00', end: '18:00' },
    saturday: { start: '11:00', end: '16:00' },
    sunday: null,
  },
  karli: {
    monday: { start: '10:00', end: '18:00' },
    tuesday: null,
    wednesday: { start: '10:00', end: '18:00' },
    thursday: { start: '10:00', end: '18:00' },
    friday: { start: '10:00', end: '18:00' },
    saturday: { start: '11:00', end: '15:00' },
    sunday: null,
  },
  nina: {
    monday: { start: '11:00', end: '19:00' },
    tuesday: { start: '11:00', end: '19:00' },
    wednesday: { start: '11:00', end: '19:00' },
    thursday: null,
    friday: { start: '11:00', end: '19:00' },
    saturday: { start: '12:00', end: '17:00' },
    sunday: null,
  },
};

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getCalendarDay(date: Date, artistId: string): CalendarDay {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  const dayName = DAY_NAMES[date.getDay()];
  const schedule = ARTIST_SCHEDULES[artistId];
  const daySchedule = schedule?.[dayName];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isPast = dateOnly < today;

  // Max 90 days forward
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  const isTooFar = dateOnly > maxDate;

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  if (isPast || isTooFar) {
    return { date: dateStr, status: 'past', slotsAvailable: 0, isWeekend, isToday: false, priceModifier: 1 };
  }

  if (!daySchedule) {
    return { date: dateStr, status: 'closed', slotsAvailable: 0, isWeekend, isToday: dateOnly.getTime() === today.getTime(), priceModifier: 1 };
  }

  // Simulate availability — in production, this would come from the API
  const slotsAvailable = Math.floor(Math.random() * 6) + 1;
  const status = slotsAvailable > 3 ? 'open' : slotsAvailable > 0 ? 'limited' : 'full';
  const dm = getDateModifier(dateStr);

  return {
    date: dateStr,
    status,
    slotsAvailable,
    isWeekend,
    isToday: dateOnly.getTime() === today.getTime(),
    priceModifier: dm.modifier,
  };
}

function generateTimeSlots(date: string, artistId: string, estimatedDurationMin: number): TimeSlot[] {
  const d = new Date(date);
  const dayName = DAY_NAMES[d.getDay()];
  const schedule = ARTIST_SCHEDULES[artistId]?.[dayName];
  if (!schedule) return [];

  const startHour = parseInt(schedule.start.split(':')[0]);
  const endHour = parseInt(schedule.end.split(':')[0]);
  const slots: TimeSlot[] = [];

  for (let h = startHour; h < endHour; h++) {
    // Duration-aware blocking: don't show slot if tattoo won't finish before closing
    const slotEndHour = h + Math.ceil(estimatedDurationMin / 60);
    if (slotEndHour > endHour) continue;

    const time = `${String(h).padStart(2, '0')}:00`;
    const tm = getTimeModifier(time);
    const period: 'morning' | 'afternoon' | 'evening' = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';

    slots.push({
      time,
      available: Math.random() > 0.2, // Simulated — would be from API
      price_modifier: tm.modifier,
      period,
    });
  }

  return slots;
}

export function StepSchedule({ form, updateForm, onNext, onBack, accentColor = '#C8956C' }: Props) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const estimatedDuration = useMemo(() =>
    estimateDuration(
      form.size_category || 'medium',
      form.style || form.service_type,
      form.is_cover_up
    ),
    [form.size_category, form.style, form.service_type, form.is_cover_up]
  );

  const calendarDays = useMemo(() => {
    const days = getDaysInMonth(currentYear, currentMonth);
    return days.map(d => getCalendarDay(d, form.artist_id));
  }, [currentYear, currentMonth, form.artist_id]);

  // First day offset for grid alignment
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    if (form.scheduled_date && form.artist_id) {
      setTimeSlots(generateTimeSlots(form.scheduled_date, form.artist_id, estimatedDuration));
    }
  }, [form.scheduled_date, form.artist_id, estimatedDuration]);

  const navigateMonth = useCallback((dir: number) => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }

    // Don't go before current month
    const now = new Date();
    if (y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth())) return;
    // Don't go more than 3 months ahead
    const maxMonth = now.getMonth() + 3;
    const maxYear = now.getFullYear() + Math.floor(maxMonth / 12);
    const maxM = maxMonth % 12;
    if (y > maxYear || (y === maxYear && m > maxM)) return;

    setCurrentMonth(m);
    setCurrentYear(y);
  }, [currentMonth, currentYear]);

  const canProceed = form.scheduled_date && form.scheduled_time;

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  };

  const formatTime = (t: string) => {
    const h = parseInt(t.split(':')[0]);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12}:00 ${ampm}`;
  };

  const statusColors: Record<string, string> = {
    open: '#4ADE80',
    limited: '#FBBF24',
    full: '#F87171',
    closed: 'rgba(255,255,255,0.06)',
    past: 'transparent',
  };

  const morningSlots = timeSlots.filter(s => s.period === 'morning');
  const afternoonSlots = timeSlots.filter(s => s.period === 'afternoon');
  const eveningSlots = timeSlots.filter(s => s.period === 'evening');

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          Pick Your Date & Time
        </h2>
        <p className="text-white/45 text-sm">
          Estimated session: <span className="text-white/70 font-medium">{formatDuration(estimatedDuration)}</span>
        </p>
      </div>

      {/* Calendar */}
      <div className="liquid-glass-elevated rounded-2xl p-4 sm:p-5">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-white">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_HEADERS.map(d => (
            <div key={d} className="text-center text-xs text-white/30 py-1 font-medium">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {calendarDays.map(day => {
            const dateNum = parseInt(day.date.split('-')[2]);
            const isSelected = form.scheduled_date === day.date;
            const isClickable = day.status === 'open' || day.status === 'limited';

            return (
              <button
                key={day.date}
                onClick={() => isClickable && updateForm({ scheduled_date: day.date, scheduled_time: '' })}
                disabled={!isClickable}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                  isSelected
                    ? 'ring-2 bg-white/10 font-bold text-white'
                    : isClickable
                    ? 'hover:bg-white/5 text-white/80 cursor-pointer'
                    : 'text-white/15 cursor-not-allowed'
                } ${day.isToday ? 'font-bold' : ''}`}
                style={{
                  ringColor: isSelected ? accentColor : undefined,
                }}
              >
                {/* Day number */}
                <span>{dateNum}</span>

                {/* Status dot */}
                {day.status !== 'past' && (
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-0.5"
                    style={{ background: statusColors[day.status] }}
                  />
                )}

                {/* Weekend badge */}
                {day.isWeekend && isClickable && (
                  <span className="absolute -top-0.5 -right-0.5 text-[8px] text-amber-400 font-bold">+15%</span>
                )}

                {/* Today indicator */}
                {day.isToday && (
                  <div className="absolute -bottom-0.5 w-3 h-0.5 rounded-full" style={{ background: accentColor }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-white/30">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400" /> Open</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400" /> Limited</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /> Full</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white/10" /> Closed</span>
        </div>
      </div>

      {/* Time Slots */}
      {form.scheduled_date && timeSlots.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Available Times</h3>

          {morningSlots.length > 0 && (
            <div>
              <p className="text-xs text-white/30 mb-2">☀️ Morning</p>
              <div className="flex flex-wrap gap-2">
                {morningSlots.map(slot => (
                  <TimeSlotButton
                    key={slot.time}
                    slot={slot}
                    isSelected={form.scheduled_time === slot.time}
                    accentColor={accentColor}
                    onClick={() => slot.available && updateForm({ scheduled_time: slot.time })}
                  />
                ))}
              </div>
            </div>
          )}

          {afternoonSlots.length > 0 && (
            <div>
              <p className="text-xs text-white/30 mb-2">🌤 Afternoon</p>
              <div className="flex flex-wrap gap-2">
                {afternoonSlots.map(slot => (
                  <TimeSlotButton
                    key={slot.time}
                    slot={slot}
                    isSelected={form.scheduled_time === slot.time}
                    accentColor={accentColor}
                    onClick={() => slot.available && updateForm({ scheduled_time: slot.time })}
                  />
                ))}
              </div>
            </div>
          )}

          {eveningSlots.length > 0 && (
            <div>
              <p className="text-xs text-white/30 mb-2">🌙 Evening</p>
              <div className="flex flex-wrap gap-2">
                {eveningSlots.map(slot => (
                  <TimeSlotButton
                    key={slot.time}
                    slot={slot}
                    isSelected={form.scheduled_time === slot.time}
                    accentColor={accentColor}
                    onClick={() => slot.available && updateForm({ scheduled_time: slot.time })}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {form.scheduled_date && timeSlots.length === 0 && (
        <p className="text-sm text-white/30 text-center py-4">No available time slots for this date</p>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-4 sm:py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            canProceed
              ? 'text-black hover:brightness-110 active:scale-[0.98]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          style={canProceed ? { background: accentColor } : undefined}
        >
          Continue to Your Info →
        </button>
      </div>
    </div>
  );
}

function TimeSlotButton({ slot, isSelected, accentColor, onClick }: {
  slot: TimeSlot;
  isSelected: boolean;
  accentColor: string;
  onClick: () => void;
}) {
  const formatTime = (t: string) => {
    const h = parseInt(t.split(':')[0]);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12}:00 ${ampm}`;
  };

  return (
    <button
      onClick={onClick}
      disabled={!slot.available}
      className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        isSelected
          ? 'text-black'
          : slot.available
          ? 'bg-white/5 text-white/70 hover:bg-white/10'
          : 'bg-white/[0.02] text-white/15 cursor-not-allowed line-through'
      }`}
      style={isSelected ? {
        background: accentColor,
      } : undefined}
    >
      {formatTime(slot.time)}
      {slot.price_modifier > 1 && slot.available && !isSelected && (
        <span className="ml-1 text-xs text-amber-400">+20%</span>
      )}
    </button>
  );
}
