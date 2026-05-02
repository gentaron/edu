/* ═══════════════════════════════════════════════════════════
   L0 METAL — WebGPU Device Manager
   Epoch-12 Delta — Liminal Forge Rendering Substrate
   ═══════════════════════════════════════════════════════════

   Manages WebGPU adapter/device lifecycle, feature detection,
   and graceful degradation to Canvas 2D when WebGPU is unavailable.
   ═══════════════════════════════════════════════════════════ */

/** Branded type for a WebGPU device identifier. */
export type GpuDeviceId = string & { readonly __brand: "GpuDeviceId" };

/**
 * WebGPU backend capability level.
 * Ordered from most capable to least.
 */
export const enum GpuTier {
  /** Full WebGPU compute support with shared memory. */
  FULL_COMPUTE = 2,
  /** WebGPU available but SharedArrayBuffer not accessible. */
  COMPUTE_NO_SHARED = 1,
  /** WebGPU unavailable — must fall back to Canvas 2D CPU path. */
  UNAVAILABLE = 0,
}

/** Metadata about the current WebGPU adapter. */
export interface GpuAdapterInfo {
  readonly vendor: string;
  readonly architecture: string;
  readonly device: string;
  readonly description: string;
  readonly tier: GpuTier;
  readonly maxComputeWorkgroupsPerDimension: number;
  readonly maxStorageBufferBindingSize: number;
  readonly hasTimestampQuery: boolean;
}

/** Result of WebGPU initialization. */
export interface GpuInitResult {
  readonly tier: GpuTier;
  readonly device: GPUDevice | null;
  readonly adapterInfo: GpuAdapterInfo | null;
  readonly fallbackReason: string | null;
}

/** Singleton state holder. */
let cachedResult: GpuInitResult | null = null;
let initPromise: Promise<GpuInitResult> | null = null;

/**
 * Detect WebGPU availability and initialize device.
 * Safe to call multiple times — returns cached result after first call.
 * Never throws — returns tier UNAVAILABLE on failure.
 *
 * @returns Promise resolving to the GPU initialization result.
 */
export async function initGpuDevice(): Promise<GpuInitResult> {
  if (cachedResult != null) {
    return cachedResult;
  }
  if (initPromise != null) {
    return initPromise;
  }

  initPromise = (async (): Promise<GpuInitResult> => {
    // Check for navigator.gpu
    if (typeof navigator === "undefined" || !("gpu" in navigator)) {
      cachedResult = {
        tier: GpuTier.UNAVAILABLE,
        device: null,
        adapterInfo: null,
        fallbackReason: "navigator.gpu not available (server-side render or unsupported browser)",
      };
      return cachedResult;
    }

    const gpu = navigator.gpu;

    try {
      const adapter = await gpu.requestAdapter({
        powerPreference: "high-performance",
      });

      if (!adapter) {
        cachedResult = {
          tier: GpuTier.UNAVAILABLE,
          device: null,
          adapterInfo: null,
          fallbackReason: "No WebGPU adapter found (GPU blacklisted or insufficient hardware)",
        };
        return cachedResult;
      }

      // Request device with required features
      const device = await adapter.requestDevice({
        requiredLimits: {
          maxComputeWorkgroupsPerDimension: 65_535,
        },
      });

      // Check for SharedArrayBuffer support (required for zero-copy ring buffer)
      const hasSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined" && isCrossOriginIsolated();

      const tier = hasSharedArrayBuffer ? GpuTier.FULL_COMPUTE : GpuTier.COMPUTE_NO_SHARED;

      // Extract adapter info
      const info = adapter.info;
      const adapterInfo: GpuAdapterInfo = {
        vendor: info.vendor ?? "unknown",
        architecture: info.architecture ?? "unknown",
        device: info.device ?? "unknown",
        description: info.description ?? "unknown",
        tier,
        maxComputeWorkgroupsPerDimension: device.limits.maxComputeWorkgroupsPerDimension,
        maxStorageBufferBindingSize: device.limits.maxStorageBufferBindingSize,
        hasTimestampQuery: device.features.has("timestamp-query"),
      };

      cachedResult = {
        tier,
        device,
        adapterInfo,
        fallbackReason: hasSharedArrayBuffer
          ? null
          : "SharedArrayBuffer not available — COOP/COEP headers missing, falling back to message-passing",
      };

      // Handle device loss gracefully
      device.lost.then((info) => {
        console.warn(`[L0 METAL/WebGPU] Device lost: ${info.message}`);
        if (info.reason !== "destroyed") {
          cachedResult = null;
          initPromise = null;
        }
      });

      return cachedResult;
    } catch (error) {
      cachedResult = {
        tier: GpuTier.UNAVAILABLE,
        device: null,
        adapterInfo: null,
        fallbackReason: `WebGPU initialization failed: ${error instanceof Error ? error.message : String(error)}`,
      };
      return cachedResult;
    }
  })();

  return initPromise;
}

/**
 * Check whether WebGPU is available without initializing.
 * @returns The current cached tier, or UNAVAILABLE if not yet initialized.
 */
export function getGpuTier(): GpuTier {
  return cachedResult?.tier ?? GpuTier.UNAVAILABLE;
}

/**
 * Check whether SharedArrayBuffer is available (cross-origin isolated).
 * @returns true if SharedArrayBuffer can be used for zero-copy communication.
 */
export function isCrossOriginIsolated(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.crossOriginIsolated === "boolean" &&
    window.crossOriginIsolated
  );
}

/**
 * Get the cached GPU device (null if not initialized or unavailable).
 * @returns The GPUDevice, or null.
 */
export function getGpuDevice(): GPUDevice | null {
  return cachedResult?.device ?? null;
}

/**
 * Get detailed adapter info (null if not initialized or unavailable).
 * @returns The adapter info, or null.
 */
export function getGpuAdapterInfo(): GpuAdapterInfo | null {
  return cachedResult?.adapterInfo ?? null;
}

/**
 * Create a branded GPU device identifier for use in branded-type discipline.
 * @param value - Raw string value for the device ID.
 * @returns Branded GpuDeviceId string.
 */
export function asGpuDeviceId(value: string): GpuDeviceId {
  return value as GpuDeviceId;
}

/**
 * Reset cached GPU state (for testing only).
 */
export function __resetGpuState(): void {
  cachedResult = null;
  initPromise = null;
}

/**
 * Inject a mock GPU init result (for testing only).
 * @param result - The mock init result to inject.
 */
export function __injectGpuResult(result: GpuInitResult): void {
  cachedResult = result;
  initPromise = Promise.resolve(result);
}
