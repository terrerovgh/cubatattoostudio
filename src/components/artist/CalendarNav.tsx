import { useState } from 'react';

interface ScheduleSlot {
  start: string;
  end: string;
}

type DayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface CalendarNavProps {
  schedule: Record<DayName, ScheduleSlot | null>;
  blockedDates?: string[];
  note?: string;
  accentColor: string;
}

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_MAP: DayName[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1; // Convert to Mon=0
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function CalendarNav({ schedule, blockedDates = [], note, accentColor }: CalendarNavProps) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
  const today = now.getDate();
  const isCurrentMonth = currentMonth === now.getMonth() && currentYear === now.getFullYear();

  const blockedSet = new Set(blockedDates);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const days: Array<{
    day: number;
    available: boolean;
    blocked: boolean;
    past: boolean;
    isToday: boolean;
    slot: ScheduleSlot | null;
  }> = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d);
    const jsDayIndex = date.getDay(); // 0=Sun
    const dayName = DAY_MAP[jsDayIndex];
    const dateStr = formatDate(currentYear, currentMonth, d);
    const slot = schedule[dayName] ?? null;
    const isBlocked = blockedSet.has(dateStr);
    const isPast = isCurrentMonth && d < today;

    days.push({
      day: d,
      available: slot !== null && !isBlocked && !isPast,
      blocked: isBlocked,
      past: isPast,
      isToday: isCurrentMonth && d === today,
      slot,
    });
  }

  return (
    <div className="space-y-4" id="calendar" data-section="calendar">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
          aria-label="Previous month"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="text-sm font-semibold text-white tracking-wide">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h4>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
          aria-label="Next month"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_HEADERS.map((h) => (
          <div key={h} className="text-center text-[10px] font-medium text-white/30 uppercase py-1">
            {h}
          </div>
        ))}

        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {days.map((d) => {
          const isHovered = hoveredDay === d.day;
          return (
            <div
              key={d.day}
              className="relative aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-200 cursor-default"
              style={{
                background: d.available
                  ? `${accentColor}15`
                  : d.blocked
                    ? 'rgba(239, 68, 68, 0.08)'
                    : 'rgba(255, 255, 255, 0.02)',
                border: d.isToday
                  ? `2px solid ${accentColor}`
                  : d.available
                    ? `1px solid ${accentColor}25`
                    : '1px solid transparent',
                color: d.past
                  ? 'rgba(255, 255, 255, 0.15)'
                  : d.available
                    ? accentColor
                    : d.blocked
                      ? 'rgba(239, 68, 68, 0.4)'
                      : 'rgba(255, 255, 255, 0.2)',
              }}
              onMouseEnter={() => d.available && d.slot && setHoveredDay(d.day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {d.day}

              {/* Tooltip with schedule */}
              {isHovered && d.slot && (
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap z-10"
                  style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: `1px solid ${accentColor}30`,
                  }}
                >
                  {d.slot.start} - {d.slot.end}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-white/30 pt-1">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: `${accentColor}30` }}
          />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-white/[0.04]" />
          Not Available
        </div>
      </div>

      {/* Note */}
      {note && (
        <p className="text-[11px] text-white/30 italic leading-relaxed">{note}</p>
      )}
    </div>
  );
}
