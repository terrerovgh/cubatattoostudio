import React, { useEffect, useState } from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { getSiteContent } from '../lib/supabase-helpers';

interface FooterContent {
    company_name?: string;
    copyright_text?: string;
    instagram_url?: string;
    twitter_url?: string;
    facebook_url?: string;
}

const FooterSection: React.FC = () => {
    const [content, setContent] = useState<FooterContent>({
        company_name: "Cuba Tattoo Studio",
        copyright_text: "© 2025 Cuba Tattoo Studio. Albuquerque, NM.",
        instagram_url: "#",
        twitter_url: "#",
        facebook_url: "#"
    });

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getSiteContent('footer');
                if (data && data.content) {
                    setContent(prev => ({ ...prev, ...data.content }));
                }
            } catch (error) {
                console.error('Error loading footer content:', error);
            }
        };

        loadContent();
    }, []);

    return (
        <footer className="py-12 bg-black border-t border-neutral-900">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <span className="text-lg font-medium tracking-tighter uppercase text-white">
                        {content.company_name}
                    </span>
                    <p className="text-xs text-neutral-500 mt-1">
                        {content.copyright_text}
                    </p>
                </div>

                <div className="flex space-x-6">
                    {content.instagram_url && (
                        <a
                            href={content.instagram_url}
                            className="text-neutral-400 hover:text-white transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                    )}
                    {content.twitter_url && (
                        <a
                            href={content.twitter_url}
                            className="text-neutral-400 hover:text-white transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                    )}
                    {content.facebook_url && (
                        <a
                            href={content.facebook_url}
                            className="text-neutral-400 hover:text-white transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
