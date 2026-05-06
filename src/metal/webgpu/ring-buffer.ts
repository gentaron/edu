/* ═══════════════════════════════════════════════════════════
   L0 METAL — Zero-Copy Ring Buffer
   Epoch-12 Delta — Dimensional Horizon Memory Bridge
   ═══════════════════════════════════════════════════════════

   Lock-free single-producer / single-consumer ring buffer over
   SharedArrayBuffer. Enables zero-copy data transfer between
   WASM linear memory and JS-side rendering.

   When SharedArrayBuffer is unavailable (no COOP/COEP),
   gracefully falls back to a message-passing implementation
   using structured clone + postMessage.

   Architecture:
   ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
   │  WebGPU /    │────>│ Ring Buffer  │────>│  Canvas 2D  │
   │  WASM Compute│     │ (SharedArray)│     │  Renderer   │
   └─────────────┘     └──────────────┘     └─────────────┘

   Memory layout (SharedArrayBuffer):
   [header 16 bytes][ring data ... N bytes]

   Header:
   - bytes 0..3:  write cursor (u32, producer)
   - bytes 4..7:  read cursor  (u32, consumer)
   - bytes 8..11: capacity     (u32, fixed)
   - bytes 12..15: generation  (u32, wrap-around counter)
   ═══════════════════════════════════════════════════════════ */

import { isCrossOriginIsolated } from "./device";

// ── Constants ──

/** Header size in bytes: write(4) + read(4) + capacity(4) + generation(4). */
const HEADER_SIZE = 16;

/** Default ring buffer capacity in bytes (1 MB). */
const DEFAULT_CAPACITY = 1024 * 1024;

/** Maximum entry size in bytes (128 KB). */
const MAX_ENTRY_SIZE = 128 * 1024;

// ── Types ──

/** Branded type for ring buffer slot index. */
export type RingSlotId = number & { readonly __brand: "RingSlotId" };

/** Result of a ring buffer write operation. */
export interface RingWriteResult {
  readonly success: boolean;
  readonly bytesWritten: number;
  readonly generation: number;
}

/** Result of a ring buffer read operation. */
export interface RingReadResult {
  readonly data: Uint8Array;
  readonly generation: number;
  readonly available: number;
}

/** Ring buffer statistics. */
export interface RingBufferStats {
  readonly capacity: number;
  readonly used: number;
  readonly free: number;
  readonly generation: number;
  readonly totalWrites: number;
  readonly totalReads: number;
  readonly overflowCount: number;
  readonly mode: "shared" | "fallback";
}

// ── Shared Memory Ring Buffer ──

/**
 * Zero-copy ring buffer backed by SharedArrayBuffer.
 * Single-producer (WASM/WebGPU compute) / single-consumer (Canvas 2D renderer).
 * Uses atomic operations for lock-free coordination.
 */
export class SharedRingBuffer {
  private readonly buffer: SharedArrayBuffer;
  private readonly headerI32: Int32Array; // header as Int32Array for Atomics
  private readonly view: DataView; // header as DataView for non-atomic access
  private readonly capacity: number;
  private totalWrites = 0;
  private totalReads = 0;
  private overflowCount = 0;
  private readonly useAtomics: boolean;

  /**
   * Create a shared ring buffer.
   *
   * @param capacity - Ring data capacity in bytes (excluding header). Defaults to 1 MB.
   */
  constructor(capacity: number = DEFAULT_CAPACITY) {
    this.capacity = capacity;
    // Total buffer: header + ring data
    this.buffer = new SharedArrayBuffer(HEADER_SIZE + capacity);
    this.view = new DataView(this.buffer);
    this.headerI32 = new Int32Array(this.buffer, 0, 4); // 4 x i32 = 16 bytes

    // Initialize header
    this.headerI32[0] = 0; // write cursor = 0
    this.headerI32[1] = 0; // read cursor = 0
    this.headerI32[2] = capacity; // capacity
    this.headerI32[3] = 0; // generation = 0

    // Check if Atomics are available
    this.useAtomics = typeof Atomics !== "undefined";
  }

