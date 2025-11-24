import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { supabase } from '../../lib/supabase';

interface DistributionData {
    name: string;
    value: number;
    color: string;
}

const DistributionChart = () => {
    const [data, setData] = useState<DistributionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [artists, works, services] = await Promise.all([
                    supabase.from('artists').select('*', { count: 'exact', head: true }),
                    supabase.from('works').select('*', { count: 'exact', head: true }),
                    supabase.from('services').select('*', { count: 'exact', head: true }),
                ]);

                const chartData = [
                    { name: 'Artists', value: artists.count || 0, color: '#60a5fa' }, // blue-400
                    { name: 'Works', value: works.count || 0, color: '#a78bfa' },   // purple-400
                    { name: 'Services', value: services.count || 0, color: '#34d399' }, // emerald-400
                ];

                setData(chartData.filter(item => item.value > 0));
            } catch (error) {
                console.error('Error fetching distribution data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-zinc-400">Loading distribution...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20">
                <div className="text-zinc-500">No data available</div>
            </div>
        );
    }

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DistributionChart;
