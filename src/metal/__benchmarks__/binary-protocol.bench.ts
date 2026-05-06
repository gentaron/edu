import { describe, bench } from "vitest"
import {
  BinaryWriter,
  BinaryReader,
  BinaryEncoder,
  BinaryIndex,
  crc32,
} from "@/metal/binary-protocol"

describe("BinaryWriter — encode throughput", () => {
  bench("writeVarInt — single value (0..300)", () => {
    const w = new BinaryWriter(64)
    for (let i = 0; i < 300; i++) {
      w.writeVarInt(i)
    }
  })

  bench("writeString — Japanese text (100 chars)", () => {
    const w = new BinaryWriter(512)
    const text =
      "永遠の支配宇宙エデュは500年以上にわたる壮大な歴史を持つSF宇宙設定プロジェクトである。"
    for (let i = 0; i < 50; i++) {
      w.writeString(text)
    }
  })

  bench("writeValue — nested object (10 fields)", () => {
    const w = new BinaryWriter(2048)
    const obj = {
      name: "セリア・ルナフォード",
      hp: 100,
      attack: 25,
      defense: 18,
      isAlive: true,
      skills: ["攻撃", "防御", "回復", "シールド"],
      stats: { wins: 42, losses: 3 },
      tags: ["SR", "キャラクター"],
    }
    for (let i = 0; i < 100; i++) {
      w.writeValue(obj)
    }
    void w.toUint8Array()
  })

  bench("writeValue — complex nested array+object structure", () => {
    const w = new BinaryWriter(4096)
    const complex = {
      team: Array.from({ length: 5 }, (_, i) => ({
        id: `char-${i}`,
        name: `Character ${i}`,
        hp: 50 + i * 10,
        abilities: ["attack", "defense", "effect", "ultimate"],
      })),
      metadata: { version: 1, timestamp: Date.now() },
    }
    for (let i = 0; i < 50; i++) {
      w.writeValue(complex)
    }
    void w.toUint8Array()
  })
})

describe("BinaryReader — decode throughput", () => {
  let buffer: ArrayBuffer
  bench(
    "prepare buffer",
    () => {
      const w = new BinaryWriter(2048)
      for (let i = 0; i < 500; i++) {
        w.writeVarInt(i)
      }
      for (let i = 0; i < 100; i++) {
        w.writeString("テスト文字列でパフォーマンスを計測する")
      }
      for (let i = 0; i < 50; i++) {
        w.writeI32(i * 100)
        w.writeF64(i * 3.14)
      }
      buffer = w.toBuffer()
    },
    { iterations: 1 }
  )

  bench("readVarInt — 500 sequential values", () => {
    const r = new BinaryReader(buffer)
    for (let i = 0; i < 500; i++) {
      r.readVarInt()
    }
  })

  bench("readString — 100 Japanese strings", () => {
    const r = new BinaryReader(buffer)
    for (let i = 0; i < 500; i++) {
      r.readVarInt()
    } // skip varints
    for (let i = 0; i < 100; i++) {
      r.readString()
    }
  })
})

describe("BinaryEncoder + BinaryIndex — end-to-end", () => {
  bench("encode 100 entries + index construction", () => {
    const entries = new Map<string, unknown>()
    for (let i = 0; i < 100; i++) {
      entries.set(`entry-${i}`, {
        name: `エントリ${i}`,
        value: i * 1.5,
        tags: ["tag-a", "tag-b", "tag-c"],
        nested: { depth: i % 5, data: `payload-${i}` },
      })
    }
    const encoded = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(encoded)
    void index.getAllIds().length
  })

  bench("index lookup — 100 random lookups", () => {
    const entries = new Map<string, unknown>()
    for (let i = 0; i < 200; i++) {
      entries.set(`entry-${i}`, { name: `Item ${i}`, score: i })
    }
    const encoded = BinaryEncoder.encode(entries)
    const index = new BinaryIndex(encoded)
    let total = 0
    for (let i = 0; i < 100; i++) {
      const entry = index.getEntry(`entry-${i % 200}`) as { score: number } | undefined
      const score = entry?.score ?? 0
      total += score
    }
    void total
  })
})

describe("CRC32 throughput", () => {
  bench("crc32 — 1KB payload", () => {
    const data = new Uint8Array(1024)
    for (let i = 0; i < 1024; i++) {
      data[i] = i & 255
    }
    void crc32(data)
  })

  bench("crc32 — 10KB payload", () => {
    const data = new Uint8Array(10_240)
    for (let i = 0; i < 10_240; i++) {
      data[i] = i & 255
    }
    void crc32(data)
  })

  bench("crc32 — 100KB payload", () => {
    const data = new Uint8Array(102_400)
    for (let i = 0; i < 102_400; i++) {
      data[i] = i & 255
    }
    void crc32(data)
  })
})
