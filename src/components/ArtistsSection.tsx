import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getSiteContent, getArtists } from '../lib/supabase-helpers';

interface Artist {
    id?: string;
    slug: string;
    name: string;
    specialty: string;
    bio: string;
    avatar_url: string;
}

interface ArtistsContent {
    title?: string;
    subtitle?: string;
    artists?: Artist[];
}

interface ArtistsSectionProps {
    initialArtists?: Artist[];
}

const ArtistsSection: React.FC<ArtistsSectionProps> = ({ initialArtists = [] }) => {
    const [content, setContent] = useState<ArtistsContent>({
        title: "The Artists.",
        subtitle: "The Talent",
        artists: initialArtists
    });

    useEffect(() => {
        const loadContent = async () => {
            try {
                // Load section content (title, subtitle)
                const sectionData = await getSiteContent('artists');

                // Load artists from database
                const artistsData = await getArtists({ active: true });

                setContent(prev => ({
                    ...prev,
                    title: sectionData?.content?.title || prev.title,
                    subtitle: sectionData?.content?.subtitle || prev.subtitle,
                    artists: artistsData && artistsData.length > 0 ? artistsData : prev.artists
                }));
            } catch (error) {
                console.error('Error loading artists content:', error);
            }
        };

        loadContent();
    }, []);

    const artists = content.artists || initialArtists;

    return (
        <section id="artists" className="py-20 md:py-32 bg-neutral-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-32 text-center reveal-hidden">
                    <span className="text-xs font-medium tracking-widest uppercase text-neutral-500 mb-4 block">
                        {content.subtitle}
                    </span>
                    <h3 className="text-4xl md:text-6xl font-medium tracking-tighter text-white">
                        {content.title}
                    </h3>
                </div>

                {artists.map((artist, index) => (
                    <div
                        key={artist.id || artist.slug}
                        className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 mb-32 reveal-hidden group`}
                    >
                        <div className="w-full md:w-1/2 relative aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl">
                            <img
                                src={artist.avatar_url}
                                alt={`${artist.name} Portfolio`}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                            />
                        </div>
                        <div className={`w-full md:w-1/2 ${index % 2 === 1 ? "md:pr-12 md:text-left" : "md:pl-12"}`}>
                            <div className={`flex items-center ${index % 2 === 1 ? "md:justify-start" : ""} gap-4 mb-2`}>
                                <span className={`h-px w-8 bg-neutral-700 ${index % 2 === 1 ? "order-last md:order-first" : ""}`} />
                                <span className="text-xs font-medium tracking-widest uppercase text-neutral-500">
                                    {artist.specialty}
                                </span>
                            </div>
                            <h4 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-6">
                                {artist.name}.
                            </h4>
                            <p className={`text-neutral-400 text-lg font-light leading-relaxed mb-8 max-w-md ${index % 2 === 1 ? "md:ml-0" : ""}`}>
                                {artist.bio}
                            </p>
                            <div className={`flex ${index % 2 === 1 ? "md:justify-start" : ""}`}>
                                <a
                                    href={`/artists/${artist.slug}`}
                                    className="inline-flex items-center text-sm font-medium hover:text-neutral-300 transition-colors border-b border-neutral-700 pb-1"
                                >
                                    View {artist.name}&apos;s Portfolio{" "}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ArtistsSection;
