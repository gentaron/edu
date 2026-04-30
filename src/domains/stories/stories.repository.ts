/* ═══════════════════════════════════════════
   L3 NETWORK — Story Repository
   Data access layer for stories and chapters.
   Depends on: L2 schemas, L1 story data (from lib)
   ═══════════════════════════════════════════ */

import {
  ALL_STORIES,
  CHAPTERS,
  getStoryUrl,
  getStoryUrlForLang,
  getStoryTitle,
  getStoryBySlug,
  getStoriesForEntry,
  getStoriesByChapter,
  getAdjacentStories,
  ENTRY_IMAGE_MAP,
} from "@/domains/stories/stories.meta"
import type { StoryMeta, ChapterMeta } from "@/domains/stories/stories.schema"

export class StoryRepository {
  /** Find a story by slug */
  static findBySlug(slug: string): StoryMeta | undefined {
    return getStoryBySlug(slug)
  }

  /** Get all stories */
  static getAllStories(): readonly StoryMeta[] {
    return ALL_STORIES
  }

  /** Get stories for a specific wiki entry */
  static getStoriesForWikiEntry(entryId: string): StoryMeta[] {
    return getStoriesForEntry(entryId)
  }

  /** Get stories grouped by chapter */
  static getStoriesByChapter(chapterId: number): StoryMeta[] {
    return getStoriesByChapter(chapterId)
  }

  /** Get all chapter metadata */
  static getAllChapters(): readonly ChapterMeta[] {
    return CHAPTERS
  }

  /** Get a specific chapter by ID */
  static getChapterById(id: number): ChapterMeta | undefined {
    return CHAPTERS.find((c) => c.id === id)
  }

  /** Get the full URL for a story file */
  static getStoryFileUrl(fileName: string): string {
    return getStoryUrl(fileName)
  }

  /** Get localized story URL */
  static getLocalizedUrl(story: StoryMeta, lang: "ja" | "en"): string {
    return getStoryUrlForLang(story, lang)
  }

  /** Get localized story title */
  static getLocalizedTitle(story: StoryMeta, lang: "ja" | "en"): string {
    return getStoryTitle(story, lang)
  }

  /** Get adjacent stories (prev/next in chapter) */
  static getAdjacent(story: StoryMeta): { prev?: StoryMeta; next?: StoryMeta } {
    return getAdjacentStories(story)
  }

  /** Get entry portrait image mapping */
  static getEntryImageMap(): Readonly<Record<string, string>> {
    return ENTRY_IMAGE_MAP
  }
}
