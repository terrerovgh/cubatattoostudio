import { test, expect } from '@playwright/test'

const mockUsers = Array.from({ length: 8 }).map((_, i) => ({
  id: `u${i + 1}`,
  email: `user${i + 1}@x.com`,
  display_name: `User ${i + 1}`,
  role: i % 2 === 0 ? 'user' : 'admin',
  created_at: `2024-01-${String(i + 1).padStart(2, '0')}`,
}))

test.describe('Admin Users table', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Auth endpoints
    await page.route('**/auth/v1/token?grant_type=password', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'fake-jwt',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake-refresh',
          user: {
            id: 'admin-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'admin@cubatattoostudio.com',
            app_metadata: { provider: 'email' },
            user_metadata: {},
            created_at: new Date().toISOString(),
          }
        }),
        headers: { 'content-type': 'application/json' }
      })
    })

    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: 'admin-id',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'admin@cubatattoostudio.com',
          app_metadata: { provider: 'email' },
          user_metadata: {},
          created_at: new Date().toISOString(),
        }),
        headers: { 'content-type': 'application/json' }
      })
    })

    await page.route('**/rest/v1/profiles*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ role: 'admin' }),
        headers: { 'content-type': 'application/json' }
      })
    })

    await page.route('**/api/users?action=list', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify(mockUsers), headers: { 'content-type': 'application/json' } })
    })

    // Perform login
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@cubatattoostudio.com')
    await page.getByLabel('Contraseña').fill('secret123')
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click()
    await page.waitForURL('**/admin/dashboard')
    
    // Now navigate to users page
    await page.goto('/admin/users')

    await page.route('**/api/users', async route => {
      const req = route.request()
      if (req.method() === 'POST') {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }), headers: { 'content-type': 'application/json' } })
        return
      }
      await route.continue()
    })
  })

  test('filter, sort, paginate, change role', async ({ page }) => {
    await page.goto('/admin/users')
    await expect(page.getByText('Create User')).toBeVisible()
    await page.getByPlaceholder('Filter').fill('User 5')
    await expect(page.getByText('User 5')).toBeVisible()
    await page.getByLabel('Sort By').selectOption('email')
    await page.getByLabel('Sort Direction').selectOption('desc')
    const firstSelect = page.getByRole('combobox').last() // Role selector in the row
    await firstSelect.selectOption('admin')
    await expect(page.getByText('User role updated to admin')).toBeVisible()
    await page.getByText('Next').click()
  })
})
