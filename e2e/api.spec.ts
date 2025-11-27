import { test, expect } from '@playwright/test'

test('api users returns 500 when server not configured', async ({ request }) => {
  const res = await request.get('/api/users')
  expect([500, 401]).toContain(res.status())
})
