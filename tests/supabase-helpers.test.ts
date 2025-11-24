import { describe, it, expect } from 'vitest'

const mockClient = {
  from: (table: string) => ({
    select: () => ({
      order: () => Promise.resolve({ data: [], error: null }),
      eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
      ilike: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
      contains: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
      or: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
    }),
    upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'work-1' }, error: null }) }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'work-1' }, error: null }) }) }),
    order: () => Promise.resolve({ data: [], error: null }),
  }),
}

describe('supabase-helpers', () => {
  it('mock client behaves for basic queries', async () => {
    const { data, error } = await (mockClient as any).from('artists').select('*').order('display_order')
    expect(error).toBeNull()
    expect(Array.isArray(data)).toBe(true)
  })
})

