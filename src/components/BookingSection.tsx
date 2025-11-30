import React, { useEffect, useState } from 'react';
import { ChevronDown, Mail, Phone, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getSiteContent } from '../lib/supabase-helpers';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Artist = Database['public']['Tables']['artists']['Row'];
type Service = Database['public']['Tables']['services']['Row'];

interface BookingContent {
    title?: string;
    subtitle?: string;
    contact_title?: string;
    address?: string;
    city?: string;
    hours_weekday?: string;
    hours_weekend?: string;
    email?: string;
    phone?: string;
    phone_link?: string;
    map_url?: string;
    button_text?: string;
}

const BookingSection: React.FC = () => {
    const [content, setContent] = useState<BookingContent>({
        title: "Book your session.",
        subtitle: "Tell us your idea. We'll do the rest.",
        contact_title: "Visit the Studio",
        address: "123 Central Avenue SW",
        city: "Albuquerque, NM 87102",
        hours_weekday: "11:00am – 7:00pm",
        hours_weekend: "Closed",
        email: "hello@cubatattoo.com",
        phone: "(505) 555-0123",
        phone_link: "+15055550123",
        map_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52222.91906288566!2d-106.69600812944298!3d35.08424957868021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87220addd309835b%3A0xc0d3f8ceb8d9f6fd!2sAlbuquerque%2C%20NM!5e0!3m2!1sen!2sus!4v1715551234567!5m2!1sen!2sus",
        button_text: "Request Appointment"
    });

    const [artists, setArtists] = useState<Artist[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        artist_id: '',
        service_id: '',
        date: '',
        time: '',
        description: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load content
                const contentData = await getSiteContent('booking');
                if (contentData && contentData.content) {
                    setContent(prev => ({ ...prev, ...contentData.content }));
                }

                // Load artists
                const { data: artistsData } = await supabase
                    .from('artists')
                    .select('*')
                    .eq('is_active', true)
                    .order('name');
                if (artistsData) setArtists(artistsData);

                // Load services
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order');
                if (servicesData) setServices(servicesData);

            } catch (error) {
                console.error('Error loading booking data:', error);
            }
        };

        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Combine date and time
            const startDateTime = new Date(`${formData.date}T${formData.time}`);
            // Default duration 1 hour for now, or could be based on service
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

            const { error: submitError } = await supabase
                .from('appointments')
                .insert([{
                    client_name: formData.name,
                    client_email: formData.email,
                    artist_id: formData.artist_id || null,
                    service_id: formData.service_id || null,
                    start_time: startDateTime.toISOString(),
                    end_time: endDateTime.toISOString(),
                    notes: formData.description,
                    status: 'pending'
                }]);

            if (submitError) throw submitError;

            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                artist_id: '',
                service_id: '',
                date: '',
                time: '',
                description: ''
            });
        } catch (err: any) {
            console.error('Error submitting booking:', err);
            setError(err.message || 'Failed to submit booking request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="booking" className="py-32 bg-neutral-950 border-t border-neutral-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {/* Booking Form */}
                    <div className="reveal-hidden">
                        <h3 className="text-3xl md:text-4xl font-medium tracking-tighter mb-2 text-white">
                            {content.title}
                        </h3>
                        <p className="text-neutral-400 font-light mb-10">
                            {content.subtitle}
                        </p>

                        {success ? (
                            <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-2xl p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/30 text-emerald-400 mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-medium text-white mb-2">Request Received!</h4>
                                <p className="text-neutral-400">
                                    We've received your appointment request. We'll be in touch shortly to confirm the details.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-6 text-sm font-medium text-emerald-400 hover:text-emerald-300"
                                >
                                    Book another session
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-8" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="flex items-center gap-2 p-4 rounded-lg bg-red-900/20 border border-red-900/50 text-red-400">
                                        <AlertCircle className="w-5 h-5" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group">
                                        <label
                                            htmlFor="name"
                                            className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-white transition-colors"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 placeholder-neutral-700 focus:outline-none border-b border-neutral-800 focus:border-white transition-colors"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div className="group">
                                        <label
                                            htmlFor="email"
                                            className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-white transition-colors"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 placeholder-neutral-700 focus:outline-none border-b border-neutral-800 focus:border-white transition-colors"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group">
                                        <label
                                            htmlFor="artist_id"
                                            className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-white transition-colors"
                                        >
                                            Preferred Artist
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="artist_id"
                                                value={formData.artist_id}
                                                onChange={handleChange}
                                                className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 appearance-none cursor-pointer focus:outline-none border-b border-neutral-800 focus:border-white transition-colors"
                                            >
                                                <option value="" className="bg-neutral-900">No Preference</option>
                                                {artists.map(artist => (
                                                    <option key={artist.id} value={artist.id} className="bg-neutral-900">
                                                        {artist.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label
                                            htmlFor="service_id"
                                            className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-white transition-colors"
                                        >
                                            Service
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="service_id"
                                                value={formData.service_id}
                                                onChange={handleChange}
                                                className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 appearance-none cursor-pointer focus:outline-none border-b border-neutral-800 focus:border-white transition-colors"
                                            >
                                                <option value="" className="bg-neutral-900">Select Service</option>
                                                {services.map(service => (
                                                    <option key={service.id} value={service.id} className="bg-neutral-900">
                                                        {service.title}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group">
                                        <label
                                            htmlFor="date"
                                            className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-white transition-colors"
                                        >
                                            Preferred Date
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                id="date"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                value={formData.date}
                                                onChange={handleChange}
                                                className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 placeholder-neutral-700 focus:outline-none border-b border-neutral-800 focus:border-white transition-colors [color-scheme:dark]"
                                            />
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label
                                            htmlFor="time"
                                            className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-white transition-colors"
                                        >
                                            Preferred Time
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                id="time"
                                                required
                                                value={formData.time}
                                                onChange={handleChange}
                                                className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 placeholder-neutral-700 focus:outline-none border-b border-neutral-800 focus:border-white transition-colors [color-scheme:dark]"
                                            />
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="group">
                                    <label
                                        htmlFor="description"
                                        className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-white transition-colors"
                                    >
                                        Concept Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 placeholder-neutral-700 resize-none focus:outline-none border-b border-neutral-800 focus:border-white transition-colors"
                                        placeholder="Describe your idea, placement, size..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-full font-medium text-sm tracking-tight hover:bg-neutral-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {loading ? 'Sending Request...' : content.button_text}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info & Map */}
                    <div className="reveal-hidden stagger-delay-2" id="contact">
                        <div className="bg-neutral-900 p-8 rounded-3xl h-full flex flex-col">
                            <div className="mb-8">
                                <h4 className="text-xl font-medium tracking-tight mb-4 text-white">
                                    {content.contact_title}
                                </h4>
                                <address className="not-italic text-neutral-400 font-light mb-4">
                                    {content.address}<br />
                                    {content.city}
                                </address>
                                <p className="text-neutral-400 font-light text-sm">
                                    <span className="block mb-1">
                                        <span className="w-20 inline-block font-medium text-neutral-200">
                                            Tue - Sat
                                        </span>
                                        {' '}{content.hours_weekday}
                                    </span>
                                    <span className="block">
                                        <span className="w-20 inline-block font-medium text-neutral-200">
                                            Sun - Mon
                                        </span>
                                        {' '}{content.hours_weekend}
                                    </span>
                                </p>
                            </div>

                            {/* Stylized Map Placeholder */}
                            <div className="flex-grow w-full rounded-2xl overflow-hidden relative bg-neutral-800 group grayscale hover:grayscale-0 transition-all duration-500">
                                <iframe
                                    src={content.map_url}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, opacity: 0.7 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl" />
                            </div>

                            <div className="mt-8 pt-8 border-t border-neutral-800 flex justify-between items-center">
                                <a
                                    href={`mailto:${content.email}`}
                                    className="flex items-center text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
                                >
                                    <Mail className="w-4 h-4 mr-2" /> {content.email}
                                </a>
                                <a
                                    href={`tel:${content.phone_link}`}
                                    className="flex items-center text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
                                >
                                    <Phone className="w-4 h-4 mr-2" /> {content.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingSection;
