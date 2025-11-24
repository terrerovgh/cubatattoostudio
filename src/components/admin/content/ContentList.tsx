import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

const SECTIONS = [
    { id: 'hero', label: 'Hero Section', description: 'Main banner and introduction' },
    { id: 'about', label: 'About Section', description: 'Studio information and history' },
    { id: 'gallery', label: 'Gallery Section', description: 'Featured tattoo works' },
    { id: 'artists', label: 'Artists Section', description: 'Artist profiles overview' },
    { id: 'booking', label: 'Booking Section', description: 'Booking form and contact info' },
    { id: 'footer', label: 'Footer', description: 'Social links and copyright' },
];

const ContentList = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Site Content</h1>
                    <p className="mt-2 text-zinc-400">Manage the content for each section of the website.</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SECTIONS.map((section) => (
                    <a
                        key={section.id}
                        href={`/admin/content/${section.id}`}
                        className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900"
                    >
                        <div className="flex items-start justify-between">
                            <div className="rounded-lg bg-zinc-800 p-3 text-zinc-400 transition-colors group-hover:bg-zinc-800 group-hover:text-white">
                                <FileText className="h-6 w-6" />
                            </div>
                            <ChevronRight className="h-5 w-5 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-400" />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-white">{section.label}</h3>
                            <p className="mt-1 text-sm text-zinc-400">{section.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default ContentList;
