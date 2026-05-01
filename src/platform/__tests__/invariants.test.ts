import { describe, it, expect } from "vitest"
import {
  checkWikiIdUniqueness,
  checkStoryReferences,
  checkCivilizationLeaderReferences,
  checkCardDataConsistency,
  checkWikiCategories,
  runAllInvariants,
} from "@/platform/invariants"
import type { WikiEntry, GameCard, Enemy, Civilization } from "@/types"
import type { StoryMeta } from "@/domains/stories/stories.schema"

// ── Test fixtures ──

const makeWikiEntry = (id: string, category: string = "キャラクター", overrides?: Partial<WikiEntry>): WikiEntry => ({
  id,
  name: `Entry ${id}`,
  nameEn: `Entry ${id} EN`,
  category,
  description: `Description for ${id}`,
  ...overrides,
})

const makeCard = (id: string, overrides?: Partial<GameCard>): GameCard => ({
  id,
  name: `Card ${id}`,
  imageUrl: `/card-${id}.png`,
  flavorText: `Flavor for ${id}`,
  rarity: "R",
  affiliation: "Test",
  attack: 10,
  defense: 5,
  effect: "Heal",
  effectValue: 3,
  ultimate: 20,
  ultimateName: "Ultimate",
  ...overrides,
})

const makeEnemy = (id: string, overrides?: Partial<Enemy>): Enemy => ({
  id,
  name: `Enemy ${id}`,
  title: "The Tester",
  maxHp: 1000,
  attackPower: 50,
  imageUrl: `/enemy-${id}.png`,
  description: `An enemy ${id}`,
  difficulty: "NORMAL",
  reward: `Reward ${id}`,
  phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
  ...overrides,
})

const makeCiv = (id: string, overrides?: Partial<Civilization>): Civilization => ({
  id,
  rank: 1,
  name: `Civ ${id}`,
  nameEn: `Civilization ${id}`,
  color: "#FF0000",
  borderColor: "#CC0000",
  bgColor: "#FFE0E0",
  icon: "⚔️",
  leader: "Leader",
  leaderWikiId: `wiki-${id}-leader`,
  specialization: "Test",
  description: `Description for civ ${id}`,
  history: `History for civ ${id}`,
  currentStatus: "Active",
  relationships: [],
  wikiId: `wiki-${id}`,
  href: `/civ/${id}`,
  ...overrides,
})

const makeStory = (slug: string, relatedEntries: string[] = [], overrides?: Partial<StoryMeta>): StoryMeta => ({
  slug,
  title: `Story ${slug}`,
  titleJa: `ストーリー ${slug}`,
  label: `Label ${slug}`,
  fileName: `${slug}.txt`,
  fileNameAlt: `${slug}_EN.txt`,
  relatedEntries,
  chapter: 1,
  chapterOrder: 1,
  isEnSource: false,
  ...overrides,
})

