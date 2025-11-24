import React, { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon, Trash2, Check } from 'lucide-react';
import { listAssets, uploadAsset } from '../../../lib/supabase-helpers';
import { supabase } from '../../../lib/supabase';

interface MediaLibraryProps {
    onSelect: (url: string) => void;
    onClose: () => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelect, onClose }) => {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        setLoading(true);
        try {
            // List assets from root and subfolders if needed. 
            // For now, let's list from root and maybe specific folders if we organize them.
            // listAssets defaults to root.
            // We might want to list recursively or just flatten for now.
            // Let's try listing from a few common folders or just root.
            // Actually, listAssets takes a path. Let's list root for now.
            const files = await listAssets('');
            // We might also want to list 'hero', 'gallery', etc if we saved them there.
            // For simplicity, let's just list everything we can find or just root.
            // If we want to see files in subfolders, we need to list those folders.
            // But listAssets doesn't do recursive.
            // Let's just list root for now, and maybe we can add folder navigation later.
            setAssets(files);
        } catch (error) {
            console.error('Error loading assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            const path = `${Date.now()}-${file.name}`;
            await uploadAsset(file, path);
            await loadAssets(); // Reload list
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (fileName: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const { error } = await supabase.storage
                .from('site-assets')
                .remove([fileName]);

            if (error) throw error;

            await loadAssets();
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 p-6">
                    <h2 className="text-xl font-bold text-white">Media Library</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        Close
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {/* Upload Button */}
                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 transition-colors hover:border-zinc-500 hover:bg-zinc-900">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*,video/*"
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                                ) : (
                                    <>
                                        <ImageIcon className="h-8 w-8 text-zinc-500" />
                                        <span className="mt-2 text-xs font-medium text-zinc-400">Upload New</span>
                                    </>
                                )}
                            </label>

                            {assets.map((asset) => (
                                <div key={asset.name} className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                                    <img
                                        src={asset.url}
                                        alt={asset.name}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-between bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 p-2">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(asset.name);
                                                }}
                                                className="rounded-full bg-red-500/20 p-1.5 text-red-400 hover:bg-red-500 hover:text-white"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => onSelect(asset.url)}
                                            className="w-full rounded-lg bg-white py-1.5 text-xs font-bold text-zinc-950 hover:bg-zinc-200"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaLibrary;
