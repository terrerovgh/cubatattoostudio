import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'

vi.mock('../src/lib/supabase', () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: 'u', email: 'admin@cubatattoostudio.com' } } })),
        getSession: vi.fn(async () => ({ data: { session: { user: { id: 'u', email: 'admin@cubatattoostudio.com' } } } })),
      },
      from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'admin' }, error: null }) }) }) }),
    },
  }
})

import AdminGuard from '../src/components/admin/AdminGuard'

describe('AdminGuard', () => {
  it('renders children when authorized', async () => {
    await act(async () => {
      render(
        <AdminGuard>
          <div>Authorized</div>
        </AdminGuard>
      )
    })
    expect(screen.getByText('Authorized')).toBeInTheDocument()
  })

  it('shows access restricted when not authorized', async () => {
    vi.resetModules()
    vi.doMock('../src/lib/supabase', () => {
      return {
        supabase: {
          auth: {
            getUser: vi.fn(async () => ({ data: { user: { id: 'u', email: 'normal@test.com' } } })),
            getSession: vi.fn(async () => ({ data: { session: { user: { id: 'u', email: 'normal@test.com' } } } })),
          },
          from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'user' }, error: null }) }) }) }),
        },
      }
    })
    const { default: Guard } = await import('../src/components/admin/AdminGuard')
    await act(async () => {
      render(
        <Guard>
          <div>Child</div>
        </Guard>
      )
    })
    expect(screen.getByText('Acceso restringido')).toBeInTheDocument()
  })
})
