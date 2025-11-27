import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/supabase';
import { ArrowLeft, Save, CheckCircle, AlertCircle } from 'lucide-react';

type WorkInsert = Database['public']['Tables']['works']['Insert'];
type Artist = Database['public']['Tables']['artists']['Row'];
type Service = Database['public']['Tables']['services']['Row'];

interface WorkFormProps {
    workId?: string;
}

const WorkForm = ({ workId }: WorkFormProps) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState<WorkInsert>({
        title: '',
        description: '',
        image_url: '',
        artist_id: null,
        service_id: null,
        tags: [],
        featured: false,
        published: true,
    });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchDependencies();
        if (workId) {
            fetchWork(workId);
        }
    }, [workId]);

    const fetchDependencies = async () => {
        try {
            const [artistsRes, servicesRes] = await Promise.all([
                supabase.from('artists').select('*').order('name'),
                supabase.from('services').select('*').order('title'),
            ]);

            if (artistsRes.data) setArtists(artistsRes.data);
            if (servicesRes.data) setServices(servicesRes.data);
        } catch (error: any) {
            console.error('Error fetching dependencies:', error);
            setErrors({ general: 'Failed to load artists and services. Please refresh the page.' });
        }
    };

    const fetchWork = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('works')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData(data);
            }
        } catch (error: any) {
            console.error('Error fetching work:', error);
            setErrors({ general: 'Failed to load work data. Please refresh the page.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            setFormData((prev) => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()],
            }));
            setTagInput('');
        }
    };

    const removeTag = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            tags: (prev.tags || []).filter((_, index) => index !== indexToRemove),
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.title?.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (!formData.image_url?.trim()) {
            newErrors.image_url = 'Image URL is required';
        } else if (!isValidUrl(formData.image_url)) {
            newErrors.image_url = 'Please enter a valid URL';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        setSaving(true);
        setSuccessMessage('');

        try {
            // Clean up empty strings for foreign keys
            const dataToSave = {
                ...formData,
                artist_id: formData.artist_id === '' ? null : formData.artist_id,
                service_id: formData.service_id === '' ? null : formData.service_id,
            };

            let result;
            if (workId) {
                result = await supabase
                    .from('works')
                    .update(dataToSave)
                    .eq('id', workId)
                    .select()
                    .single();
            } else {
                result = await supabase
                    .from('works')
                    .insert([dataToSave])
                    .select()
                    .single();
            }
            
            if (result.error) throw result.error;
            
            // Show success message
            setSuccessMessage(workId ? 'Work updated successfully!' : 'Work created successfully!');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '/admin/works';
            }, 1500);
            
        } catch (error: any) {
            console.error('Error saving work:', error);
            
            if (error.message?.includes('permission denied')) {
                setErrors({ general: 'You do not have permission to perform this action.' });
            } else {
                setErrors({ general: error.message || 'An error occurred while saving the work.' });
            }
        } finally {
            setSaving(false);
        }
    };

    if (workId && loading) return <div className="text-zinc-400">Loading work...</div>;

    return (
        <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
                <a
                    href="/admin/works"
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                </a>
                <h2 className="text-xl font-semibold text-white">
                    {workId ? 'Edit Work' : 'New Work'}
                </h2>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-800 bg-green-900/50 p-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* General Error Message */}
            {errors.general && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-800 bg-red-900/50 p-3 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>{errors.general}</span>
                </div>
            )}

            <form data-testid="work-form" onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-zinc-400">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            className={`w-full rounded-lg border bg-zinc-950 px-4 py-2 text-white focus:outline-none ${
                                errors.title ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-700'
                            }`}
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="image_url" className="text-sm font-medium text-zinc-400">Image URL *</label>
                        <input
                            type="text"
                            id="image_url"
                            name="image_url"
                            required
                            value={formData.image_url}
                            onChange={handleChange}
                            className={`w-full rounded-lg border bg-zinc-950 px-4 py-2 text-white focus:outline-none ${
                                errors.image_url ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-700'
                            }`}
                        />
                        {errors.image_url && <p className="text-sm text-red-500">{errors.image_url}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="artist_id" className="text-sm font-medium text-zinc-400">Artist</label>
                        <select
                            id="artist_id"
                            name="artist_id"
                            value={formData.artist_id || ''}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                        >
                            <option value="">Select Artist</option>
                            {artists.map((artist) => (
                                <option key={artist.id} value={artist.id}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="service_id" className="text-sm font-medium text-zinc-400">Service</label>
                        <select
                            id="service_id"
                            name="service_id"
                            value={formData.service_id || ''}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                        >
                            <option value="">Select Service</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.title}
                                </option>
                            ))}
                        </select>
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
                    <label htmlFor="tags" className="text-sm font-medium text-zinc-400">Tags (Press Enter to add)</label>
                    <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-2 pt-2">
                        {formData.tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    className="ml-1 text-zinc-500 hover:text-zinc-300"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="published"
                            id="published"
                            checked={formData.published}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-0"
                        />
                        <label htmlFor="published" className="text-sm font-medium text-zinc-400">
                            Published
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="featured"
                            id="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-0"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-zinc-400">
                            Featured
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving || loading}
                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                                {workId ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {workId ? 'Update Work' : 'Save Work'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WorkForm;
