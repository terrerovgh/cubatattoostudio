import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

if (!(globalThis as any).fetch) {
  ;(globalThis as any).fetch = async () => {
    throw new Error('fetch not mocked')
  }
}

vi.stubGlobal('Headers', (globalThis as any).Headers)
vi.stubGlobal('Request', (globalThis as any).Request)
vi.stubGlobal('Response', (globalThis as any).Response)
