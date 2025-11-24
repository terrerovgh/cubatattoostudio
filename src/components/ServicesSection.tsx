import React, { useEffect, useState } from 'react';
import { PenTool, Pencil, Feather } from 'lucide-react';
import { getSiteContent } from '../lib/supabase-helpers';

interface Service {
    id: string;
    title: string;
    description: string;
    image: string;
    icon: string;
}

interface ServicesContent {
    title?: string;
    description?: string;
    services?: Service[];
}

const iconMap: Record<string, any> = {
    PenTool: PenTool,
    Pencil: Pencil,
    Feather: Feather,
};

interface ServicesSectionProps {
    initialServices?: any[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ initialServices = [] }) => {
    const [content, setContent] = useState<ServicesContent>({
        title: "Disciplines.",
        description: "We don't just apply ink. We curate experiences tailored to your narrative. From microscopic detail to full body suits.",
        services: initialServices
    });

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getSiteContent('services');
                if (data && data.content) {
                    setContent(prev => ({
                        ...prev,
                        title: data.content.title || prev.title,
                        description: data.content.description || prev.description,
                        services: data.content.services || prev.services
                    }));
                }
            } catch (error) {
                console.error('Error loading services content:', error);
            }
        };

        loadContent();
    }, []);

    const services = content.services || initialServices;

    return (
        <section id="services" className="py-32 bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-24 reveal-hidden">
                    <h3 className="text-3xl md:text-5xl font-medium tracking-tighter mb-6 text-white">
                        {content.title}
                    </h3>
                    <p className="text-lg text-neutral-400 font-light max-w-2xl">
                        {content.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service: any, index: number) => {
                        const Icon = service.Icon || iconMap[service.icon] || PenTool;
                        return (
                            <div
                                key={service.id || index}
                                className={`group relative h-[400px] rounded-2xl overflow-hidden reveal-hidden stagger-delay-${index + 1} cursor-default`}
                            >
                                <div className="absolute inset-0 bg-neutral-900 transition-transform duration-700 group-hover:scale-[1.02]">
                                    <img
                                        src={service.image}
                                        className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"
                                        alt={service.title || service.data?.title}
                                    />
                                </div>
                                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent">
                                    <Icon className="text-white w-8 h-8 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500" />
                                    <h4 className="text-2xl text-white font-medium tracking-tight mb-2">
                                        {service.title || service.data?.title}
                                    </h4>
                                    <p className="text-neutral-300 text-sm font-light opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                        {service.description || service.data?.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
