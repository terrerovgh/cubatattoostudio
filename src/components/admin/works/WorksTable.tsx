import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/supabase';

type Work = Database['public']['Tables']['works']['Row'];

const WorksTable = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [deleteLoading, setDeleteLoading] = useState<string>('');

    useEffect(() => {
        fetchWorks();
    }, []);

    const fetchWorks = async () => {
        try {
            setError('');
            const { data, error } = await supabase
                .from('works')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWorks(data || []);
        } catch (error: any) {
            console.error('Error fetching works:', error);
            setError(error.message || 'Failed to fetch works. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const work = works.find(w => w.id === id);
        if (!work) return;

        if (!window.confirm(`Are you sure you want to delete "${work.title || 'this work'}"? This action cannot be undone.`)) return;

        setDeleteLoading(id);
        setError('');
        setSuccess('');

        try {
            const { error } = await supabase.from('works').delete().eq('id', id);
            if (error) throw error;
            
            setSuccess(`Work "${work.title || 'Untitled'}" deleted successfully!`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Remove the deleted work from the list
            setWorks(prev => prev.filter(w => w.id !== id));
        } catch (error: any) {
            console.error('Error deleting work:', error);
            
            if (error.message?.includes('permission denied')) {
                setError('You do not have permission to delete works.');
            } else {
                setError(error.message || 'Failed to delete work. Please try again.');
            }
            
            setTimeout(() => setError(''), 5000);
        } finally {
            setDeleteLoading('');
        }
    };

    if (loading) return <div className="text-zinc-400">Loading works...</div>;

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
                    onClick={() => window.location.href = '/admin/works/new'}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                >
                    <Plus className="h-4 w-4" />
                    Add Work
                </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-900 text-xs uppercase text-zinc-200">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {works.map((work) => (
                            <tr key={work.id} className="hover:bg-zinc-900/50">
                                <td className="px-6 py-4">
                                    {work.image_url && (
                                        <img src={work.image_url} alt={work.title || 'Work'} className="h-12 w-12 rounded object-cover" />
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium text-white">{work.title || 'Untitled'}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${work.published
                                                ? 'bg-emerald-400/10 text-emerald-400'
                                                : 'bg-zinc-400/10 text-zinc-400'
                                            }`}
                                    >
                                        {work.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => window.location.href = `/admin/works/${work.id}`}
                                            className="rounded p-1 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                                            disabled={deleteLoading === work.id}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(work.id)}
                                            className="rounded p-1 hover:bg-red-900/30 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={deleteLoading === work.id}
                                        >
                                            {deleteLoading === work.id ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {works.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                    No works found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorksTable;
