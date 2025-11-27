import { describe, it, expect } from 'vitest'
import { filterRows, sortRows, paginateRows } from '../src/components/admin/table-utils'

const rows = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com' },
]

describe('table-utils', () => {
  it('filters rows by query', () => {
    const filtered = filterRows(rows, 'bo', ['name', 'email'])
    expect(filtered.length).toBe(1)
    expect(filtered[0].name).toBe('Bob')
  })

  it('sorts rows asc/desc', () => {
    const asc = sortRows(rows, 'name', 'asc')
    const desc = sortRows(rows, 'name', 'desc')
    expect(asc[0].name).toBe('Alice')
    expect(desc[0].name).toBe('Charlie')
  })

  it('paginates rows', () => {
    const { data, totalPages } = paginateRows(rows, 2, 2)
    expect(totalPages).toBe(2)
    expect(data.length).toBe(1)
    expect(data[0].name).toBe('Charlie')
  })
})
