import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarProps {
    artistName?: string;
    artistSlug?: string;
    bookings?: { date: string; time: string; type: 'booking' | 'walk-in' }[]; // date format: YYYY-MM-DD
    onSelectDate?: (date: string, time: string) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Calendar: React.FC<CalendarProps> = ({ artistName = "Studio", bookings = [], onSelectDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Helpers
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const todayStr = new Date().toISOString().split('T')[0];

    // Mock time slots for selection
    const TIME_SLOTS = ['11:00 AM', '02:00 PM', '05:00 PM'];

    const handleDayClick = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (dateStr < todayStr) return; // Disable past dates
        setSelectedDate(selectedDate === dateStr ? null : dateStr);
    };

    const isBooked = (dateStr: string) => bookings.some(b => b.date === dateStr);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-serif text-white">{artistName}</h2>
                    <p className="text-zinc-400 text-sm">Select a date for your session</p>
                </div>
                <div className="flex items-center gap-4 bg-black/20 p-2 rounded-full border border-white/5">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        ←
                    </button>
                    <span className="text-white font-medium min-w-[140px] text-center">
                        {MONTHS[month]} {year}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Calendar Grid */}
                <div className="md:col-span-2">
                    <div className="grid grid-cols-7 mb-4">
                        {DAYS.map(day => (
                            <div key={day} className="text-center text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isPast = dateStr < todayStr;
                            const isSelected = selectedDate === dateStr;
                            const hasBooking = isBooked(dateStr);

                            return (
                                <motion.button
                                    key={day}
                                    whileHover={!isPast ? { scale: 1.1 } : {}}
                                    whileTap={!isPast ? { scale: 0.95 } : {}}
                                    onClick={() => handleDayClick(day)}
                                    disabled={isPast}
                                    className={`
                                        aspect-square rounded-xl flex items-center justify-center text-sm font-medium relative transition-all
                                        ${isSelected ? 'bg-white text-black shadow-lg shadow-white/20' : 'bg-white/5 text-zinc-300 hover:bg-white/10'}
                                        ${isPast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                                        ${hasBooking && !isSelected ? 'border border-red-500/30' : ''}
                                    `}
                                >
                                    {day}
                                    {hasBooking && (
                                        <span className="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full"></span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Selection Panel */}
                <div className="border-l border-white/10 pl-0 md:pl-8 pt-6 md:pt-0">
                    <AnimatePresence mode="wait">
                        {selectedDate ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col"
                            >
                                <h3 className="text-white font-serif text-lg mb-4">
                                    Availability for <br />
                                    <span className="text-zinc-400 text-base font-sans">{selectedDate}</span>
                                </h3>

                                <div className="space-y-3">
                                    {TIME_SLOTS.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => onSelectDate?.(selectedDate, time)}
                                            className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all group"
                                        >
                                            <div className="flex justify-between items-center text-zinc-300 group-hover:text-white">
                                                <span>{time}</span>
                                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
                                                    Available
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <p className="text-blue-200 text-xs">
                                        ℹ️ Selecting a time will generate a booking request in your dossier.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col justify-center items-center text-center p-6 text-zinc-500"
                            >
                                <span className="text-4xl mb-4 opacity-50">📅</span>
                                <p>Select a date to view available time slots.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
