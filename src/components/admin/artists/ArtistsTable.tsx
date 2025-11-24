import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/supabase';

type Artist = Database['public']['Tables']['artists']['Row'];

const ArtistsTable = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [deleteLoading, setDeleteLoading] = useState<string>('');

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        try {
            setError('');

            // Get auth token
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token || '';

            // Fetch via API endpoint
            const response = await fetch('/api/artists', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
                throw new Error(errorData.error?.message || 'Failed to fetch artists');
            }

            const data = await response.json();
            setArtists(data || []);
        } catch (error: any) {
            console.error('Error fetching artists:', error);
            setError(error.message || 'Failed to fetch artists. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const artist = artists.find(a => a.id === id);
        if (!artist) return;

        if (!window.confirm(`Are you sure you want to delete "${artist.name}"? This action cannot be undone.`)) return;

        setDeleteLoading(id);
        setError('');
        setSuccess('');

        try {
            // Get auth token
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token || '';

            // Delete via API endpoint
            const response = await fetch('/api/artists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    action: 'delete',
                    artistId: id
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
                throw new Error(errorData.error?.message || 'Failed to delete artist');
            }

            setSuccess(`Artist "${artist.name}" deleted successfully!`);
            setTimeout(() => setSuccess(''), 3000);

            // Remove the deleted artist from the list
            setArtists(prev => prev.filter(a => a.id !== id));
        } catch (error: any) {
            console.error('Error deleting artist:', error);
            setError(error.message || 'Failed to delete artist. Please try again.');
            setTimeout(() => setError(''), 5000);
        } finally {
            setDeleteLoading('');
        }
    };

    if (loading) return <div className="text-zinc-400">Loading artists...</div>;

    return (
        <div className="space-y-4">
            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-900/50 p-3 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="flex items-center gap-2 rounded-lg border border-green-800 bg-green-900/50 p-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>{success}</span>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={() => window.location.href = '/admin/artists/new'}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                >
                    <Plus className="h-4 w-4" />
                    Add Artist
                </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-900 text-xs uppercase text-zinc-200">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Specialty</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {artists.map((artist) => (
                            <tr key={artist.id} className="hover:bg-zinc-900/50">
                                <td className="px-6 py-4 font-medium text-white">{artist.name}</td>
                                <td className="px-6 py-4">{artist.specialty}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${artist.is_active
                                            ? 'bg-emerald-400/10 text-emerald-400'
                                            : 'bg-zinc-400/10 text-zinc-400'
                                            }`}
                                    >
                                        {artist.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => window.location.href = `/admin/artists/${artist.id}`}
                                            className="rounded p-1 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                                            disabled={deleteLoading === artist.id}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(artist.id)}
                                            className="rounded p-1 hover:bg-red-900/30 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={deleteLoading === artist.id}
                                        >
                                            {deleteLoading === artist.id ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {artists.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                    No artists found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ArtistsTable;
