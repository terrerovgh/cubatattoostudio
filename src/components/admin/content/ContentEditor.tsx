import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader2, ArrowLeft, Image as ImageIcon, Video, CheckCircle, AlertCircle, X, Plus } from 'lucide-react';
import { getSiteContent, updateSiteContent, uploadAsset } from '../../../lib/supabase-helpers';

import MediaLibrary from '../media/MediaLibrary';

interface ContentEditorProps {
    section: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ section }) => {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [showMediaLibrary, setShowMediaLibrary] = useState<string | null>(null);
    const [mediaLibraryMultiple, setMediaLibraryMultiple] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadContent();
    }, [section]);

    const loadContent = async () => {
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const data = await getSiteContent(section);
            if (data && data.content) {
                setContent(data.content);
            } else {
                // Initialize with empty object if no content exists
                setContent({});
            }
        } catch (error: any) {
            console.error('Error loading content:', error);
            setErrors({ general: error.message || 'Failed to load content. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setErrors({});
        setSuccessMessage('');

        try {
            await updateSiteContent(section, content);
            setSuccessMessage('Content saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: any) {
            console.error('Error saving content:', error);

            if (error.message?.includes('permission denied')) {
                setErrors({ general: 'You do not have permission to save content.' });
            } else {
                setErrors({ general: error.message || 'Failed to save content. Please try again.' });
            }

            setTimeout(() => setErrors({}), 5000);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: any) => {
        setContent((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = async (key: string, file: File) => {
        setUploading(key);
        setErrors({});

        try {
            const path = `${section}/${Date.now()}-${file.name}`;
            const publicUrl = await uploadAsset(file, path);
            handleChange(key, publicUrl);
            setSuccessMessage('File uploaded successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: any) {
            console.error('Error uploading file:', error);
            setErrors({ [key]: error.message || 'Failed to upload file. Please try again.' });
            setTimeout(() => setErrors({}), 5000);
        } finally {
            setUploading(null);
        }
    };

    const handleMediaSelect = (result: string | string[]) => {
        if (showMediaLibrary) {
            if (Array.isArray(result)) {
                // For array fields (gallery), append new images
                const currentImages = Array.isArray(content[showMediaLibrary]) ? content[showMediaLibrary] : [];
                // Filter out duplicates if needed, or just append
                const newImages = [...currentImages, ...result];
                // Remove duplicates
                const uniqueImages = Array.from(new Set(newImages));
                handleChange(showMediaLibrary, uniqueImages);
            } else {
                // For single fields
                handleChange(showMediaLibrary, result);
            }
            setShowMediaLibrary(null);
        }
    };

    const removeImageFromGallery = (key: string, index: number) => {
        const currentImages = [...(content[key] || [])];
        currentImages.splice(index, 1);
        handleChange(key, currentImages);
    };

    const openMediaLibrary = (key: string, multiple: boolean = false) => {
        setMediaLibraryMultiple(multiple);
        setShowMediaLibrary(key);
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    const renderField = (key: string, value: any) => {
        const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('cover');
        const isVideo = key.toLowerCase().includes('video');
        const isLongText = key.toLowerCase().includes('description') || key.toLowerCase().includes('bio') || key.toLowerCase().includes('content');
        const isGallery = Array.isArray(value) || key.toLowerCase().includes('gallery') || key.toLowerCase().includes('images');

        if (isGallery) {
            const images = Array.isArray(value) ? value : [];
            return (
                <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400 capitalize">{key.replace(/_/g, ' ')}</label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {images.map((img: string, idx: number) => (
                            <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                                <img src={img} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                                <button
                                    onClick={() => removeImageFromGallery(key, idx)}
                                    className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => openMediaLibrary(key, true)}
                            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-500 hover:bg-zinc-900 hover:text-white"
                        >
                            <Plus className="h-8 w-8" />
                            <span className="text-xs font-medium">Add Images</span>
                        </button>
                    </div>
                </div>
            );
        }

        if (isImage || isVideo) {
            return (
                <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400 capitalize">{key.replace(/_/g, ' ')}</label>
                    <div className="flex items-start gap-4">
                        {value && (
                            <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                                {isImage ? (
                                    <img src={value} alt={key} className="h-32 w-32 object-cover" />
                                ) : (
                                    <video src={value} className="h-32 w-32 object-cover" controls />
                                )}
                            </div>
                        )}
                        <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 px-4 py-2 transition-colors hover:border-zinc-500 hover:bg-zinc-900/50">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept={isImage ? "image/*" : "video/*"}
                                        onChange={(e) => e.target.files?.[0] && handleFileUpload(key, e.target.files[0])}
                                        disabled={!!uploading}
                                    />
                                    {uploading === key ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                                    ) : (
                                        <Upload className="h-4 w-4 text-zinc-500" />
                                    )}
                                    <span className="text-sm text-zinc-400">Upload</span>
                                </label>
                                <button
                                    onClick={() => openMediaLibrary(key, false)}
                                    className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    Library
                                </button>
                            </div>
                            <input
                                type="text"
                                value={value || ''}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className={`w-full rounded-lg border bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none ${errors[key] ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-white'
                                    }`}
                                placeholder="Or enter URL directly"
                            />
                            {errors[key] && <p className="text-sm text-red-500">{errors[key]}</p>}
                        </div>
                    </div>
                </div>
            );
        }

        if (isLongText) {
            return (
                <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400 capitalize">{key.replace(/_/g, ' ')}</label>
                    <textarea
                        value={value || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        rows={4}
                        className={`w-full rounded-lg border bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none ${errors[key] ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-white'
                            }`}
                    />
                    {errors[key] && <p className="text-sm text-red-500">{errors[key]}</p>}
                </div>
            );
        }

        return (
            <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-zinc-400 capitalize">{key.replace(/_/g, ' ')}</label>
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className={`w-full rounded-lg border bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none ${errors[key] ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-white'
                        }`}
                />
                {errors[key] && <p className="text-sm text-red-500">{errors[key]}</p>}
            </div>
        );
    };

    // Default fields to show if content is empty
    const defaultFields = ['title', 'subtitle', 'description', 'image_url'];
    const fieldsToShow = Object.keys(content).length > 0 ? Object.keys(content) : defaultFields;

    return (
        <div className="space-y-6">
            {/* Success Message */}
            {successMessage && (
                <div className="flex items-center gap-2 rounded-lg border border-green-800 bg-green-900/50 p-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* General Error Message */}
            {errors.general && (
                <div className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-900/50 p-3 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>{errors.general}</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <a href="/admin/content" className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </a>
                    <div>
                        <h1 className="text-3xl font-bold text-white capitalize">{section} Section</h1>
                        <p className="mt-2 text-zinc-400">Edit content for the {section} section.</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                </button>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                <div className="space-y-6">
                    {fieldsToShow.map(key => renderField(key, content[key]))}
                </div>

                {/* Add Field Button (Optional, for flexibility) */}
                <div className="mt-8 border-t border-zinc-800 pt-6">
                    <p className="mb-4 text-sm text-zinc-500">Add a new field if needed:</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="new-field-name"
                            placeholder="Field name (e.g., button_text)"
                            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
                        />
                        <button
                            onClick={() => {
                                const input = document.getElementById('new-field-name') as HTMLInputElement;
                                if (input.value) {
                                    handleChange(input.value, '');
                                    input.value = '';
                                }
                            }}
                            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                        >
                            Add Field
                        </button>
                    </div>
                </div>
            </div>

            {showMediaLibrary && (
                <MediaLibrary
                    onSelect={handleMediaSelect}
                    onClose={() => setShowMediaLibrary(null)}
                    multiple={mediaLibraryMultiple}
                    initialSelected={
                        mediaLibraryMultiple && Array.isArray(content[showMediaLibrary])
                            ? content[showMediaLibrary]
                            : []
                    }
                />
            )}
        </div>
    );
};

export default ContentEditor;
