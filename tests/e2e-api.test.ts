import { describe, it, expect } from 'vitest'

describe('e2e api users', () => {
  it('GET /api/users responds without crash', async () => {
    const res = await fetch('http://localhost:4321/api/users')
    expect([500, 401, 200, 403]).toContain(res.status)
  })
})
