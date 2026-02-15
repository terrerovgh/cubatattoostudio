import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { ServiceData } from './ServiceModal';

interface ServiceCardProps {
    service: ServiceData;
    onClick: () => void;
    className?: string;
}

export default function ServiceCard({ service, onClick, className = '' }: ServiceCardProps) {
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const allMedia = [...(service.images || []), ...(service.videos || [])];

    // Auto-play carousel on hover
    useEffect(() => {
        if (isHovered && allMedia.length > 1) {
            intervalRef.current = setInterval(() => {
                setActiveMediaIndex((prev) => (prev + 1) % allMedia.length);
            }, 2000); // Change every 2 seconds
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setActiveMediaIndex(0); // Reset to first image when not hovered
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHovered, allMedia.length]);

    return (
        <div
            className={`group relative overflow-hidden rounded-[24px] bg-white/5 border border-white/10 cursor-pointer transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_30px_rgba(200,149,108,0.15)] hover:scale-[1.02] h-full ${className}`}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Media Background */}
            <div className="aspect-[4/5] w-full relative overflow-hidden">
                {allMedia.length > 0 ? (
                    allMedia.map((media, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${idx === activeMediaIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                src={media}
                                alt={`${service.name} preview ${idx + 1}`}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                        </div>
                    ))
                ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                        <span className="text-white/20">No preview</span>
                    </div>
                )}

                {/* Play indicator (if videos) */}
                {/* Add minimal indicators if multiple media */}
                {allMedia.length > 1 && (
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {allMedia.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full shadow-sm ${idx === activeMediaIndex ? 'bg-white' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end z-20">
                <div className="flex justify-between items-start mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-xl font-bold text-white leading-tight">{service.name}</h3>
                    <ArrowUpRight className="text-white/0 group-hover:text-[var(--color-gold)] transition-colors transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" size={20} />
                </div>

                <p className="text-white/70 text-sm line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                    {service.description}
                </p>

                {service.price && (
                    <span className="inline-block mt-3 text-[var(--color-gold)] text-xs font-bold uppercase tracking-wider transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                        {service.price}
                    </span>
                )}
            </div>
        </div>
    );
}
