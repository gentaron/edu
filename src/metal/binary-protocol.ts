/* ═══════════════════════════════════════════════════════════════
   L0 METAL — TLV Binary Serialization Protocol
   Pure TypeScript, zero dependencies. No `any` types.
   ═══════════════════════════════════════════════════════════════ */

// ─── Type Tags ────────────────────────────────────────────────

/**
 * TLV (Tag-Length-Value) type tags for the EDU binary serialization protocol.
 * Each tag byte identifies the type of the following value in the stream.
 */
export enum TypeTag {
  /** UTF-8 encoded string (length-prefixed with VarInt) */
  String = 0x01,
  /** 32-bit signed integer (little-endian) */
  I32 = 0x02,
  /** 64-bit floating point (IEEE 754, little-endian) */
  F64 = 0x03,
  /** Boolean value (single byte: 0 or 1) */
  Bool = 0x04,
  /** Marks the start of an array (followed by VarInt count, then elements, then End tag) */
  ArrayStart = 0x05,
  /** Marks the start of an object (followed by VarInt count, then key-value pairs, then End tag) */
  ObjectStart = 0x06,
  /** Null value (tag byte only — no additional data) */
  Null = 0x07,
  /** End marker for arrays and objects */
  End = 0x08,
}

// ─── CRC32 (table-based, no external deps) ───────────────────

const CRC32_TABLE = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? (c >>> 1) ^ 0xed_b8_83_20 : c >>> 1
  }
  CRC32_TABLE[i] = c
}

function crc32(data: Uint8Array): number {
  let crc = 0xff_ff_ff_ff
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ data[i]!) & 0xff]!
  }
  return (crc ^ 0xff_ff_ff_ff) >>> 0
}

/**
 * Compute CRC32 checksum for binary data using a table-based algorithm.
 * Uses polynomial 0xEDB88320 (reflected form of standard CRC32).
 *
 * @param data - The input byte array to compute the checksum for.
 * @returns The CRC32 checksum as an unsigned 32-bit integer.
 * @example
 * const checksum = crc32(new Uint8Array([0x45, 0x44, 0x55]))
 * // → 3522472952 (0xD1F26AD8)
 */
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

/**
 * Low-level binary writer that appends typed values to a growable byte buffer.
 * All multi-byte values are written in little-endian byte order.
 * The buffer automatically grows (doubles) when capacity is exceeded.
 */
export class BinaryWriter {
  private buf: Uint8Array
  private dv: DataView
  private pos = 0

  /**
   * Create a new BinaryWriter with the given initial capacity.
   * The buffer will grow automatically if more space is needed.
   *
   * @param initialCapacity - Starting buffer size in bytes (default 1024).
   */
  constructor(initialCapacity = 1024) {
    this.buf = new Uint8Array(initialCapacity)
    this.dv = new DataView(this.buf.buffer)
  }

