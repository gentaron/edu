export interface StoryMeta {
  slug: string
  title: string
  titleJa: string
  label: string
  fileName: string
  fileNameAlt: string // _EN.txt for JP stories, _JP.txt for EN stories
  relatedEntries: string[] // wiki entry IDs
  era?: string
  chapter: number
  chapterOrder: number // order within chapter
  isEnSource: boolean // true = original is EN, alt is _JP.txt; false = original is JP, alt is _EN.txt
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
    color: "from-edu-accent2 to-violet-600",
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
    color: "from-edu-accent2 to-cyan-500",
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
    titleJa: "ダイアナの世界",
    label: "Diana's Story",
    fileName: "DianaWorld.txt",
    fileNameAlt: "DianaWorld_EN.txt",
    relatedEntries: ["Diana"],
    era: "E260〜E280",
    chapter: 1,
    chapterOrder: 1,
    isEnSource: false,
  },
  {
    slug: "kate-lily",
    title: "Kate Claudia & Lillie Steiner's Story",
    titleJa: "ケイト・クラウディアとリリー・スタイナーの物語",
    label: "Kate Claudia & Lillie Steiner's Story",
    fileName: "kateclaudiaandlilliesteiner.txt",
    fileNameAlt: "kateclaudiaandlilliesteiner_EN.txt",
    relatedEntries: ["Kate Claudia", "Lily Steiner"],
    era: "E270〜E400",
    chapter: 1,
    chapterOrder: 2,
    isEnSource: false,
  },

  // ─── Chapter 2: 覚醒編 ───
  {
    slug: "nebura",
    title: "Alpha Cain & Celia Dominix's Story",
    titleJa: "アルファ・ケインとセリア・ドミニクスの物語",
    label: "Alpha Cain & Celia Dominix's Story",
    fileName: "nebura.txt",
    fileNameAlt: "nebura_EN.txt",
    relatedEntries: ["アルファ・ケイン", "セリア・ドミニクス"],
    era: "E318〜E370",
    chapter: 2,
    chapterOrder: 1,
    isEnSource: false,
  },
  {
    slug: "jen-story-1",
    title: "Jen's Story — Episode 1",
    titleJa: "ジェンの物語 — エピソード1",
    label: "Jen's Story Ep1",
    fileName: "Jenstoryep1.txt",
    fileNameAlt: "Jenstoryep1_JP.txt",
    relatedEntries: ["Jen"],
    era: "E319〜",
    chapter: 2,
    chapterOrder: 2,
    isEnSource: true,
  },
  {
    slug: "jen-story-2",
    title: "Jen's Story — Episode 2",
    titleJa: "ジェンの物語 — エピソード2",
    label: "Jen's Story Ep2",
    fileName: "Jenstoryep2.txt",
    fileNameAlt: "Jenstoryep2_JP.txt",
    relatedEntries: ["Jen"],
    era: "E319〜",
    chapter: 2,
    chapterOrder: 3,
    isEnSource: true,
  },
  {
    slug: "jen-story-3",
    title: "Jen's Story — Episode 3",
    titleJa: "ジェンの物語 — エピソード3",
    label: "Jen's Story Ep3",
    fileName: "Jenstoryep3.txt",
    fileNameAlt: "Jenstoryep3_JP.txt",
    relatedEntries: ["Jen"],
    era: "E319〜",
    chapter: 2,
    chapterOrder: 4,
    isEnSource: true,
  },
  {
    slug: "layla-story",
    title: "Layla Virel Nova's Story",
    titleJa: "レイラ・ヴィレル・ノヴァの物語",
    label: "Layla Virel Nova's Story",
    fileName: "LAYLA.txt",
    fileNameAlt: "LAYLA_JP.txt",
    relatedEntries: ["レイラ・ヴィレル・ノヴァ"],
    era: "E325〜E400（冷凍）→ E522〜現在",
    chapter: 2,
    chapterOrder: 5,
    isEnSource: true,
  },
  {
    slug: "layla-battle-1",
    title: "Layla's Battle Records — Part 1",
    titleJa: "レイラの戦闘記録 — 前編",
    label: "Layla's Battle Records 1",
    fileName: "laylastats.txt",
    fileNameAlt: "laylastats_JP.txt",
    relatedEntries: ["レイラ・ヴィレル・ノヴァ"],
    era: "E325〜E400",
    chapter: 2,
    chapterOrder: 6,
    isEnSource: true,
  },
  {
    slug: "layla-battle-2",
    title: "Layla's Battle Records — Part 2",
    titleJa: "レイラの戦闘記録 — 後編",
    label: "Layla's Battle Records 2",
    fileName: "laylastats2.txt",
    fileNameAlt: "laylastats2_JP.txt",
    relatedEntries: ["レイラ・ヴィレル・ノヴァ"],
    era: "E325〜E400",
    chapter: 2,
    chapterOrder: 7,
    isEnSource: true,
  },
  {
    slug: "gentaro-world",
    title: "Gentaro's World",
    titleJa: "弦太郎の世界",
    label: "Gentaro's Story",
    fileName: "Gentaroworld.txt",
    fileNameAlt: "Gentaroworld_EN.txt",
    relatedEntries: ["弦太郎"],
    era: "E325〜現在",
    chapter: 2,
    chapterOrder: 8,
    isEnSource: false,
  },
  {
    slug: "jun-slime",
    title: "Jun & Slime Woman's Story",
    titleJa: "ジュンとスライムウーマンの物語",
    label: "Jun's Story",
    fileName: "Junandslime.txt",
    fileNameAlt: "Junandslime_JP.txt",
    relatedEntries: ["Slime_Woman", "ジュン"],
    era: "E340〜現在",
    chapter: 2,
    chapterOrder: 9,
    isEnSource: true,
  },

  // ─── Chapter 3: 闘争編 ───
  {
    slug: "gue-story",
    title: "Gue's Story",
    titleJa: "グエの物語",
    label: "Gue's Story",
    fileName: "gue.txt",
    fileNameAlt: "gue_EN.txt",
    relatedEntries: ["Tina/Gue"],
    era: "E400〜現在",
    chapter: 3,
    chapterOrder: 1,
    isEnSource: false,
  },

  // ─── Chapter 4: 星霜編 ───
  {
    slug: "iris-story-1",
    title: "Iris's Story — Episode 1",
    titleJa: "アイリスの物語 — エピソード1",
    label: "Iris's Story Ep1",
    fileName: "IRIS_1.txt",
    fileNameAlt: "IRIS_1_EN.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
    chapter: 4,
    chapterOrder: 1,
    isEnSource: false,
  },
  {
    slug: "iris-story-2",
    title: "Iris's Story — Episode 2",
    titleJa: "アイリスの物語 — エピソード2",
    label: "Iris's Story Ep2",
    fileName: "IRIS_2.txt",
    fileNameAlt: "IRIS_2_EN.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
    chapter: 4,
    chapterOrder: 2,
    isEnSource: false,
  },
  {
    slug: "iris-story-3",
    title: "Iris's Story — Episode 3",
    titleJa: "アイリスの物語 — エピソード3",
    label: "Iris's Story Ep3",
    fileName: "IRIS_3.txt",
    fileNameAlt: "IRIS_3_EN.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
    chapter: 4,
    chapterOrder: 3,
    isEnSource: false,
  },
  {
    slug: "iris-story-4",
    title: "Iris's Story — Episode 4",
    titleJa: "アイリスの物語 — エピソード4",
    label: "Iris's Story Ep4",
    fileName: "IRIS_4.txt",
    fileNameAlt: "IRIS_4_EN.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
    chapter: 4,
    chapterOrder: 4,
    isEnSource: false,
  },
  {
    slug: "casteria",
    title: "Casteria Grenvelt's Story",
    titleJa: "カステリア・グレンヴェルトの物語",
    label: "Casteria Grenvelt's Story",
    fileName: "kasuteriasan.txt",
    fileNameAlt: "kasuteriasan_EN.txt",
    relatedEntries: ["カステリア・グレンヴェルト"],
    chapter: 4,
    chapterOrder: 5,
    isEnSource: false,
  },
  {
    slug: "sitra",
    title: "Sitra Celes's Story",
    titleJa: "シトラ・セレスの物語",
    label: "Sitra Celes's Story",
    fileName: "sitra.txt",
    fileNameAlt: "sitra_EN.txt",
    relatedEntries: ["シトラ・セレス"],
    chapter: 4,
    chapterOrder: 6,
    isEnSource: false,
  },
  {
    slug: "myu-story",
    title: "Myu's Story",
    titleJa: "ミューの物語",
    label: "Myu's Story",
    fileName: "Myustory.txt",
    fileNameAlt: "Myustory_JP.txt",
    relatedEntries: ["ミュー"],
    chapter: 4,
    chapterOrder: 7,
    isEnSource: true,
  },

  // ─── Chapter 5: 新世界編 ───
  {
    slug: "auralis-spinoff",
    title: "AURALIS Spinoff",
    titleJa: "アウラリス スピンオフ",
    label: "AURALIS Spinoff",
    fileName: "Auralishentai.txt",
    fileNameAlt: "Auralishentai_EN.txt",
    relatedEntries: [
      "Kate Patton",
      "Lillie Ardent",
      "ミナ・エウレカ・エルンスト",
      "Ninny Offenbach",
    ],
    era: "E522〜現在",
    chapter: 5,
    chapterOrder: 1,
    isEnSource: false,
  },
]

