import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/supabase';

type Service = Database['public']['Tables']['services']['Row'];

const ServicesTable = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) throw error;
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Error deleting service');
        }
    };

    if (loading) return <div className="text-zinc-400">Loading services...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => window.location.href = '/admin/services/new'}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                >
                    <Plus className="h-4 w-4" />
                    Add Service
                </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-900 text-xs uppercase text-zinc-200">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {services.map((service) => (
                            <tr key={service.id} className="hover:bg-zinc-900/50">
                                <td className="px-6 py-4 font-medium text-white">{service.title}</td>
                                <td className="px-6 py-4">{service.slug}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${service.is_active
                                                ? 'bg-emerald-400/10 text-emerald-400'
                                                : 'bg-zinc-400/10 text-zinc-400'
                                            }`}
                                    >
                                        {service.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => window.location.href = `/admin/services/${service.id}`}
                                            className="rounded p-1 hover:bg-zinc-800 hover:text-white"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="rounded p-1 hover:bg-red-900/30 hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {services.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                    No services found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServicesTable;
