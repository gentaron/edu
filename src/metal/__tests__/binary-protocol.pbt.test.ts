import { describe, it, expect } from "vitest"
import fc from "fast-check"
import {
  BinaryWriter,
  BinaryReader,
  crc32,
  BinaryEncoder,
  BinaryIndex,
} from "@/metal/binary-protocol"

/* ═══════════════════════════════════════════
   Property-Based Tests — Binary Protocol
   ═══════════════════════════════════════════ */

describe("PBT: binary-protocol", () => {
  /* ── VarInt round-trip for any u32 ── */
  it("VarInt round-trip for any u32", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 4_294_967_295 }), (value) => {
        const w = new BinaryWriter()
        w.writeVarInt(value)
        const r = new BinaryReader(w.toBuffer())
        expect(r.readVarInt()).toBe(value)
      })
    )
  })

  /* ── String round-trip for any string ── */
  it("String round-trip for any string", () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        const w = new BinaryWriter()
        w.writeString(value)
        const r = new BinaryReader(w.toBuffer())
        expect(r.readString()).toBe(value)
      })
    )
  })

  /* ── i32 round-trip for any i32 ── */
  it("i32 round-trip for any i32", () => {
    fc.assert(
      fc.property(fc.integer({ min: -2_147_483_648, max: 2_147_483_647 }), (value) => {
        const w = new BinaryWriter()
        w.writeI32(value)
        const r = new BinaryReader(w.toBuffer())
        expect(r.readI32()).toBe(value)
      })
    )
  })

  /* ── f64 round-trip for any finite f64 ── */
  it("f64 round-trip for any finite f64", () => {
    fc.assert(
      fc.property(fc.double(), (value) => {
        if (!Number.isFinite(value)) {
          return
        } // skip NaN/Infinity
        const w = new BinaryWriter()
        w.writeF64(value)
        const r = new BinaryReader(w.toBuffer())
        expect(r.readF64()).toBe(value)
      })
    )
  })

  /* ── Bool round-trip ── */
  it("Bool round-trip for any boolean", () => {
    fc.assert(
      fc.property(fc.boolean(), (value) => {
        const w = new BinaryWriter()
        w.writeBool(value)
        const r = new BinaryReader(w.toBuffer())
        expect(r.readBool()).toBe(value)
      })
    )
  })

  /* ── crc32 deterministic for any byte array ── */
  it("crc32 is deterministic for any byte array", () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 0, maxLength: 100 }), (data) => {
        const a = crc32(data)
        const b = crc32(new Uint8Array(data)) // clone
        expect(a).toBe(b)
      })
    )
  })

  /* ── writeValue/readValue round-trip for primitives ── */
  it("writeValue/readValue round-trip for any string", () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        const w = new BinaryWriter()
        w.writeValue(value)
        const r = new BinaryReader(w.toBuffer())
        expect(r.readValue()).toBe(value)
      })
    )
  })

  it("writeValue/readValue round-trip for any integer", () => {
    fc.assert(
      fc.property(fc.integer({ min: -100_000, max: 100_000 }), (value) => {
        const w = new BinaryWriter()
        w.writeValue(value)
        const r = new BinaryReader(w.toBuffer())
        expect(r.readValue()).toBe(value)
      })
    )
  })

  it("writeValue/readValue round-trip for any boolean", () => {
    fc.assert(
      fc.property(fc.boolean(), (value) => {
        const w = new BinaryWriter()
        w.writeValue(value)
        const r = new BinaryReader(w.toBuffer())
        expect(r.readValue()).toBe(value)
      })
    )
  })

  /* ── BinaryEncoder round-trip for simple values ── */
  it("BinaryEncoder round-trip for any string value", () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        const entries = new Map<string, unknown>()
        entries.set("key", value)
        const buffer = BinaryEncoder.encode(entries)
        const index = new BinaryIndex(buffer)
        expect(index.getEntry("key")).toBe(value)
      })
    )
  })
})
