import { useState, useEffect, useMemo } from 'react';
import type { BookingFormData, PriceEstimate, TimeSlot } from '../../types/booking';
import { getDateModifier, getTimeModifier } from '../../lib/pricing';

interface Props {
  form: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  priceEstimate: PriceEstimate | null;
  onNext: () => void;
  onBack: () => void;
}

// Artist schedules (synced with content/artists/*.md)
const ARTIST_SCHEDULES: Record<string, Record<string, { start: string; end: string } | null>> = {
  david: {
    monday: null,
    tuesday: { start: '11:00', end: '19:00' },
    wednesday: { start: '11:00', end: '19:00' },
    thursday: { start: '11:00', end: '19:00' },
    friday: { start: '11:00', end: '19:00' },
    saturday: { start: '11:00', end: '19:00' },
    sunday: null,
  },
  nina: {
    monday: null,
    tuesday: { start: '11:00', end: '19:00' },
    wednesday: { start: '11:00', end: '19:00' },
    thursday: { start: '11:00', end: '19:00' },
    friday: { start: '11:00', end: '19:00' },
    saturday: { start: '11:00', end: '17:00' },
    sunday: null,
  },
  karli: {
    monday: null,
    tuesday: { start: '11:00', end: '19:00' },
    wednesday: { start: '11:00', end: '19:00' },
    thursday: { start: '11:00', end: '19:00' },
    friday: { start: '11:00', end: '19:00' },
    saturday: { start: '11:00', end: '17:00' },
    sunday: null,
  },
};

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function generateTimeSlots(start: string, end: string, intervalMinutes: number = 60): string[] {
  const slots: string[] = [];
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  let current = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (current + intervalMinutes <= endMinutes) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    current += intervalMinutes;
  }

  return slots;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