  private grow(needed: number): void {
    const required = this.pos + needed
    if (required <= this.buf.length) {
      return
    }
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

  /**
   * Write a single byte (0x00–0xFF).
   *
   * @param value - The byte value to write (only lower 8 bits used).
   */
  writeByte(value: number): void {
    this.u8(value & 0xff)
  }

  /**
   * Write a variable-length unsigned integer (VarInt encoding).
   * Uses 7 bits per byte with continuation bit (MSB).
   * Supports up to 35-bit values (5 bytes max).
   *
   * @param value - Non-negative integer to encode.
   * @throws {RangeError} If value is negative.
   */
  writeVarInt(value: number): void {
    if (value < 0) {
      throw new RangeError("VarInt value must be non-negative")
    }
    let v = value >>> 0
    do {
      let byte = v & 0x7f
      v >>>= 7
      if (v !== 0) {
        byte |= 0x80
      }
      this.u8(byte)
    } while (v !== 0)
  }

  /**
   * Write a type tag byte.
   *
   * @param tag - The {@link TypeTag} to write.
   */
  writeTag(tag: TypeTag): void {
    this.u8(tag)
  }

  /**
   * Write a UTF-8 encoded string (VarInt length prefix + bytes).
   *
   * @param value - The string to write.
   */
  writeString(value: string): void {
    const encoded = encodeUTF8(value)
    this.writeVarInt(encoded.length)
    this.raw(encoded)
  }

  /**
   * Write a 32-bit signed integer (4 bytes, little-endian).
   *
   * @param value - The integer to write.
   */
  writeI32(value: number): void {
    this.i32(value)
  }

  /**
   * Write a 64-bit floating point number (8 bytes, IEEE 754, little-endian).
   *
   * @param value - The number to write.
   */
  writeF64(value: number): void {
    this.f64(value)
  }

  /**
   * Write a boolean value as a single byte (1 = true, 0 = false).
   *
   * @param value - The boolean to write.
   */
  writeBool(value: boolean): void {
    this.u8(value ? 1 : 0)
  }

  /**
   * Write a null marker (tag byte only, no additional data).
   */
  writeNull(): void {
    this.writeTag(TypeTag.Null)
  }

  /**
   * Write the start of an array (ArrayStart tag + VarInt element count).
   * Follow with element writes and close with {@link writeEnd}.
   *
   * @param count - Number of elements in the array.
   */
  writeArrayStart(count: number): void {
    this.writeTag(TypeTag.ArrayStart)
    this.writeVarInt(count)
  }

  /**
   * Write the start of an object (ObjectStart tag + VarInt property count).
   * Follow with key-value pair writes (keys as tagged strings) and close with {@link writeEnd}.
   *
   * @param count - Number of properties in the object.
   */
  writeObjectStart(count: number): void {
    this.writeTag(TypeTag.ObjectStart)
    this.writeVarInt(count)
  }

  /**
   * Write an End tag, closing the current array or object.
   */
  writeEnd(): void {
    this.writeTag(TypeTag.End)
  }

  /**
   * Recursively serialize an arbitrary TypeScript value using tagged TLV format.
   * Automatically determines the type tag and writes the appropriate data.
   * Integers within the i32 range are written as I32; others as F64.
   * Arrays and objects are written with start/end markers.
   *
   * @param value - The value to serialize (string, number, boolean, null, array, or object).
   * @throws {TypeError} If the value type is unsupported (e.g. function, symbol).
   */
  writeValue(value: unknown): void {
    if (value == null) {
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
        if (Number.isInteger(value) && value >= -2_147_483_648 && value <= 2_147_483_647) {
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
      case "bigint":
      case "symbol":
      case "undefined":
      case "function": {
        throw new TypeError(`Unsupported type for binary serialization: ${typeof value}`)
      }
    }
  }

  /**
   * Get the written data as an ArrayBuffer.
   * Returns only the bytes that have been written (not the full capacity).
   *
   * @returns An ArrayBuffer containing the written data.
   */
  toBuffer(): ArrayBuffer {
    return this.buf.buffer.slice(0, this.pos) as ArrayBuffer
  }

  /**
   * Get the written data as a Uint8Array.
   * Returns only the bytes that have been written (not the full capacity).
   *
   * @returns A Uint8Array containing the written data.
   */
  toUint8Array(): Uint8Array {
    return this.buf.slice(0, this.pos)
  }

  /**
   * Get the current write position (number of bytes written so far).
   *
   * @returns The current byte position.
   */
  getPosition(): number {
    return this.pos
  }
}

// ─── BinaryReader ─────────────────────────────────────────────

/**
 * Low-level binary reader that reads typed values from an ArrayBuffer.
 * All multi-byte values are read in little-endian byte order.
 * The read position advances as data is consumed.
 */
export class BinaryReader {
  private buf: Uint8Array
  private dv: DataView
  private pos = 0

  /**
   * Create a new BinaryReader wrapping the given buffer.
   *
   * @param buffer - The ArrayBuffer to read from.
   */
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

  /**
   * Read a single byte from the stream.
   *
   * @returns The byte value (0x00–0xFF).
   */
  readByte(): number {
    return this.u8()
  }

  /**
   * Read a variable-length unsigned integer (VarInt encoding).
   * Reads 7 bits per byte until the continuation bit (MSB) is 0.
   *
   * @returns The decoded unsigned integer value.
   * @throws {RangeError} If the VarInt exceeds 5 bytes (35-bit limit).
   */
  readVarInt(): number {
    let result = 0
    let shift = 0
    while (true) {
      const byte = this.u8()
      result |= (byte & 0x7f) << shift
      if ((byte & 0x80) === 0) {
        break
      }
      shift += 7
      if (shift >= 35) {
        throw new RangeError("VarInt too large")
      }
    }
    return result >>> 0
  }

  /**
   * Read and validate a type tag byte from the stream.
   *
   * @returns The validated {@link TypeTag}.
   * @throws {TypeError} If the byte is not a valid type tag.
   */
  readTag(): TypeTag {
    const byte = this.u8()
    if (!isValidTypeTag(byte)) {
      throw new TypeError(`Invalid type tag: 0x${byte.toString(16).padStart(2, "0")}`)
    }
    return byte
  }

  /**
   * Read a UTF-8 encoded string (VarInt length prefix + bytes).
   *
   * @returns The decoded string.
   */
  readString(): string {
    const length = this.readVarInt()
    const data = this.bytes(length)
    return new TextDecoder("utf-8").decode(data)
  }

  /**
   * Read a 32-bit signed integer (4 bytes, little-endian).
   *
   * @returns The integer value.
   */
  readI32(): number {
    return this.i32()
  }

  /**
   * Read a 64-bit floating point number (8 bytes, IEEE 754, little-endian).
   *
   * @returns The floating point value.
   */
  readF64(): number {
    return this.f64()
  }

  /**
   * Read a boolean value (single byte: 0 = false, nonzero = true).
   *
   * @returns The boolean value.
   */
  readBool(): boolean {
    return this.u8() !== 0
  }

  /**
   * Recursively read and deserialize a typed value from the stream.
   * Reads the next type tag, then reads the appropriate data based on the tag.
   * For arrays and objects, reads all elements/properties until an End tag.
   *
   * @returns The deserialized value (string, number, boolean, null, array, or object).
   * @throws {TypeError} If an invalid tag is encountered or expected End tag is missing.
   */
  readValue(): unknown {
    const tag = this.readTag()

    switch (tag) {
      case TypeTag.Null: {
        return null
      }

      case TypeTag.String: {
        return this.readString()
      }

      case TypeTag.I32: {
        return this.readI32()
      }

      case TypeTag.F64: {
        return this.readF64()
      }

      case TypeTag.Bool: {
        return this.readBool()
      }

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

      case TypeTag.End: {
        throw new TypeError("Unexpected End tag during readValue")
      }

      default: {
        const _exhaustive: never = tag
        throw new TypeError(
          `Unexpected type tag during readValue: 0x${(_exhaustive as number).toString(16)}`
        )
      }
    }
  }

  /**
   * Get the current read position (number of bytes consumed so far).
   *
   * @returns The current byte position.
   */
  getPosition(): number {
    return this.pos
  }

  /**
   * Get the underlying ArrayBuffer.
   *
   * @returns The original ArrayBuffer passed to the constructor.
   */
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

/**
 * High-level binary encoder that produces EDU-format files with a header,
 * offset table, TLV data section, and CRC32 checksum.
 *
 * File layout:
 * - Bytes 0..3: Magic "EDU\x01"
 * - Bytes 4..5: Version (uint16 LE)
 * - Bytes 6..9: Entry count (uint32 LE)
 * - Bytes 10..: Offset table (N × 8 bytes: offset u32 + length u32)
 * - Data section: TLV entries
 * - Last 4 bytes: CRC32 checksum
 */
export const BinaryEncoder = {
  /**
   * Encode a collection of named entries into the EDU binary format.
   * Each entry is serialized as a tagged TLV blob (string ID + value).
   * The resulting file includes a header, offset table, data, and CRC32.
   *
   * @param entries - A Map of entry IDs to their values.
   * @returns An ArrayBuffer containing the complete EDU binary file.
   * @example
   * const map = new Map([['card-1', { name: 'リン', hp: 19 }]])
   * const buf = BinaryEncoder.encode(map)
   */
  encode(entries: Map<string, unknown>): ArrayBuffer {
    const entryIds = [...entries.keys()]
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
  },
}

// ─── BinaryIndex ──────────────────────────────────────────────

/**
 * Random-access index over an EDU binary file.
 * Parses the file header, validates CRC32, and builds an O(1) lookup map
 * for entries by their string IDs. Enables efficient single-entry deserialization
 * without reading the entire file.
 */
export class BinaryIndex {
  private buf: Uint8Array
  private view: DataView
  private indexMap: Map<string, OffsetEntry>

  /**
   * Create a BinaryIndex from an EDU binary file buffer.
   * Validates magic number, version, and CRC32 checksum during construction.
   *
   * @param buffer - The complete EDU binary file as an ArrayBuffer.
   * @throws {TypeError} If the magic number, version, or CRC32 is invalid.
   */
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
    const dataWithoutCrc = this.buf.slice(0, -4)
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

  /**
   * Look up an entry's file offset and length by its ID. O(1) lookup.
   *
   * @param id - The entry ID to look up.
   * @returns The offset and length, or `undefined` if the ID is not found.
   */
  lookup(id: string): OffsetEntry | undefined {
    return this.indexMap.get(id)
  }

  /**
   * Get all entry IDs in the file.
   *
   * @returns Array of all entry ID strings.
   */
  getAllIds(): string[] {
    return [...this.indexMap.keys()]
  }

  /**
   * Read and deserialize a single entry by its ID.
   * Extracts the raw bytes from the file and deserializes them using BinaryReader.
   *
   * @param id - The entry ID to read.
   * @returns The deserialized value, or `undefined` if the ID is not found.
   */
  getEntry(id: string): unknown {
    const entry = this.indexMap.get(id)
    if (entry === undefined) {
      return undefined
    }
    const entryBuf = this.buf.buffer.slice(entry.offset, entry.offset + entry.length) as ArrayBuffer
    const reader = new BinaryReader(entryBuf)
    reader.readTag() // skip String tag
    reader.readString() // skip id
    return reader.readValue()
  }

  /**
   * Read and deserialize all entries in the file.
   *
   * @returns Array of all deserialized entry values, in file order.
   */
  readAllEntries(): unknown[] {
    const results: unknown[] = []
    for (const id of this.indexMap.keys()) {
      results.push(this.getEntry(id))
    }
    return results
  }
}
