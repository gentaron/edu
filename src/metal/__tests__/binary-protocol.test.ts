import { describe, it, expect } from "vitest"
import {
  BinaryWriter,
  BinaryReader,
  BinaryEncoder,
  BinaryIndex,
  crc32,
  TypeTag,
} from "@/metal/binary-protocol"

/* ═══════════════════════════════════════════
   VarInt Round-Trip
   ═══════════════════════════════════════════ */
describe("VarInt round-trip", () => {
  const roundTrip = (value: number) => {
    const w = new BinaryWriter()
    w.writeVarInt(value)
    const r = new BinaryReader(w.toBuffer())
    return r.readVarInt()
  }

  it("encodes/decodes 0", () => {
    expect(roundTrip(0)).toBe(0)
  })

  it("encodes/decodes 1", () => {
    expect(roundTrip(1)).toBe(1)
  })

  it("encodes/decodes 127", () => {
    expect(roundTrip(127)).toBe(127)
  })

  it("encodes/decodes 128 (2-byte boundary)", () => {
    expect(roundTrip(128)).toBe(128)
  })

  it("encodes/decodes 16383", () => {
    expect(roundTrip(16383)).toBe(16383)
  })

  it("encodes/decodes 16384 (3-byte boundary)", () => {
    expect(roundTrip(16384)).toBe(16384)
  })

  it("encodes/decodes 2097151", () => {
    expect(roundTrip(2097151)).toBe(2097151)
  })

  it("encodes/decodes max u32", () => {
    expect(roundTrip(0xFFFFFFFF)).toBe(0xFFFFFFFF)
  })

  it("throws on negative value", () => {
    const w = new BinaryWriter()
    expect(() => w.writeVarInt(-1)).toThrow(RangeError)
  })

  it("multi-value round-trip", () => {
    const w = new BinaryWriter()
    const values = [0, 1, 127, 128, 255, 300, 16384, 1000000]
    for (const v of values) w.writeVarInt(v)
    const r = new BinaryReader(w.toBuffer())
    for (const v of values) {
      expect(r.readVarInt()).toBe(v)
    }
  })
})

/* ═══════════════════════════════════════════
   String Round-Trip
   ═══════════════════════════════════════════ */
describe("String round-trip", () => {
  const roundTrip = (value: string) => {
    const w = new BinaryWriter()
    w.writeString(value)
    const r = new BinaryReader(w.toBuffer())
    return r.readString()
  }

  it("encodes/decodes empty string", () => {
    expect(roundTrip("")).toBe("")
  })

  it("encodes/decodes ASCII string", () => {
    expect(roundTrip("hello world")).toBe("hello world")
  })

  it("encodes/decodes Japanese string", () => {
    expect(roundTrip("ディアナ")).toBe("ディアナ")
  })

  it("encodes/decodes emoji string", () => {
    expect(roundTrip("⚔️🎮")).toBe("⚔️🎮")
  })

  it("encodes/decodes mixed content", () => {
    expect(roundTrip("Hello世界")).toBe("Hello世界")
  })

  it("encodes/decodes long string", () => {
    const long = "a".repeat(10000)
    expect(roundTrip(long)).toBe(long)
  })

  it("encodes/decodes string with special chars", () => {
    expect(roundTrip("line1\nline2\ttab")).toBe("line1\nline2\ttab")
  })

  it("multi-string round-trip", () => {
    const w = new BinaryWriter()
    const strings = ["", "a", "hello", "ディアナ", "⚔️"]
    for (const s of strings) w.writeString(s)
    const r = new BinaryReader(w.toBuffer())
    for (const s of strings) {
      expect(r.readString()).toBe(s)
    }
  })
})

/* ═══════════════════════════════════════════
   I32 Round-Trip
   ═══════════════════════════════════════════ */
describe("I32 round-trip", () => {
  const roundTrip = (value: number) => {
    const w = new BinaryWriter()
    w.writeI32(value)
    const r = new BinaryReader(w.toBuffer())
    return r.readI32()
  }

  it("encodes/decodes 0", () => {
    expect(roundTrip(0)).toBe(0)
  })

  it("encodes/decodes positive number", () => {
    expect(roundTrip(42)).toBe(42)
  })

  it("encodes/decodes negative number", () => {
    expect(roundTrip(-42)).toBe(-42)
  })

  it("encodes/decodes max i32", () => {
    expect(roundTrip(2147483647)).toBe(2147483647)
  })

  it("encodes/decodes min i32", () => {
    expect(roundTrip(-2147483648)).toBe(-2147483648)
  })

  it("multi-i32 round-trip", () => {
    const w = new BinaryWriter()
    const values = [0, 1, -1, 100, -100, 2147483647, -2147483648]
    for (const v of values) w.writeI32(v)
    const r = new BinaryReader(w.toBuffer())
    for (const v of values) {
      expect(r.readI32()).toBe(v)
    }
  })
})

