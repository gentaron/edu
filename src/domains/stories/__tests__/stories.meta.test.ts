import { describe, it, expect } from "vitest"
import {
  ALL_STORIES,
  CHAPTERS,
  getStoryBySlug,
  getStoriesForEntry,
  getStoriesByChapter,
  getAdjacentStories,
  getStoryUrl,
  getStoryUrlForLang,
  getStoryTitle,
  type StoryMeta,
} from "@/domains/stories/stories.meta"

/* ═══════════════════════════════════════════
   Stories Meta Tests
   ═══════════════════════════════════════════ */

describe("CHAPTERS", () => {
  it("has exactly 5 chapters", () => {
    expect(CHAPTERS).toHaveLength(5)
  })

  it("chapters have sequential IDs", () => {
    for (let i = 0; i < CHAPTERS.length; i++) {
      expect(CHAPTERS[i]!.id).toBe(i + 1)
    }
  })

  it("each chapter has required fields", () => {
    for (const ch of CHAPTERS) {
      expect(ch).toHaveProperty("id")
      expect(ch).toHaveProperty("titleJa")
      expect(ch).toHaveProperty("titleEn")
      expect(ch).toHaveProperty("era")
      expect(ch).toHaveProperty("description")
      expect(ch).toHaveProperty("descriptionEn")
      expect(ch).toHaveProperty("color")
      expect(ch).toHaveProperty("gradient")
    }
  })
})

describe("ALL_STORIES", () => {
  it("has at least one story", () => {
    expect(ALL_STORIES.length).toBeGreaterThan(0)
  })

  it("no duplicate slugs", () => {
    const slugs = ALL_STORIES.map((s) => s.slug)
    const unique = new Set(slugs)
    expect(unique.size).toBe(slugs.length)
  })

  it("each story has required fields", () => {
    for (const s of ALL_STORIES) {
      expect(s).toHaveProperty("slug")
      expect(s).toHaveProperty("title")
      expect(s).toHaveProperty("titleJa")
      expect(s).toHaveProperty("label")
      expect(s).toHaveProperty("fileName")
      expect(s).toHaveProperty("fileNameAlt")
      expect(s).toHaveProperty("relatedEntries")
      expect(s).toHaveProperty("chapter")
      expect(s).toHaveProperty("chapterOrder")
      expect(s).toHaveProperty("isEnSource")
      expect(typeof s.slug).toBe("string")
      expect(s.slug.length).toBeGreaterThan(0)
    }
  })

  it("all stories have chapter in range [1, 5]", () => {
    for (const s of ALL_STORIES) {
      expect(s.chapter).toBeGreaterThanOrEqual(1)
      expect(s.chapter).toBeLessThanOrEqual(5)
    }
  })

  it("all stories have valid isEnSource boolean", () => {
    for (const s of ALL_STORIES) {
      expect(typeof s.isEnSource).toBe("boolean")
    }
  })

  it("relatedEntries is an array", () => {
    for (const s of ALL_STORIES) {
      expect(Array.isArray(s.relatedEntries)).toBe(true)
    }
  })

  it("fileName and fileNameAlt are non-empty", () => {
    for (const s of ALL_STORIES) {
      expect(s.fileName.length).toBeGreaterThan(0)
      expect(s.fileNameAlt.length).toBeGreaterThan(0)
    }
  })
})

describe("getStoryBySlug", () => {
  it("returns story for existing slug", () => {
    const first = ALL_STORIES[0]
    if (!first) return
    const result = getStoryBySlug(first.slug)
    expect(result).toBeDefined()
    expect(result!.slug).toBe(first.slug)
  })

  it("returns undefined for non-existent slug", () => {
    expect(getStoryBySlug("nonexistent-slug")).toBeUndefined()
  })

  it("returns undefined for empty string", () => {
    expect(getStoryBySlug("")).toBeUndefined()
  })

  it("returns correct story for each known slug", () => {
    for (const story of ALL_STORIES) {
      const found = getStoryBySlug(story.slug)
      expect(found).toBeDefined()
      expect(found!.title).toBe(story.title)
    }
  })
})

describe("getStoriesByChapter", () => {
  it("returns stories for chapter 1", () => {
    const stories = getStoriesByChapter(1)
    expect(stories.length).toBeGreaterThan(0)
    for (const s of stories) {
      expect(s.chapter).toBe(1)
    }
  })

  it("returns stories sorted by chapterOrder", () => {
    for (let ch = 1; ch <= 5; ch++) {
      const stories = getStoriesByChapter(ch)
      for (let i = 1; i < stories.length; i++) {
        expect(stories[i - 1]!.chapterOrder).toBeLessThan(stories[i]!.chapterOrder)
      }
    }
  })

  it("returns empty for non-existent chapter", () => {
    expect(getStoriesByChapter(99)).toEqual([])
  })

  it("returns empty for chapter 0", () => {
    expect(getStoriesByChapter(0)).toEqual([])
  })

  it("covers all chapters [1-5]", () => {
    let total = 0
    for (let ch = 1; ch <= 5; ch++) {
      total += getStoriesByChapter(ch).length
    }
    expect(total).toBe(ALL_STORIES.length)
  })
})

