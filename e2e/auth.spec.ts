import { test, expect } from '@playwright/test'

test.describe('Auth flow', () => {
  test('login via email/password redirects to admin dashboard', async ({ page }) => {
    // Mock login response
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

    // Mock user response (for subsequent checks)
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

    // Mock profile check
    await page.route('**/rest/v1/profiles*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ role: 'admin' }),
        headers: { 'content-type': 'application/json' }
      })
    })

    // Mock dashboard stats
    await page.route('**/rest/v1/artists*', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify([]), headers: { 'content-type': 'application/json', 'content-range': '0-0/0' } })
    })
    await page.route('**/rest/v1/works*', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify([]), headers: { 'content-type': 'application/json', 'content-range': '0-0/0' } })
    })
    await page.route('**/rest/v1/services*', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify([]), headers: { 'content-type': 'application/json', 'content-range': '0-0/0' } })
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@cubatattoostudio.com')
    await page.getByLabel('Contraseña').fill('secret123')
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click()
    
    // Wait for navigation and verify dashboard content
    await page.waitForURL('**/admin/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('protected route redirects to login when not authenticated', async ({ page }) => {
    // Mock unauthenticated user
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
        headers: { 'content-type': 'application/json' }
      })
    })

    await page.goto('/admin/users')
    await page.waitForURL('**/login')
    await expect(page.getByRole('heading', { name: 'Cuba Tattoo Studio' })).toBeVisible()
  })
})
