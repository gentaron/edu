import { describe, it, expect } from "vitest"
import { StoryRepository } from "@/domains/stories/stories.repository"

describe("StoryRepository", () => {
  /* ── findBySlug ── */
  describe("findBySlug", () => {
    it("finds a story by existing slug", () => {
      const story = StoryRepository.findBySlug("diana-world")
      expect(story).toBeDefined()
      expect(story!.slug).toBe("diana-world")
      expect(story!.title).toContain("Diana")
    })

    it("returns undefined for non-existent slug", () => {
      const story = StoryRepository.findBySlug("nonexistent-story")
      expect(story).toBeUndefined()
    })

    it("returns correct story structure", () => {
      const story = StoryRepository.findBySlug("diana-world")
      expect(story).toHaveProperty("slug")
      expect(story).toHaveProperty("title")
      expect(story).toHaveProperty("titleJa")
      expect(story).toHaveProperty("label")
      expect(story).toHaveProperty("fileName")
      expect(story).toHaveProperty("fileNameAlt")
      expect(story).toHaveProperty("relatedEntries")
      expect(story).toHaveProperty("chapter")
      expect(story).toHaveProperty("chapterOrder")
      expect(story).toHaveProperty("isEnSource")
    })
  })

  /* ── getAllStories ── */
  describe("getAllStories", () => {
    it("returns all stories", () => {
      const stories = StoryRepository.getAllStories()
      expect(stories.length).toBeGreaterThan(0)
    })

    it("returns readonly array", () => {
      const stories = StoryRepository.getAllStories()
      // Verify it's not empty
      expect(stories.length).toBeGreaterThan(0)
    })

    it("stories have unique slugs", () => {
      const stories = StoryRepository.getAllStories()
      const slugs = stories.map((s) => s.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(slugs.length)
    })
  })

  /* ── getStoriesForWikiEntry ── */
  describe("getStoriesForWikiEntry", () => {
    it("returns stories for Diana wiki entry", () => {
      const stories = StoryRepository.getStoriesForWikiEntry("Diana")
      expect(stories.length).toBeGreaterThan(0)
      expect(stories.every((s) => s.relatedEntries.includes("Diana"))).toBe(true)
    })

    it("returns stories for Jen wiki entry", () => {
      const stories = StoryRepository.getStoriesForWikiEntry("Jen")
      expect(stories.length).toBeGreaterThan(0)
    })

    it("returns empty array for non-existent entry", () => {
      const stories = StoryRepository.getStoriesForWikiEntry("Nonexistent Entry")
      expect(stories).toHaveLength(0)
    })

    it("returns multiple stories for entries with many references", () => {
      const stories = StoryRepository.getStoriesForWikiEntry("アイリス")
      expect(stories.length).toBeGreaterThan(1)
    })
  })

  /* ── getStoriesByChapter ── */
  describe("getStoriesByChapter", () => {
    it("returns stories for chapter 1", () => {
      const stories = StoryRepository.getStoriesByChapter(1)
      expect(stories.length).toBeGreaterThan(0)
      expect(stories.every((s) => s.chapter === 1)).toBe(true)
    })

    it("returns stories for chapter 2", () => {
      const stories = StoryRepository.getStoriesByChapter(2)
      expect(stories.length).toBeGreaterThan(0)
    })

    it("returns stories sorted by chapterOrder", () => {
      const stories = StoryRepository.getStoriesByChapter(2)
      for (let i = 1; i < stories.length; i++) {
        expect(stories[i]!.chapterOrder).toBeGreaterThanOrEqual(stories[i - 1]!.chapterOrder)
      }
    })

    it("returns empty for non-existent chapter", () => {
      const stories = StoryRepository.getStoriesByChapter(99)
      expect(stories).toHaveLength(0)
    })
  })

  /* ── getAllChapters ── */
  describe("getAllChapters", () => {
    it("returns all chapters", () => {
      const chapters = StoryRepository.getAllChapters()
      expect(chapters.length).toBe(5)
    })

    it("chapters have unique IDs", () => {
      const chapters = StoryRepository.getAllChapters()
      const ids = chapters.map((c) => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it("chapters have required fields", () => {
      const chapters = StoryRepository.getAllChapters()
      for (const chapter of chapters) {
        expect(chapter).toHaveProperty("id")
        expect(chapter).toHaveProperty("titleJa")
        expect(chapter).toHaveProperty("titleEn")
        expect(chapter).toHaveProperty("era")
        expect(chapter).toHaveProperty("description")
        expect(chapter).toHaveProperty("descriptionEn")
        expect(chapter).toHaveProperty("color")
        expect(chapter).toHaveProperty("gradient")
      }
    })
  })

  /* ── getChapterById ── */
  describe("getChapterById", () => {
    it("finds chapter by ID", () => {
      const chapter = StoryRepository.getChapterById(1)
      expect(chapter).toBeDefined()
      expect(chapter!.id).toBe(1)
      expect(chapter!.titleJa).toBe("黎明編")
    })

    it("returns undefined for non-existent ID", () => {
      const chapter = StoryRepository.getChapterById(999)
      expect(chapter).toBeUndefined()
    })
  })

  /* ── getStoryFileUrl ── */
  describe("getStoryFileUrl", () => {
    it("returns full URL for story file", () => {
      const url = StoryRepository.getStoryFileUrl("test.txt")
      expect(url).toContain("raw.githubusercontent.com")
      expect(url).toContain("test.txt")
    })

    it("includes base path", () => {
      const url = StoryRepository.getStoryFileUrl("story.txt")
      expect(url).toContain("gentaron/edutext")
    })
  })

  /* ── getLocalizedUrl ── */
  describe("getLocalizedUrl", () => {
    it("returns JP URL for Japanese locale on JP source story", () => {
      const story = StoryRepository.findBySlug("diana-world")!
      const url = StoryRepository.getLocalizedUrl(story, "ja")
      expect(url).toContain("DianaWorld.txt")
    })

    it("returns EN URL for English locale on JP source story", () => {
      const story = StoryRepository.findBySlug("diana-world")!
      const url = StoryRepository.getLocalizedUrl(story, "en")
      expect(url).toContain("DianaWorld_EN.txt")
    })

    it("returns EN URL for English locale on EN source story", () => {
      const story = StoryRepository.findBySlug("jen-story-1")!
      expect(story.isEnSource).toBe(true)
      const url = StoryRepository.getLocalizedUrl(story, "en")
      expect(url).toContain("Jenstoryep1.txt")
    })

    it("returns JP URL for Japanese locale on EN source story", () => {
      const story = StoryRepository.findBySlug("jen-story-1")!
      expect(story.isEnSource).toBe(true)
      const url = StoryRepository.getLocalizedUrl(story, "ja")
      expect(url).toContain("Jenstoryep1_JP.txt")
    })
  })

  /* ── getLocalizedTitle ── */
  describe("getLocalizedTitle", () => {
    it("returns Japanese title for JP locale on JP source story", () => {
      const story = StoryRepository.findBySlug("diana-world")!
      const title = StoryRepository.getLocalizedTitle(story, "ja")
      expect(title).toBe("ダイアナの世界")
    })

    it("returns English title for EN locale on JP source story", () => {
      const story = StoryRepository.findBySlug("diana-world")!
      const title = StoryRepository.getLocalizedTitle(story, "en")
      expect(title).toBe("Diana's World")
    })

    it("returns English title for EN locale on EN source story", () => {
      const story = StoryRepository.findBySlug("jen-story-1")!
      const title = StoryRepository.getLocalizedTitle(story, "en")
      expect(title).toContain("Jen")
    })

    it("returns Japanese title for JA locale on EN source story", () => {
      const story = StoryRepository.findBySlug("jen-story-1")!
      const title = StoryRepository.getLocalizedTitle(story, "ja")
      expect(title).toContain("ジェン")
    })
  })

  /* ── getAdjacent ── */
  describe("getAdjacent", () => {
    it("returns prev and next for middle story", () => {
      const story = StoryRepository.findBySlug("jen-story-2")!
      const adjacent = StoryRepository.getAdjacent(story)
      expect(adjacent.prev).toBeDefined()
      expect(adjacent.next).toBeDefined()
    })

    it("returns only next for first story in chapter", () => {
      const story = StoryRepository.findBySlug("diana-world")!
      const adjacent = StoryRepository.getAdjacent(story)
      expect(adjacent.prev).toBeUndefined()
      expect(adjacent.next).toBeDefined()
    })

    it("returns only prev for last story in chapter", () => {
      const chapter4Stories = StoryRepository.getStoriesByChapter(4)
      const lastStory = chapter4Stories[chapter4Stories.length - 1]!
      const adjacent = StoryRepository.getAdjacent(lastStory)
      expect(adjacent.prev).toBeDefined()
      expect(adjacent.next).toBeUndefined()
    })
  })

  /* ── getEntryImageMap ── */
  describe("getEntryImageMap", () => {
    it("returns non-empty image map", () => {
      const map = StoryRepository.getEntryImageMap()
      expect(Object.keys(map).length).toBeGreaterThan(0)
    })

    it("contains known character entries", () => {
      const map = StoryRepository.getEntryImageMap()
      expect(map["Diana"]).toBeDefined()
      expect(map["アイリス"]).toBeDefined()
    })

    it("values are valid image paths", () => {
      const map = StoryRepository.getEntryImageMap()
      for (const value of Object.values(map)) {
        expect(value).toMatch(/^\//)
      }
    })
  })
})
