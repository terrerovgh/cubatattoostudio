import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { BookingData } from '../BookingWizard';

interface Props {
    data: BookingData;
    updateData: (data: Partial<BookingData>) => void;
    onNext: () => void;
}

interface Artist {
    id: string;
    name: string;
}

const ContactStep: React.FC<Props> = ({ data, updateData, onNext }) => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            const { data } = await supabase
                .from('artists')
                .select('id, name')
                .eq('is_active', true)
                .order('name');
            if (data) setArtists(data);
            setLoading(false);
        };
        fetchArtists();
    }, []);

    const isValid = data.fullName && data.email && data.phone;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Full Name</label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={data.fullName}
                            onChange={(e) => updateData({ fullName: e.target.value })}
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Jane Doe"
                        />
                        <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Email Address</label>
                    <div className="relative group">
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => updateData({ email: e.target.value })}
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="jane@example.com"
                        />
                        <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Phone Number</label>
                    <div className="relative group">
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => updateData({ phone: e.target.value })}
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="(555) 123-4567"
                        />
                        <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                    </div>
                </div>

                {/* Artist */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Preferred Artist</label>
                    <div className="relative group">
                        <select
                            value={data.artistId}
                            onChange={(e) => updateData({ artistId: e.target.value })}
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 pl-10 text-white appearance-none focus:outline-none focus:border-white transition-colors cursor-pointer"
                        >
                            <option value="" className="bg-neutral-900">No Preference</option>
                            {artists.map(artist => (
                                <option key={artist.id} value={artist.id} className="bg-neutral-900">{artist.name}</option>
                            ))}
                        </select>
                        <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                        <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Preferred Date</label>
                    <div className="relative group">
                        <input
                            type="date"
                            value={data.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => updateData({ date: e.target.value })}
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-white transition-colors [color-scheme:dark]"
                        />
                        <Calendar className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                    </div>
                </div>

                {/* Time */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Preferred Time</label>
                    <div className="relative group">
                        <input
                            type="time"
                            value={data.time}
                            onChange={(e) => updateData({ time: e.target.value })}
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-white transition-colors [color-scheme:dark]"
                        />
                        <Clock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                    </div>
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Next Step <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ContactStep;