/* ═══════════════════════════════════════════
   F64 Round-Trip
   ═══════════════════════════════════════════ */
describe("F64 round-trip", () => {
  const roundTrip = (value: number) => {
    const w = new BinaryWriter()
    w.writeF64(value)
    const r = new BinaryReader(w.toBuffer())
    return r.readF64()
  }

  it("encodes/decodes 0", () => {
    expect(roundTrip(0)).toBe(0)
  })

  it("encodes/decodes positive number", () => {
    expect(roundTrip(3.14)).toBeCloseTo(3.14, 10)
  })

  it("encodes/decodes negative number", () => {
    expect(roundTrip(-42.5)).toBeCloseTo(-42.5, 10)
  })

  it("encodes/decodes very large number", () => {
    expect(roundTrip(1e308)).toBeCloseTo(1e308, 290)
  })

  it("encodes/decodes very small number", () => {
    expect(roundTrip(1e-100)).toBeCloseTo(1e-100, 80)
  })

  it("encodes/decodes Infinity", () => {
    expect(roundTrip(Infinity)).toBe(Infinity)
  })

  it("encodes/decodes -Infinity", () => {
    expect(roundTrip(-Infinity)).toBe(-Infinity)
  })

  it("multi-f64 round-trip", () => {
    const w = new BinaryWriter()
    const values = [0, 1.5, -3.14, 100.999, 1e10]
    for (const v of values) w.writeF64(v)
    const r = new BinaryReader(w.toBuffer())
    for (const v of values) {
      expect(r.readF64()).toBeCloseTo(v, 10)
    }
  })
})

/* ═══════════════════════════════════════════
   Bool Round-Trip
   ═══════════════════════════════════════════ */
describe("Bool round-trip", () => {
  const roundTrip = (value: boolean) => {
    const w = new BinaryWriter()
    w.writeBool(value)
    const r = new BinaryReader(w.toBuffer())
    return r.readBool()
  }

  it("encodes/decodes true", () => {
    expect(roundTrip(true)).toBe(true)
  })

  it("encodes/decodes false", () => {
    expect(roundTrip(false)).toBe(false)
  })

  it("multi-bool round-trip", () => {
    const w = new BinaryWriter()
    const values = [true, false, true, true, false]
    for (const v of values) w.writeBool(v)
    const r = new BinaryReader(w.toBuffer())
    for (const v of values) {
      expect(r.readBool()).toBe(v)
    }
  })
})

/* ═══════════════════════════════════════════
   CRC32
   ═══════════════════════════════════════════ */
describe("crc32", () => {
  it("returns same value for same input (deterministic)", () => {
    const data = new Uint8Array([1, 2, 3, 4, 5])
    expect(crc32(data)).toBe(crc32(data))
  })

  it("returns 0 for empty input", () => {
    expect(crc32(new Uint8Array(0))).toBe(0)
  })

  it("different inputs produce different values", () => {
    const a = crc32(new Uint8Array([1, 2, 3]))
    const b = crc32(new Uint8Array([3, 2, 1]))
    expect(a).not.toBe(b)
  })

  it("returns u32 (unsigned)", () => {
    const result = crc32(new Uint8Array([255, 255, 255, 255]))
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(0xFFFFFFFF)
  })
})

/* ═══════════════════════════════════════════
   TypeTag
   ═══════════════════════════════════════════ */
describe("TypeTag", () => {
  it("has expected values", () => {
    expect(TypeTag.String).toBe(0x01)
    expect(TypeTag.I32).toBe(0x02)
    expect(TypeTag.F64).toBe(0x03)
    expect(TypeTag.Bool).toBe(0x04)
    expect(TypeTag.ArrayStart).toBe(0x05)
    expect(TypeTag.ObjectStart).toBe(0x06)
    expect(TypeTag.Null).toBe(0x07)
    expect(TypeTag.End).toBe(0x08)
  })
})

