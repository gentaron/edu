/* ═══════════════════════════════════════════
   L0 ASSET URL — Image URL resolution
   Provides a caching layer over presigned URLs
   from cloud storage, falling back to raw GitHub
   URLs when storage is unavailable.
   ═══════════════════════════════════════════ */

import { files, isStorageAvailable } from './storage'

/** In-memory URL cache entry. */
interface CacheEntry {
  url: string
  expires: number
}

const urlCache = new Map<string, CacheEntry>()

/** Cache TTL in milliseconds (1 hour). */
const CACHE_TTL = 3_600_000

/**
 * Resolve an asset path to a public URL.
 *
 * Strategy:
 * 1. Return a cached URL if still valid.
 * 2. If cloud storage is available, generate a
 *    presigned URL via files-sdk.
 * 3. Graceful degradation: fall back to the
 *    GitHub raw repository URL.
 *
 * @param path - Asset key relative to the bucket root
 *               (e.g. `"characters/Iris.png"`).
 * @returns A fully-qualified URL string.
 */
export async function getImageUrl(path: string): Promise<string> {
  const cached = urlCache.get(path)
  if (cached && Date.now() < cached.expires) {
    return cached.url
  }

  if (isStorageAvailable && files) {
    try {
      const url = await files.url(path, { expiresIn: 3600 })
      urlCache.set(path, { url, expires: Date.now() + CACHE_TTL })
      return url
    } catch {
      // Fall through to GitHub
    }
  }

  // Graceful degradation
  return `https://raw.githubusercontent.com/gentaron/image/main/${path}`
}

/**
 * Clear the entire in-memory URL cache.
 * Useful for testing or forced refresh scenarios.
 */
export function clearUrlCache(): void {
  urlCache.clear()
}