  /**
   * Get the underlying SharedArrayBuffer.
   * @returns The shared buffer reference.
   */
  getSharedBuffer(): SharedArrayBuffer {
    return this.buffer;
  }

  /**
   * Write data into the ring buffer (producer side).
   * The data is prefixed with a 4-byte length header for framing.
   *
   * @param data - Bytes to write.
   * @returns Write result with success status and generation.
   */
  write(data: Uint8Array): RingWriteResult {
    const writeCursor = this.useAtomics
      ? Atomics.load(this.headerI32, 0)
      : this.headerI32[0]!;

    const readCursor = this.useAtomics
      ? Atomics.load(this.headerI32, 1)
      : this.headerI32[1]!;

    const generation = this.headerI32[3]!;
    const entrySize = 4 + data.length; // length prefix + data
    const _totalSize = HEADER_SIZE + this.capacity;

    if (entrySize > this.capacity) {
      this.overflowCount++;
      return { success: false, bytesWritten: 0, generation };
    }

    // Calculate available space (circular)
    const available = writeCursor >= readCursor ? this.capacity - (writeCursor - readCursor) : readCursor - writeCursor;

    if (available < entrySize + 1) {
      // Not enough space — overflow
      this.overflowCount++;
      return { success: false, bytesWritten: 0, generation };
    }

    // Write length prefix and data
    const dataOffset = HEADER_SIZE + writeCursor;

    // Handle wrap-around
    if (writeCursor + entrySize <= this.capacity) {
      // Contiguous write
      this.view.setUint32(dataOffset, data.length, true);
      const ringView = new Uint8Array(this.buffer);
      ringView.set(data, dataOffset + 4);
    } else {
      // Wrapping write: split across end and beginning
      const firstChunk = this.capacity - writeCursor;
      const _remaining = entrySize - firstChunk;

      // Write first chunk
      if (firstChunk >= 4) {
        this.view.setUint32(dataOffset, data.length, true);
        const ringView = new Uint8Array(this.buffer);
        const dataInFirst = Math.min(firstChunk - 4, data.length);
        ringView.set(data.subarray(0, dataInFirst), dataOffset + 4);
      } else {
        // Length prefix wraps
        const temp = new Uint8Array(4);
        const tempView = new DataView(temp.buffer);
        tempView.setUint32(0, data.length, true);
        const ringView = new Uint8Array(this.buffer);
        ringView.set(temp.subarray(0, firstChunk), dataOffset);
        ringView.set(temp.subarray(firstChunk), HEADER_SIZE);
      }

      // Write remaining data at the beginning
      const dataWrittenInFirst = Math.max(0, firstChunk - 4);
      const remainingData = data.subarray(dataWrittenInFirst);
      if (remainingData.length > 0) {
        const ringView = new Uint8Array(this.buffer);
        ringView.set(remainingData, HEADER_SIZE + (firstChunk < 4 ? 4 - firstChunk : 0));
      }
    }

    // Advance write cursor (with wrap)
    const newCursor = (writeCursor + entrySize) % this.capacity;
    if (this.useAtomics) {
      Atomics.store(this.headerI32, 0, newCursor);
      Atomics.notify(this.headerI32, 0);
    } else {
      this.headerI32[0] = newCursor;
    }

    this.totalWrites++;

    // Increment generation on wrap-around
    let newGeneration = generation;
    if (newCursor < writeCursor) {
      newGeneration++;
      this.headerI32[3] = newGeneration;
    }

    return { success: true, bytesWritten: data.length, generation: newGeneration };
  }

