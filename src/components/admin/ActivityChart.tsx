import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { generateActivityData } from '../../lib/activity-helpers';
import type { ActivityData } from '../../types/activity';

const ActivityChart = () => {
    const [data, setData] = useState<ActivityData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activityData = await generateActivityData();
                setData(activityData);
            } catch (error) {
                console.error('Error fetching activity data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-zinc-400">Loading activity data...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20">
                <div className="text-zinc-500">No activity data available</div>
            </div>
        );
    }

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                        dataKey="date"
                        stroke="#71717a"
                        tick={{ fill: '#71717a' }}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }}
                    />
                    <YAxis stroke="#71717a" tick={{ fill: '#71717a' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        labelStyle={{ color: '#a1a1aa' }}
                    />
                    <Legend
                        wrapperStyle={{
                            paddingTop: '20px',
                        }}
                        iconType="line"
                    />
                    <Line
                        type="monotone"
                        dataKey="works"
                        stroke="#a78bfa"
                        strokeWidth={2}
                        name="Works"
                        dot={{ fill: '#a78bfa', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="artists"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        name="Artists"
                        dot={{ fill: '#60a5fa', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="services"
                        stroke="#34d399"
                        strokeWidth={2}
                        name="Services"
                        dot={{ fill: '#34d399', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;
