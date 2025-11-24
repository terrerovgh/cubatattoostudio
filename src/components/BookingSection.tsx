import React, { useEffect, useState } from 'react';
import { ChevronDown, Mail, Phone } from 'lucide-react';
import { getSiteContent } from '../lib/supabase-helpers';

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

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getSiteContent('booking');
                if (data && data.content) {
                    setContent(prev => ({ ...prev, ...data.content }));
                }
            } catch (error) {
                console.error('Error loading booking content:', error);
            }
        };

        loadContent();
    }, []);

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

                        <form className="space-y-8">
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
                                        className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 placeholder-neutral-700"
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
                                        className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 placeholder-neutral-700"
                                        placeholder="jane@example.com"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label
                                    htmlFor="artist-select"
                                    className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-white transition-colors"
                                >
                                    Preferred Artist
                                </label>
                                <div className="relative">
                                    <select
                                        id="artist-select"
                                        className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 appearance-none cursor-pointer"
                                    >
                                        <option className="bg-neutral-900">No Preference</option>
                                        <option className="bg-neutral-900">David (Realism)</option>
                                        <option className="bg-neutral-900">Nina (Fine Line)</option>
                                        <option className="bg-neutral-900">Karli (Neo Traditional)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-4">
                                    Placement & Size
                                </label>
                                {/* Custom Range Slider */}
                                <div className="w-full bg-neutral-800 h-1 rounded-full relative mb-4">
                                    <div className="absolute top-0 left-0 h-full bg-white rounded-full w-1/2" />
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-neutral-600 rounded-full shadow-sm cursor-pointer" />
                                </div>
                                <div className="flex justify-between text-xs text-neutral-400 font-medium">
                                    <span>Small</span>
                                    <span>Medium</span>
                                    <span>Large</span>
                                    <span>Full Back/Sleeve</span>
                                </div>
                            </div>

                            <div className="group">
                                <label
                                    htmlFor="message"
                                    className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-white transition-colors"
                                >
                                    Concept Description
                                </label>
                                <textarea
                                    id="message"
                                    rows={3}
                                    className="custom-input w-full py-2 bg-transparent text-lg text-neutral-100 placeholder-neutral-700 resize-none"
                                    placeholder="Describe your idea..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-full font-medium text-sm tracking-tight hover:bg-neutral-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {content.button_text}
                            </button>
                        </form>
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
