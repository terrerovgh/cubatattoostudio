import React, { useEffect, useState } from 'react';
import { Users, Image, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DashboardStats = () => {
    const [stats, setStats] = useState({
        artists: 0,
        works: 0,
        services: 0,
    });
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setError(null);
        setLoading(true);
        try {
            const [artists, works, services] = await Promise.all([
                supabase.from('artists').select('*', { count: 'exact', head: true }),
                supabase.from('works').select('*', { count: 'exact', head: true }),
                supabase.from('services').select('*', { count: 'exact', head: true }),
            ]);

            if (artists.error) throw artists.error;
            if (works.error) throw works.error;
            if (services.error) throw services.error;

            setStats({
                artists: artists.count || 0,
                works: works.count || 0,
                services: services.count || 0,
            });
        } catch (error: any) {
            console.error('Error fetching stats:', error);
            setError(error.message || 'Error fetching stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        {
            label: 'Total Artists',
            value: stats.artists,
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
        },
        {
            label: 'Total Works',
            value: stats.works,
            icon: Image,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
        },
        {
            label: 'Services',
            value: stats.services,
            icon: FileText,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
        },
    ];

    if (loading) {
        return <div className="text-zinc-400">Loading stats...</div>;
    }

    if (error) {
        return (
            <div className="text-red-400">
                Error: {error}
                <button onClick={fetchStats} className="ml-4 underline">Retry</button>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                            <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                        </div>
                        <div className={`rounded-lg p-3 ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
