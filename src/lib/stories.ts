export interface StoryMeta {
  slug: string;
  title: string;
  label: string;
  fileName: string;
  relatedEntries: string[]; // wiki entry IDs
  era?: string;
}

const BASE = "https://raw.githubusercontent.com/gentaron/edutext/main";

export const ALL_STORIES: StoryMeta[] = [
  {
    slug: "diana-world",
    title: "Diana's World",
    label: "Diana's Story",
    fileName: "DianaWorld.txt",
    relatedEntries: ["Diana"],
    era: "E260〜E280",
  },
  {
    slug: "jen-story-1",
    title: "Jen's Story — Episode 1",
    label: "Jen's Story Ep1",
    fileName: "Jenstoryep1.txt",
    relatedEntries: ["Jen"],
    era: "E319〜",
  },
  {
    slug: "jen-story-2",
    title: "Jen's Story — Episode 2",
    label: "Jen's Story Ep2",
    fileName: "Jenstoryep2.txt",
    relatedEntries: ["Jen"],
    era: "E319〜",
  },
  {
    slug: "jen-story-3",
    title: "Jen's Story — Episode 3",
    label: "Jen's Story Ep3",
    fileName: "Jenstoryep3.txt",
    relatedEntries: ["Jen"],
    era: "E319〜",
  },
  {
    slug: "gue-story",
    title: "Gue's Story",
    label: "Gue's Story",
    fileName: "gue.txt",
    relatedEntries: ["Tina/Gue"],
    era: "E400〜現在",
  },
  {
    slug: "nebura",
    title: "Alpha Cain & Celia Dominix's Story",
    label: "Alpha Cain & Celia Dominix's Story",
    fileName: "nebura.txt",
    relatedEntries: ["アルファ・ケイン", "セリア・ドミニクス"],
    era: "E318〜E370",
  },
  {
    slug: "layla-battle-1",
    title: "Layla's Battle Records — Part 1",
    label: "Layla's Battle Records 1",
    fileName: "laylastats.txt",
    relatedEntries: ["レイラ・ヴィレル・ノヴァ"],
    era: "E325〜E400",
  },
  {
    slug: "layla-battle-2",
    title: "Layla's Battle Records — Part 2",
    label: "Layla's Battle Records 2",
    fileName: "laylastats2.txt",
    relatedEntries: ["レイラ・ヴィレル・ノヴァ"],
    era: "E325〜E400",
  },
  {
    slug: "layla-story",
    title: "Layla Virel Nova's Story",
    label: "Layla Virel Nova's Story",
    fileName: "LAYLA.txt",
    relatedEntries: ["レイラ・ヴィレル・ノヴァ"],
    era: "E325〜E400（冷凍）→ E522〜現在",
  },
  {
    slug: "gentaro-world",
    title: "Gentaro's World",
    label: "Gentaro's Story",
    fileName: "Gentaroworld.txt",
    relatedEntries: ["弦太郎"],
    era: "E325〜現在",
  },
  {
    slug: "kate-lily",
    title: "Kate Claudia & Lillie Steiner's Story",
    label: "Kate Claudia & Lillie Steiner's Story",
    fileName: "kateclaudiaandlilliesteiner.txt",
    relatedEntries: ["Kate Claudia", "Lily Steiner"],
    era: "E270〜E400",
  },
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
  },
  {
    slug: "iris-story-1",
    title: "Iris's Story — Episode 1",
    label: "Iris's Story Ep1",
    fileName: "IRIS_1.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
  },
  {
    slug: "iris-story-2",
    title: "Iris's Story — Episode 2",
    label: "Iris's Story Ep2",
    fileName: "IRIS_2.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
  },
  {
    slug: "iris-story-3",
    title: "Iris's Story — Episode 3",
    label: "Iris's Story Ep3",
    fileName: "IRIS_3.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
  },
  {
    slug: "iris-story-4",
    title: "Iris's Story — Episode 4",
    label: "Iris's Story Ep4",
    fileName: "IRIS_4.txt",
    relatedEntries: ["アイリス"],
    era: "E480〜",
  },
  {
    slug: "jun-slime",
    title: "Jun & Slime Woman's Story",
    label: "Jun's Story",
    fileName: "Junandslime.txt",
    relatedEntries: ["Slime_Woman", "ジュン"],
    era: "E340〜現在",
  },
  {
    slug: "casteria",
    title: "Casteria Grenvelt's Story",
    label: "Casteria Grenvelt's Story",
    fileName: "kasuteriasan.txt",
    relatedEntries: ["カステリア・グレンヴェルト"],
  },
  {
    slug: "sitra",
    title: "Sitra Celes's Story",
    label: "Sitra Celes's Story",
    fileName: "sitra.txt",
    relatedEntries: ["シトラ・セレス"],
  },
  {
    slug: "myu-story",
    title: "Myu's Story",
    label: "Myu's Story",
    fileName: "Myustory.txt",
    relatedEntries: ["ミュー"],
  },
];

export function getStoryUrl(fileName: string): string {
  return `${BASE}/${fileName}`;
}

export function getStoryBySlug(slug: string): StoryMeta | undefined {
  return ALL_STORIES.find((s) => s.slug === slug);
}

export function getStoriesForEntry(entryId: string): StoryMeta[] {
  return ALL_STORIES.filter((s) => s.relatedEntries.includes(entryId));
}
