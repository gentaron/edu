import { describe, it, expect } from 'vitest'

/* ═══════════════════════════════════════════
   storage.ts + asset-url.ts tests
   ═══════════════════════════════════════════ */

/* ── 1. Storage module structure ── */
describe('storage', () => {
  it('exports files and isStorageAvailable', async () => {
    const mod = await import('@/platform/storage')
    expect('files' in mod).toBe(true)
    expect('isStorageAvailable' in mod).toBe(true)
    expect(typeof mod.isStorageAvailable).toBe('boolean')
  })

  it('isStorageAvailable reflects credential presence', async () => {
    // In CI/test, no credentials are set so storage should be unavailable
    const mod = await import('@/platform/storage')
    if (!process.env.EDU_STORAGE_BUCKET && !process.env.AWS_ACCESS_KEY_ID) {
      expect(mod.isStorageAvailable).toBe(false)
      expect(mod.files).toBeUndefined()
    }
  })
})

/* ── 2. Graceful degradation ── */
describe('graceful degradation', () => {
  it('getImageUrl falls back to GitHub URL when storage is unavailable', async () => {
    // Without credentials, getImageUrl should return GitHub fallback
    const { getImageUrl } = await import('@/platform/asset-url')
    const url = await getImageUrl('characters/Iris.png')
    expect(url).toContain('raw.githubusercontent.com/gentaron/image/main')
    expect(url).toContain('characters/Iris.png')
  })
})

/* ── 3. Fallback URL format ── */
describe('getImageUrl fallback format', () => {
  it('constructs correct GitHub URL for various paths', async () => {
    const { getImageUrl } = await import('@/platform/asset-url')

    const cases = [
      { path: 'characters/Iris.png', expected: 'characters/Iris.png' },
      { path: 'cards/sebastian.png', expected: 'cards/sebastian.png' },
      { path: 'Diana.png', expected: 'Diana.png' },
    ]

    for (const { path, expected } of cases) {
      const url = await getImageUrl(path)
      expect(url).toBe(`https://raw.githubusercontent.com/gentaron/image/main/${expected}`)
    }
  })
})
