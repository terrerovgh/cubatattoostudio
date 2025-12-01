import React, { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { getSiteContent } from '../lib/supabase-helpers';
import BookingWizard from './booking/BookingWizard';

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
        const loadData = async () => {
            try {
                const contentData = await getSiteContent('booking');
                if (contentData && contentData.content) {
                    setContent(prev => ({ ...prev, ...contentData.content }));
                }
            } catch (error) {
                console.error('Error loading booking data:', error);
            }
        };

        loadData();
    }, []);

    return (
        <section id="booking" className="py-32 bg-neutral-950 border-t border-neutral-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Booking Wizard (Main Focus) */}
                    <div className="lg:col-span-8 reveal-hidden">
                        <h3 className="text-3xl md:text-4xl font-medium tracking-tighter mb-2 text-white">
                            {content.title}
                        </h3>
                        <p className="text-neutral-400 font-light mb-10">
                            {content.subtitle}
                        </p>

                        <BookingWizard />
                    </div>

                    {/* Contact Info & Map (Sidebar) */}
                    <div className="lg:col-span-4 reveal-hidden stagger-delay-2" id="contact">
                        <div className="bg-neutral-900 p-8 rounded-3xl h-full flex flex-col sticky top-24">
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
                            <div className="flex-grow w-full min-h-[200px] rounded-2xl overflow-hidden relative bg-neutral-800 group grayscale hover:grayscale-0 transition-all duration-500">
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

                            <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col gap-4">
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
