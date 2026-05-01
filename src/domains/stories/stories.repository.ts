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

/**
 * Story Repository — in-memory data access layer for stories and chapters.
 * Wraps the story meta module to provide a clean query API for story content,
 * localization, navigation, and related wiki entry lookups.
 */
export const StoryRepository = {
  /**
   * Find a story by its URL slug.
   *
   * @param slug - The unique URL slug of the story (e.g. 'ch1-awakening').
   * @returns The matching {@link StoryMeta}, or `undefined` if not found.
   * @example
   * const story = StoryRepository.findBySlug('ch1-awakening')
   * // → { slug: 'ch1-awakening', title: '目覚め', chapterId: 1, ... }
   */
  findBySlug(slug: string): StoryMeta | undefined {
    return getStoryBySlug(slug)
  },

  /**
   * Get all stories as a read-only array.
   *
   * @returns Read-only array of all {@link StoryMeta} objects.
   */
  getAllStories(): readonly StoryMeta[] {
    return ALL_STORIES
  },

  /**
   * Get stories related to a specific wiki entry.
   *
   * @param entryId - The wiki entry ID to find related stories for.
   * @returns Array of stories that reference this wiki entry.
   */
  getStoriesForWikiEntry(entryId: string): StoryMeta[] {
    return getStoriesForEntry(entryId)
  },

  /**
   * Get stories belonging to a specific chapter.
   *
   * @param chapterId - The chapter number to filter stories by.
   * @returns Array of stories in the specified chapter.
   */
  getStoriesByChapter(chapterId: number): StoryMeta[] {
    return getStoriesByChapter(chapterId)
  },

  /**
   * Get all chapter metadata.
   *
   * @returns Read-only array of all {@link ChapterMeta} objects.
   */
  getAllChapters(): readonly ChapterMeta[] {
    return CHAPTERS
  },

  /**
   * Get a specific chapter by its numeric ID.
   *
   * @param id - The chapter ID to look up.
   * @returns The matching {@link ChapterMeta}, or `undefined` if not found.
   */
  getChapterById(id: number): ChapterMeta | undefined {
    return CHAPTERS.find((c) => c.id === id)
  },

  /**
   * Get the full URL for a story file (e.g. for fetching story content).
   *
   * @param fileName - The story file name (e.g. 'ch1-awakening.md').
   * @returns The full URL path to the story file.
   */
  getStoryFileUrl(fileName: string): string {
    return getStoryUrl(fileName)
  },

  /**
   * Get the localized URL for a story file.
   * Returns the English version URL if lang is 'en', otherwise the Japanese version.
   *
   * @param story - The story metadata object.
   * @param lang - The desired language ('ja' or 'en').
   * @returns The localized URL path to the story file.
   */
  getLocalizedUrl(story: StoryMeta, lang: "ja" | "en"): string {
    return getStoryUrlForLang(story, lang)
  },

  /**
   * Get the localized title for a story.
   *
   * @param story - The story metadata object.
   * @param lang - The desired language ('ja' or 'en').
   * @returns The story title in the specified language.
   */
  getLocalizedTitle(story: StoryMeta, lang: "ja" | "en"): string {
    return getStoryTitle(story, lang)
  },

  /**
   * Get the previous and next stories within the same chapter.
   * Useful for story navigation (previous/next buttons).
   *
   * @param story - The current story metadata object.
   * @returns Object with optional `prev` and `next` story metadata.
   *          Either may be `undefined` if at the beginning/end of the chapter.
   */
  getAdjacent(story: StoryMeta): { prev?: StoryMeta; next?: StoryMeta } {
    return getAdjacentStories(story)
  },

  /**
   * Get the mapping of wiki entry IDs to their portrait image paths.
   *
   * @returns Read-only record mapping entry IDs to image file paths.
   */
  getEntryImageMap(): Readonly<Record<string, string>> {
    return ENTRY_IMAGE_MAP
  },
};
