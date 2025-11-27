import { describe, it, expect, vi, beforeEach } from 'vitest'

function base64url(input: string) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function tokenWithSub(sub: string) {
  const header = base64url(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  const payload = base64url(JSON.stringify({ sub }))
  return `${header}.${payload}.sig`
}

let mock: any

beforeEach(() => {
  mock = {
    auth: {
      admin: {
        getUserById: vi.fn(async (id: string) => ({ data: { user: { id, email: 'user@test.com' } } })),
        listUsers: vi.fn(async () => ({ data: { users: [] }, error: null })),
        createUser: vi.fn(async ({ email }: any) => ({ data: { user: { id: 'new-user', email } }, error: null })),
        deleteUser: vi.fn(async () => ({ error: null })),
      },
    },
    from: vi.fn((table: string) => {
      if (table === 'profiles') {
        return {
          select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'admin' }, error: null }) }) }),
          insert: vi.fn(async () => ({ error: null })),
          update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: { id: 'u', role: 'admin' }, error: null }) }) }) }),
          delete: () => ({ eq: vi.fn(async () => ({ error: null })) }),
        }
      }
      return {
        select: vi.fn(async () => ({ data: [], error: null })),
      }
    }),
  }

  vi.resetModules()
  vi.mock('@supabase/supabase-js', () => ({ createClient: () => mock }))
  process.env.PUBLIC_SUPABASE_URL = 'http://localhost'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'sk'
})

describe('API users GET', () => {
  it('returns 401 without valid token', async () => {
    const mod = await import('../src/pages/api/users')
    const res = await mod.GET({ request: new Request('http://localhost/api/users', { method: 'GET' }) } as any)
    expect(res.status).toBe(401)
  })

  it('returns 403 when requester is not admin', async () => {
    mock.auth.admin.getUserById = vi.fn(async (id: string) => ({ data: { user: { id, email: 'notadmin@test.com' } } }))
    mock.from = vi.fn(() => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'user' }, error: null }) }) }) }))
    const mod = await import('../src/pages/api/users')
    const token = tokenWithSub('uid-1')
    const res = await mod.GET({ request: new Request('http://localhost/api/users', { method: 'GET', headers: new Headers({ authorization: `Bearer ${token}` }) }) } as any)
    expect(res.status).toBe(403)
  })

  it('returns 200 with merged users and profiles', async () => {
    mock.auth.admin.getUserById = vi.fn(async (id: string) => ({ data: { user: { id, email: 'admin@cubatattoostudio.com' } } }))
    mock.auth.admin.listUsers = vi.fn(async () => ({ data: { users: [{ id: 'u1', email: 'a@x.com', created_at: '2024-01-01' }, { id: 'u2', email: 'b@x.com', created_at: '2024-01-02' }] }, error: null }))
    mock.from = vi.fn(() => ({ select: vi.fn(async () => ({ data: [{ id: 'u1', display_name: 'A', role: 'admin' }, { id: 'u2', display_name: 'B', role: 'user' }], error: null })) }))
    const mod = await import('../src/pages/api/users')
    const token = tokenWithSub('uid-1')
    const res = await mod.GET({ request: new Request('http://localhost/api/users', { method: 'GET', headers: new Headers({ authorization: `Bearer ${token}` }) }) } as any)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.length).toBe(2)
    expect(json[0].display_name).toBe('A')
    expect(json[1].role).toBe('user')
  })

  it('returns 400 when listUsers fails', async () => {
    mock.auth.admin.getUserById = vi.fn(async (id: string) => ({ data: { user: { id, email: 'admin@cubatattoostudio.com' } } }))
    mock.auth.admin.listUsers = vi.fn(async () => ({ data: null, error: { message: 'fail' } }))
    const mod = await import('../src/pages/api/users')
    const token = tokenWithSub('uid-1')
    const res = await mod.GET({ request: new Request('http://localhost/api/users', { method: 'GET', headers: new Headers({ authorization: `Bearer ${token}` }) }) } as any)
    expect(res.status).toBe(400)
  })
})

