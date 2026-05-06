"use client"

import { useState, useEffect } from "react"

interface WebGPUSupport {
  supported: boolean
  checking: boolean
}

/**
 * Hook to check if the browser supports WebGPU.
 * Used to determine if the WebLLM backend is available.
 */
export function useWebGPUSupport(): WebGPUSupport {
  const [checking, setChecking] = useState(true)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        // Check for WebGPU API availability
        if (typeof navigator !== "undefined" && "gpu" in navigator) {
          const adapter = await (navigator as unknown as { gpu: { requestAdapter: () => Promise<unknown> } }).gpu.requestAdapter()
          if (cancelled) {
            return
          }
          setSupported(!!adapter)
        } else {
          if (cancelled) {
            return
          }
          setSupported(false)
        }
      } catch {
        if (cancelled) {
          return
        }
        setSupported(false)
      } finally {
        if (!cancelled) {
          setChecking(false)
        }
      }
    }

    check()

    return () => {
      cancelled = true
    }
  }, [])

  return { supported, checking }
}
