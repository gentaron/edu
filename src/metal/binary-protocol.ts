/* ═══════════════════════════════════════════════════════════════
   L0 METAL — TLV Binary Serialization Protocol
   Pure TypeScript, zero dependencies. No `any` types.
   ═══════════════════════════════════════════════════════════════ */

// ─── Type Tags ────────────────────────────────────────────────

export enum TypeTag {
  String = 0x01,
  I32 = 0x02,
  F64 = 0x03,
  Bool = 0x04,
  ArrayStart = 0x05,
  ObjectStart = 0x06,
  Null = 0x07,
  End = 0x08,
}

// ─── CRC32 (table-based, no external deps) ───────────────────

const CRC32_TABLE = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) {
    if (c & 1) {
      c = (c >>> 1) ^ 0xedb88320
    } else {
      c = c >>> 1
    }
  }
  CRC32_TABLE[i] = c
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ data[i]!) & 0xff]!
  }
  return (crc ^ 0xffffffff) >>> 0
}

export { crc32 }

// ─── Helpers ──────────────────────────────────────────────────

function encodeUTF8(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

const MAGIC = new Uint8Array([0x45, 0x44, 0x55, 0x01]) // "EDU\x01"
const CURRENT_VERSION = 1

// ─── Type guard ───────────────────────────────────────────────

function isValidTypeTag(value: number): value is TypeTag {
  return (
    value === TypeTag.String ||
    value === TypeTag.I32 ||
    value === TypeTag.F64 ||
    value === TypeTag.Bool ||
    value === TypeTag.ArrayStart ||
    value === TypeTag.ObjectStart ||
    value === TypeTag.Null ||
    value === TypeTag.End
  )
}

// ─── BinaryWriter ─────────────────────────────────────────────

export class BinaryWriter {
  private buf: Uint8Array
  private dv: DataView
  private pos = 0

  constructor(initialCapacity = 1024) {
    this.buf = new Uint8Array(initialCapacity)
    this.dv = new DataView(this.buf.buffer)
  }

  private grow(needed: number): void {
    const required = this.pos + needed
    if (required <= this.buf.length) return
    const next = Math.max(required * 2, 1024)
    const grown = new Uint8Array(next)
    grown.set(this.buf)
    this.buf = grown
    this.dv = new DataView(this.buf.buffer)
  }

  private u8(v: number): void {
    this.grow(1)
    this.dv.setUint8(this.pos, v)
    this.pos += 1
  }

  private i32(v: number): void {
    this.grow(4)
    this.dv.setInt32(this.pos, v, true)
    this.pos += 4
  }

  private u32(v: number): void {
    this.grow(4)
    this.dv.setUint32(this.pos, v, true)
    this.pos += 4
  }

  private f64(v: number): void {
    this.grow(8)
    this.dv.setFloat64(this.pos, v, true)
    this.pos += 8
  }

  private raw(data: Uint8Array): void {
    this.grow(data.length)
    this.buf.set(data, this.pos)
    this.pos += data.length
  }

  writeByte(value: number): void {
    this.u8(value & 0xff)
  }

  writeVarInt(value: number): void {
    if (value < 0) throw new RangeError("VarInt value must be non-negative")
    let v = value >>> 0
    do {
      let byte = v & 0x7f
      v >>>= 7
      if (v !== 0) byte |= 0x80
      this.u8(byte)
    } while (v !== 0)
  }

  writeTag(tag: TypeTag): void {
    this.u8(tag)
  }

  writeString(value: string): void {
    const encoded = encodeUTF8(value)
    this.writeVarInt(encoded.length)
    this.raw(encoded)
  }

  writeI32(value: number): void {
    this.i32(value)
  }

  writeF64(value: number): void {
    this.f64(value)
  }

  writeBool(value: boolean): void {
    this.u8(value ? 1 : 0)
  }

  writeNull(): void {
    // null is tag-only: the tag byte IS the value
    this.writeTag(TypeTag.Null)
  }

  writeArrayStart(count: number): void {
    this.writeTag(TypeTag.ArrayStart)
    this.writeVarInt(count)
  }

  writeObjectStart(count: number): void {
    this.writeTag(TypeTag.ObjectStart)
    this.writeVarInt(count)
  }

  writeEnd(): void {
    this.writeTag(TypeTag.End)
  }

  /** Recursive serialization of arbitrary TypeScript values (tagged TLV). */
  writeValue(value: unknown): void {
    if (value === null) {
      this.writeTag(TypeTag.Null)
      return
    }

    switch (typeof value) {
      case "string": {
        this.writeTag(TypeTag.String)
        this.writeString(value)
        break
      }
      case "number": {
        if (Number.isInteger(value) && value >= -2147483648 && value <= 2147483647) {
          this.writeTag(TypeTag.I32)
          this.writeI32(value)
        } else {
          this.writeTag(TypeTag.F64)
          this.writeF64(value)
        }
        break
      }
      case "boolean": {
        this.writeTag(TypeTag.Bool)
        this.writeBool(value)
        break
      }
      case "object": {
        if (Array.isArray(value)) {
          this.writeArrayStart(value.length)
          for (const item of value) {
            this.writeValue(item)
          }
          this.writeEnd()
        } else {
          const obj = value as Record<string, unknown>
          const keys = Object.keys(obj)
          this.writeObjectStart(keys.length)
          for (const key of keys) {
            this.writeTag(TypeTag.String)
            this.writeString(key)
            this.writeValue(obj[key])
          }
          this.writeEnd()
        }
        break
      }
      default:
        throw new TypeError(`Unsupported type for binary serialization: ${typeof value}`)
    }
  }

  toBuffer(): ArrayBuffer {
    return this.buf.buffer.slice(0, this.pos) as ArrayBuffer
  }

  toUint8Array(): Uint8Array {
    return this.buf.slice(0, this.pos)
  }

  getPosition(): number {
    return this.pos
  }
}

// ─── BinaryReader ─────────────────────────────────────────────

export class BinaryReader {
  private buf: Uint8Array
  private dv: DataView
  private pos = 0

  constructor(buffer: ArrayBuffer) {
    this.buf = new Uint8Array(buffer)
    this.dv = new DataView(buffer)
  }

  private u8(): number {
    const v = this.dv.getUint8(this.pos)
    this.pos += 1
    return v
  }

  private i32(): number {
    const v = this.dv.getInt32(this.pos, true)
    this.pos += 4
    return v
  }

  private u32(): number {
    const v = this.dv.getUint32(this.pos, true)
    this.pos += 4
    return v
  }

  private f64(): number {
    const v = this.dv.getFloat64(this.pos, true)
    this.pos += 8
    return v
  }

  private bytes(len: number): Uint8Array {
    const slice = this.buf.slice(this.pos, this.pos + len)
    this.pos += len
    return slice
  }

  readByte(): number {
    return this.u8()
  }

  readVarInt(): number {
    let result = 0
    let shift = 0
    while (true) {
      const byte = this.u8()
      result |= (byte & 0x7f) << shift
      if ((byte & 0x80) === 0) break
      shift += 7
      if (shift >= 35) {
        throw new RangeError("VarInt too large")
      }
    }
    return result >>> 0
  }

  readTag(): TypeTag {
    const byte = this.u8()
    if (!isValidTypeTag(byte)) {
      throw new TypeError(`Invalid type tag: 0x${byte.toString(16).padStart(2, "0")}`)
    }
    return byte
  }

  readString(): string {
    const length = this.readVarInt()
    const data = this.bytes(length)
    return new TextDecoder("utf-8").decode(data)
  }

  readI32(): number {
    return this.i32()
  }

  readF64(): number {
    return this.f64()
  }

  readBool(): boolean {
    return this.u8() !== 0
  }

  /** Recursive deserialization */
  readValue(): unknown {
    const tag = this.readTag()

    switch (tag) {
      case TypeTag.Null:
        return null

      case TypeTag.String:
        return this.readString()

      case TypeTag.I32:
        return this.readI32()

      case TypeTag.F64:
        return this.readF64()

      case TypeTag.Bool:
        return this.readBool()

      case TypeTag.ArrayStart: {
        const count = this.readVarInt()
        const arr: unknown[] = []
        for (let i = 0; i < count; i++) {
          arr.push(this.readValue())
        }
        const endTag = this.readTag()
        if (endTag !== TypeTag.End) {
          throw new TypeError(`Expected End tag after array, got 0x${endTag.toString(16)}`)
        }
        return arr
      }

      case TypeTag.ObjectStart: {
        const count = this.readVarInt()
        const obj: Record<string, unknown> = {}
        for (let i = 0; i < count; i++) {
          const keyTag = this.readTag()
          if (keyTag !== TypeTag.String) {
            throw new TypeError(`Expected string key in object, got tag 0x${keyTag.toString(16)}`)
          }
          const key = this.readString()
          obj[key] = this.readValue()
        }
        const endTag = this.readTag()
        if (endTag !== TypeTag.End) {
          throw new TypeError(`Expected End tag after object, got 0x${endTag.toString(16)}`)
        }
        return obj
      }

      default:
        throw new TypeError(`Unexpected type tag during readValue: 0x${tag.toString(16)}`)
    }
  }

  getPosition(): number {
    return this.pos
  }

  getBuffer(): ArrayBuffer {
    return this.buf.buffer as ArrayBuffer
  }
}

// ─── File Header Structure ────────────────────────────────────
//
// Bytes 0..3   Magic "EDU\x01"
// Bytes 4..5   Version (uint16 LE)
// Bytes 6..9   Entry count (uint32 LE)
// Bytes 10..   Offset table: N × 8 bytes (offset: u32 LE, length: u32 LE)
//              Data section: TLV entries
//              CRC32: 4 bytes (last 4 bytes of file)
//
// Offsets in the offset table are relative to the start of the file.

interface OffsetEntry {
  offset: number
  length: number
}

// ─── BinaryEncoder ────────────────────────────────────────────

export class BinaryEncoder {
  /** Encode a collection of named entries into the EDU binary format. */
  static encode(entries: Map<string, unknown>): ArrayBuffer {
    const entryIds = Array.from(entries.keys())
    const entryCount = entryIds.length

    // 1. Serialize each entry: id (string) + value as a TLV blob
    const blobs: Uint8Array[] = []
    for (const id of entryIds) {
      const w = new BinaryWriter(256)
      w.writeTag(TypeTag.String)
      w.writeString(id)
      w.writeValue(entries.get(id))
      blobs.push(w.toUint8Array())
    }

    // 2. Compute layout
    const headerSize = 4 + 2 + 4 + entryCount * 8
    const offsets: OffsetEntry[] = []
    let cursor = headerSize
    for (const blob of blobs) {
      offsets.push({ offset: cursor, length: blob.length })
      cursor += blob.length
    }

    // 3. Assemble the file without CRC
    const totalDataSize = blobs.reduce((s, b) => s + b.length, 0)
    const raw = new Uint8Array(headerSize + totalDataSize)
    const rawView = new DataView(raw.buffer)
    let p = 0

    raw.set(MAGIC, p)
    p += 4

    rawView.setUint16(p, CURRENT_VERSION, true)
    p += 2

    rawView.setUint32(p, entryCount, true)
    p += 4

    for (const oe of offsets) {
      rawView.setUint32(p, oe.offset, true)
      p += 4
      rawView.setUint32(p, oe.length, true)
      p += 4
    }

    for (const blob of blobs) {
      raw.set(blob, p)
      p += blob.length
    }

    // 4. Compute CRC32 and append
    const checksum = crc32(raw)
    const final = new Uint8Array(raw.length + 4)
    final.set(raw)
    new DataView(final.buffer).setUint32(raw.length, checksum, true)

    return final.buffer
  }
}

// ─── BinaryIndex ──────────────────────────────────────────────

export class BinaryIndex {
  private buf: Uint8Array
  private view: DataView
  private indexMap: Map<string, OffsetEntry>

  constructor(buffer: ArrayBuffer) {
    this.buf = new Uint8Array(buffer)
    this.view = new DataView(buffer)
    this.indexMap = new Map()

    // Validate magic
    if (
      this.buf[0] !== 0x45 ||
      this.buf[1] !== 0x44 ||
      this.buf[2] !== 0x55 ||
      this.buf[3] !== 0x01
    ) {
      throw new TypeError("Invalid EDU binary format: bad magic number")
    }

    // Read version
    const version = this.view.getUint16(4, true)
    if (version !== CURRENT_VERSION) {
      throw new TypeError(`Unsupported EDU binary version: ${version}`)
    }

    // Read entry count
    const entryCount = this.view.getUint32(6, true)

    // Verify CRC32 first (everything except last 4 bytes)
    const dataWithoutCrc = this.buf.slice(0, this.buf.length - 4)
    const storedCrc = this.view.getUint32(this.buf.length - 4, true)
    const computedCrc = crc32(dataWithoutCrc)
    if (storedCrc !== computedCrc) {
      throw new TypeError(
        `CRC32 mismatch: stored=0x${storedCrc.toString(16)}, computed=0x${computedCrc.toString(16)}`
      )
    }

    // Parse offset table and extract IDs
    for (let i = 0; i < entryCount; i++) {
      const tableOffset = 10 + i * 8
      const dataOffset = this.view.getUint32(tableOffset, true)
      const dataLength = this.view.getUint32(tableOffset + 4, true)

      const entryReader = new BinaryReader(
        this.buf.buffer.slice(dataOffset, dataOffset + dataLength) as ArrayBuffer
      )
      const idTag = entryReader.readTag()
      if (idTag !== TypeTag.String) {
        throw new TypeError(`Expected string ID for entry ${i}, got tag 0x${idTag.toString(16)}`)
      }
      const id = entryReader.readString()
      this.indexMap.set(id, { offset: dataOffset, length: dataLength })
    }
  }

  /** Look up an entry's offset and length by id. O(1). */
  lookup(id: string): OffsetEntry | undefined {
    return this.indexMap.get(id)
  }

  /** Get all entry ids in the file. */
  getAllIds(): string[] {
    return Array.from(this.indexMap.keys())
  }

  /** Read and deserialize a single entry by id. */
  getEntry(id: string): unknown {
    const entry = this.indexMap.get(id)
    if (entry === undefined) return undefined
    const entryBuf = this.buf.buffer.slice(entry.offset, entry.offset + entry.length) as ArrayBuffer
    const reader = new BinaryReader(entryBuf)
    reader.readTag() // skip String tag
    reader.readString() // skip id
    return reader.readValue()
  }

  /** Read and deserialize all entries, returning them as an array. */
  readAllEntries(): unknown[] {
    const results: unknown[] = []
    for (const id of Array.from(this.indexMap.keys())) {
      results.push(this.getEntry(id))
    }
    return results
  }
}