describe('API users POST', () => {
  it('create returns 400 without email/password', async () => {
    const mod = await import('../src/pages/api/users')
    const token = tokenWithSub('uid-1')
    mock.auth.admin.getUserById = vi.fn(async (id: string) => ({ data: { user: { id, email: 'admin@cubatattoostudio.com' } } }))
    mock.from = vi.fn(() => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'admin' }, error: null }) }) }) }))
    const res = await mod.POST({ request: new Request('http://localhost/api/users', { method: 'POST', headers: new Headers({ authorization: `Bearer ${token}`, 'content-type': 'application/json' }), body: JSON.stringify({ action: 'create' }) }) } as any)
    expect(res.status).toBe(400)
  })

  it('create rollback when profile insert fails', async () => {
    mock.auth.admin.getUserById = vi.fn(async (id: string) => ({ data: { user: { id, email: 'admin@cubatattoostudio.com' } } }))
    mock.from = vi.fn(() => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'admin' }, error: null }) }) }),
      insert: vi.fn(async () => ({ error: { message: 'profile fail' } })),
    }))
    const mod = await import('../src/pages/api/users')
    const token = tokenWithSub('uid-1')
    const res = await mod.POST({ request: new Request('http://localhost/api/users', { method: 'POST', headers: new Headers({ authorization: `Bearer ${token}`, 'content-type': 'application/json' }), body: JSON.stringify({ action: 'create', email: 'e@x.com', password: 'secret123' }) }) } as any)
    expect(res.status).toBe(400)
    expect(mock.auth.admin.deleteUser).toHaveBeenCalled()
  })

  it('update returns 400 without userId', async () => {
    mock.auth.admin.getUserById = vi.fn(async (id: string) => ({ data: { user: { id, email: 'admin@cubatattoostudio.com' } } }))
    mock.from = vi.fn(() => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'admin' }, error: null }) }) }) }))
    const mod = await import('../src/pages/api/users')
    const token = tokenWithSub('uid-1')
    const res = await mod.POST({ request: new Request('http://localhost/api/users', { method: 'POST', headers: new Headers({ authorization: `Bearer ${token}`, 'content-type': 'application/json' }), body: JSON.stringify({ action: 'update', role: 'admin' }) }) } as any)
    expect(res.status).toBe(400)
  })

  it('delete returns 200 with userId', async () => {
    mock.auth.admin.getUserById = vi.fn(async (id: string) => ({ data: { user: { id, email: 'admin@cubatattoostudio.com' } } }))
    mock.from = vi.fn(() => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'admin' }, error: null }) }) }),
      delete: () => ({ eq: vi.fn(async () => ({ error: null })) }),
    }))
    const mod = await import('../src/pages/api/users')
    const token = tokenWithSub('uid-1')
    const res = await mod.POST({ request: new Request('http://localhost/api/users', { method: 'POST', headers: new Headers({ authorization: `Bearer ${token}`, 'content-type': 'application/json' }), body: JSON.stringify({ action: 'delete', userId: 'u-1' }) }) } as any)
    expect(res.status).toBe(200)
  })

  it('role update path returns 200', async () => {
    mock.auth.admin.getUserById = vi.fn(async (id: string) => ({ data: { user: { id, email: 'admin@cubatattoostudio.com' } } }))
    mock.from = vi.fn(() => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'admin' }, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: { id: 'u', role: 'admin' }, error: null }) }) }) }),
    }))
    const mod = await import('../src/pages/api/users')
    const token = tokenWithSub('uid-1')
    const res = await mod.POST({ request: new Request('http://localhost/api/users', { method: 'POST', headers: new Headers({ authorization: `Bearer ${token}`, 'content-type': 'application/json' }), body: JSON.stringify({ userId: 'u', role: 'admin' }) }) } as any)
    expect(res.status).toBe(200)
  })
})
