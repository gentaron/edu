/* ═══════════════════════════════════════════════════════════
   L0 METAL — WebGPU Device Manager Tests
   Epoch-12 Delta — Unit tests for GPU feature detection
   ═══════════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach } from "vitest"
import {
  initGpuDevice,
  getGpuTier,
  getGpuDevice,
  getGpuAdapterInfo,
  isCrossOriginIsolated,
  asGpuDeviceId,
  __resetGpuState,
  __injectGpuResult,
} from "../device"
import { GpuTier } from "../device"
import type { GpuInitResult } from "../device"

describe("webgpu/device", () => {
  beforeEach(() => {
    __resetGpuState()
  })

  // ── Test 1: Default tier is UNAVAILABLE before initialization ──
  describe("getGpuTier", () => {
    it("should return UNAVAILABLE before initialization", () => {
      expect(getGpuTier()).toBe(GpuTier.UNAVAILABLE)
    })
  })

  // ── Test 2: getGpuDevice returns null before initialization ──
  describe("getGpuDevice", () => {
    it("should return null before initialization", () => {
      expect(getGpuDevice()).toBeNull()
    })
  })

  // ── Test 3: getGpuAdapterInfo returns null before initialization ──
  describe("getGpuAdapterInfo", () => {
    it("should return null before initialization", () => {
      expect(getGpuAdapterInfo()).toBeNull()
    })
  })

  // ── Test 4: asGpuDeviceId creates branded type ──
  describe("asGpuDeviceId", () => {
    it("should return a branded string", () => {
      const id = asGpuDeviceId("device-42")
      expect(id).toBe("device-42")
    })
  })

  // ── Test 5: Inject mock UNAVAILABLE result ──
  describe("__injectGpuResult", () => {
    it("should cache injected UNAVAILABLE result", async () => {
      const mockResult: GpuInitResult = {
        tier: GpuTier.UNAVAILABLE,
        device: null,
        adapterInfo: null,
        fallbackReason: "Test fallback",
      }
      __injectGpuResult(mockResult)

      expect(getGpuTier()).toBe(GpuTier.UNAVAILABLE)
      expect(getGpuDevice()).toBeNull()
      expect(getGpuAdapterInfo()).toBeNull()
    })
  })

  // ── Test 6: Inject mock FULL_COMPUTE result ──
  describe("__injectGpuResult with FULL_COMPUTE", () => {
    it("should cache injected FULL_COMPUTE result", async () => {
      const mockDevice = {} as GPUDevice
      const mockInfo = {
        vendor: "test-vendor",
        architecture: "test-arch",
        device: "test-device",
        description: "test-desc",
        tier: GpuTier.FULL_COMPUTE,
        maxComputeWorkgroupsPerDimension: 65_535,
        maxStorageBufferBindingSize: 134_217_728,
        hasTimestampQuery: true,
      }
      __injectGpuResult({
        tier: GpuTier.FULL_COMPUTE,
        device: mockDevice,
        adapterInfo: mockInfo,
        fallbackReason: null,
      })

      expect(getGpuTier()).toBe(GpuTier.FULL_COMPUTE)
      expect(getGpuDevice()).toBe(mockDevice)
      expect(getGpuAdapterInfo()).toEqual(mockInfo)
    })
  })

  // ── Test 7: isCrossOriginIsolated returns false in test env ──
  describe("isCrossOriginIsolated", () => {
    it("should return false in non-isolated test environment", () => {
      expect(isCrossOriginIsolated()).toBe(false)
    })
  })

  // ── Test 8: Reset clears cached state ──
  describe("__resetGpuState", () => {
    it("should clear cached GPU state", () => {
      __injectGpuResult({
        tier: GpuTier.FULL_COMPUTE,
        device: {} as GPUDevice,
        adapterInfo: {
          vendor: "v",
          architecture: "a",
          device: "d",
          description: "desc",
          tier: GpuTier.FULL_COMPUTE,
          maxComputeWorkgroupsPerDimension: 65_535,
          maxStorageBufferBindingSize: 134_217_728,
          hasTimestampQuery: false,
        },
        fallbackReason: null,
      })

      __resetGpuState()

      expect(getGpuTier()).toBe(GpuTier.UNAVAILABLE)
      expect(getGpuDevice()).toBeNull()
    })
  })

  // ── Test 9: initGpuDevice returns cached result on second call ──
  describe("initGpuDevice idempotency", () => {
    it("should return same result on multiple calls", async () => {
      const mockResult: GpuInitResult = {
        tier: GpuTier.UNAVAILABLE,
        device: null,
        adapterInfo: null,
        fallbackReason: "server-side render",
      }
      __injectGpuResult(mockResult)

      const result1 = await initGpuDevice()
      const result2 = await initGpuDevice()

      expect(result1).toBe(result2)
    })
  })
})
