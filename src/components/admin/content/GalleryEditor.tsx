import React, { useState, useEffect } from 'react';
import { Save, Loader2, ArrowLeft, CheckCircle, AlertCircle, Plus, X, Search } from 'lucide-react';
import { getSiteContent, updateSiteContent, getWorks, toggleWorkTag } from '../../../lib/supabase-helpers';

interface GalleryEditorProps {
    section: string;
    tag?: string;
}

const GalleryEditor: React.FC<GalleryEditorProps> = ({ section, tag = 'main_gallery' }) => {
    const [content, setContent] = useState<any>(null);
    const [galleryWorks, setGalleryWorks] = useState<any[]>([]);
    const [allWorks, setAllWorks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showWorkSelector, setShowWorkSelector] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, [section, tag]);

    const loadData = async () => {
        setLoading(true);
        setErrors({});
        try {
            // Load site content (title, links)
            const contentData = await getSiteContent(section);
            setContent(contentData?.content || {});

            // Load works tagged with the specific tag
            const gallery = await getWorks({ tags: [tag] });
            setGalleryWorks(gallery || []);

            // Load all works for selection
            const all = await getWorks();
            setAllWorks(all || []);

        } catch (error: any) {
            console.error('Error loading data:', error);
            setErrors({ general: error.message || 'Failed to load data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContent = async () => {
        setSaving(true);
        setErrors({});
        setSuccessMessage('');

        try {
            await updateSiteContent(section, content);
            setSuccessMessage('Content saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: any) {
            console.error('Error saving content:', error);
            setErrors({ general: error.message || 'Failed to save content.' });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleWork = async (work: any, active: boolean) => {
        try {
            await toggleWorkTag(work.id, tag, active);

            // Update local state
            if (active) {
                setGalleryWorks(prev => [work, ...prev]);
            } else {
                setGalleryWorks(prev => prev.filter(w => w.id !== work.id));
            }

            // If removing from selector, no need to close. If adding, maybe keep open?
        } catch (error: any) {
            console.error('Error updating work tag:', error);
            alert('Failed to update gallery selection.');
        }
    };

    const handleChange = (key: string, value: any) => {
        setContent((prev: any) => ({ ...prev, [key]: value }));
    };

    const filteredWorks = allWorks.filter(work => {
        const searchLower = searchTerm.toLowerCase();
        return (
            !galleryWorks.some(gw => gw.id === work.id) && // Exclude already selected
            (work.title?.toLowerCase().includes(searchLower) || false)
        );
    });

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    const title = tag === 'dome_gallery' ? 'Dome Gallery Management' : 'Gallery Management';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <a href="/admin/content" className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </a>
                    <div>
                        <h1 className="text-3xl font-bold text-white capitalize">{title}</h1>
                        <p className="mt-2 text-zinc-400">Manage gallery settings and selected works.</p>
                    </div>
                </div>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="flex items-center gap-2 rounded-lg border border-green-800 bg-green-900/50 p-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>{successMessage}</span>
                </div>
            )}
            {errors.general && (
                <div className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-900/50 p-3 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>{errors.general}</span>
                </div>
            )}

            {/* Settings Section */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <button
                        onClick={handleSaveContent}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Settings
                    </button>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-400">Section Title</label>
                        <input
                            type="text"
                            value={content.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                            placeholder="Selected Works."
                        />
                    </div>
                    {tag === 'main_gallery' && (
                        <>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-400">Archive Link Text</label>
                                <input
                                    type="text"
                                    value={content.archive_text || ''}
                                    onChange={(e) => handleChange('archive_text', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                    placeholder="View Archive"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-400">Archive Link URL</label>
                                <input
                                    type="text"
                                    value={content.archive_link || ''}
                                    onChange={(e) => handleChange('archive_link', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                    placeholder="/works"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Selected Works Section */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Selected Works ({galleryWorks.length})</h2>
                    <button
                        onClick={() => setShowWorkSelector(true)}
                        className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                    >
                        <Plus className="h-4 w-4" />
                        Add Works
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {galleryWorks.map((work) => (
                        <div key={work.id} className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                            <img src={work.image_url} alt={work.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="truncate text-xs font-medium text-white">{work.title || 'Untitled'}</p>
                                </div>
                                <button
                                    onClick={() => handleToggleWork(work, false)}
                                    className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1.5 text-white hover:bg-red-600"
                                    title="Remove from gallery"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {galleryWorks.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 py-12 text-zinc-500">
                            <p>No works selected for the gallery.</p>
                            <button
                                onClick={() => setShowWorkSelector(true)}
                                className="mt-2 text-sm text-white hover:underline"
                            >
                                Select works
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Work Selector Modal */}
            {showWorkSelector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 p-6">
                            <h2 className="text-xl font-bold text-white">Select Works</h2>
                            <button onClick={() => setShowWorkSelector(false)} className="text-zinc-400 hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="border-b border-zinc-800 p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search works..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-10 pr-4 py-2 text-sm text-white focus:border-white focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                {filteredWorks.map((work) => (
                                    <div
                                        key={work.id}
                                        onClick={() => handleToggleWork(work, true)}
                                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 hover:border-white"
                                    >
                                        <img src={work.image_url} alt={work.title} className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Plus className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                            <p className="truncate text-xs text-white">{work.title || 'Untitled'}</p>
                                        </div>
                                    </div>
                                ))}
                                {filteredWorks.length === 0 && (
                                    <div className="col-span-full text-center text-zinc-500">
                                        No matching works found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryEditor;
