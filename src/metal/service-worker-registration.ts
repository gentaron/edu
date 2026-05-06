/* ═══════════════════════════════════════════
   L0 METAL — Service Worker Registration
   Call from a client component or app/layout.tsx
   to automatically register the SW on page load.
   ═══════════════════════════════════════════ */

/**
 * Register the EDU Service Worker.
 * Safe to call during SSR — becomes a no-op when `window` is undefined.
 * Safe to call multiple times.
 */
export function registerServiceWorker(): void {
  if (typeof window === "undefined") {
    return
  }
  if (navigator.serviceWorker === undefined) {
    return
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.info("[EDU] Service Worker registered:", registration.scope)

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                console.info("[EDU] New Service Worker activated")
              }
            })
          }
        })
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error)
        console.warn("[EDU] Service Worker registration failed:", message)
      })
  })
}
