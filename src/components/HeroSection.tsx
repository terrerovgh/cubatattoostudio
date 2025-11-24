import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import DomeGallery from './DomeGallery';
import { getSiteContent } from '../lib/supabase-helpers';

interface HeroContent {
    location?: string;
    tagline?: string;
    cta_text?: string;
    cta_link?: string;
}

interface HeroSectionProps {
    domeImages: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ domeImages }) => {
    const [content, setContent] = useState<HeroContent>({
        location: "Albuquerque, NM",
        tagline: "Ideally located in the heart of the desert. Where precision meets permanence.",
        cta_text: "Meet the Artists",
        cta_link: "#artists"
    });

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getSiteContent('hero');
                if (data && data.content) {
                    setContent(prev => ({ ...prev, ...data.content }));
                }
            } catch (error) {
                console.error('Error loading hero content:', error);
            }
        };

        loadContent();
    }, []);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Parallax Background Image */}
            {/* Dome Gallery Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <DomeGallery images={domeImages} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black z-10">
            </div>

            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                <h2 className="reveal-hidden text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-neutral-400 mb-6">
                    {content.location}
                </h2>
                <h1 className="sr-only">Cuba Tattoo Studio</h1>
                <div className="reveal-hidden stagger-delay-1 mb-12">
                    <img
                        src="/logo-stack.svg"
                        alt="Cuba Tattoo Studio"
                        className="w-full max-w-lg md:max-w-2xl mx-auto opacity-90"
                    />
                </div>
                <p className="reveal-hidden stagger-delay-2 text-lg md:text-xl text-neutral-300 max-w-lg mx-auto font-light tracking-tight mb-10">
                    {content.tagline}
                </p>
                <div className="reveal-hidden stagger-delay-3">
                    <a
                        href={content.cta_link}
                        className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-neutral-900 bg-white/30 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 group"
                    >
                        {content.cta_text}
                        <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
