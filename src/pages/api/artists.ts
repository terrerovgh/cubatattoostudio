import type { APIRoute } from 'astro'
import { createClient } from '@supabase/supabase-js'

export const prerender = false;

const url = import.meta.env.PUBLIC_SUPABASE_URL as string
const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined

function decodeJwt(token: string): any {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/').padEnd((Math.ceil(parts[1].length / 4) * 4), '=')
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
        const payload = new TextDecoder('utf-8').decode(bytes)
        return JSON.parse(payload)
    } catch {
        return null
    }
}

function checkAdmin(userEmail: string | undefined, profile: any): boolean {
    const adminEmails = ['terrerov@gmail.com', 'admin@cubatattoostudio.com'];
    return profile?.role === 'admin' || adminEmails.includes(userEmail || '');
}

export const GET: APIRoute = async ({ request }) => {
    if (!url || !serviceKey) return new Response('Server not configured', { status: 500 })
    const auth = request.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    const payload = token ? decodeJwt(token) : null
    if (!payload?.sub) return new Response('Unauthorized', { status: 401 })

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    // Check if requester is admin
    const { data: user } = await supabase.auth.admin.getUserById(payload.sub)
    const userEmail = user?.user?.email

    const adminEmails = ['terrerov@gmail.com', 'admin@cubatattoostudio.com'];
    const isAdmin = adminEmails.includes(userEmail || '');

    if (!isAdmin) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', payload.sub)
            .single()

        if (profile?.role !== 'admin') {
            return new Response('Forbidden', { status: 403 })
        }
    }

    // Fetch all artists using Service Role Key (bypasses RLS)
    const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .order('display_order', { ascending: true })

    if (error) {
        return new Response(JSON.stringify({ error }), { status: 400 })
    }

    return new Response(JSON.stringify(artists), {
        status: 200,
        headers: { 'content-type': 'application/json' }
    })
}

export const POST: APIRoute = async ({ request }) => {
    if (!url || !serviceKey) return new Response('Server not configured', { status: 500 })
    const auth = request.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    const payload = token ? decodeJwt(token) : null
    if (!payload?.sub) return new Response('Unauthorized', { status: 401 })

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    // Check if requester is admin
    const { data: user } = await supabase.auth.admin.getUserById(payload.sub)
    const userEmail = user?.user?.email

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', payload.sub)
        .single()

    if (!checkAdmin(userEmail, profile)) {
        return new Response('Forbidden', { status: 403 })
    }

    const body = await request.json()
    const { action, artistId, artistData } = body

    // Handle different actions
    if (action === 'create') {
        try {
            const { data, error } = await supabase
                .from('artists')
                .insert(artistData)
                .select()
                .single()

            if (error) throw error

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'content-type': 'application/json' }
            })
        } catch (error: any) {
            return new Response(JSON.stringify({ error: { message: error.message } }), { status: 400 })
        }
    }

    if (action === 'update') {
        if (!artistId) {
            return new Response(JSON.stringify({ error: { message: 'Artist ID is required' } }), { status: 400 })
        }

        try {
            const { data, error } = await supabase
                .from('artists')
                .update(artistData)
                .eq('id', artistId)
                .select()
                .single()

            if (error) throw error

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'content-type': 'application/json' }
            })
        } catch (error: any) {
            return new Response(JSON.stringify({ error: { message: error.message } }), { status: 400 })
        }
    }

    if (action === 'delete') {
        if (!artistId) {
            return new Response(JSON.stringify({ error: { message: 'Artist ID is required' } }), { status: 400 })
        }

        try {
            const { error } = await supabase
                .from('artists')
                .delete()
                .eq('id', artistId)

            if (error) throw error

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'content-type': 'application/json' }
            })
        } catch (error: any) {
            // Check for foreign key constraint violation
            if (error.code === '23503') {
                return new Response(JSON.stringify({
                    error: { message: 'Cannot delete this artist because they have associated works. Please remove their works first.' }
                }), { status: 400 })
            }
            return new Response(JSON.stringify({ error: { message: error.message } }), { status: 400 })
        }
    }

    return new Response(JSON.stringify({ error: { message: 'Invalid action' } }), { status: 400 })
}
