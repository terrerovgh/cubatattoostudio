import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/supabase';
import { ArrowLeft, Save, CheckCircle, AlertCircle } from 'lucide-react';

type Artist = Database['public']['Tables']['artists']['Row'];
type ArtistInsert = Database['public']['Tables']['artists']['Insert'];

interface ArtistFormProps {
    artistId?: string;
}

const ArtistForm = ({ artistId }: ArtistFormProps) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState<ArtistInsert>({
        name: '',
        slug: '',
        specialty: '',
        bio: '',
        avatar_url: '',
        portfolio_url: '',
        instagram: '',
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        if (artistId) {
            fetchArtist(artistId);
        }
    }, [artistId]);

    const fetchArtist = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('artists')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData(data);
            }
        } catch (error) {
            console.error('Error fetching artist:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
        }
        
        if (!formData.specialty.trim()) {
            newErrors.specialty = 'Specialty is required';
        }
        
        // URL validation
        if (formData.avatar_url && !isValidUrl(formData.avatar_url)) {
            newErrors.avatar_url = 'Please enter a valid URL';
        }
        
        if (formData.portfolio_url && !isValidUrl(formData.portfolio_url)) {
            newErrors.portfolio_url = 'Please enter a valid URL';
        }
        
        if (formData.instagram && !isValidInstagram(formData.instagram)) {
            newErrors.instagram = 'Please enter a valid Instagram username or URL';
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

    const isValidInstagram = (input: string) => {
        // Accept Instagram username or full URL
        const usernamePattern = /^[a-zA-Z0-9_.]+$/;
        const urlPattern = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
        
        return usernamePattern.test(input) || urlPattern.test(input);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        
        let finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        
        // Auto-generate slug from name if creating new artist
        if (name === 'name' && !artistId && !formData.slug) {
            const newSlug = generateSlug(value as string);
            setFormData((prev) => ({
                ...prev,
                name: value as string,
                slug: newSlug,
            }));
            return;
        }
        
        setFormData((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
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
            let result;
            if (artistId) {
                result = await supabase
                    .from('artists')
                    .update(formData)
                    .eq('id', artistId)
                    .select()
                    .single();
            } else {
                result = await supabase
                    .from('artists')
                    .insert([formData])
                    .select()
                    .single();
            }
            
            if (result.error) throw result.error;
            
            // Show success message
            setSuccessMessage(artistId ? 'Artist updated successfully!' : 'Artist created successfully!');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '/admin/artists';
            }, 1500);
            
        } catch (error: any) {
            console.error('Error saving artist:', error);
            
            // Handle specific Supabase errors
            if (error.code === '23505') {
                setErrors({ slug: 'This slug is already in use. Please choose a different one.' });
            } else if (error.message?.includes('permission denied')) {
                setErrors({ general: 'You do not have permission to perform this action.' });
            } else {
                setErrors({ general: error.message || 'An error occurred while saving the artist.' });
            }
        } finally {
            setSaving(false);
        }
    };

    if (artistId && loading) return <div className="text-zinc-400">Loading artist...</div>;

    return (
        <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
                <a
                    href="/admin/artists"
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                </a>
                <h2 className="text-xl font-semibold text-white">
                    {artistId ? 'Edit Artist' : 'New Artist'}
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

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full rounded-lg border bg-zinc-950 px-4 py-2 text-white focus:outline-none ${
                                errors.name ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-700'
                            }`}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            required
                            value={formData.slug}
                            onChange={handleChange}
                            className={`w-full rounded-lg border bg-zinc-950 px-4 py-2 text-white focus:outline-none ${
                                errors.slug ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-700'
                            }`}
                        />
                        {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Specialty *</label>
                        <input
                            type="text"
                            name="specialty"
                            required
                            value={formData.specialty}
                            onChange={handleChange}
                            className={`w-full rounded-lg border bg-zinc-950 px-4 py-2 text-white focus:outline-none ${
                                errors.specialty ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-700'
                            }`}
                        />
                        {errors.specialty && <p className="text-sm text-red-500">{errors.specialty}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Display Order</label>
                        <input
                            type="number"
                            name="display_order"
                            value={formData.display_order}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Bio</label>
                    <textarea
                        name="bio"
                        rows={4}
                        value={formData.bio || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-white focus:border-zinc-700 focus:outline-none"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Avatar URL</label>
                        <input
                            type="text"
                            name="avatar_url"
                            value={formData.avatar_url || ''}
                            onChange={handleChange}
                            className={`w-full rounded-lg border bg-zinc-950 px-4 py-2 text-white focus:outline-none ${
                                errors.avatar_url ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-700'
                            }`}
                        />
                        {errors.avatar_url && <p className="text-sm text-red-500">{errors.avatar_url}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Portfolio URL</label>
                        <input
                            type="text"
                            name="portfolio_url"
                            value={formData.portfolio_url || ''}
                            onChange={handleChange}
                            className={`w-full rounded-lg border bg-zinc-950 px-4 py-2 text-white focus:outline-none ${
                                errors.portfolio_url ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-700'
                            }`}
                        />
                        {errors.portfolio_url && <p className="text-sm text-red-500">{errors.portfolio_url}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Instagram</label>
                        <input
                            type="text"
                            name="instagram"
                            value={formData.instagram || ''}
                            onChange={handleChange}
                            className={`w-full rounded-lg border bg-zinc-950 px-4 py-2 text-white focus:outline-none ${
                                errors.instagram ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-700'
                            }`}
                        />
                        {errors.instagram && <p className="text-sm text-red-500">{errors.instagram}</p>}
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
                        disabled={saving || loading}
                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                                {artistId ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {artistId ? 'Update Artist' : 'Save Artist'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ArtistForm;
