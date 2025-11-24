import { supabase } from './supabase'

export async function getCurrentUserProfile() {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  if (error) return null
  return data
}

export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, display_name, avatar_url')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

