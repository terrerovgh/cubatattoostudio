import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config()

const url = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@cubatattoostudio.com'
const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'

async function main() {
  const adminClient = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data: existingUser } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 200 })
  const found = existingUser.users.find(u => u.email === adminEmail)
  let userId = found?.id
  if (!found) {
    const { data, error } = await adminClient.auth.admin.createUser({ email: adminEmail, password: adminPassword, email_confirm: true })
    if (error) {
      console.error('Error creating admin user:', error)
      process.exit(1)
    }
    userId = data.user?.id || null
    console.log('Created admin user:', adminEmail)
  } else {
    console.log('Admin user already exists:', adminEmail)
  }
  if (!userId) {
    console.error('No admin user id found')
    process.exit(1)
  }
  const { error: upsertError } = await adminClient
    .from('profiles')
    .upsert({ id: userId, role: 'admin', display_name: 'Administrator' }, { onConflict: 'id' })
  if (upsertError) {
    console.error('Error upserting admin profile:', upsertError)
    process.exit(1)
  }
  console.log('Admin profile upserted with role=admin')
}

main().catch(err => { console.error(err); process.exit(1) })

