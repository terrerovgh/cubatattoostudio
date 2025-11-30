import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/supabase';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import MediaLibrary from '../media/MediaLibrary';

type ServiceInsert = Database['public']['Tables']['services']['Insert'] & {
    before_image_url?: string | null;
    after_image_url?: string | null;
};

interface ServiceFormProps {
    serviceId?: string;
}

const ServiceForm = ({ serviceId }: ServiceFormProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ServiceInsert>({
        title: '',
        slug: '',
        description: '',
        icon: '',
        cover_image_url: '',
        before_image_url: '',
        after_image_url: '',
        display_order: 0,
        is_active: true,
    });
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [activeMediaField, setActiveMediaField] = useState<'cover_image_url' | 'before_image_url' | 'after_image_url' | null>(null);

    useEffect(() => {
        if (serviceId) {
            fetchService(serviceId);
        }
    }, [serviceId]);

    const fetchService = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData(data);
            }
        } catch (error) {
            console.error('Error fetching service:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleMediaSelect = (url: string | string[]) => {
        if (activeMediaField && typeof url === 'string') {
            setFormData(prev => ({ ...prev, [activeMediaField]: url }));
            setShowMediaLibrary(false);
            setActiveMediaField(null);
        }
    };

    const openMediaLibrary = (field: 'cover_image_url' | 'before_image_url' | 'after_image_url') => {
        setActiveMediaField(field);
        setShowMediaLibrary(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (serviceId) {
                const { error } = await supabase
                    .from('services')
                    .update(formData)
                    .eq('id', serviceId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('services')
                    .insert([formData]);
                if (error) throw error;
            }
            window.location.href = '/admin/services';
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Error saving service');
        } finally {
            setLoading(false);
        }
    };

    // Dynamic Icon Preview
    // @ts-ignore
    const IconPreview = formData.icon && LucideIcons[formData.icon] ? LucideIcons[formData.icon] : null;

    if (serviceId && loading) return <div className="text-zinc-400">Loading service...</div>;

    return (
        <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
                <a
                    href="/admin/services"
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                </a>
                <h2 className="text-xl font-semibold text-white">
                    {serviceId ? 'Edit Service' : 'New Service'}
                </h2>
            </div>

            <form data-testid="service-form" onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-zinc-400">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="slug" className="text-sm font-medium text-zinc-400">Slug</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            required
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="icon" className="text-sm font-medium text-zinc-400">Icon (Lucide Name)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="icon"
                                name="icon"
                                value={formData.icon || ''}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                            />
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                                {IconPreview ? <IconPreview className="h-5 w-5 text-white" /> : <span className="text-xs text-zinc-600">?</span>}
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500">
                            Use any icon name from <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Lucide Icons</a>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="display_order" className="text-sm font-medium text-zinc-400">Display Order</label>
                        <input
                            type="number"
                            id="display_order"
                            name="display_order"
                            value={formData.display_order}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-zinc-400">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                    />
                </div>

                {/* Image Fields */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Cover Image</label>
                        <div className="flex items-center gap-4">
                            {formData.cover_image_url ? (
                                <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-zinc-800">
                                    <img src={formData.cover_image_url} alt="Cover" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, cover_image_url: '' }))}
                                        className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => openMediaLibrary('cover_image_url')}
                                    className="flex h-32 w-32 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-900"
                                >
                                    <ImageIcon className="h-8 w-8 text-zinc-500" />
                                    <span className="mt-2 text-xs text-zinc-400">Select Image</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Before Image (For Cover Ups)</label>
                            <div className="flex items-center gap-4">
                                {formData.before_image_url ? (
                                    <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-zinc-800">
                                        <img src={formData.before_image_url} alt="Before" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, before_image_url: '' }))}
                                            className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-red-500"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => openMediaLibrary('before_image_url')}
                                        className="flex h-32 w-32 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-900"
                                    >
                                        <ImageIcon className="h-8 w-8 text-zinc-500" />
                                        <span className="mt-2 text-xs text-zinc-400">Select Image</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">After Image (For Cover Ups)</label>
                            <div className="flex items-center gap-4">
                                {formData.after_image_url ? (
                                    <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-zinc-800">
                                        <img src={formData.after_image_url} alt="After" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, after_image_url: '' }))}
                                            className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-red-500"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => openMediaLibrary('after_image_url')}
                                        className="flex h-32 w-32 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-900"
                                    >
                                        <ImageIcon className="h-8 w-8 text-zinc-500" />
                                        <span className="mt-2 text-xs text-zinc-400">Select Image</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="is_active"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-0"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-zinc-400">
                        Active
                    </label>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? 'Saving...' : 'Save Service'}
                    </button>
                </div>
            </form>

            {showMediaLibrary && (
                <MediaLibrary
                    onSelect={handleMediaSelect}
                    onClose={() => setShowMediaLibrary(false)}
                />
            )}
        </div>
    );
};

export default ServiceForm;
