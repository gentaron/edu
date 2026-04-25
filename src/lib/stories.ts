export interface StoryMeta {
  slug: string
  title: string
  label: string
  fileName: string
  relatedEntries: string[] // wiki entry IDs
  era?: string
  chapter: number
  chapterOrder: number // order within chapter
}

export interface ChapterMeta {
  id: number
  titleJa: string
  titleEn: string
  era: string
  description: string
  descriptionEn: string
  color: string // tailwind color token for gradient accent
  gradient: string // CSS gradient string for chapter header
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 1,
    titleJa: "黎明編",
    titleEn: "The Dawn",
    era: "E260〜E300",
    description:
      "E16星系への移住から始まる、新天地での最初の物語。ダイアナとケイト・クラウディアたちの初期の足跡が、この世界の基盤を築いていく。",
    descriptionEn:
      "The first stories of humanity's new home in the E16 star system. Diana and Kate Claudia lay the foundations of this world in an era of wonder and discovery.",
    color: "from-amber-500 to-orange-600",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(249,115,22,0.08) 100%)",
  },
  {
    id: 2,
    titleJa: "覚醒編",
    titleEn: "The Awakening",
    era: "E300〜E400",
    description:
      "英雄たちが次々と覚醒し、ギガポリスの舞台に立つ時代。ネブラ、ジェン、レイラ、弦太郎 — 異なる道を歩む彼らの物語が交錯する。",
    descriptionEn:
      "Heroes rise one by one to take the stage of Gigapolis. The paths of Nebura, Jen, Layla, and Gentaro cross in an age of awakening power and converging destinies.",
    color: "from-nebula-purple to-violet-600",
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(139,92,246,0.08) 100%)",
  },
  {
    id: 3,
    titleJa: "闘争編",
    titleEn: "Age of Strife",
    era: "E400〜",
    description:
      "世界の均衡が崩れ、新たな争いが始まる時代。グエ、ジュンの物語を中心に、激動の時代を生き抜く人々の姿を描く。",
    descriptionEn:
      "The balance of the world fractures as new conflicts erupt. Centered on the stories of Gue and Jun, this era chronicles those who survive the chaos of a world in upheaval.",
    color: "from-red-500 to-rose-600",
    gradient: "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(244,63,94,0.08) 100%)",
  },
  {
    id: 4,
    titleJa: "星霜編",
    titleEn: "Passage of Stars",
    era: "E480〜",
    description:
      "アイリスをはじめとする新世代の英雄が、星々の歴史を受け継ぎ新たな章を開く。カステリア、シトラ、ミュー — 個性豊かな物語が紡がれる。",
    descriptionEn:
      "A new generation led by Iris inherits the history of the stars and opens a fresh chapter. Casteria, Sitra, and Myu each weave their own distinct and vibrant tale.",
    color: "from-electric-blue to-cyan-500",
    gradient: "linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(6,182,212,0.08) 100%)",
  },
  {
    id: 5,
    titleJa: "新世界編",
    titleEn: "New World",
    era: "E520〜",
    description:
      "AURALISの誕生と、最新の時代を彩る物語。ミナ、ニニー、パットン、アーデント — 新世界の幕開けを告げるスピンオフ群。",
    descriptionEn:
      "The birth of AURALIS and the stories that color the newest era. Kate Patton, Lillie Ardent, Mina, and Ninny herald the dawn of a new world through their spinoff tales.",
    color: "from-emerald-500 to-teal-500",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(20,184,166,0.08) 100%)",
  },
]

const BASE = "https://raw.githubusercontent.com/gentaron/edutext/main"

