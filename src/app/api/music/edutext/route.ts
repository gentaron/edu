import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ALL_ENTRIES } from "@/domains/wiki/wiki.data";
import type { WikiEntry } from "@/types";

/**
 * edutextのWikiエントリからランダムにテーマを選び、
 * 歌詞生成のインスピレーションとして返す
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const count = parseInt(searchParams.get("count") ?? "3", 10);

  let entries = [...ALL_ENTRIES];

  if (category && category !== "all") {
    entries = entries.filter(
      (e) =>
        e.category === category ||
        e.subCategory === category,
    );
  }

  // description が長いエントリを優先（歌詞のインスピレーションに適している）
  entries.sort((a, b) => b.description.length - a.description.length);

  // ランダムに選択
  const shuffled = entries.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, entries.length));

  const inspirations = selected.map((entry: WikiEntry) => ({
    id: entry.id,
    name: entry.name,
    nameEn: entry.nameEn,
    category: entry.category,
    subCategory: entry.subCategory,
    era: entry.era ?? undefined,
    description: entry.description,
    affiliation: entry.affiliation ?? undefined,
    tier: entry.tier ?? undefined,
    sourceLinks: entry.sourceLinks ?? [],
  }));

  // カテゴリ一覧も返す
  const categories = [...new Set(ALL_ENTRIES.map((e) => e.category))];

  return NextResponse.json({ inspirations, categories });
}
