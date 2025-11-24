import React, { useEffect, useState } from 'react';
import { Image, Users, FileText, Clock } from 'lucide-react';
import { fetchRecentActivity, formatRelativeTime } from '../../lib/activity-helpers';
import type { RecentActivityItem } from '../../types/activity';

const RecentActivity = () => {
    const [activities, setActivities] = useState<RecentActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchRecentActivity();
                setActivities(data);
            } catch (error) {
                console.error('Error fetching recent activity:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'work':
                return <Image className="h-5 w-5 text-purple-400" />;
            case 'artist':
                return <Users className="h-5 w-5 text-blue-400" />;
            case 'service':
                return <FileText className="h-5 w-5 text-emerald-400" />;
            default:
                return <Clock className="h-5 w-5 text-zinc-400" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'work':
                return 'Work';
            case 'artist':
                return 'Artist';
            case 'service':
                return 'Service';
            default:
                return 'Item';
        }
    };

    const getActionColor = (action: string) => {
        return action === 'created' ? 'text-emerald-400' : 'text-amber-400';
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-zinc-400">Loading recent activity...</div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20">
                <div className="text-zinc-500">No recent activity</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div
                    key={`${activity.type}-${activity.id}`}
                    className="flex items-start gap-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 transition-colors hover:bg-zinc-900/50"
                >
                    <div className="rounded-lg bg-zinc-800/50 p-2">
                        {getIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{activity.entityName}</span>
                            <span className="text-xs text-zinc-500">•</span>
                            <span className="text-xs text-zinc-400">{getTypeLabel(activity.type)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className={getActionColor(activity.action)}>
                                {activity.action}
                            </span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500">
                                {formatRelativeTime(activity.timestamp)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecentActivity;
