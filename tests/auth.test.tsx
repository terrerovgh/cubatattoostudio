import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'

vi.mock('../src/lib/supabase', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn(async () => ({ data: { session: { access_token: 't', user: { id: 'u', email: 'e@x.com' } } } })),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: vi.fn(async () => ({ data: { user: { id: 'u' }, session: { access_token: 't' } }, error: null })),
        signOut: vi.fn(async () => ({ error: null })),
      },
    },
  }
})

import { AuthProvider, useAuth } from '../src/components/auth/AuthProvider'

function Consumer() {
  const { user } = useAuth()
  return <div>{user?.email}</div>
}

describe('AuthProvider', () => {
  it('sets user from getSession', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      )
    })
    expect(screen.getByText('e@x.com')).toBeInTheDocument()
  })
})

describe('ProtectedRoute', () => {
  it('redirects to login when no user', async () => {
    vi.resetModules()
    vi.doMock('../src/lib/supabase', () => {
      return {
        supabase: {
          auth: {
            getSession: vi.fn(async () => ({ data: { session: null } })),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          },
        },
      }
    })
    const { AuthProvider: Provider } = await import('../src/components/auth/AuthProvider')
    const { default: PR } = await import('../src/components/auth/ProtectedRoute')
    Object.defineProperty(window, 'location', { value: { assign: vi.fn() } })
    await act(async () => {
      render(
        <Provider>
          <PR>
            <div>Private</div>
          </PR>
        </Provider>
      )
    })
    expect(window.location.assign).toHaveBeenCalledWith('/login')
  })
})
