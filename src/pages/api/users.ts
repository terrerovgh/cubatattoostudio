import type { APIRoute } from 'astro'
import { createClient } from '@supabase/supabase-js'
import { Buffer } from 'node:buffer'

export const prerender = false;

const url = import.meta.env.PUBLIC_SUPABASE_URL as string
const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined

function decodeJwt(token: string): any {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    try {
        const payload = Buffer.from(parts[1], 'base64url').toString('utf8')
        return JSON.parse(payload)
    } catch {
        return null
    }
}

export const GET: APIRoute = async ({ request }) => {
    if (!url || !serviceKey) return new Response('Server not configured', { status: 500 })
    const auth = request.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    const payload = token ? decodeJwt(token) : null
    if (!payload?.sub) return new Response('Unauthorized', { status: 401 })

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    // Check if requester is admin or allowed user
    const { data: user } = await supabase.auth.admin.getUserById(payload.sub)
    const userEmail = user?.user?.email

    // Use admin emails list to bypass recursion
    const adminEmails = ['terrerov@gmail.com', 'admin@cubatattoostudio.com'];
    const isAdmin = adminEmails.includes(userEmail || '');

    if (!isAdmin) {
        // Try to check role if not in admin emails list
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', payload.sub)
            .single()

        if (profile?.role !== 'admin') {
            return new Response('Forbidden', { status: 403 })
        }
    }

    // Fetch all users using Service Role Key (bypasses RLS)
    const { data: allUsers, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) {
        return new Response(JSON.stringify({ error: usersError }), { status: 400 })
    }

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')

    if (profilesError) {
        return new Response(JSON.stringify({ error: profilesError }), { status: 400 })
    }

    // Merge user data with profiles
    const usersWithProfiles = allUsers.users.map(authUser => {
        const profile = profiles?.find(p => p.id === authUser.id)
        return {
            id: authUser.id,
            email: authUser.email,
            display_name: profile?.display_name || authUser.email,
            role: profile?.role || 'user',
            created_at: authUser.created_at,
            ...profile
        }
    })

    return new Response(JSON.stringify(usersWithProfiles), {
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

    // Check if requester is admin or allowed user
    const { data: user } = await supabase.auth.admin.getUserById(payload.sub)
    const userEmail = user?.user?.email

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', payload.sub)
        .single()

    const adminEmails = ['terrerov@gmail.com', 'admin@cubatattoostudio.com'];
    const isAdmin = profile?.role === 'admin' || adminEmails.includes(userEmail || '');
    if (!isAdmin) return new Response('Forbidden', { status: 403 })

    const body = await request.json()
    const { action, userId, role, email, password, displayName } = body

    // Handle different actions
    if (action === 'create') {
        // Create new user
        if (!email || !password) {
            return new Response(JSON.stringify({ error: { message: 'Email and password are required' } }), { status: 400 })
        }

        try {
            // Create user in auth
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: {
                    display_name: displayName || email
                }
            })

            if (createError) throw createError

            // Create profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: newUser.user.id,
                    display_name: displayName || email,
                    role: role || 'user',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })

            if (profileError) {
                // Rollback: delete the auth user if profile creation fails
                await supabase.auth.admin.deleteUser(newUser.user.id)
                throw profileError
            }

            return new Response(JSON.stringify({ success: true, user: newUser.user }), {
                status: 200,
                headers: { 'content-type': 'application/json' }
            })
        } catch (error: any) {
            return new Response(JSON.stringify({ error: { message: error.message } }), { status: 400 })
        }
    }

    if (action === 'update') {
        // Update user
        if (!userId) {
            return new Response(JSON.stringify({ error: { message: 'User ID is required' } }), { status: 400 })
        }

        try {
            // Update profile
            const updateData: any = {
                updated_at: new Date().toISOString()
            }

            if (displayName !== undefined) updateData.display_name = displayName
            if (role !== undefined) updateData.role = role

            const { data, error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', userId)
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
        // Delete user
        if (!userId) {
            return new Response(JSON.stringify({ error: { message: 'User ID is required' } }), { status: 400 })
        }

        try {
            // Delete from auth (this will cascade to profiles if set up correctly)
            const { error } = await supabase.auth.admin.deleteUser(userId)
            if (error) throw error

            // Also delete profile manually to be safe
            await supabase
                .from('profiles')
                .delete()
                .eq('id', userId)

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'content-type': 'application/json' }
            })
        } catch (error: any) {
            return new Response(JSON.stringify({ error: { message: error.message } }), { status: 400 })
        }
    }

    // Default: Update role (backward compatibility)
    if (userId && role) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', userId)
            .select()
            .single()

        if (error) return new Response(JSON.stringify({ error }), { status: 400 })
        return new Response(JSON.stringify(data), { status: 200, headers: { 'content-type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: { message: 'Invalid action' } }), { status: 400 })
}