/* ═══════════════════════════════════════════
   writeTag + readTag
   ═══════════════════════════════════════════ */
describe("Tag round-trip", () => {
  it("writes and reads each tag", () => {
    const tags = [TypeTag.String, TypeTag.I32, TypeTag.F64, TypeTag.Bool, TypeTag.Null, TypeTag.End]
    for (const tag of tags) {
      const w = new BinaryWriter()
      w.writeTag(tag)
      const r = new BinaryReader(w.toBuffer())
      expect(r.readTag()).toBe(tag)
    }
  })
})

/* ═══════════════════════════════════════════
   writeByte + readByte
   ═══════════════════════════════════════════ */
describe("Byte round-trip", () => {
  it("writes and reads byte values", () => {
    const w = new BinaryWriter()
    w.writeByte(0)
    w.writeByte(127)
    w.writeByte(255)
    const r = new BinaryReader(w.toBuffer())
    expect(r.readByte()).toBe(0)
    expect(r.readByte()).toBe(127)
    expect(r.readByte()).toBe(255)
  })
})

/* ═══════════════════════════════════════════
   BinaryEncoder/Decoder Round-Trip
   ═══════════════════════════════════════════ */
describe("BinaryEncoder round-trip", () => {
  it("encodes and decodes string entries", () => {
    const entries = new Map<string, unknown>()
    entries.set("name", "Diana")
    entries.set("level", 42)
    const buffer = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(buffer)
    expect(index.getEntry("name")).toBe("Diana")
    expect(index.getEntry("level")).toBe(42)
  })

  it("encodes and decodes number entries", () => {
    const entries = new Map<string, unknown>()
    entries.set("hp", 100)
    entries.set("attack", 15.5)
    entries.set("alive", true)
    const buffer = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(buffer)
    expect(index.getEntry("hp")).toBe(100)
    expect(index.getEntry("attack")).toBeCloseTo(15.5, 10)
    expect(index.getEntry("alive")).toBe(true)
  })

  it("encodes and decodes nested object", () => {
    const entries = new Map<string, unknown>()
    entries.set("character", { name: "Jen", hp: 80, skills: ["attack", "heal"] })
    const buffer = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(buffer)
    const result = index.getEntry("character") as Record<string, unknown>
    expect(result.name).toBe("Jen")
    expect(result.hp).toBe(80)
    expect(result.skills).toEqual(["attack", "heal"])
  })

  it("encodes and decodes null entry", () => {
    const entries = new Map<string, unknown>()
    entries.set("empty", null)
    const buffer = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(buffer)
    expect(index.getEntry("empty")).toBeNull()
  })

  it("encodes and decodes array entry", () => {
    const entries = new Map<string, unknown>()
    entries.set("numbers", [1, 2, 3, 4, 5])
    const buffer = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(buffer)
    expect(index.getEntry("numbers")).toEqual([1, 2, 3, 4, 5])
  })

  it("getAllIds returns all entry IDs", () => {
    const entries = new Map<string, unknown>()
    entries.set("a", 1)
    entries.set("b", 2)
    entries.set("c", 3)
    const buffer = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(buffer)
    const ids = index.getAllIds()
    expect(ids).toContain("a")
    expect(ids).toContain("b")
    expect(ids).toContain("c")
  })

  it("getEntry returns undefined for missing ID", () => {
    const entries = new Map<string, unknown>()
    entries.set("existing", "value")
    const buffer = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(buffer)
    expect(index.getEntry("nonexistent")).toBeUndefined()
  })

  it("handles empty entries map", () => {
    const entries = new Map<string, unknown>()
    const buffer = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(buffer)
    expect(index.getAllIds()).toEqual([])
  })

  it("readAllEntries returns all entries", () => {
    const entries = new Map<string, unknown>()
    entries.set("x", "hello")
    entries.set("y", 42)
    const buffer = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(buffer)
    const all = index.readAllEntries()
    expect(all.length).toBe(2)
  })

  it("throws on invalid magic number", () => {
    const badBuffer = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00])
    const crcBuf = new Uint8Array(badBuffer.length + 4)
    crcBuf.set(badBuffer)
    // Compute CRC for the bad data
    const checksum = crc32(badBuffer)
    new DataView(crcBuf.buffer).setUint32(badBuffer.length, checksum, true)
    expect(() => new BinaryIndex(crcBuf.buffer as ArrayBuffer)).toThrow(TypeError)
  })
})
