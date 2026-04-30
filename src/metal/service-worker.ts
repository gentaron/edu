/* ═══════════════════════════════════════════
   L0 METAL — Service Worker Manager
   Handles SW registration, lifecycle, and
   status tracking. Client-side only.
   ═══════════════════════════════════════════ */

export interface SwStatus {
  readonly supported: boolean
  readonly registered: boolean
  readonly controller: boolean
  readonly updateAvailable: boolean
}

export type SwStatusCallback = (status: Readonly<SwStatus>) => void

/**
 * Manages Service Worker registration, updates, and status tracking.
 * Designed for client-side use only. Methods are safe to call during SSR
 * (they resolve immediately with no-op).
 */
class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null
  private listeners: Set<SwStatusCallback> = new Set()
  private status: SwStatus = {
    supported: false,
    registered: false,
    controller: false,
    updateAvailable: false,
  }

  constructor() {
    this.emit()
  }

  /** Whether the current environment supports Service Workers */
  private get isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      navigator.serviceWorker !== undefined
    )
  }

  /** Broadcast current status to all listeners */
  private emit(): void {
    const current: Readonly<SwStatus> = { ...this.status }
    for (const cb of this.listeners) {
      cb(current)
    }
  }

  /** Update internal status and notify listeners */
  private setStatus(patch: Partial<SwStatus>): void {
    this.status = { ...this.status, ...patch }
    this.emit()
  }

  /**
   * Register the Service Worker at `/sw.js`.
   * Safe to call multiple times — subsequent calls re-use the existing registration.
   * No-op in unsupported or server contexts.
   */
  async register(): Promise<Readonly<SwStatus>> {
    if (!this.isSupported) {
      this.setStatus({ supported: false })
      return { ...this.status }
    }

    try {
      this.registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      })

      // Detect new worker waiting
      this.registration.addEventListener("updatefound", () => {
        const newWorker = this.registration?.installing
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              this.setStatus({ updateAvailable: true })
            }
          })
        }
      })

      // Check if we already have a controller (e.g. page reload)
      this.setStatus({
        supported: true,
        registered: true,
        controller: !!navigator.serviceWorker.controller,
      })
    } catch (error) {
      console.warn("[EDU] Service Worker registration failed:", error)
      this.setStatus({ supported: true, registered: false })
    }

    return { ...this.status }
  }

  /**
   * Unregister the Service Worker.
   * No-op if no registration exists or SW is not supported.
   */
  async unregister(): Promise<void> {
    if (this.registration) {
      await this.registration.unregister()
      this.registration = null
    }
    this.setStatus({
      registered: false,
      controller: false,
      updateAvailable: false,
    })
  }

  /**
   * Tell the waiting Service Worker to skipWaiting so it becomes active immediately.
   * The new worker will take control after all clients are closed or on next navigation.
   * For immediate control, use `window.location.reload()` after calling this.
   */
  async skipWaiting(): Promise<void> {
    if (!this.registration?.waiting) {return}

    return new Promise<void>((resolve) => {
      const worker = this.registration!.waiting!
      worker.addEventListener("statechange", () => {
        if (worker.state === "activated") {
          this.setStatus({ updateAvailable: false })
          resolve()
        }
      })
      worker.postMessage({ type: "SKIP_WAITING" })
    })
  }

  /**
   * Force the browser to check for Service Worker updates.
   * If an update is found, the `updateAvailable` status will be set to true.
   */
  async update(): Promise<void> {
    if (!this.registration) {return}
    await this.registration.update()
  }

  /**
   * Subscribe to status changes.
   * @returns An unsubscribe function
   */
  onStatusChange(callback: SwStatusCallback): () => void {
    this.listeners.add(callback)
    // Immediately fire with current state
    callback({ ...this.status })
    return () => {
      this.listeners.delete(callback)
    }
  }

  /** Get a read-only snapshot of the current status */
  getStatus(): Readonly<SwStatus> {
    return { ...this.status }
  }

  /** Reset internal state (testing only) */
  __resetForTesting(): void {
    this.registration = null
    this.listeners.clear()
    this.status = {
      supported: false,
      registered: false,
      controller: false,
      updateAvailable: false,
    }
  }
}

export const swManager = new ServiceWorkerManager()
