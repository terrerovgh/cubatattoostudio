import React, { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon, Trash2, Check } from 'lucide-react';
import { listAssets, uploadAsset, getAssetUrl } from '../../../lib/supabase-helpers';
import { supabase } from '../../../lib/supabase';

interface MediaLibraryProps {
    onSelect: (url: string | string[]) => void;
    onClose: () => void;
    multiple?: boolean;
    initialSelected?: string[];
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelect, onClose, multiple = false, initialSelected = [] }) => {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState<string[]>(initialSelected);

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        setLoading(true);
        try {
            const files = await listAssets('');
            // Map files to include public URL
            const filesWithUrl = files?.map((file: any) => ({
                ...file,
                url: getAssetUrl(file.name)
            })) || [];
            setAssets(filesWithUrl);
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

    const toggleSelection = (url: string) => {
        if (multiple) {
            setSelected(prev =>
                prev.includes(url)
                    ? prev.filter(item => item !== url)
                    : [...prev, url]
            );
        } else {
            onSelect(url);
        }
    };

    const handleConfirmSelection = () => {
        onSelect(selected);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 p-6">
                    <h2 className="text-xl font-bold text-white">Media Library</h2>
                    <div className="flex items-center gap-4">
                        {multiple && (
                            <button
                                onClick={handleConfirmSelection}
                                className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-zinc-200"
                            >
                                Confirm Selection ({selected.length})
                            </button>
                        )}
                        <button onClick={onClose} className="text-zinc-400 hover:text-white">
                            Close
                        </button>
                    </div>
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

                            {assets.map((asset) => {
                                const isSelected = selected.includes(asset.url);
                                return (
                                    <div
                                        key={asset.name}
                                        onClick={() => toggleSelection(asset.url)}
                                        className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-zinc-900 ${isSelected ? 'border-white ring-2 ring-white' : 'border-zinc-800'}`}
                                    >
                                        <img
                                            src={asset.url}
                                            alt={asset.name}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 rounded-full bg-white p-1 text-zinc-950 shadow-lg">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        )}
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
                                            {!multiple && (
                                                <button
                                                    className="w-full rounded-lg bg-white py-1.5 text-xs font-bold text-zinc-950 hover:bg-zinc-200"
                                                >
                                                    Select
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaLibrary;
