import { getCollection } from 'astro:content';


export async function getWorksByLocation(location: string) {
    const works = await getCollection('works', ({ data }) => {
        // Check if displayLocations exists and includes the requested location
        return data.displayLocations && data.displayLocations.includes(location as any);
    });
    return works;
}

export async function getWorksByArtist(artistSlug: string) {
    const works = await getCollection('works', ({ data }) => {
        return data.artist.slug === artistSlug;
    });
    return works;
}

// Re-export Supabase helpers for server-side use
export { getSiteContent, updateSiteContent, uploadAsset, listAssets } from './supabase-helpers';
