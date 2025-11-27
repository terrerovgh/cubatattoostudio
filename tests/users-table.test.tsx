import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'

vi.mock('../src/lib/supabase', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn(async () => ({ data: { session: { access_token: 't' } } })),
      },
    },
  }
})

vi.mock('../src/lib/supabase-helpers', () => ({
  updateUserRole: vi.fn(async () => ({})),
}))

const rows = Array.from({ length: 12 }).map((_, i) => ({
  id: `u${i + 1}`,
  email: `user${i + 1}@x.com`,
  display_name: `User ${i + 1}`,
  role: i % 2 === 0 ? 'user' : 'admin',
  created_at: `2024-01-${String(i + 1).padStart(2, '0')}`,
}))

beforeEach(() => {
  vi.resetModules()
  ;(globalThis as any).fetch = vi.fn(async (url: string, init?: any) => {
    if (String(url).includes('/api/users') && (!init || init.method === 'GET')) {
      return new Response(JSON.stringify(rows), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'content-type': 'application/json' } })
  })
})

describe('UsersTable', () => {
  it('renders and filters, sorts, paginates', async () => {
    const mod = await import('../src/components/admin/users/UsersTable')
    render(<mod.default />)
    await waitFor(() => expect(screen.getByText('Create User')).toBeInTheDocument())
    expect(screen.getByText('User 1')).toBeInTheDocument()
    const filter = screen.getByPlaceholderText('Filter')
    fireEvent.change(filter, { target: { value: 'User 10' } })
    expect(screen.getByText('User 10')).toBeInTheDocument()
    expect(screen.queryByText('User 1')).not.toBeInTheDocument()

    const sortKey = screen.getByDisplayValue('Name')
    fireEvent.change(sortKey, { target: { value: 'email' } })
    const sortDir = screen.getByDisplayValue('Asc')
    fireEvent.change(sortDir, { target: { value: 'desc' } })
  })

  it('changes role using updateUserRole', async () => {
    const mod = await import('../src/components/admin/users/UsersTable')
    const { updateUserRole } = await import('../src/lib/supabase-helpers')
    render(<mod.default />)
    await waitFor(() => expect(screen.getByText('Create User')).toBeInTheDocument())
    const selects = screen.getAllByRole('combobox')
    const roleSelect = selects.find(sel => {
      try {
        return within(sel).getByText('Admin') && within(sel).getByText('User')
      } catch {
        return false
      }
    })!
    fireEvent.change(roleSelect, { target: { value: 'admin' } })
    await waitFor(() => expect(updateUserRole).toHaveBeenCalled())
  })

  it('paginates through pages', async () => {
    const mod = await import('../src/components/admin/users/UsersTable')
    render(<mod.default />)
    await waitFor(() => expect(screen.getByText('Create User')).toBeInTheDocument())
    const pageSize = screen.getByDisplayValue('10')
    fireEvent.change(pageSize, { target: { value: '5' } })
    const next = screen.getByText('Next')
    fireEvent.click(next)
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })
})
