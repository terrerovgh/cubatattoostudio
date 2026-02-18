import { useState, useRef, useEffect, useMemo } from 'react';
import type { BookingFormData, SizeCategory, PriceEstimate, TimeSlot } from '../../types/booking';
import { BodySelector } from './BodySelector';
import { getDateModifier, getTimeModifier } from '../../lib/pricing';

interface Props {
  form: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  priceEstimate: PriceEstimate | null;
  onNext: () => void;
  onBack: () => void;
}

const SIZES: { id: SizeCategory; label: string; desc: string; example: string }[] = [
  { id: 'tiny', label: 'Tiny', desc: 'Under 2"', example: 'Small symbol, initial' },
  { id: 'small', label: 'Small', desc: '2-4 inches', example: 'Wrist piece, small flower' },
  { id: 'medium', label: 'Medium', desc: '4-6 inches', example: 'Forearm piece, portrait' },
  { id: 'large', label: 'Large', desc: '6-10 inches', example: 'Half sleeve, back piece section' },
  { id: 'xlarge', label: 'Extra Large', desc: '10+ inches', example: 'Full sleeve, large back piece' },
  { id: 'custom', label: 'Custom', desc: 'Let us measure', example: 'Complex or unusual placement' },
];

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

export function StepDetailsSchedule({ form, updateForm, priceEstimate, onNext, onBack }: Props) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const schedule = ARTIST_SCHEDULES[form.artist_id] || ARTIST_SCHEDULES.david;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - form.reference_images.length);
    const newPreviews: string[] = [];

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          newPreviews.push(ev.target.result as string);
          if (newPreviews.length === newFiles.length) {
            setPreviewImages((prev) => [...prev, ...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    updateForm({
      reference_images: [...form.reference_images, ...newFiles],
    });
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    updateForm({
      reference_images: form.reference_images.filter((_, i) => i !== index),
    });
  };

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ date: Date; dayNum: number; isAvailable: boolean; isToday: boolean; isPast: boolean }> = [];

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

  useEffect(() => {
    if (!form.scheduled_date) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);

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
        available: true,
        price_modifier: dateMod.modifier * timeMod.modifier,
      };
    });

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

  const canProceed = 
    form.description && 
    form.placement && 
    form.size_category &&
    form.scheduled_date && 
    form.scheduled_time &&
    form.first_name && 
    form.email;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Tattoo Description */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">Describe Your Tattoo</h3>
        <p className="text-white/45 text-sm mb-4">Tell us about your vision — the more detail, the better</p>
        <textarea
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
          placeholder="Describe your tattoo idea... Include any specific elements, colors, mood, or meaning you want to capture."
          rows={3}
          className="input-premium w-full resize-none"
        />
      </div>

      {/* Reference Images & Placement - Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reference Images */}
        <div>
          <h3 className="text-base font-bold text-white mb-1.5">Reference Images</h3>
          <p className="text-white/45 text-xs mb-3">Upload up to 5 inspiration images</p>

          <div className="flex flex-wrap gap-2">
            {previewImages.map((src, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                <img src={src} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity flex items-center justify-center text-white text-lg"
                >
                  ×
                </button>
              </div>
            ))}

            {previewImages.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-lg border border-dashed border-white/10 flex flex-col items-center justify-center text-white/30 hover:border-[#C8956C]/30 hover:text-[#C8956C]/60 active:border-[#C8956C]/40 transition-colors"
              >
                <span className="text-lg">+</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Body Placement */}
        <div>
          <h3 className="text-base font-bold text-white mb-1.5">Placement</h3>
          <p className="text-white/45 text-xs mb-3">Where do you want your tattoo?</p>
          <BodySelector
            selected={form.placement}
            onSelect={(placement) => updateForm({ placement })}
          />
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="text-base font-bold text-white mb-1.5">Size</h3>
        <p className="text-white/45 text-xs mb-3">Approximate size of your tattoo</p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {SIZES.map((size) => (
            <button
              key={size.id}
              onClick={() => updateForm({ size_category: size.id })}
              className={`
                p-3 rounded-xl text-left transition-all duration-300 min-h-[56px]
                ${form.size_category === size.id
                  ? 'bg-[#C8956C]/15 border border-[#C8956C]/40'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }
              `}
            >
              <h4 className={`font-semibold text-xs ${form.size_category === size.id ? 'text-[#C8956C]' : 'text-white'}`}>
                {size.label}
              </h4>
              <p className="text-white/40 text-[10px] mt-0.5">{size.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Options Row */}
      <div className="grid grid-cols-2 gap-3">
        <label className={`
          flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all min-h-[48px]
          ${form.is_cover_up ? 'bg-[#C8956C]/15 border border-[#C8956C]/40' : 'bg-white/[0.03] border border-white/[0.06]'}
        `}>
          <input
            type="checkbox"
            checked={form.is_cover_up}
            onChange={(e) => updateForm({ is_cover_up: e.target.checked })}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs flex-shrink-0 ${form.is_cover_up ? 'bg-[#C8956C] border-[#C8956C] text-black' : 'border-white/20'}`}>
            {form.is_cover_up && '✓'}
          </div>
          <span className="text-xs text-white font-medium">Cover-up</span>
        </label>

        <label className={`
          flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all min-h-[48px]
          ${form.is_touch_up ? 'bg-[#C8956C]/15 border border-[#C8956C]/40' : 'bg-white/[0.03] border border-white/[0.06]'}
        `}>
          <input
            type="checkbox"
            checked={form.is_touch_up}
            onChange={(e) => updateForm({ is_touch_up: e.target.checked })}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs flex-shrink-0 ${form.is_touch_up ? 'bg-[#C8956C] border-[#C8956C] text-black' : 'border-white/20'}`}>
            {form.is_touch_up && '✓'}
          </div>
          <span className="text-xs text-white font-medium">Touch-up</span>
        </label>
      </div>

      {/* Client Info */}
      <div className="border-t border-white/10 pt-8">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">Your Information</h3>
        <p className="text-white/45 text-sm mb-4">We need a few details to confirm your appointment</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">First Name *</label>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => updateForm({ first_name: e.target.value })}
              className="input-premium w-full text-sm"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Last Name</label>
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => updateForm({ last_name: e.target.value })}
              className="input-premium w-full text-sm"
              placeholder="Last name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateForm({ email: e.target.value })}
              className="input-premium w-full text-sm"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateForm({ phone: e.target.value })}
              className="input-premium w-full text-sm"
              placeholder="(505) 000-0000"
            />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="border-t border-white/10 pt-8">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">Choose Date & Time</h3>
        <p className="text-white/45 text-sm mb-4">
          {form.artist_id && <>Available times for <span className="text-[#C8956C] capitalize">{form.artist_id}</span></>}
          {' '}• Tue-Sat
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                ‹
              </button>
              <h4 className="text-sm font-bold text-white">
                {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h4>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_LABELS.map((d) => (
                <div key={d} className="text-center text-[10px] font-medium text-white/30 py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => (
                <button
                  key={i}
                  onClick={() => day.isAvailable && selectDate(day.date)}
                  disabled={!day.isAvailable || day.dayNum === 0}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                    transition-all duration-200 min-h-[32px]
                    ${day.dayNum === 0 ? 'invisible' : ''}
                    ${isSelectedDate(day.date)
                      ? 'bg-[#C8956C] text-black font-bold'
                      : day.isToday
                        ? 'bg-[#C8956C]/10 text-[#C8956C] ring-1 ring-[#C8956C]/30'
                        : day.isAvailable
                          ? 'text-white/80 hover:bg-white/10 active:bg-white/15 cursor-pointer'
                          : 'text-white/15 cursor-not-allowed'
                    }
                  `}
                >
                  {day.dayNum || ''}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            {form.scheduled_date ? (
              loadingSlots ? (
                <div className="flex items-center justify-center py-8 text-white/40">
                  <div className="w-4 h-4 border-2 border-[#C8956C]/30 border-t-[#C8956C] rounded-full animate-spin mr-2" />
                  Loading...
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-center py-8 text-white/40 text-sm">No available slots for this date</p>
              ) : (
                <>
                  <p className="text-xs text-white/50 mb-3">
                    {new Date(form.scheduled_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
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
                          p-2.5 rounded-lg text-center transition-all duration-200 min-h-[40px]
                          ${form.scheduled_time === slot.time
                            ? 'bg-[#C8956C] text-black font-bold'
                            : slot.available
                              ? 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] active:bg-white/10 text-white/80'
                              : 'bg-white/[0.02] text-white/15 cursor-not-allowed line-through'
                          }
                        `}
                      >
                        <span className="text-xs font-medium">{formatTime(slot.time)}</span>
                        {slot.price_modifier > 1 && slot.available && (
                          <span className="block text-[9px] text-[#C8956C]/80">
                            +{Math.round((slot.price_modifier - 1) * 100)}%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )
            ) : (
              <div className="flex items-center justify-center h-full min-h-[200px] text-white/30 text-sm">
                Select a date to see available times
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Preview */}
      {priceEstimate && (
        <div className="p-4 rounded-xl bg-[#C8956C]/10 border border-[#C8956C]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white font-medium">Estimated: ${priceEstimate.total_min} — ${priceEstimate.total_max}</p>
            <p className="text-xs text-white/50">Deposit: ${priceEstimate.deposit_required} (applied to final cost)</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-white/50">Duration</p>
            <p className="text-sm text-white font-medium">{form.estimated_duration >= 60 ? `${Math.round(form.estimated_duration / 60)}h` : `${form.estimated_duration}min`}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3.5 sm:py-3 rounded-xl font-medium text-sm text-white/60 hover:text-white transition-colors text-center"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            w-full sm:w-auto px-8 py-4 sm:py-3.5 rounded-xl font-semibold text-sm transition-all duration-300
            ${canProceed
              ? 'bg-[#C8956C] text-black hover:bg-[#DABA8F] active:scale-[0.98]'
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
