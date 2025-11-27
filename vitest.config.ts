import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html', 'clover'],
      include: [
        'src/pages/api/users.ts',
        'src/components/auth/**/*.tsx',
        'src/components/admin/**/*.tsx',
        'src/components/admin/table-utils.ts',
        'src/lib/supabase-helpers.ts',
      ],
      thresholds: {
        lines: 20,
        statements: 20,
        functions: 20,
        branches: 20,
      },
    },
  },
})
