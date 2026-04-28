import { describe, it, expect } from "vitest"
import {
  ALL_STORIES,
  CHAPTERS,
  getStoryBySlug,
  getStoriesByChapter,
  getAdjacentStories,
} from "../stories"

describe("stories", () => {
  it("ALL_STORIES should have no duplicate slugs", () => {
    const slugs = ALL_STORIES.map((s) => s.slug)
    const uniqueSlugs = new Set(slugs)
    expect(uniqueSlugs.size).toBe(slugs.length)
  })

  it("each story should have a fileName string", () => {
    for (const story of ALL_STORIES) {
      expect(story).toHaveProperty("fileName")
      expect(typeof story.fileName).toBe("string")
      expect(story.fileName.length).toBeGreaterThan(0)
    }
  })

  it("getStoryBySlug should return the correct entry", () => {
    // Test a known slug
    const diana = getStoryBySlug("diana-world")
    expect(diana).toBeDefined()
    expect(diana!.slug).toBe("diana-world")
    expect(diana!.fileName).toBe("DianaWorld.txt")

    // Test another known slug
    const iris = getStoryBySlug("iris-story-1")
    expect(iris).toBeDefined()
    expect(iris!.slug).toBe("iris-story-1")
    expect(iris!.fileName).toBe("IRIS_1.txt")

    // Test non-existent slug
    const notFound = getStoryBySlug("non-existent-story")
    expect(notFound).toBeUndefined()
  })

  it("CHAPTERS should have 5 entries", () => {
    expect(CHAPTERS.length).toBe(5)
  })

  it("each story should have a valid chapter assignment", () => {
    for (const story of ALL_STORIES) {
      expect(story.chapter).toBeGreaterThanOrEqual(1)
      expect(story.chapter).toBeLessThanOrEqual(5)
      expect(typeof story.chapterOrder).toBe("number")
      expect(story.chapterOrder).toBeGreaterThanOrEqual(1)
    }
  })

  it("getStoriesByChapter should return stories sorted by chapterOrder", () => {
    const chapter1 = getStoriesByChapter(1)
    expect(chapter1.length).toBeGreaterThanOrEqual(1)
    for (let i = 1; i < chapter1.length; i++) {
      expect(chapter1[i].chapterOrder).toBeGreaterThanOrEqual(chapter1[i - 1].chapterOrder)
    }
  })

  it("getAdjacentStories should return correct prev/next within chapter", () => {
    const jen1 = getStoryBySlug("jen-story-1")
    expect(jen1).toBeDefined()
    const { prev, next } = getAdjacentStories(jen1!)
    expect(prev).toBeDefined() // nebura
    expect(next).toBeDefined() // jen-story-2
    expect(next!.slug).toBe("jen-story-2")

    // First in chapter should have no prev
    const nebura = getStoryBySlug("nebura")
    expect(nebura).toBeDefined()
    const { prev: nebPrev, next: nebNext } = getAdjacentStories(nebura!)
    expect(nebPrev).toBeUndefined()
    expect(nebNext).toBeDefined()
  })
})