  /**
   * Read data from the ring buffer (consumer side).
   *
   * @param maxBytes - Maximum bytes to read. Defaults to all available.
   * @returns Read result with data and metadata, or null if empty.
   */
  read(maxBytes?: number): RingReadResult | null {
    const writeCursor = this.useAtomics
      ? Atomics.load(this.headerI32, 0)
      : this.headerI32[0]!;

    const readCursor = this.useAtomics
      ? Atomics.load(this.headerI32, 1)
      : this.headerI32[1]!;

    const generation = this.headerI32[3]!;

    // Empty check
    if (writeCursor === readCursor) {
      return null;
    }

    // Read length prefix
    const readOffset = HEADER_SIZE + readCursor;
    let entryLength: number;

    if (readCursor + 4 <= this.capacity) {
      entryLength = this.view.getUint32(readOffset, true);
    } else {
      // Length prefix wraps
      const temp = new Uint8Array(4);
      const ringView = new Uint8Array(this.buffer);
      const firstChunk = this.capacity - readCursor;
      temp.set(ringView.subarray(readOffset, readOffset + firstChunk), 0);
      temp.set(ringView.subarray(HEADER_SIZE, HEADER_SIZE + (4 - firstChunk)), firstChunk);
      entryLength = new DataView(temp.buffer).getUint32(0, true);
    }

    // Clamp to maxBytes
    const readLength = maxBytes != null ? Math.min(entryLength, maxBytes) : entryLength;
    const totalEntrySize = 4 + readLength;
    const result = new Uint8Array(readLength);

    // Read data
    const dataStart = HEADER_SIZE + ((readCursor + 4) % this.capacity);

    if (dataStart + readLength <= HEADER_SIZE + this.capacity) {
      // Contiguous read
      const ringView = new Uint8Array(this.buffer);
      result.set(ringView.subarray(dataStart, dataStart + readLength));
    } else {
      // Wrapping read
      const ringView = new Uint8Array(this.buffer);
      const endOfBuffer = HEADER_SIZE + this.capacity;
      const firstChunk = endOfBuffer - dataStart;
      result.set(ringView.subarray(dataStart, endOfBuffer), 0);
      result.set(ringView.subarray(HEADER_SIZE, HEADER_SIZE + (readLength - firstChunk)), firstChunk);
    }

    // Advance read cursor
    const newCursor = (readCursor + totalEntrySize) % this.capacity;
    if (this.useAtomics) {
      Atomics.store(this.headerI32, 1, newCursor);
    } else {
      this.headerI32[1] = newCursor;
    }

    this.totalReads++;

    // Calculate remaining available
    const available = writeCursor >= newCursor ? writeCursor - newCursor : this.capacity - (newCursor - writeCursor);

    return { data: result, generation, available };
  }

  /**
   * Get current ring buffer statistics.
   * @returns Buffer stats including capacity, usage, and mode.
   */
  getStats(): RingBufferStats {
    const writeCursor = this.headerI32[0]!;
    const readCursor = this.headerI32[1]!;
    const generation = this.headerI32[3]!;

    const used = writeCursor >= readCursor ? writeCursor - readCursor : this.capacity - (readCursor - writeCursor);

    return {
      capacity: this.capacity,
      used,
      free: this.capacity - used,
      generation,
      totalWrites: this.totalWrites,
      totalReads: this.totalReads,
      overflowCount: this.overflowCount,
      mode: "shared",
    };
  }

  /**
   * Check if the ring buffer is empty.
   * @returns true if no data is available to read.
   */
  isEmpty(): boolean {
    return this.headerI32[0]! === this.headerI32[1]!;
  }

  /**
   * Clear all data in the ring buffer.
   */
  clear(): void {
    this.headerI32[0] = 0; // write cursor = 0
    this.headerI32[1] = 0; // read cursor = 0
    this.totalWrites = 0;
    this.totalReads = 0;
    this.overflowCount = 0;
  }

  /**
   * Get the ring buffer capacity.
   * @returns Capacity in bytes.
   */
  getCapacity(): number {
    return this.capacity;
  }
}

// ── Fallback Ring Buffer (Message-Passing) ──

/**
 * Fallback ring buffer that uses a regular ArrayBuffer + structured clone.
 * Used when SharedArrayBuffer is not available (no COOP/COEP headers).
 * Simulates ring buffer semantics but copies data on each read/write.
 */
