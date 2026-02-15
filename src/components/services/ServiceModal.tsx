import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export interface ServiceData {
    name: string;
    description: string;
    images: string[];
    videos?: string[];
    fullDescription?: string;
    priceList?: { item: string; price: string }[];
    reviews?: { author: string; comment: string; rating: number }[];
    price?: string;
    // Grid Configuration
    colSpanMobile?: number;
    rowSpanMobile?: number;
    colSpanTablet?: number;
    rowSpanTablet?: number;
    colSpanDesktop?: number;
    rowSpanDesktop?: number;
}

interface ServiceModalProps {
    service: ServiceData | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        setActiveMediaIndex(0);
    }, [service]);

    if (!service || !isOpen) return null;

    const allMedia = [...(service.images || []), ...(service.videos || [])];

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMediaIndex((prev) => (prev + 1) % allMedia.length);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-5xl bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Media Section (Left/Top) */}
                <div className="w-full md:w-1/2 bg-black relative flex items-center justify-center h-[300px] md:h-auto min-h-[300px]">
                    {allMedia.length > 0 ? (
                        <>
                            <img
                                src={allMedia[activeMediaIndex]}
                                alt={service.name}
                                className="w-full h-full object-cover"
                            />

                            {allMedia.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {allMedia.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === activeMediaIndex ? 'bg-white w-4' : 'bg-white/40'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-white/40 flex flex-col items-center">
                            <span>No media available</span>
                        </div>
                    )}
                </div>

                {/* Content Section (Right/Bottom) */}
                <div className="w-full md:w-1/2 flex flex-col h-full bg-[#1a1a1a]">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 relative">
                        <h2 className="text-2xl font-bold text-white mb-1">{service.name}</h2>
                        <p className="text-white/60 text-sm">{service.description}</p>
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">

                        {/* Full Description */}
                        <div>
                            <h3 className="text-[var(--color-gold)] text-xs font-bold uppercase tracking-wider mb-3">About the Service</h3>
                            <div className="text-white/80 space-y-4 leading-relaxed text-sm md:text-base whitespace-pre-line">
                                {service.fullDescription || service.description}
                            </div>
                        </div>

                        {/* Pricing */}
                        {service.priceList && service.priceList.length > 0 && (
                            <div>
                                <h3 className="text-[var(--color-gold)] text-xs font-bold uppercase tracking-wider mb-3">Pricing</h3>
                                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                    {service.priceList.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 last:border-0 pb-2 last:pb-0">
                                            <span className="text-white/90 font-medium">{item.item}</span>
                                            <span className="text-white/60">{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {service.reviews && service.reviews.length > 0 && (
                            <div>
                                <h3 className="text-[var(--color-gold)] text-xs font-bold uppercase tracking-wider mb-3">Client Reviews</h3>
                                <div className="space-y-4">
                                    {service.reviews.map((review, idx) => (
                                        <div key={idx} className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-white font-medium text-sm">{review.author}</span>
                                                <div className="flex gap-0.5 text-[var(--color-gold)]">
                                                    {Array.from({ length: 5 }).map((_, starIdx) => (
                                                        <Star
                                                            key={starIdx}
                                                            size={12}
                                                            fill={starIdx < review.rating ? "currentColor" : "none"}
                                                            className={starIdx < review.rating ? "opacity-100" : "opacity-30"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-white/70 text-xs italic">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer CTA */}
                    <div className="p-6 border-t border-white/10 mt-auto bg-[#1a1a1a]">
                        <a
                            href="/booking"
                            className="block w-full text-center py-3 bg-[var(--color-gold)] text-black font-bold rounded-lg hover:bg-[#d4a883] transition-colors"
                        >
                            Book This Service
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