describe("getStoriesForEntry", () => {
  it("returns stories for a known entry", () => {
    const stories = getStoriesForEntry("Diana")
    expect(stories.length).toBeGreaterThan(0)
    for (const s of stories) {
      expect(s.relatedEntries).toContain("Diana")
    }
  })

  it("returns empty for non-existent entry", () => {
    expect(getStoriesForEntry("nonexistent")).toEqual([])
  })

  it("returns empty for empty string", () => {
    expect(getStoriesForEntry("")).toEqual([])
  })
})

describe("getAdjacentStories", () => {
  it("first story in chapter has no prev", () => {
    const chapter1 = getStoriesByChapter(1)
    if (chapter1.length === 0) return
    const adj = getAdjacentStories(chapter1[0]!)
    expect(adj.prev).toBeUndefined()
    expect(adj.next).toBeDefined()
  })

  it("last story in chapter has no next", () => {
    const chapter1 = getStoriesByChapter(1)
    if (chapter1.length === 0) return
    const last = chapter1[chapter1.length - 1]!
    const adj = getAdjacentStories(last)
    expect(adj.next).toBeUndefined()
  })

  it("middle story has both prev and next", () => {
    const chapter2 = getStoriesByChapter(2)
    if (chapter2.length < 3) return
    const adj = getAdjacentStories(chapter2[1]!)
    expect(adj.prev).toBeDefined()
    expect(adj.next).toBeDefined()
  })

  it("adjacent stories are in the same chapter", () => {
    const chapter1 = getStoriesByChapter(1)
    if (chapter1.length < 2) return
    const adj = getAdjacentStories(chapter1[1]!)
    if (adj.prev) expect(adj.prev.chapter).toBe(1)
    if (adj.next) expect(adj.next.chapter).toBe(1)
  })

  it("correctly identifies single-story chapter", () => {
    for (let ch = 1; ch <= 5; ch++) {
      const stories = getStoriesByChapter(ch)
      if (stories.length === 1) {
        const adj = getAdjacentStories(stories[0]!)
        expect(adj.prev).toBeUndefined()
        expect(adj.next).toBeUndefined()
      }
    }
  })
})

describe("getStoryUrl", () => {
  it("returns URL starting with base", () => {
    const url = getStoryUrl("test.txt")
    expect(url).toContain("test.txt")
    expect(url).toMatch(/^https:\/\//)
  })
})

describe("getStoryUrlForLang", () => {
  it("returns correct URL for JP source", () => {
    const story: StoryMeta = {
      slug: "test",
      title: "Test",
      titleJa: "テスト",
      label: "Test",
      fileName: "test.txt",
      fileNameAlt: "test_EN.txt",
      relatedEntries: [],
      chapter: 1,
      chapterOrder: 1,
      isEnSource: false,
    }
    const jaUrl = getStoryUrlForLang(story, "ja")
    expect(jaUrl).toContain("test.txt")
    const enUrl = getStoryUrlForLang(story, "en")
    expect(enUrl).toContain("test_EN.txt")
  })

  it("returns correct URL for EN source", () => {
    const story: StoryMeta = {
      slug: "test",
      title: "Test",
      titleJa: "テスト",
      label: "Test",
      fileName: "test.txt",
      fileNameAlt: "test_JP.txt",
      relatedEntries: [],
      chapter: 1,
      chapterOrder: 1,
      isEnSource: true,
    }
    const enUrl = getStoryUrlForLang(story, "en")
    expect(enUrl).toContain("test.txt")
    const jaUrl = getStoryUrlForLang(story, "ja")
    expect(jaUrl).toContain("test_JP.txt")
  })
})

describe("getStoryTitle", () => {
  it("returns Japanese title for JP source in JA", () => {
    const story: StoryMeta = {
      slug: "test",
      title: "English Title",
      titleJa: "日本語タイトル",
      label: "Test",
      fileName: "test.txt",
      fileNameAlt: "test_EN.txt",
      relatedEntries: [],
      chapter: 1,
      chapterOrder: 1,
      isEnSource: false,
    }
    expect(getStoryTitle(story, "ja")).toBe("日本語タイトル")
    expect(getStoryTitle(story, "en")).toBe("English Title")
  })

  it("returns English title for EN source in EN", () => {
    const story: StoryMeta = {
      slug: "test",
      title: "English Title",
      titleJa: "日本語タイトル",
      label: "Test",
      fileName: "test.txt",
      fileNameAlt: "test_JP.txt",
      relatedEntries: [],
      chapter: 1,
      chapterOrder: 1,
      isEnSource: true,
    }
    expect(getStoryTitle(story, "en")).toBe("English Title")
    expect(getStoryTitle(story, "ja")).toBe("日本語タイトル")
  })
})