export function StepCalendar({ form, updateForm, priceEstimate, onNext, onBack }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const schedule = ARTIST_SCHEDULES[form.artist_id] || ARTIST_SCHEDULES.david;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calendar data
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ date: Date; dayNum: number; isAvailable: boolean; isToday: boolean; isPast: boolean }> = [];

    // Empty days for padding
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: new Date(year, month, -firstDay + i + 1), dayNum: 0, isAvailable: false, isToday: false, isPast: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayName = DAY_NAMES[date.getDay()];
      const isPast = date < today;
      const hasSchedule = schedule[dayName] !== null;

      days.push({
        date,
        dayNum: d,
        isAvailable: !isPast && hasSchedule,
        isToday: date.toDateString() === today.toDateString(),
        isPast,
      });
    }

    return days;
  }, [currentMonth, schedule]);

  // Load available slots when date changes
  useEffect(() => {
    if (!form.scheduled_date) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);

    // Fetch availability from API (or compute locally)
    const date = new Date(form.scheduled_date);
    const dayName = DAY_NAMES[date.getDay()];
    const daySchedule = schedule[dayName];

    if (!daySchedule) {
      setAvailableSlots([]);
      setLoadingSlots(false);
      return;
    }

    const times = generateTimeSlots(daySchedule.start, daySchedule.end, 60);
    const dateStr = form.scheduled_date;

    const slots: TimeSlot[] = times.map((time) => {
      const dateMod = getDateModifier(dateStr);
      const timeMod = getTimeModifier(time);
      return {
        time,
        available: true, // TODO: check against existing bookings via API
        price_modifier: dateMod.modifier * timeMod.modifier,
      };
    });

    // Simulate a brief loading state
    setTimeout(() => {
      setAvailableSlots(slots);
      setLoadingSlots(false);
    }, 200);
  }, [form.scheduled_date, form.artist_id, schedule]);

  const selectDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    updateForm({ scheduled_date: dateStr, scheduled_time: '' });
  };

  const isSelectedDate = (date: Date) => {
    return form.scheduled_date === date.toISOString().split('T')[0];
  };

  const canProceed = form.scheduled_date && form.scheduled_time;

  return (
    <div className="space-y-8">
      {/* Client Info */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Your Information</h3>
        <p className="text-white/50 text-sm mb-6">We need a few details to confirm your appointment</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">First Name *</label>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => updateForm({ first_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#C8956C]/50"
              placeholder="Your first name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Last Name *</label>
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => updateForm({ last_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#C8956C]/50"
              placeholder="Your last name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateForm({ email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#C8956C]/50"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Phone *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateForm({ phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#C8956C]/50"
              placeholder="(505) 000-0000"
            />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Choose a Date</h3>
        <p className="text-white/50 text-sm mb-6">
          {form.artist_id && <>Available times for <span className="text-[#C8956C] capitalize">{form.artist_id}</span></>}
          {' '}• Tue-Sat, 11am-7pm
        </p>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              ‹
            </button>
            <h4 className="text-lg font-bold text-white">
              {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              ›
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAY_LABELS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-white/30 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => (
              <button
                key={i}
                onClick={() => day.isAvailable && selectDate(day.date)}
                disabled={!day.isAvailable || day.dayNum === 0}
                className={`
                  aspect-square rounded-xl flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${day.dayNum === 0 ? 'invisible' : ''}
                  ${isSelectedDate(day.date)
                    ? 'bg-[#C8956C] text-black font-bold'
                    : day.isToday
                      ? 'bg-[#C8956C]/10 text-[#C8956C] ring-1 ring-[#C8956C]/30'
                      : day.isAvailable
                        ? 'text-white/80 hover:bg-white/10 cursor-pointer'
                        : 'text-white/15 cursor-not-allowed'
                  }
                `}
              >
                {day.dayNum || ''}
              </button>
            ))}
          </div>

          {/* Weekend pricing note */}
          <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
            <div className="w-3 h-3 rounded bg-[#C8956C]/20 border border-[#C8956C]/30" />
            <span>Saturday: +15% weekend rate</span>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      {form.scheduled_date && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">
            Available Times — {new Date(form.scheduled_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>

          {loadingSlots ? (
            <div className="flex items-center justify-center py-12 text-white/40">
              <div className="w-5 h-5 border-2 border-[#C8956C]/30 border-t-[#C8956C] rounded-full animate-spin mr-3" />
              Loading available times...
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="text-center py-8 text-white/40">No available slots for this date</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => {
                    if (slot.available) {
                      updateForm({ scheduled_time: slot.time });
                    }
                  }}
                  disabled={!slot.available}
                  className={`
                    p-3 rounded-xl text-center transition-all duration-200
                    ${form.scheduled_time === slot.time
                      ? 'bg-[#C8956C] text-black font-bold'
                      : slot.available
                        ? 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-white/80'
                        : 'bg-white/[0.02] text-white/15 cursor-not-allowed line-through'
                    }
                  `}
                >
                  <span className="text-sm font-medium">{formatTime(slot.time)}</span>
                  {slot.price_modifier > 1 && slot.available && (
                    <span className="block text-[10px] text-[#C8956C]/80 mt-0.5">
                      +{Math.round((slot.price_modifier - 1) * 100)}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Summary */}
      {priceEstimate && form.scheduled_date && form.scheduled_time && (
        <div className="p-4 rounded-xl bg-[#C8956C]/10 border border-[#C8956C]/20 flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">Estimated: ${priceEstimate.total_min} — ${priceEstimate.total_max}</p>
            <p className="text-xs text-white/50">Deposit: ${priceEstimate.deposit_required} (applied to final cost)</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/50">Duration</p>
            <p className="text-sm text-white font-medium">{form.estimated_duration >= 60 ? `${Math.round(form.estimated_duration / 60)}h` : `${form.estimated_duration}min`}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-medium text-sm text-white/60 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed || !form.first_name || !form.email}
          className={`
            px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300
            ${canProceed && form.first_name && form.email
              ? 'bg-[#C8956C] text-black hover:bg-[#D4A574]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
            }
          `}
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}
