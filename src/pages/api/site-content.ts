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

export const GET: APIRoute = async ({ url: reqUrl }) => {
  if (!url || !serviceKey) return new Response('Server not configured', { status: 500 })
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const section = reqUrl.searchParams.get('section') || ''
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('section', section)
    .single()
  if (error && error.code !== 'PGRST116') return new Response(JSON.stringify({ error }), { status: 400 })
  return new Response(JSON.stringify(data || null), { status: 200, headers: { 'content-type': 'application/json' } })
}

export const POST: APIRoute = async ({ request }) => {
  if (!url || !serviceKey) return new Response('Server not configured', { status: 500 })
  const auth = request.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  const payload = token ? decodeJwt(token) : null
  if (!payload?.sub) return new Response('Unauthorized', { status: 401 })

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: user, error: userError } = await supabase.auth.admin.getUserById(payload.sub)
  const userEmail = user?.user?.email

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', payload.sub)
    .single()

  const adminEmails = ['terrerov@gmail.com', 'admin@cubatattoostudio.com'];
  const isAdmin = profile?.role === 'admin' || adminEmails.includes(userEmail || '');
  if (!isAdmin) return new Response('Forbidden', { status: 403 })

  const body = await request.json()
  const section = body.section as string
  const content = body.content

  const { data, error } = await supabase
    .from('site_content')
    .upsert({ section, content, updated_at: new Date().toISOString() }, { onConflict: 'section' })
    .select()
    .single()
  if (error) return new Response(JSON.stringify({ error }), { status: 400 })
  return new Response(JSON.stringify(data), { status: 200, headers: { 'content-type': 'application/json' } })
}
