import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getSiteContent } from '../lib/supabase-helpers';

interface GalleryImage {
    src: string;
    alt: string;
    slug: string;
}

interface GalleryContent {
    title?: string;
    archive_text?: string;
    archive_link?: string;
}

interface GallerySectionProps {
    initialImages?: GalleryImage[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ initialImages = [] }) => {
    const [content, setContent] = useState<GalleryContent>({
        title: "Selected Works.",
        archive_text: "View Archive",
        archive_link: "/works"
    });
    const [images] = useState<GalleryImage[]>(initialImages);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getSiteContent('gallery');
                if (data && data.content) {
                    setContent(prev => ({ ...prev, ...data.content }));
                }
            } catch (error) {
                console.error('Error loading gallery content:', error);
            }
        };

        loadContent();
    }, []);

    return (
        <section id="gallery" className="py-32 bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-16 reveal-hidden">
                    <h3 className="text-3xl md:text-4xl font-medium tracking-tighter text-white">
                        {content.title}
                    </h3>
                    <a
                        href={content.archive_link}
                        className="hidden md:inline-flex items-center text-sm font-medium text-neutral-500 hover:text-white transition-colors"
                    >
                        {content.archive_text}
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`break-inside-avoid reveal-hidden ${index % 3 === 1 ? "stagger-delay-1" : index % 3 === 2 ? "stagger-delay-2" : ""
                                }`}
                        >
                            <a href={`/works/${image.slug}`}>
                                <img
                                    src={image.src}
                                    className="w-full rounded-xl hover:opacity-90 transition-opacity"
                                    alt={image.alt}
                                />
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <a
                        href={content.archive_link}
                        className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-white transition-colors"
                    >
                        {content.archive_text}
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