export class FallbackRingBuffer {
  private readonly data: Uint8Array[];
  private readonly capacity: number;
  private totalBytesInBuffer = 0;
  private totalWrites = 0;
  private totalReads = 0;
  private overflowCount = 0;
  private generation = 0;

  constructor(capacity: number = DEFAULT_CAPACITY) {
    this.data = [];
    this.capacity = capacity;
  }

  /**
   * Write data into the fallback ring buffer.
   *
   * @param data - Bytes to write.
   * @returns Write result with success status and generation.
   */
  write(data: Uint8Array): RingWriteResult {
    if (data.length > MAX_ENTRY_SIZE) {
      this.overflowCount++;
      return { success: false, bytesWritten: 0, generation: this.generation };
    }

    if (this.totalBytesInBuffer + data.length + 4 > this.capacity) {
      this.overflowCount++;
      return { success: false, bytesWritten: 0, generation: this.generation };
    }

    // Copy data (this is the "copy" in the fallback path)
    this.data.push(new Uint8Array(data));
    this.totalBytesInBuffer += data.length;
    this.totalWrites++;

    // Increment generation every 1024 writes
    if (this.totalWrites % 1024 === 0) {
      this.generation++;
    }

    return { success: true, bytesWritten: data.length, generation: this.generation };
  }

  /**
   * Read data from the fallback ring buffer.
   *
   * @param maxBytes - Maximum bytes to read.
   * @returns Read result with copied data, or null if empty.
   */
  read(maxBytes?: number): RingReadResult | null {
    if (this.data.length === 0) {
      return null;
    }

    const entry = this.data.shift();
    if (!entry) {
      return null;
    }

    this.totalBytesInBuffer -= entry.length;
    this.totalReads++;

    const readLength = maxBytes != null ? Math.min(entry.length, maxBytes) : entry.length;
    const result = new Uint8Array(readLength);
    result.set(entry.subarray(0, readLength));

    return {
      data: result,
      generation: this.generation,
      available: this.totalBytesInBuffer,
    };
  }

  /**
   * Get statistics for the fallback ring buffer.
   * @returns Buffer stats.
   */
  getStats(): RingBufferStats {
    return {
      capacity: this.capacity,
      used: this.totalBytesInBuffer,
      free: this.capacity - this.totalBytesInBuffer,
      generation: this.generation,
      totalWrites: this.totalWrites,
      totalReads: this.totalReads,
      overflowCount: this.overflowCount,
      mode: "fallback",
    };
  }

  /**
   * Check if the buffer is empty.
   * @returns true if no data available.
   */
  isEmpty(): boolean {
    return this.data.length === 0;
  }

  /**
   * Clear all data.
   */
  clear(): void {
    this.data.length = 0;
    this.totalBytesInBuffer = 0;
    this.totalWrites = 0;
    this.totalReads = 0;
    this.overflowCount = 0;
  }

  /**
   * Get capacity.
   * @returns Capacity in bytes.
   */
  getCapacity(): number {
    return this.capacity;
  }
}

// ── Factory ──

/**
 * Create the appropriate ring buffer based on browser capabilities.
 * Uses SharedArrayBuffer if available (COOP/COEP headers present),
 * otherwise falls back to the message-passing implementation.
 *
 * @param capacity - Buffer capacity in bytes. Defaults to 1 MB.
 * @returns Either a SharedRingBuffer or FallbackRingBuffer.
 */
export function createRingBuffer(capacity: number = DEFAULT_CAPACITY): SharedRingBuffer | FallbackRingBuffer {
  if (typeof SharedArrayBuffer !== "undefined" && isCrossOriginIsolated()) {
    return new SharedRingBuffer(capacity);
  }
  console.info("[L0 METAL/RingBuffer] SharedArrayBuffer unavailable — using fallback message-passing buffer");
  return new FallbackRingBuffer(capacity);
}
