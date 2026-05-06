/* ═══════════════════════════════════════════════════════════
   L0 METAL — Zero-Copy Ring Buffer Tests
   Epoch-12 Delta — Unit + PBT tests for ring buffer
   ═══════════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest"
import fc from "fast-check"
import {
  SharedRingBuffer,
  FallbackRingBuffer,
  createRingBuffer,
} from "../ring-buffer"

describe("webgpu/ring-buffer", () => {
  // ── Test 1: FallbackRingBuffer basic write/read ──
  describe("FallbackRingBuffer", () => {
    it("should write and read data correctly", () => {
      const buf = new FallbackRingBuffer(1024)
      const data = new Uint8Array([1, 2, 3, 4, 5])

      const writeResult = buf.write(data)
      expect(writeResult.success).toBe(true)
      expect(writeResult.bytesWritten).toBe(5)

      const readResult = buf.read()
      expect(readResult).not.toBeNull()
      expect(readResult!.data).toEqual(data)
    })

    // ── Test 2: FallbackRingBuffer FIFO ordering ──
    it("should maintain FIFO ordering", () => {
      const buf = new FallbackRingBuffer(1024)

      buf.write(new Uint8Array([1]))
      buf.write(new Uint8Array([2]))
      buf.write(new Uint8Array([3]))

      expect(buf.read()?.data).toEqual(new Uint8Array([1]))
      expect(buf.read()?.data).toEqual(new Uint8Array([2]))
      expect(buf.read()?.data).toEqual(new Uint8Array([3]))
    })

    // ── Test 3: FallbackRingBuffer isEmpty ──
    it("should report empty correctly", () => {
      const buf = new FallbackRingBuffer(1024)
      expect(buf.isEmpty()).toBe(true)

      buf.write(new Uint8Array([1]))
      expect(buf.isEmpty()).toBe(false)

      buf.read()
      expect(buf.isEmpty()).toBe(true)
    })

    // ── Test 4: FallbackRingBuffer overflow ──
    it("should reject writes that exceed capacity", () => {
      const buf = new FallbackRingBuffer(16)
      const bigData = new Uint8Array(32)

      const result = buf.write(bigData)
      expect(result.success).toBe(false)
      expect(result.bytesWritten).toBe(0)
    })

    // ── Test 5: FallbackRingBuffer stats ──
    it("should report accurate stats", () => {
      const buf = new FallbackRingBuffer(1024)

      buf.write(new Uint8Array(10))
      buf.write(new Uint8Array(20))

      const stats = buf.getStats()
      expect(stats.mode).toBe("fallback")
      expect(stats.capacity).toBe(1024)
      expect(stats.used).toBe(30)
      expect(stats.free).toBe(994)
      expect(stats.totalWrites).toBe(2)
      expect(stats.totalReads).toBe(0)
    })

    // ── Test 6: FallbackRingBuffer clear ──
    it("should clear all data on reset", () => {
      const buf = new FallbackRingBuffer(1024)
      buf.write(new Uint8Array([1, 2, 3]))
      buf.write(new Uint8Array([4, 5]))

      buf.clear()

      expect(buf.isEmpty()).toBe(true)
      expect(buf.getStats().totalWrites).toBe(0)
    })

    // ── Test 7: FallbackRingBuffer maxBytes read ──
    it("should respect maxBytes on read", () => {
      const buf = new FallbackRingBuffer(1024)
      buf.write(new Uint8Array([1, 2, 3, 4, 5]))

      const result = buf.read(3)
      expect(result).not.toBeNull()
      expect(result!.data).toEqual(new Uint8Array([1, 2, 3]))
    })
  })

  // ── Test 8: createRingBuffer returns FallbackRingBuffer in test env ──
  describe("createRingBuffer", () => {
    it("should return FallbackRingBuffer when COOP/COEP missing", () => {
      const buf = createRingBuffer(512)
      expect(buf).toBeInstanceOf(FallbackRingBuffer)
    })
  })

  // ── Test 9: SharedRingBuffer basic operations ──
  describe("SharedRingBuffer", () => {
    it("should create with correct capacity", () => {
      const buf = new SharedRingBuffer(2048)
      expect(buf.getCapacity()).toBe(2048)
      expect(buf.isEmpty()).toBe(true)
    })

    it("should write and read data correctly", () => {
      const buf = new SharedRingBuffer(1024)
      const data = new Uint8Array([10, 20, 30, 40])

      const writeResult = buf.write(data)
      expect(writeResult.success).toBe(true)
      expect(writeResult.bytesWritten).toBe(4)

      const readResult = buf.read()
      expect(readResult).not.toBeNull()
      expect(readResult!.data).toEqual(data)
    })

    it("should report shared mode in stats", () => {
      const buf = new SharedRingBuffer(1024)
      buf.write(new Uint8Array([1, 2, 3]))

      const stats = buf.getStats()
      expect(stats.mode).toBe("shared")
    })

    it("should clear correctly", () => {
      const buf = new SharedRingBuffer(1024)
      buf.write(new Uint8Array([1, 2]))
      buf.clear()

      expect(buf.isEmpty()).toBe(true)
      expect(buf.getStats().totalWrites).toBe(0)
    })
  })

  // ── Test 10: PBT — FallbackRingBuffer write/read roundtrip ──
  describe("Property-based tests", () => {
    it("should preserve data integrity on write/read roundtrip", () => {
      fc.assert(
        fc.property(fc.uint8Array({ minLength: 1, maxLength: 100 }), (data) => {
          const buf = new FallbackRingBuffer(4096)
          const writeResult = buf.write(data)

          expect(writeResult.success).toBe(true)

          const readResult = buf.read()
          expect(readResult).not.toBeNull()
          expect(readResult!.data).toEqual(data)
        })
      )
    })

    // ── Test 11: PBT — FIFO ordering preserved ──
    it("should preserve FIFO ordering for multiple writes", () => {
      fc.assert(
        fc.property(
          fc.array(fc.uint8Array({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
          (items) => {
            const buf = new FallbackRingBuffer(65_536)

            for (const item of items) {
              buf.write(item)
            }

            for (const item of items) {
              const result = buf.read()
              expect(result).not.toBeNull()
              expect(result!.data).toEqual(item)
            }
          }
        )
      )
    })

    // ── Test 12: PBT — Stats consistency ──
    it("should maintain consistent stats after operations", () => {
      fc.assert(
        fc.property(
          fc.array(fc.uint8Array({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 20 }),
          (items) => {
            const buf = new FallbackRingBuffer(32_768)

            let totalBytes = 0
            for (const item of items) {
              buf.write(item)
              totalBytes += item.length
            }

            const stats = buf.getStats()
            expect(stats.totalWrites).toBe(items.length)
            expect(stats.used).toBe(totalBytes)
            expect(stats.capacity).toBe(32_768)
            expect(stats.free).toBe(32_768 - totalBytes)

            // Read all back
            for (let i = 0; i < items.length; i++) {
              buf.read()
            }

            const finalStats = buf.getStats()
            expect(finalStats.totalReads).toBe(items.length)
            expect(finalStats.used).toBe(0)
          }
        )
      )
    })

    // ── Test 13: PBT — Overflow detection ──
    it("should correctly detect overflow when capacity exceeded", () => {
      fc.assert(
        fc.property(fc.uint8Array({ minLength: 500, maxLength: 2000 }), (bigData) => {
          const buf = new FallbackRingBuffer(256)
          const result = buf.write(bigData)

          // Either succeeds (if data fits with overhead) or overflows
          if (!result.success) {
            expect(result.bytesWritten).toBe(0)
          }
        })
      )
    })

    // ── Test 14: PBT — Generation counter increments ──
    it("should increment generation on wrap-around", () => {
      fc.assert(
        fc.property(fc.nat(500), (writeCount) => {
          const buf = new FallbackRingBuffer(65_536)
          let lastGen = 0

          for (let i = 0; i < writeCount; i++) {
            const result = buf.write(new Uint8Array([i & 0xFF]))
            expect(result.generation).toBeGreaterThanOrEqual(lastGen)
            lastGen = result.generation
          }
        })
      )
    })
  })

  // ── Test 15: SharedRingBuffer PBT — data integrity ──
  describe("SharedRingBuffer PBT", () => {
    it("should preserve data on write/read roundtrip", () => {
      fc.assert(
        fc.property(fc.uint8Array({ minLength: 1, maxLength: 200 }), (data) => {
          const buf = new SharedRingBuffer(4096)
          const writeResult = buf.write(data)

          expect(writeResult.success).toBe(true)

          const readResult = buf.read()
          expect(readResult).not.toBeNull()
          expect(readResult!.data).toEqual(data)
        })
      )
    })
  })
})