export const ALL_STORIES: StoryMeta[] = [
  // ─── Chapter 1: 黎明編 ───
  {
    slug: "diana-world",
    title: "Diana's World",
    label: "Diana's Story",
    fileName: "DianaWorld.txt",
    relatedEntries: ["Diana"],
    era: "E260〜E280",
    chapter: 1,
    chapterOrder: 1,
  },
  {
    slug: "kate-lily",
    title: "Kate Claudia & Lillie Steiner's Story",
    label: "Kate Claudia & Lillie Steiner's Story",
    fileName: "kateclaudiaandlilliesteiner.txt",
    relatedEntries: ["Kate Claudia", "Lily Steiner"],
    era: "E270〜E400",
    chapter: 1,
    chapterOrder: 2,
  },

  // ─── Chapter 2: 覚醒編 ───
  {
    slug: "nebura",
    title: "Alpha Cain & Celia Dominix's Story",
    label: "Alpha Cain & Celia Dominix's Story",
    fileName: "nebura.txt",
    relatedEntries: ["アルファ・ケイン", "セリア・ドミニクス"],
    era: "E318〜E370",
    chapter: 2,
    chapterOrder: 1,
  },
  {
    slug: "jen-story-1",
    title: "Jen's Story — Episode 1",
    label: "Jen's Story Ep1",
    fileName: "Jenstoryep1.txt",
    relatedEntries: ["Jen"],
    era: "E319〜",
    chapter: 2,
    chapterOrder: 2,
  },
  {
    slug: "jen-story-2",
    title: "Jen's Story — Episode 2",
    label: "Jen's Story Ep2",
    fileName: "Jenstoryep2.txt",
    relatedEntries: ["Jen"],
    era: "E319〜",
    chapter: 2,
    chapterOrder: 3,
  },
  {
    slug: "jen-story-3",
    title: "Jen's Story — Episode 3",
    label: "Jen's Story Ep3",
    fileName: "Jenstoryep3.txt",
    relatedEntries: ["Jen"],
    era: "E319〜",
    chapter: 2,
    chapterOrder: 4,
  },
  {
    slug: "layla-story",
    title: "Layla Virel Nova's Story",
    label: "Layla Virel Nova's Story",
    fileName: "LAYLA.txt",
    relatedEntries: ["レイラ・ヴィレル・ノヴァ"],
    era: "E325〜E400（冷凍）→ E522〜現在",
    chapter: 2,
    chapterOrder: 5,
  },
  {
    slug: "layla-battle-1",
    title: "Layla's Battle Records — Part 1",
    label: "Layla's Battle Records 1",
    fileName: "laylastats.txt",
    relatedEntries: ["レイラ・ヴィレル・ノヴァ"],
    era: "E325〜E400",
    chapter: 2,
    chapterOrder: 6,
  },
  {
    slug: "layla-battle-2",
    title: "Layla's Battle Records — Part 2",
    label: "Layla's Battle Records 2",
    fileName: "laylastats2.txt",
    relatedEntries: ["レイラ・ヴィレル・ノヴァ"],
    era: "E325〜E400",
    chapter: 2,
    chapterOrder: 7,
  },
  {
    slug: "gentaro-world",
    title: "Gentaro's World",
    label: "Gentaro's Story",
    fileName: "Gentaroworld.txt",
    relatedEntries: ["弦太郎"],
    era: "E325〜現在",
    chapter: 2,
    chapterOrder: 8,
  },
  {
    slug: "jun-slime",
    title: "Jun & Slime Woman's Story",
    label: "Jun's Story",
    fileName: "Junandslime.txt",
    relatedEntries: ["Slime_Woman", "ジュン"],
    era: "E340〜現在",
    chapter: 2,
    chapterOrder: 9,
  },

  // ─── Chapter 3: 闘争編 ───
  {
    slug: "gue-story",
    title: "Gue's Story",
    label: "Gue's Story",
    fileName: "gue.txt",
    relatedEntries: ["Tina/Gue"],
    era: "E400〜現在",
    chapter: 3,
    chapterOrder: 1,
  },

  // ─── Chapter 4: 星霜編 ───
  {
    slug: "iris-story-1",
    title: "Iris's Story — Episode 1",
    label: "Iris's Story Ep1",
    fileName: "IRIS_1.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
    chapter: 4,
    chapterOrder: 1,
  },
  {
    slug: "iris-story-2",
    title: "Iris's Story — Episode 2",
    label: "Iris's Story Ep2",
    fileName: "IRIS_2.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
    chapter: 4,
    chapterOrder: 2,
  },
  {
    slug: "iris-story-3",
    title: "Iris's Story — Episode 3",
    label: "Iris's Story Ep3",
    fileName: "IRIS_3.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
    chapter: 4,
    chapterOrder: 3,
  },
  {
    slug: "iris-story-4",
    title: "Iris's Story — Episode 4",
    label: "Iris's Story Ep4",
    fileName: "IRIS_4.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
    chapter: 4,
    chapterOrder: 4,
  },
  {
    slug: "casteria",
    title: "Casteria Grenvelt's Story",
    label: "Casteria Grenvelt's Story",
    fileName: "kasuteriasan.txt",
    relatedEntries: ["カステリア・グレンヴェルト"],
    chapter: 4,
    chapterOrder: 5,
  },
  {
    slug: "sitra",
    title: "Sitra Celes's Story",
    label: "Sitra Celes's Story",
    fileName: "sitra.txt",
    relatedEntries: ["シトラ・セレス"],
    chapter: 4,
    chapterOrder: 6,
  },
  {
    slug: "myu-story",
    title: "Myu's Story",
    label: "Myu's Story",
    fileName: "Myustory.txt",
    relatedEntries: ["ミュー"],
    chapter: 4,
    chapterOrder: 7,
  },

  // ─── Chapter 5: 新世界編 ───
  {
    slug: "auralis-spinoff",
    title: "AURALIS Spinoff",
    label: "AURALIS Spinoff",
    fileName: "Auralishentai.txt",
    relatedEntries: [
      "Kate Patton",
      "Lillie Ardent",
      "ミナ・エウレカ・エルンスト",
      "Ninny Offenbach",
    ],
    era: "E522〜現在",
    chapter: 5,
    chapterOrder: 1,
  },
]

export function getStoryUrl(fileName: string): string {
  return `${BASE}/${fileName}`
}

export function getStoryBySlug(slug: string): StoryMeta | undefined {
  return ALL_STORIES.find((s) => s.slug === slug)
}

export function getStoriesForEntry(entryId: string): StoryMeta[] {
  return ALL_STORIES.filter((s) => s.relatedEntries.includes(entryId))
}

export function getStoriesByChapter(chapterId: number): StoryMeta[] {
  return ALL_STORIES.filter((s) => s.chapter === chapterId).sort(
    (a, b) => a.chapterOrder - b.chapterOrder
  )
}

export function getAdjacentStories(story: StoryMeta): { prev?: StoryMeta; next?: StoryMeta } {
  const chapterStories = getStoriesByChapter(story.chapter)
  const idx = chapterStories.findIndex((s) => s.slug === story.slug)
  return {
    prev: idx > 0 ? chapterStories[idx - 1] : undefined,
    next: idx < chapterStories.length - 1 ? chapterStories[idx + 1] : undefined,
  }
}
