/* ═══════════════════════════════════════════
   L0 STORAGE — Cloud object-store client
   Provides a configured files-sdk instance backed
   by S3-compatible storage (Cloudflare R2).

   Graceful degradation: if credentials are not
   configured, the client initialises in a "dry"
   state where download / url calls throw so that
   callers can fall back to their GitHub sources.
   ═══════════════════════════════════════════ */

import { Files } from 'files-sdk'
import { s3 } from 'files-sdk/s3'
import * as Sentry from '@sentry/nextjs'

/**
 * Environment-driven flag that indicates whether
 * cloud storage credentials are available.
 */
function isStorageConfigured(): boolean {
  return !!(
    process.env.EDU_STORAGE_BUCKET ||
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_SECRET_ACCESS_KEY
  )
}

/**
 * Create the S3-compatible adapter.
 * Returns `undefined` when no credentials are
 * available, signalling that the caller should
 * use a fallback path.
 */
function createAdapter() {
  if (!isStorageConfigured()) {
    return
  }

  const opts: {
    bucket: string
    region: string
    credentials?: { accessKeyId: string; secretAccessKey: string }
  } = {
    bucket: process.env.EDU_STORAGE_BUCKET ?? 'edu-assets',
    region: process.env.AWS_REGION ?? 'auto',
  }

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    opts.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  }

  return s3(opts)
}

const adapter = createAdapter()

/**
 * Singleton files-sdk client for all cloud-storage
 * operations. When `adapter` is `undefined` (no
 * credentials configured), every call will throw
 * so that callers can catch and fall back.
 */
export const files = adapter
  ? new Files({
      adapter,
      hooks: {
        onError({ error }) {
          if (!error.aborted) {
            Sentry.captureException(error)
          }
        },
      },
    })
  : undefined

/**
 * Whether the storage client was initialised with
 * real credentials. Useful for conditional logic
 * without try/catch.
 */
export const isStorageAvailable: boolean = files !== undefined
