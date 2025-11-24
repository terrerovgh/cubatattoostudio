export interface ActivityData {
    date: string;
    works: number;
    artists: number;
    services: number;
}

export interface RecentActivityItem {
    id: string;
    type: 'work' | 'artist' | 'service';
    action: 'created' | 'updated';
    entityName: string;
    timestamp: string;
    userId?: string;
}
