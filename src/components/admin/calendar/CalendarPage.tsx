import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';

type Appointment = {
    id: string;
    created_at: string;
    client_name: string;
    client_email: string;
    client_phone: string | null;
    artist_id: string | null;
    service_id: string | null;
    start_time: string;
    end_time: string;
    status: string;
    notes: string | null;
    artists: { name: string } | null;
    services: { title: string } | null;
};

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        fetchAppointments();
    }, [currentDate]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            console.log('Fetching appointments for:', {
                startOfMonth: startOfMonth.toISOString(),
                endOfMonth: endOfMonth.toISOString()
            });

            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    artists (name),
                    services (title)
                `)
                .gte('start_time', startOfMonth.toISOString())
                .lte('start_time', endOfMonth.toISOString());

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Fetched appointments:', data);
            console.log('Number of appointments:', data?.length || 0);

            // @ts-ignore
            setAppointments(data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getAppointmentsForDay = (day: number) => {
        return appointments.filter(apt => {
            const aptDate = new Date(apt.start_time);
            return aptDate.getDate() === day &&
                aptDate.getMonth() === currentDate.getMonth() &&
                aptDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setAppointments((prev: Appointment[]) => prev.map(apt =>
                apt.id === id ? { ...apt, status: newStatus } : apt
            ));

            if (selectedAppointment && selectedAppointment.id === id) {
                setSelectedAppointment((prev: Appointment | null) => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <DashboardLayout title="Calendar">
            <div className="flex h-[calc(100vh-12rem)] gap-6">
                {/* Calendar View */}
                <div className="flex-1 flex flex-col bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-zinc-400" />
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                Today
                            </button>
                            <button onClick={nextMonth} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Grid Header */}
                    <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/50">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-500">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid Body */}
                    <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-zinc-950 overflow-y-auto">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="border-b border-r border-zinc-800/50 bg-zinc-900/20" />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayAppointments = getAppointmentsForDay(day);
                            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                            return (
                                <div
                                    key={day}
                                    className={`min-h-[100px] p-2 border-b border-r border-zinc-800/50 transition-colors hover:bg-zinc-900/30 ${isToday ? 'bg-zinc-900/50' : ''}`}
                                >
                                    <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-400' : 'text-zinc-400'}`}>
                                        {day}
                                    </div>
                                    <div className="space-y-1">
                                        {dayAppointments.map(apt => (
                                            <button
                                                key={apt.id}
                                                onClick={() => setSelectedAppointment(apt)}
                                                className={`w-full text-left px-2 py-1 rounded text-xs truncate transition-colors ${apt.status === 'confirmed' ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50' :
                                                    apt.status === 'cancelled' ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' :
                                                        apt.status === 'completed' ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' :
                                                            'bg-amber-900/30 text-amber-400 hover:bg-amber-900/50'
                                                    }`}
                                            >
                                                {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {apt.client_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="w-80 bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-white mb-6">Appointment Details</h3>

                    {selectedAppointment ? (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Client</label>
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{selectedAppointment.client_name}</div>
                                        <div className="text-sm text-zinc-400">{selectedAppointment.client_email}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Date & Time</label>
                                <div className="mt-2 flex items-center gap-2 text-zinc-300">
                                    <Clock className="w-4 h-4 text-zinc-500" />
                                    <span>
                                        {new Date(selectedAppointment.start_time).toLocaleDateString()} at {new Date(selectedAppointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Service</label>
                                <div className="mt-2 text-zinc-300">
                                    {selectedAppointment.services?.title || 'Unknown Service'}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Artist</label>
                                <div className="mt-2 text-zinc-300">
                                    {selectedAppointment.artists?.name || 'No Preference'}
                                </div>
                            </div>

                            {selectedAppointment.notes && (
                                <div>
                                    <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Notes</label>
                                    <div className="mt-2 text-sm text-zinc-400 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                                        {selectedAppointment.notes}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-zinc-800">
                                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3 block">Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(selectedAppointment.id, status)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors border ${selectedAppointment.status === status
                                                ? 'bg-white text-black border-white'
                                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-zinc-500 text-center">
                            <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                            <p>Select an appointment to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CalendarPage;
