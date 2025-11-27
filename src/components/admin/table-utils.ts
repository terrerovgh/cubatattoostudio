export type Row = Record<string, any>

export function filterRows<T extends Row>(rows: T[], q: string, keys: (keyof T)[]): T[] {
  const s = q.trim().toLowerCase()
  if (!s) return rows
  return rows.filter(r => keys.some(k => String(r[k] ?? '').toLowerCase().includes(s)))
}

export function sortRows<T extends Row>(rows: T[], key: keyof T, dir: 'asc' | 'desc' = 'asc'): T[] {
  const copy = [...rows]
  copy.sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av === bv) return 0
    if (av == null) return dir === 'asc' ? -1 : 1
    if (bv == null) return dir === 'asc' ? 1 : -1
    return dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
  })
  return copy
}

export function paginateRows<T>(rows: T[], page: number, pageSize: number): { data: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const start = (page - 1) * pageSize
  const data = rows.slice(start, start + pageSize)
  return { data, totalPages }
}
