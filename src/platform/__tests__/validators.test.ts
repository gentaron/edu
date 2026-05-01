import { describe, it, expect } from "vitest"
import {
  validateWikiEntries,
  validateGameCards,
  validateEnemies,
  validateCivilizations,
  validateCivilizationLeaders,
  validateStoryMetas,
  validateChapterMetas,
  validateTimelinePeriods,
  validateTechEntries,
  validateFactionTrees,
} from "@/platform/validators"

describe("Validators", () => {
  /* ── Wiki Entries ── */
  describe("validateWikiEntries", () => {
    it("validates a valid wiki entry array", () => {
      const result = validateWikiEntries([
        {
          id: "test-entry-1",
          name: "Test Character",
          nameEn: "Test Character En",
          category: "キャラクター",
          description: "A test character description",
        },
      ])
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toHaveLength(1)
        expect(result.data[0]!.id).toBe("test-entry-1")
      }
    })

    it("rejects entries with missing required fields", () => {
      const result = validateWikiEntries([
        { id: "test" } as unknown[],
      ])
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0)
      }
    })

    it("rejects entries with empty id", () => {
      const result = validateWikiEntries([
        { id: "", name: "Test", category: "キャラクター", description: "Desc" },
      ])
      expect(result.success).toBe(false)
    })

    it("rejects entries with invalid category", () => {
      const result = validateWikiEntries([
        { id: "test", name: "Test", category: "invalid", description: "Desc" },
      ])
      expect(result.success).toBe(false)
    })

    it("accepts all valid categories", () => {
      const categories = ["キャラクター", "用語", "組織", "地理", "技術", "歴史"]
      for (const cat of categories) {
        const result = validateWikiEntries([
          { id: `test-${cat}`, name: `Test ${cat}`, category: cat, description: "Desc" },
        ])
        expect(result.success).toBe(true)
      }
    })

    it("accepts entries with optional fields", () => {
      const result = validateWikiEntries([
        {
          id: "test-full",
          name: "Full Test",
          nameEn: "Full Test EN",
          category: "キャラクター",
          description: "Description",
          subCategory: "sub",
          era: "E300",
          affiliation: "Test Affiliation",
          tier: "S",
          image: "/test.png",
          sourceLinks: [{ url: "https://example.com", label: "Source" }],
          leaders: [{ id: "leader-1", name: "Leader", role: "King", era: "E300" }],
        },
      ])
      expect(result.success).toBe(true)
    })

    it("validates an empty array", () => {
      const result = validateWikiEntries([])
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toHaveLength(0)
      }
    })

    it("returns structured error with path and message", () => {
      const result = validateWikiEntries([{ name: "no id" }])
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors[0]!.path).toBeDefined()
        expect(result.errors[0]!.message).toBeDefined()
      }
    })
  })

  /* ── Game Cards ── */
  describe("validateGameCards", () => {
    it("validates a valid game card array", () => {
      const result = validateGameCards([
        {
          id: "char-test",
          name: "Test Card",
          imageUrl: "/test.png",
          flavorText: "A flavorful test card",
          rarity: "SR",
          affiliation: "Test",
          attack: 10,
          defense: 5,
          effect: "Heal",
          effectValue: 3,
          ultimate: 20,
          ultimateName: "Ultimate Test",
        },
      ])
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toHaveLength(1)
        expect(result.data[0]!.rarity).toBe("SR")
      }
    })

    it("rejects cards with invalid rarity", () => {
      const result = validateGameCards([
        {
          id: "char-test",
          name: "Test Card",
          imageUrl: "/test.png",
          flavorText: "Flavor",
          rarity: "INVALID",
          affiliation: "Test",
          attack: 10,
          defense: 5,
          effect: "Effect",
          effectValue: 0,
          ultimate: 20,
          ultimateName: "Ultimate",
        },
      ])
      expect(result.success).toBe(false)
    })

    it("accepts all valid rarities", () => {
      for (const rarity of ["C", "R", "SR"] as const) {
        const result = validateGameCards([
          {
            id: `char-${rarity}`,
            name: `Card ${rarity}`,
            imageUrl: "/test.png",
            flavorText: "Flavor",
            rarity,
            affiliation: "Test",
            attack: 5,
            defense: 3,
            effect: "Effect",
            effectValue: 0,
            ultimate: 10,
            ultimateName: "Ult",
          },
        ])
        expect(result.success).toBe(true)
      }
    })

    it("rejects cards with negative attack", () => {
      const result = validateGameCards([
        {
          id: "char-neg",
          name: "Test",
          imageUrl: "/test.png",
          flavorText: "Flavor",
          rarity: "C",
          affiliation: "Test",
          attack: -1,
          defense: 0,
          effect: "Effect",
          effectValue: 0,
          ultimate: 0,
          ultimateName: "Ult",
        },
      ])
      expect(result.success).toBe(false)
    })
  })

  /* ── Enemies ── */
  describe("validateEnemies", () => {
    const validEnemy = {
      id: "test-enemy",
      name: "Test Enemy",
      title: "The Tester",
      maxHp: 1000,
      attackPower: 50,
      imageUrl: "/enemy.png",
      description: "A test enemy",
      difficulty: "NORMAL",
      reward: "Test Reward",
      phases: [{ triggerHpPercent: 50, message: "Phase 2!", attackBonus: 10 }],
    }

    it("validates a valid enemy array", () => {
      const result = validateEnemies([validEnemy])
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toHaveLength(1)
      }
    })

    it("rejects enemies with no phases", () => {
      const result = validateEnemies([{ ...validEnemy, phases: [] }])
      expect(result.success).toBe(false)
    })

    it("rejects enemies with zero maxHp", () => {
      const result = validateEnemies([{ ...validEnemy, maxHp: 0 }])
      expect(result.success).toBe(false)
    })

    it("accepts all valid difficulties", () => {
      for (const diff of ["NORMAL", "HARD", "BOSS", "FINAL"] as const) {
        const result = validateEnemies([{ ...validEnemy, difficulty: diff }])
        expect(result.success).toBe(true)
      }
    })

    it("accepts phases with selfHealPerTurn", () => {
      const result = validateEnemies([
        {
          ...validEnemy,
          phases: [{ triggerHpPercent: 50, message: "Heal phase", attackBonus: 10, selfHealPerTurn: 5 }],
        },
      ])
      expect(result.success).toBe(true)
    })
  })

  /* ── Civilizations ── */
  describe("validateCivilizations", () => {
    const validCiv = {
      id: "test-civ",
      rank: 1,
      name: "Test Civ",
      nameEn: "Test Civilization",
      color: "#FF0000",
      borderColor: "#CC0000",
      bgColor: "#FFE0E0",
      icon: "⚔️",
      leader: "Test Leader",
      leaderWikiId: "test-leader",
      specialization: "Testing",
      description: "A test civilization",
      history: "Test history",
      currentStatus: "Active",
      relationships: ["civ-2"],
      wikiId: "test-civ-wiki",
      href: "/test-civ",
    }

    it("validates a valid civilization array", () => {
      const result = validateCivilizations([validCiv])
      expect(result.success).toBe(true)
    })

    it("rejects civilizations with missing required fields", () => {
      const result = validateCivilizations([{ id: "test" }])
      expect(result.success).toBe(false)
    })

    it("accepts optional fields", () => {
      const result = validateCivilizations([
        { ...validCiv, capital: "Test Capital", gdp: "100T", isHistorical: true, planets: ["Earth", "Mars"] },
      ])
      expect(result.success).toBe(true)
    })
  })

  /* ── Civilization Leaders ── */
  describe("validateCivilizationLeaders", () => {
    const validLeader = {
      name: "Test Leader",
      title: "The Great",
      civilization: "Test Civ",
      civilizationColor: "#FF0000",
      wealth: "100T",
      source: "Historical Records",
      era: "E300",
      wikiId: "test-leader-wiki",
    }

    it("validates a valid leader array", () => {
      const result = validateCivilizationLeaders([validLeader])
      expect(result.success).toBe(true)
    })

    it("rejects leaders with missing fields", () => {
      const result = validateCivilizationLeaders([{ name: "Incomplete" }])
      expect(result.success).toBe(false)
    })
  })

  /* ── Story Metas ── */
  describe("validateStoryMetas", () => {
    const validStory = {
      slug: "test-story-1",
      title: "Test Story",
      titleJa: "テストストーリー",
      label: "Test Label",
      fileName: "test.txt",
      fileNameAlt: "test_JP.txt",
      relatedEntries: ["entry-1"],
      chapter: 1,
      chapterOrder: 1,
      isEnSource: false,
    }

    it("validates a valid story meta array", () => {
      const result = validateStoryMetas([validStory])
      expect(result.success).toBe(true)
    })

    it("rejects stories with invalid slug format", () => {
      const result = validateStoryMetas([{ ...validStory, slug: "Invalid Slug!" }])
      expect(result.success).toBe(false)
    })

    it("accepts stories with era field", () => {
      const result = validateStoryMetas([{ ...validStory, era: "E300" }])
      expect(result.success).toBe(true)
    })
  })

  /* ── Chapter Metas ── */
  describe("validateChapterMetas", () => {
    const validChapter = {
      id: 1,
      titleJa: "テスト編",
      titleEn: "The Test",
      era: "E300",
      description: "A test chapter",
      descriptionEn: "A test chapter in English",
      color: "from-red-500 to-blue-500",
      gradient: "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)",
    }

    it("validates a valid chapter meta array", () => {
      const result = validateChapterMetas([validChapter])
      expect(result.success).toBe(true)
    })

    it("rejects chapters with zero id", () => {
      const result = validateChapterMetas([{ ...validChapter, id: 0 }])
      expect(result.success).toBe(false)
    })
  })

  /* ── Timeline Periods ── */
  describe("validateTimelinePeriods", () => {
    const validPeriod = {
      period: "Era 1",
      range: "E260-E300",
      color: "#FF0000",
      borderColor: "#CC0000",
      events: [{ text: "Event 1", loc: "Location" }],
    }

    it("validates a valid timeline period array", () => {
      const result = validateTimelinePeriods([validPeriod])
      expect(result.success).toBe(true)
    })

    it("rejects periods with no events", () => {
      const result = validateTimelinePeriods([{ ...validPeriod, events: [] }])
      expect(result.success).toBe(false)
    })

    it("accepts events without location", () => {
      const result = validateTimelinePeriods([
        { ...validPeriod, events: [{ text: "Simple event" }] },
      ])
      expect(result.success).toBe(true)
    })
  })

  /* ── Tech Entries ── */
  describe("validateTechEntries", () => {
    const validTech = {
      id: "test-tech",
      name: "Test Tech",
      nameEn: "Test Technology",
      icon: "⚡",
      color: "#FF0000",
      borderColor: "#CC0000",
      bgGlow: "rgba(255,0,0,0.1)",
      tag: "Test Tag",
      tagColor: "#FFFFFF",
      physics: "Test physics",
      applications: ["Application 1", "Application 2"],
    }

    it("validates a valid tech entry array", () => {
      const result = validateTechEntries([validTech])
      expect(result.success).toBe(true)
    })

    it("rejects tech entries with invalid id format", () => {
      const result = validateTechEntries([{ ...validTech, id: "Invalid ID!" }])
      expect(result.success).toBe(false)
    })

    it("rejects tech entries with empty applications", () => {
      const result = validateTechEntries([{ ...validTech, applications: [] }])
      expect(result.success).toBe(false)
    })
  })

  /* ── Faction Trees ── */
  describe("validateFactionTrees", () => {
    const validFaction = {
      name: "Test Faction",
      color: "#FF0000",
      dotColor: "#CC0000",
      textColor: "#FFFFFF",
      description: "A test faction",
      keyMembers: ["Member 1", "Member 2"],
      alliances: "Test Alliance",
      nodes: [{ year: "E300", name: "Test Node" }],
    }

    it("validates a valid faction tree array", () => {
      const result = validateFactionTrees([validFaction])
      expect(result.success).toBe(true)
    })

    it("rejects faction trees with empty keyMembers", () => {
      const result = validateFactionTrees([{ ...validFaction, keyMembers: [] }])
      expect(result.success).toBe(false)
    })

    it("rejects faction trees with empty nodes", () => {
      const result = validateFactionTrees([{ ...validFaction, nodes: [] }])
      expect(result.success).toBe(false)
    })

    it("accepts nodes with children", () => {
      const result = validateFactionTrees([
        { ...validFaction, nodes: [{ year: "E300", name: "Parent", children: ["child1", "child2"] }] },
      ])
      expect(result.success).toBe(true)
    })
  })

  /* ── Edge cases ── */
  describe("edge cases", () => {
    it("handles non-array input", () => {
      const result = validateWikiEntries("not an array" as unknown as unknown[])
      expect(result.success).toBe(false)
    })

    it("handles null input", () => {
      const result = validateWikiEntries(null as unknown as unknown[])
      expect(result.success).toBe(false)
    })
  })
})
