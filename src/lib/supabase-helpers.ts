import { supabase } from './supabase';
import type { PageComponent } from '../types/editor';

/**
 * Get site content for a section
 */
export async function getSiteContent(section: string) {
    const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', section)
        .single();

    if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found", which is ok for new sections
        throw error;
    }

    return data;
}

/**
 * Update site content for a section
 */
export async function updateSiteContent(section: string, content: any) {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData?.session?.access_token || ''
    const res = await fetch('/api/site-content', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ section, content }),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const e: any = new Error(err?.error?.message || res.statusText)
        if (err?.error?.code) e.code = err.error.code
        throw e
    }
    return await res.json()
}

/**
 * Upload an asset to Supabase Storage
 */
export async function uploadAsset(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) throw error;

    const {
        data: { publicUrl },
    } = supabase.storage.from('site-assets').getPublicUrl(path);

    return publicUrl;
}

/**
 * Delete an asset from Supabase Storage
 */
export async function deleteAsset(path: string): Promise<void> {
    const { error } = await supabase.storage.from('site-assets').remove([path]);

    if (error) throw error;
}

/**
 * List all assets in a folder
 */
export async function listAssets(folder: string = '') {
    const { data, error } = await supabase.storage.from('site-assets').list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) throw error;
    return data;
}

/**
 * Get URL for an asset
 */
export function getAssetUrl(path: string): string {
    const {
        data: { publicUrl },
    } = supabase.storage.from('site-assets').getPublicUrl(path);
    return publicUrl;
}

/**
 * Get all artists with their works
 */
export async function getArtistsWithWorks() {
    const { data, error } = await supabase
        .from('artists')
        .select(`*, works (*)`)
        .order('display_order');

    if (error) throw error;
    return data;
}

/**
 * Get artist by ID with extended data
 */
export async function getArtistExtended(artistId: string) {
    const { data, error } = await supabase
        .from('artists')
        .select(`*, works (*)`)
        .eq('id', artistId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update artist with extended fields
 */
export async function updateArtistExtended(artistId: string, updates: any) {
    const { data, error } = await supabase
        .from('artists')
        .update(updates)
        .eq('id', artistId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get work by ID with all related data
 */
export async function getWorkExtended(workId: string) {
    const { data, error } = await supabase
        .from('works')
        .select(`*, artists (*), services (*)`)
        .eq('id', workId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Create or update work with artist relationships
 */
export async function saveWorkWithArtists(work: any, artistIds: { artistId: string; role: string }[]) {
    const { data: workData, error: workError } = await supabase
        .from('works')
        .upsert(work)
        .select()
        .single()
    if (workError) throw workError

    const workId = workData.id
    const { data: existing } = await supabase
        .from('work_artists')
        .select('artist_id')
        .eq('work_id', workId)
    const incomingIds = artistIds.map(a => a.artistId)
    const toRemove = ((existing || []) as { artist_id: string }[]).filter(e => !incomingIds.includes(e.artist_id))
    if (toRemove.length > 0) {
        for (const r of toRemove) {
            await supabase
                .from('work_artists')
                .delete()
                .eq('work_id', workId)
                .eq('artist_id', r.artist_id)
        }
    }
    for (const rel of artistIds) {
        await supabase
            .from('work_artists')
            .upsert({ work_id: workId, artist_id: rel.artistId, role: rel.role }, { onConflict: 'work_id,artist_id' })
    }
    return workData
}

/**
 * Get all animations
 */
export async function getAnimations() {
    const { data, error } = await supabase
        .from('animations')
        .select('*')
        .eq('is_active', true)
        .order('name');

    if (error) throw error;
    return data;
}

/**
 * Save animation
 */
export async function saveAnimation(animation: any) {
    const { data, error } = await supabase.from('animations').upsert(animation).select().single();

    if (error) throw error;
    return data;
}

/**
 * Delete animation
 */
export async function deleteAnimation(animationId: string) {
    const { error } = await supabase.from('animations').delete().eq('id', animationId);

    if (error) throw error;
}

export async function getArtists(params?: { q?: string; specialty?: string; active?: boolean }) {
    let query = supabase.from('artists').select('*')
    if (params?.active !== undefined) query = query.eq('is_active', params.active)
    if (params?.specialty) query = query.ilike('specialty', `%${params.specialty}%`)
    if (params?.q) {
        query = query.or(`name.ilike.%${params.q}%,bio.ilike.%${params.q}%`)
    }
    const { data, error } = await query.order('display_order')
    if (error) throw error
    return data
}

export async function getWorks(params?: { tags?: string[]; serviceId?: string; artistId?: string; published?: boolean; featured?: boolean }) {
    let query = supabase.from('works').select('*')
    if (params?.published !== undefined) query = query.eq('published', params.published)
    if (params?.featured !== undefined) query = query.eq('featured', params.featured)
    if (params?.serviceId) query = query.eq('service_id', params.serviceId)
    if (params?.artistId) query = query.eq('artist_id', params.artistId)
    if (params?.tags && params.tags.length > 0) query = query.contains('tags', params.tags)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data
}

export async function updateUserRole(userId: string, role: string) {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData?.session?.access_token || ''
    const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId, role }),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const e: any = new Error(err?.error?.message || res.statusText)
        if (err?.error?.code) e.code = err.error.code
        throw e
    }
    return await res.json()
}

/**
 * Toggle a tag on a work
 */
export async function toggleWorkTag(workId: string, tag: string, active: boolean) {
    const { data: work, error: fetchError } = await supabase
        .from('works')
        .select('tags')
        .eq('id', workId)
        .single();

    if (fetchError) throw fetchError;

    const currentTags = work.tags || [];
    let newTags: string[];

    if (active) {
        if (!currentTags.includes(tag)) {
            newTags = [...currentTags, tag];
        } else {
            newTags = currentTags;
        }
    } else {
        newTags = currentTags.filter((t: string) => t !== tag);
    }

    const { data, error } = await supabase
        .from('works')
        .update({ tags: newTags })
        .eq('id', workId)
        .select()
        .single();

    if (error) throw error;
    return data;
}