export function getStoryUrl(fileName: string): string {
  return `${BASE}/${fileName}`
}

export function getStoryUrlForLang(story: StoryMeta, lang: "ja" | "en"): string {
  if (story.isEnSource) {
    // Original is EN, alt (_JP.txt) is Japanese
    return lang === "ja" ? `${BASE}/${story.fileNameAlt}` : `${BASE}/${story.fileName}`
  } else {
    // Original is JP, alt (_EN.txt) is English
    return lang === "en" ? `${BASE}/${story.fileNameAlt}` : `${BASE}/${story.fileName}`
  }
}

export function getStoryTitle(story: StoryMeta, lang: "ja" | "en"): string {
  return story.isEnSource
    ? (lang === "en" ? story.title : story.titleJa)
    : (lang === "ja" ? story.titleJa : story.title)
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

/** Shared character → portrait image mapping (used by story archive + reader) */
export const ENTRY_IMAGE_MAP: Record<string, string> = {
  アイリス: "/edu-iris.png",
  Diana: "/edu-diana.png",
  "Kate Claudia": "/edu-kate-claudia.png",
  "Lily Steiner": "/edu-lillie-steiner.png",
  "レイラ・ヴィレル・ノヴァ": "/edu-fiona.png",
  "カステリア・グレンヴェルト": "/edu-diana.png",
  "シトラ・セレス": "/edu-iris.png",
  ミュー: "/edu-diana.png",
  Jen: "/edu-iris.png",
  "Tina/Gue": "/edu-diana.png",
  "アルファ・ケイン": "/edu-hero.png",
  "セリア・ドミニクス": "/edu-celia.png",
  弦太郎: "/edu-auralis.png",
  Slime_Woman: "/edu-diana.png",
  ジュン: "/edu-hero.png",
  "Kate Patton": "/edu-kate-claudia.png",
  "Lillie Ardent": "/edu-lillie-steiner.png",
  "ミナ・エウレカ・エルンスト": "/edu-diana.png",
  "Ninny Offenbach": "/edu-fiona.png",
}

export function getAdjacentStories(story: StoryMeta): { prev?: StoryMeta; next?: StoryMeta } {
  const chapterStories = getStoriesByChapter(story.chapter)
  const idx = chapterStories.findIndex((s) => s.slug === story.slug)
  return {
    prev: idx > 0 ? chapterStories[idx - 1] : undefined,
    next: idx < chapterStories.length - 1 ? chapterStories[idx + 1] : undefined,
  }
}
