import { supabase } from './supabase';
import type { ActivityData, RecentActivityItem } from '../types/activity';

/**
 * Generates activity data for the last 7 days
 * Aggregates works, artists, and services created/updated each day
 */
export async function generateActivityData(): Promise<ActivityData[]> {
    const days = 7;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(now);
    start.setDate(start.getDate() - (days - 1));
    const end = new Date(now);
    end.setDate(end.getDate() + 1);

    const dateKeys: string[] = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dateKeys.push(d.toISOString().split('T')[0]);
    }

    const buckets: Record<string, ActivityData> = Object.fromEntries(
        dateKeys.map((k) => [k, { date: k, works: 0, artists: 0, services: 0 }])
    );

    try {
        const [worksRes, artistsRes, servicesRes] = await Promise.all([
            supabase
                .from('works')
                .select('id, created_at')
                .gte('created_at', start.toISOString())
                .lt('created_at', end.toISOString()),
            supabase
                .from('artists')
                .select('id, created_at')
                .gte('created_at', start.toISOString())
                .lt('created_at', end.toISOString()),
            supabase
                .from('services')
                .select('id, created_at')
                .gte('created_at', start.toISOString())
                .lt('created_at', end.toISOString()),
        ]);

        const works = worksRes.data || [];
        const artists = artistsRes.data || [];
        const services = servicesRes.data || [];

        for (const w of works as any[]) {
            const key = new Date(w.created_at).toISOString().split('T')[0];
            if (buckets[key]) buckets[key].works += 1;
        }
        for (const a of artists as any[]) {
            const key = new Date(a.created_at).toISOString().split('T')[0];
            if (buckets[key]) buckets[key].artists += 1;
        }
        for (const s of services as any[]) {
            const key = new Date(s.created_at).toISOString().split('T')[0];
            if (buckets[key]) buckets[key].services += 1;
        }
    } catch (error) {
        return dateKeys.map((k) => ({ date: k, works: 0, artists: 0, services: 0 }));
    }

    return dateKeys.map((k) => buckets[k]);
}

/**
 * Fetches recent activity across all content tables
 */
export async function fetchRecentActivity(): Promise<RecentActivityItem[]> {
    const activities: RecentActivityItem[] = [];

    try {
        // Fetch recent works
        const { data: works } = await supabase
            .from('works')
            .select('id, title, created_at, updated_at')
            .order('created_at', { ascending: false })
            .limit(5);

        if (works) {
            works.forEach((work: any) => {
                activities.push({
                    id: work.id,
                    type: 'work',
                    action: 'created',
                    entityName: work.title,
                    timestamp: work.created_at,
                });
            });
        }

        // Fetch recent artists
        const { data: artists } = await supabase
            .from('artists')
            .select('id, name, created_at, updated_at')
            .order('created_at', { ascending: false })
            .limit(5);

        if (artists) {
            artists.forEach((artist: any) => {
                activities.push({
                    id: artist.id,
                    type: 'artist',
                    action: 'created',
                    entityName: artist.name,
                    timestamp: artist.created_at,
                });
            });
        }

        // Fetch recent services
        const { data: services } = await supabase
            .from('services')
            .select('id, title, created_at, updated_at')
            .order('created_at', { ascending: false })
            .limit(5);

        if (services) {
            services.forEach((service: any) => {
                activities.push({
                    id: service.id,
                    type: 'service',
                    action: 'created',
                    entityName: service.title,
                    timestamp: service.created_at,
                });
            });
        }

        // Sort all activities by timestamp and return top 10
        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        return [];
    }
}

/**
 * Formats a timestamp as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }

    return 'just now';
}
