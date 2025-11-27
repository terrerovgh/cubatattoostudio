import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/supabase';
import { ArrowLeft, Save } from 'lucide-react';

type ServiceInsert = Database['public']['Tables']['services']['Insert'];

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
        display_order: 0,
        is_active: true,
    });

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
                        <input
                            type="text"
                            id="icon"
                            name="icon"
                            value={formData.icon || ''}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                        />
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

                <div className="space-y-2">
                    <label htmlFor="cover_image_url" className="text-sm font-medium text-zinc-400">Cover Image URL</label>
                    <input
                        type="text"
                        id="cover_image_url"
                        name="cover_image_url"
                        value={formData.cover_image_url || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                    />
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
        </div>
    );
};

export default ServiceForm;
