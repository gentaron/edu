import { describe, it, expect } from "vitest"
import { ALL_STORIES, getStoryBySlug } from "../stories"

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
})
