import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import BeforeAfterSlider from './ui/BeforeAfterSlider';

type Service = Database['public']['Tables']['services']['Row'];

const ServicesSection: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (error) throw error;
                setServices(data || []);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Trigger reveal animations after services are loaded and rendered
    useEffect(() => {
        if (!loading && services.length > 0) {
            // Give DOM a moment to render
            setTimeout(() => {
                const revealElements = document.querySelectorAll('#services .reveal-hidden');
                revealElements.forEach((el) => {
                    el.classList.add('reveal-visible');
                });
            }, 100);
        }
    }, [loading, services]);

    if (loading) {
        return (
            <section id="services" className="py-32 bg-black relative overflow-hidden min-h-[50vh] flex items-center justify-center">
                <div className="text-neutral-500">Loading services...</div>
            </section>
        );
    }

    if (services.length === 0) {
        return null; // Or render a placeholder if preferred
    }

    return (
        <section id="services" className="py-32 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-24 reveal-hidden">
                    <h3 className="text-4xl md:text-6xl font-medium tracking-tighter mb-6 text-white">
                        Disciplines.
                    </h3>
                    <p className="text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
                        We don't just apply ink. We curate experiences tailored to your narrative.
                        From microscopic detail to full body suits.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        // @ts-ignore - Dynamic access to Lucide icons
                        const Icon = (service.icon && LucideIcons[service.icon]) ? LucideIcons[service.icon] : LucideIcons.PenTool;
                        const isCoverUp = service.slug === 'cover-up' || (service.before_image_url && service.after_image_url);

                        return (
                            <div
                                key={service.id}
                                className={`group relative rounded-3xl overflow-hidden bg-neutral-900/50 border border-white/5 hover:border-white/10 transition-all duration-500 reveal-hidden stagger-delay-${index + 1} ${isCoverUp ? 'md:col-span-2 lg:col-span-2 aspect-[16/9] md:aspect-auto' : 'aspect-[4/5]'}`}
                            >
                                {isCoverUp && service.before_image_url && service.after_image_url ? (
                                    <div className="absolute inset-0 w-full h-full">
                                        <BeforeAfterSlider
                                            beforeImage={service.before_image_url}
                                            afterImage={service.after_image_url}
                                        />
                                        <div className="absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Icon className="text-white w-6 h-6" />
                                                <h4 className="text-2xl text-white font-medium tracking-tight">
                                                    {service.title}
                                                </h4>
                                            </div>
                                            <p className="text-neutral-300 text-sm font-light max-w-md">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-neutral-900 transition-transform duration-700 group-hover:scale-[1.02]">
                                            {service.cover_image_url && (
                                                <img
                                                    src={service.cover_image_url}
                                                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                                                    alt={service.title}
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                                        </div>

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <Icon className="text-white w-8 h-8 mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                                                <h4 className="text-3xl text-white font-medium tracking-tight mb-3">
                                                    {service.title}
                                                </h4>
                                                <p className="text-neutral-300 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                                                    {service.description}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
