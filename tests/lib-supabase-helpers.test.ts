import { describe, it, expect } from 'vitest'
import { getSiteContent, getArtistsWithWorks, getAssetUrl } from '../src/lib/supabase-helpers'

describe('supabase-helpers src functions', () => {
  it('getSiteContent returns null when not found', async () => {
    const data = await getSiteContent('non-existent-section')
    expect(data).toBeNull()
  })

  it('getArtistsWithWorks returns array', async () => {
    const data = await getArtistsWithWorks()
    expect(Array.isArray(data)).toBe(true)
  })

  it('getAssetUrl returns string', () => {
    const url = getAssetUrl('path/to/file')
    expect(typeof url).toBe('string')
  })
})
