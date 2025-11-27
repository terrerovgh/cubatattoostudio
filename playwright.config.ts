import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npm run dev',
    port: 4321,
    reuseExistingServer: true,
    timeout: 120000,
  },
})