describe("Invariants", () => {
  /* ── checkWikiIdUniqueness ── */
  describe("checkWikiIdUniqueness", () => {
    it("returns no violations for unique IDs", () => {
      const entries = [makeWikiEntry("a"), makeWikiEntry("b"), makeWikiEntry("c")]
      const violations = checkWikiIdUniqueness(entries)
      expect(violations).toHaveLength(0)
    })

    it("returns violations for duplicate IDs", () => {
      const entries = [makeWikiEntry("dup"), makeWikiEntry("dup"), makeWikiEntry("unique")]
      const violations = checkWikiIdUniqueness(entries)
      expect(violations).toHaveLength(1)
      expect(violations[0]!.rule).toBe("wiki-id-unique")
      expect(violations[0]!.severity).toBe("error")
      expect(violations[0]!.message).toContain("dup")
    })

    it("returns multiple violations for multiple duplicate pairs", () => {
      const entries = [makeWikiEntry("a"), makeWikiEntry("a"), makeWikiEntry("b"), makeWikiEntry("b")]
      const violations = checkWikiIdUniqueness(entries)
      expect(violations).toHaveLength(2)
    })

    it("returns no violations for empty array", () => {
      const violations = checkWikiIdUniqueness([])
      expect(violations).toHaveLength(0)
    })
  })

  /* ── checkStoryReferences ── */
  describe("checkStoryReferences", () => {
    it("returns no violations when all references are valid", () => {
      const wikiEntries = [makeWikiEntry("entry-1"), makeWikiEntry("entry-2")]
      const stories = [makeStory("story-1", ["entry-1", "entry-2"])]
      const violations = checkStoryReferences(stories, wikiEntries)
      expect(violations).toHaveLength(0)
    })

    it("returns violations for non-existent wiki entry references", () => {
      const wikiEntries = [makeWikiEntry("entry-1")]
      const stories = [makeStory("story-1", ["entry-1", "nonexistent"])]
      const violations = checkStoryReferences(stories, wikiEntries)
      expect(violations).toHaveLength(1)
      expect(violations[0]!.rule).toBe("story-references-valid")
      expect(violations[0]!.severity).toBe("warning")
      expect(violations[0]!.message).toContain("nonexistent")
      expect(violations[0]!.message).toContain("story-1")
    })

    it("returns violations for all missing references", () => {
      const wikiEntries = [makeWikiEntry("entry-1")]
      const stories = [
        makeStory("story-1", ["missing-a", "missing-b"]),
        makeStory("story-2", ["entry-1", "missing-c"]),
      ]
      const violations = checkStoryReferences(stories, wikiEntries)
      expect(violations).toHaveLength(3)
    })

    it("handles stories with empty related entries", () => {
      const wikiEntries = [makeWikiEntry("entry-1")]
      const stories = [makeStory("story-1", [])]
      const violations = checkStoryReferences(stories, wikiEntries)
      expect(violations).toHaveLength(0)
    })

    it("handles empty story array", () => {
      const wikiEntries = [makeWikiEntry("entry-1")]
      const violations = checkStoryReferences([], wikiEntries)
      expect(violations).toHaveLength(0)
    })
  })

  /* ── checkCivilizationLeaderReferences ── */
  describe("checkCivilizationLeaderReferences", () => {
    it("returns no violations for valid references", () => {
      const wikiEntries = [makeWikiEntry("wiki-civ-leader"), makeWikiEntry("wiki-civ")]
      const civs = [
        makeCiv("civ-1", { leaderWikiId: "wiki-civ-leader", wikiId: "wiki-civ" }),
      ]
      const violations = checkCivilizationLeaderReferences(civs, wikiEntries)
      expect(violations).toHaveLength(0)
    })

    it("returns violations for missing leaderWikiId", () => {
      const wikiEntries = [makeWikiEntry("wiki-civ")]
      const civs = [
        makeCiv("civ-1", { leaderWikiId: "nonexistent-leader", wikiId: "wiki-civ" }),
      ]
      const violations = checkCivilizationLeaderReferences(civs, wikiEntries)
      expect(violations).toHaveLength(1)
      expect(violations[0]!.rule).toBe("civ-leader-wiki-ref")
      expect(violations[0]!.severity).toBe("warning")
      expect(violations[0]!.message).toContain("nonexistent-leader")
    })

    it("returns violations for missing wikiId", () => {
      const wikiEntries = [makeWikiEntry("wiki-leader")]
      const civs = [
        makeCiv("civ-1", { leaderWikiId: "wiki-leader", wikiId: "nonexistent-wiki" }),
      ]
      const violations = checkCivilizationLeaderReferences(civs, wikiEntries)
      expect(violations).toHaveLength(1)
      expect(violations[0]!.rule).toBe("civ-wiki-ref")
      expect(violations[0]!.message).toContain("nonexistent-wiki")
    })

    it("returns violations for both missing references", () => {
      const wikiEntries = [makeWikiEntry("other")]
      const civs = [
        makeCiv("civ-1", { leaderWikiId: "missing-leader", wikiId: "missing-wiki" }),
      ]
      const violations = checkCivilizationLeaderReferences(civs, wikiEntries)
      expect(violations).toHaveLength(2)
    })

    it("handles empty civilization array", () => {
      const wikiEntries = [makeWikiEntry("entry-1")]
      const violations = checkCivilizationLeaderReferences([], wikiEntries)
      expect(violations).toHaveLength(0)
    })
  })

  /* ── checkCardDataConsistency ── */
  describe("checkCardDataConsistency", () => {
    it("returns no violations for valid data", () => {
      const cards = [makeCard("card-1"), makeCard("card-2")]
      const enemies = [makeEnemy("enemy-1")]
      const violations = checkCardDataConsistency(cards, enemies)
      expect(violations).toHaveLength(0)
    })

    it("returns violation for duplicate card IDs", () => {
      const cards = [makeCard("card-1"), makeCard("card-1")]
      const enemies = [makeEnemy("enemy-1")]
      const violations = checkCardDataConsistency(cards, enemies)
      expect(violations.some((v) => v.rule === "card-id-unique")).toBe(true)
      expect(violations.some((v) => v.severity === "error")).toBe(true)
    })

    it("returns violation for duplicate enemy IDs", () => {
      const cards = [makeCard("card-1")]
      const enemies = [makeEnemy("enemy-1"), makeEnemy("enemy-1")]
      const violations = checkCardDataConsistency(cards, enemies)
      expect(violations.some((v) => v.rule === "enemy-id-unique")).toBe(true)
    })

    it("returns violation for enemy with no phases", () => {
      const cards = [makeCard("card-1")]
      const enemies = [makeEnemy("enemy-1", { phases: [] })]
      const violations = checkCardDataConsistency(cards, enemies)
      expect(violations.some((v) => v.rule === "enemy-has-phases")).toBe(true)
      expect(violations.some((v) => v.message.includes("enemy-1"))).toBe(true)
    })

    it("returns violation for enemy with zero maxHp", () => {
      const cards = [makeCard("card-1")]
      const enemies = [makeEnemy("enemy-1", { maxHp: 0 })]
      const violations = checkCardDataConsistency(cards, enemies)
      expect(violations.some((v) => v.rule === "enemy-positive-hp")).toBe(true)
      expect(violations.some((v) => v.message.includes("0"))).toBe(true)
    })

    it("returns violation for enemy with negative maxHp", () => {
      const cards = [makeCard("card-1")]
      const enemies = [makeEnemy("enemy-1", { maxHp: -10 })]
      const violations = checkCardDataConsistency(cards, enemies)
      expect(violations.some((v) => v.rule === "enemy-positive-hp")).toBe(true)
    })

    it("returns multiple violations for multiple issues", () => {
      const cards = [makeCard("dup"), makeCard("dup")]
      const enemies = [
        makeEnemy("e1", { maxHp: 0 }),
        makeEnemy("e2", { phases: [] }),
      ]
      const violations = checkCardDataConsistency(cards, enemies)
      expect(violations.length).toBeGreaterThanOrEqual(3)
    })
  })

  /* ── checkWikiCategories ── */
  describe("checkWikiCategories", () => {
    it("returns no violations for all valid categories", () => {
      const entries = [
        makeWikiEntry("a", "キャラクター"),
        makeWikiEntry("b", "用語"),
        makeWikiEntry("c", "組織"),
        makeWikiEntry("d", "地理"),
        makeWikiEntry("e", "技術"),
        makeWikiEntry("f", "歴史"),
      ]
      const violations = checkWikiCategories(entries)
      expect(violations).toHaveLength(0)
    })

    it("returns violations for invalid categories", () => {
      const entries = [
        makeWikiEntry("a", "invalid-category"),
        makeWikiEntry("b", "キャラクター"),
        makeWikiEntry("c", "also-invalid"),
      ]
      const violations = checkWikiCategories(entries)
      expect(violations).toHaveLength(2)
      expect(violations[0]!.rule).toBe("wiki-valid-category")
      expect(violations[0]!.severity).toBe("error")
      expect(violations[0]!.message).toContain("invalid-category")
      expect(violations[1]!.message).toContain("also-invalid")
    })

    it("handles empty array", () => {
      const violations = checkWikiCategories([])
      expect(violations).toHaveLength(0)
    })
  })

  /* ── runAllInvariants ── */
  describe("runAllInvariants", () => {
    it("returns no violations for clean data", () => {
      const data = {
        wikiEntries: [makeWikiEntry("wiki-1")],
        cards: [makeCard("card-1")],
        enemies: [makeEnemy("enemy-1")],
        civilizations: [makeCiv("civ-1", { leaderWikiId: "wiki-1", wikiId: "wiki-1" })],
        stories: [makeStory("story-1", ["wiki-1"])],
      }
      const violations = runAllInvariants(data)
      expect(violations).toHaveLength(0)
    })

    it("collects violations from multiple invariant checks", () => {
      const data = {
        wikiEntries: [makeWikiEntry("dup"), makeWikiEntry("dup")],
        cards: [makeCard("c1"), makeCard("c1")],
        enemies: [makeEnemy("e1", { maxHp: 0, phases: [] })],
        civilizations: [makeCiv("civ-1", { leaderWikiId: "missing", wikiId: "missing" })],
        stories: [makeStory("s1", ["nonexistent-wiki"])],
      }
      const violations = runAllInvariants(data)
      expect(violations.length).toBeGreaterThan(0)
    })

    it("includes violations from wiki uniqueness", () => {
      const data = {
        wikiEntries: [makeWikiEntry("dup"), makeWikiEntry("dup")],
        cards: [],
        enemies: [],
        civilizations: [],
        stories: [],
      }
      const violations = runAllInvariants(data)
      expect(violations.some((v) => v.rule === "wiki-id-unique")).toBe(true)
    })

    it("includes violations from wiki categories", () => {
      const data = {
        wikiEntries: [makeWikiEntry("a", "invalid")],
        cards: [],
        enemies: [],
        civilizations: [],
        stories: [],
      }
      const violations = runAllInvariants(data)
      expect(violations.some((v) => v.rule === "wiki-valid-category")).toBe(true)
    })

    it("handles all empty arrays", () => {
      const data = {
        wikiEntries: [],
        cards: [],
        enemies: [],
        civilizations: [],
        stories: [],
      }
      const violations = runAllInvariants(data)
      expect(violations).toHaveLength(0)
    })
  })
})
