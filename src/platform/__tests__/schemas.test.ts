import { describe, it, expect } from "vitest"
import {
  WikiEntrySchema,
  CategorySchema,
  SourceLinkSchema,
  LeaderEntrySchema,
  GameCardSchema,
  AbilityTypeSchema,
  RaritySchema,
  EnemyDifficultySchema,
  EnemyPhaseSchema,
  EnemySchema,
  FieldCharSchema,
  CivilizationSchema,
  CivilizationLeaderSchema,
  TimelinePeriodSchema,
  TlEvSchema,
  TechEntrySchema,
  FactionTreeSchema,
  FactionNodeSchema,
  StoryMetaSchema,
  ChapterMetaSchema,
  RelationNodeSchema,
  RelationEdgeSchema,
  IrisTimelineEntrySchema,
  IrisAbilitySchema,
  IrisRelationSchema,
  MinaTimelineEntrySchema,
  PlatformEntrySchema,
} from "@/platform/schemas"
// Import shared schema to cover it
import {
  AbilityTypeSchema as SharedAbilityTypeSchema,
  RaritySchema as SharedRaritySchema,
  EnemyDifficultySchema as SharedEnemyDifficultySchema,
  EnemyPhaseSchema as SharedEnemyPhaseSchema,
  CategorySchema as SharedCategorySchema,
} from "@/platform/schemas/shared.schema"

describe("Platform Schemas", () => {
  /* ── CategorySchema ── */
  describe("CategorySchema", () => {
    it("accepts all valid categories", () => {
      const categories = ["キャラクター", "用語", "組織", "地理", "技術", "歴史"]
      for (const cat of categories) {
        expect(CategorySchema.parse(cat)).toBe(cat)
      }
    })

    it("rejects invalid category", () => {
      expect(() => CategorySchema.parse("invalid")).toThrow()
    })

    it("rejects empty string", () => {
      expect(() => CategorySchema.parse("")).toThrow()
    })
  })

  /* ── SourceLinkSchema ── */
  describe("SourceLinkSchema", () => {
    it("accepts valid source link", () => {
      const result = SourceLinkSchema.parse({ url: "https://example.com", label: "Example" })
      expect(result.url).toBe("https://example.com")
      expect(result.label).toBe("Example")
    })

    it("rejects empty url", () => {
      expect(() => SourceLinkSchema.parse({ url: "", label: "Test" })).toThrow()
    })

    it("rejects empty label", () => {
      expect(() => SourceLinkSchema.parse({ url: "https://example.com", label: "" })).toThrow()
    })
  })

  /* ── LeaderEntrySchema ── */
  describe("LeaderEntrySchema", () => {
    it("accepts valid leader entry", () => {
      const result = LeaderEntrySchema.parse({
        id: "leader-1",
        name: "Test Leader",
        nameEn: "Test Leader EN",
        role: "King",
        era: "E300",
      })
      expect(result.name).toBe("Test Leader")
    })

    it("accepts leader without optional fields", () => {
      const result = LeaderEntrySchema.parse({
        id: "leader-2",
        name: "Minimal Leader",
        role: "Advisor",
      })
      expect(result.nameEn).toBeUndefined()
      expect(result.era).toBeUndefined()
    })

    it("rejects leader without required fields", () => {
      expect(() => LeaderEntrySchema.parse({ id: "leader-3", name: "Incomplete" })).toThrow()
    })
  })

  /* ── WikiEntrySchema ── */
  describe("WikiEntrySchema", () => {
    const validEntry = {
      id: "wiki-1",
      name: "Test Entry",
      nameEn: "Test Entry EN",
      category: "キャラクター",
      description: "A test description",
    }

    it("accepts valid wiki entry", () => {
      const result = WikiEntrySchema.parse(validEntry)
      expect(result.id).toBe("wiki-1")
    })

    it("accepts entry with all optional fields", () => {
      const fullEntry = {
        ...validEntry,
        subCategory: "sub",
        era: "E300",
        affiliation: "Test",
        tier: "S",
        image: "/test.png",
        sourceLinks: [{ url: "https://example.com", label: "Source" }],
        leaders: [{ id: "l1", name: "Leader", role: "King", era: "E300" }],
      }
      const result = WikiEntrySchema.parse(fullEntry)
      expect(result.subCategory).toBe("sub")
      expect(result.sourceLinks).toHaveLength(1)
      expect(result.leaders).toHaveLength(1)
    })

    it("rejects entry without required fields", () => {
      expect(() => WikiEntrySchema.parse({ id: "wiki-2" })).toThrow()
    })

    it("rejects entry with empty id", () => {
      expect(() => WikiEntrySchema.parse({ id: "", name: "Test", category: "キャラクター", description: "Desc" })).toThrow()
    })
  })

  /* ── AbilityTypeSchema ── */
  describe("AbilityTypeSchema", () => {
    it("accepts all valid ability types", () => {
      const types = ["攻撃", "防御", "効果", "必殺"]
      for (const t of types) {
        expect(AbilityTypeSchema.parse(t)).toBe(t)
      }
    })

    it("rejects invalid ability type", () => {
      expect(() => AbilityTypeSchema.parse("invalid")).toThrow()
    })
  })

  /* ── RaritySchema ── */
  describe("RaritySchema", () => {
    it("accepts all valid rarities", () => {
      for (const r of ["C", "R", "SR"]) {
        expect(RaritySchema.parse(r)).toBe(r)
      }
    })

    it("rejects invalid rarity", () => {
      expect(() => RaritySchema.parse("SSR")).toThrow()
    })
  })

  /* ── GameCardSchema ── */
  describe("GameCardSchema", () => {
    const validCard = {
      id: "char-test",
      name: "Test Card",
      imageUrl: "/test.png",
      flavorText: "Flavor text",
      rarity: "SR",
      affiliation: "Test",
      attack: 10,
      defense: 5,
      effect: "Heal",
      effectValue: 3,
      ultimate: 20,
      ultimateName: "Ultimate Test",
    }

    it("accepts valid game card", () => {
      const result = GameCardSchema.parse(validCard)
      expect(result.id).toBe("char-test")
    })

    it("rejects card with invalid rarity", () => {
      expect(() => GameCardSchema.parse({ ...validCard, rarity: "INVALID" })).toThrow()
    })

    it("rejects card with negative attack", () => {
      expect(() => GameCardSchema.parse({ ...validCard, attack: -1 })).toThrow()
    })

    it("rejects card with negative defense", () => {
      expect(() => GameCardSchema.parse({ ...validCard, defense: -1 })).toThrow()
    })
  })

  /* ── EnemyDifficultySchema ── */
  describe("EnemyDifficultySchema", () => {
    it("accepts all valid difficulties", () => {
      for (const d of ["NORMAL", "HARD", "BOSS", "FINAL"]) {
        expect(EnemyDifficultySchema.parse(d)).toBe(d)
      }
    })

    it("rejects invalid difficulty", () => {
      expect(() => EnemyDifficultySchema.parse("EASY")).toThrow()
    })
  })

  /* ── EnemyPhaseSchema ── */
  describe("EnemyPhaseSchema", () => {
    it("accepts valid phase", () => {
      const result = EnemyPhaseSchema.parse({
        triggerHpPercent: 50,
        message: "Phase 2!",
        attackBonus: 10,
      })
      expect(result.triggerHpPercent).toBe(50)
    })

    it("accepts phase with selfHealPerTurn", () => {
      const result = EnemyPhaseSchema.parse({
        triggerHpPercent: 50,
        message: "Heal phase",
        attackBonus: 10,
        selfHealPerTurn: 5,
      })
      expect(result.selfHealPerTurn).toBe(5)
    })

    it("rejects triggerHpPercent below 0", () => {
      expect(() => EnemyPhaseSchema.parse({
        triggerHpPercent: -1,
        message: "Invalid",
        attackBonus: 0,
      })).toThrow()
    })

    it("rejects triggerHpPercent above 100", () => {
      expect(() => EnemyPhaseSchema.parse({
        triggerHpPercent: 101,
        message: "Invalid",
        attackBonus: 0,
      })).toThrow()
    })

    it("allows 0 and 100", () => {
      const r1 = EnemyPhaseSchema.parse({ triggerHpPercent: 0, message: "m", attackBonus: 0 })
      const r2 = EnemyPhaseSchema.parse({ triggerHpPercent: 100, message: "m", attackBonus: 0 })
      expect(r1.triggerHpPercent).toBe(0)
      expect(r2.triggerHpPercent).toBe(100)
    })
  })

  /* ── EnemySchema ── */
  describe("EnemySchema", () => {
    const validEnemy = {
      id: "enemy-1",
      name: "Test Enemy",
      title: "The Tester",
      maxHp: 1000,
      attackPower: 50,
      imageUrl: "/enemy.png",
      description: "An enemy",
      difficulty: "NORMAL",
      reward: "Reward",
      phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
    }

    it("accepts valid enemy", () => {
      const result = EnemySchema.parse(validEnemy)
      expect(result.id).toBe("enemy-1")
    })

    it("rejects enemy with zero maxHp", () => {
      expect(() => EnemySchema.parse({ ...validEnemy, maxHp: 0 })).toThrow()
    })

    it("rejects enemy with empty phases", () => {
      expect(() => EnemySchema.parse({ ...validEnemy, phases: [] })).toThrow()
    })

    it("accepts enemy with specialRule", () => {
      const result = EnemySchema.parse({ ...validEnemy, specialRule: "Special" })
      expect(result.specialRule).toBe("Special")
    })
  })

  /* ── FieldCharSchema ── */
  describe("FieldCharSchema", () => {
    const validFieldChar = {
      card: {
        id: "char-1",
        name: "Test",
        imageUrl: "/test.png",
        flavorText: "Flavor",
        rarity: "R",
        affiliation: "Test",
        attack: 10,
        defense: 5,
        effect: "Effect",
        effectValue: 0,
        ultimate: 20,
        ultimateName: "Ult",
      },
      hp: 50,
      maxHp: 100,
      isDown: false,
    }

    it("accepts valid field character", () => {
      const result = FieldCharSchema.parse(validFieldChar)
      expect(result.card.id).toBe("char-1")
    })

    it("accepts downed character", () => {
      const result = FieldCharSchema.parse({ ...validFieldChar, isDown: true, hp: 0 })
      expect(result.isDown).toBe(true)
    })

    it("rejects field char with negative hp", () => {
      expect(() => FieldCharSchema.parse({ ...validFieldChar, hp: -1 })).toThrow()
    })

    it("rejects field char with zero maxHp", () => {
      expect(() => FieldCharSchema.parse({ ...validFieldChar, maxHp: 0 })).toThrow()
    })
  })

  /* ── CivilizationSchema ── */
  describe("CivilizationSchema", () => {
    it("accepts valid civilization with all required fields", () => {
      const result = CivilizationSchema.parse({
        id: "civ-1",
        rank: 1,
        name: "Test Civ",
        nameEn: "Test Civilization",
        color: "#FF0000",
        borderColor: "#CC0000",
        bgColor: "#FFE0E0",
        icon: "⚔️",
        leader: "Leader",
        leaderWikiId: "wiki-leader",
        specialization: "Test",
        description: "Desc",
        history: "History",
        currentStatus: "Active",
        relationships: [],
        wikiId: "wiki-civ",
        href: "/civ",
      })
      expect(result.id).toBe("civ-1")
    })

    it("rejects civilization with missing fields", () => {
      expect(() => CivilizationSchema.parse({ id: "civ-2", rank: 1, name: "Civ" })).toThrow()
    })
  })

  /* ── CivilizationLeaderSchema ── */
  describe("CivilizationLeaderSchema", () => {
    it("accepts valid leader", () => {
      const result = CivilizationLeaderSchema.parse({
        name: "Test Leader",
        title: "The Great",
        civilization: "Test Civ",
        civilizationColor: "#FF0000",
        wealth: "100T",
        source: "Records",
        era: "E300",
        wikiId: "wiki-leader",
      })
      expect(result.name).toBe("Test Leader")
    })

    it("rejects leader with missing fields", () => {
      expect(() => CivilizationLeaderSchema.parse({ name: "Incomplete" })).toThrow()
    })
  })

  /* ── TlEvSchema ── */
  describe("TlEvSchema", () => {
    it("accepts event with text only", () => {
      const result = TlEvSchema.parse({ text: "An event" })
      expect(result.text).toBe("An event")
      expect(result.loc).toBeUndefined()
    })

    it("accepts event with location", () => {
      const result = TlEvSchema.parse({ text: "An event", loc: "Gigapolis" })
      expect(result.loc).toBe("Gigapolis")
    })

    it("rejects empty text", () => {
      expect(() => TlEvSchema.parse({ text: "" })).toThrow()
    })
  })

  /* ── TimelinePeriodSchema ── */
  describe("TimelinePeriodSchema", () => {
    it("accepts valid timeline period", () => {
      const result = TimelinePeriodSchema.parse({
        period: "Era 1",
        range: "E260-E300",
        color: "#FF0000",
        borderColor: "#CC0000",
        events: [{ text: "Event 1" }],
      })
      expect(result.period).toBe("Era 1")
    })

    it("rejects empty events", () => {
      expect(() => TimelinePeriodSchema.parse({
        period: "Era 1",
        range: "E260-E300",
        color: "#FF0000",
        borderColor: "#CC0000",
        events: [],
      })).toThrow()
    })
  })

  /* ── TechEntrySchema ── */
  describe("TechEntrySchema", () => {
    it("accepts valid tech entry", () => {
      const result = TechEntrySchema.parse({
        id: "tech-1",
        name: "Test Tech",
        nameEn: "Test Technology",
        icon: "⚡",
        color: "#FF0000",
        borderColor: "#CC0000",
        bgGlow: "rgba(255,0,0,0.1)",
        tag: "Tag",
        tagColor: "#FFF",
        physics: "Physics",
        applications: ["App 1"],
      })
      expect(result.id).toBe("tech-1")
    })

    it("rejects invalid id format", () => {
      expect(() => TechEntrySchema.parse({
        id: "Invalid!",
        name: "Tech",
        nameEn: "Technology",
        icon: "⚡",
        color: "#FF0000",
        borderColor: "#CC0000",
        bgGlow: "rgba(255,0,0,0.1)",
        tag: "Tag",
        tagColor: "#FFF",
        physics: "Physics",
        applications: ["App 1"],
      })).toThrow()
    })

    it("rejects empty applications", () => {
      expect(() => TechEntrySchema.parse({
        id: "tech-2",
        name: "Tech",
        nameEn: "Technology",
        icon: "⚡",
        color: "#FF0000",
        borderColor: "#CC0000",
        bgGlow: "rgba(255,0,0,0.1)",
        tag: "Tag",
        tagColor: "#FFF",
        physics: "Physics",
        applications: [],
      })).toThrow()
    })
  })

  /* ── FactionNodeSchema ── */
  describe("FactionNodeSchema", () => {
    it("accepts node with year and name", () => {
      const result = FactionNodeSchema.parse({ year: "E300", name: "Test Node" })
      expect(result.year).toBe("E300")
      expect(result.children).toBeUndefined()
    })

    it("accepts node with children", () => {
      const result = FactionNodeSchema.parse({ year: "E300", name: "Parent", children: ["c1", "c2"] })
      expect(result.children).toHaveLength(2)
    })
  })

  /* ── FactionTreeSchema ── */
  describe("FactionTreeSchema", () => {
    it("accepts valid faction tree", () => {
      const result = FactionTreeSchema.parse({
        name: "Test Faction",
        color: "#FF0000",
        dotColor: "#CC0000",
        textColor: "#FFF",
        description: "A test faction",
        keyMembers: ["Member 1"],
        alliances: "Test Alliance",
        nodes: [{ year: "E300", name: "Node" }],
      })
      expect(result.name).toBe("Test Faction")
    })

    it("rejects empty keyMembers", () => {
      expect(() => FactionTreeSchema.parse({
        name: "Test",
        color: "#FF0000",
        dotColor: "#CC0000",
        textColor: "#FFF",
        description: "Desc",
        keyMembers: [],
        alliances: "Alliance",
        nodes: [{ year: "E300", name: "Node" }],
      })).toThrow()
    })

    it("rejects empty nodes", () => {
      expect(() => FactionTreeSchema.parse({
        name: "Test",
        color: "#FF0000",
        dotColor: "#CC0000",
        textColor: "#FFF",
        description: "Desc",
        keyMembers: ["Member"],
        alliances: "Alliance",
        nodes: [],
      })).toThrow()
    })
  })

  /* ── StoryMetaSchema ── */
  describe("StoryMetaSchema", () => {
    it("accepts valid story meta", () => {
      const result = StoryMetaSchema.parse({
        slug: "test-story",
        title: "Test Story",
        titleJa: "テスト",
        label: "Label",
        fileName: "test.txt",
        fileNameAlt: "test_EN.txt",
        relatedEntries: ["entry-1"],
        chapter: 1,
        chapterOrder: 1,
        isEnSource: false,
      })
      expect(result.slug).toBe("test-story")
    })

    it("rejects invalid slug", () => {
      expect(() => StoryMetaSchema.parse({
        slug: "Invalid Slug!",
        title: "Story",
        titleJa: "ストーリー",
        label: "Label",
        fileName: "test.txt",
        fileNameAlt: "test_EN.txt",
        relatedEntries: [],
        chapter: 1,
        chapterOrder: 1,
        isEnSource: false,
      })).toThrow()
    })
  })

  /* ── ChapterMetaSchema ── */
  describe("ChapterMetaSchema", () => {
    it("accepts valid chapter meta", () => {
      const result = ChapterMetaSchema.parse({
        id: 1,
        titleJa: "テスト編",
        titleEn: "The Test",
        era: "E300",
        description: "A test chapter",
        descriptionEn: "A test chapter",
        color: "from-red-500",
        gradient: "linear-gradient(...)",
      })
      expect(result.id).toBe(1)
    })

    it("rejects zero id", () => {
      expect(() => ChapterMetaSchema.parse({
        id: 0,
        titleJa: "Test",
        titleEn: "Test",
        era: "E300",
        description: "Desc",
        descriptionEn: "Desc",
        color: "color",
        gradient: "grad",
      })).toThrow()
    })
  })

  /* ── RelationNodeSchema ── */
  describe("RelationNodeSchema", () => {
    it("accepts valid relation node", () => {
      const result = RelationNodeSchema.parse({
        id: "node-1",
        name: "Test Node",
        category: "キャラクター",
        description: "A test description",
      })
      expect(result.id).toBe("node-1")
    })

    it("accepts node with optional fields", () => {
      const result = RelationNodeSchema.parse({
        id: "node-2",
        name: "Node 2",
        nameEn: "Node 2 EN",
        category: "文明",
        tier: "S",
        image: "/test.png",
        description: "Desc",
        era: "E300",
        subCategory: "sub",
      })
      expect(result.tier).toBe("S")
    })

    it("rejects invalid category", () => {
      expect(() => RelationNodeSchema.parse({
        id: "n", name: "N", category: "invalid", description: "D",
      })).toThrow()
    })
  })

  /* ── RelationEdgeSchema ── */
  describe("RelationEdgeSchema", () => {
    it("accepts valid relation edge", () => {
      const result = RelationEdgeSchema.parse({
        source: "a",
        target: "b",
        type: "所属",
        description: "Desc",
      })
      expect(result.type).toBe("所属")
    })

    it("accepts all valid edge types", () => {
      for (const type of ["所属", "指導", "同盟", "対立", "関連", "歴史的"]) {
        const result = RelationEdgeSchema.parse({ source: "a", target: "b", type, description: "D" })
        expect(result.type).toBe(type)
      }
    })

    it("rejects invalid edge type", () => {
      expect(() => RelationEdgeSchema.parse({
        source: "a", target: "b", type: "invalid", description: "D",
      })).toThrow()
    })
  })

  /* ── IrisTimelineEntrySchema ── */
  describe("IrisTimelineEntrySchema", () => {
    it("accepts valid entry", () => {
      const result = IrisTimelineEntrySchema.parse({ year: "E300", event: "Event", loc: "Place" })
      expect(result.year).toBe("E300")
    })

    it("rejects empty fields", () => {
      expect(() => IrisTimelineEntrySchema.parse({ year: "", event: "", loc: "" })).toThrow()
    })
  })

  /* ── IrisAbilitySchema ── */
  describe("IrisAbilitySchema", () => {
    it("accepts valid ability", () => {
      const result = IrisAbilitySchema.parse({ name: "Power", desc: "A power", color: "#FF0000" })
      expect(result.name).toBe("Power")
    })
  })

  /* ── IrisRelationSchema ── */
  describe("IrisRelationSchema", () => {
    it("accepts valid relation", () => {
      const result = IrisRelationSchema.parse({ name: "Friend", note: "A friend", color: "#00FF00" })
      expect(result.name).toBe("Friend")
    })
  })

  /* ── MinaTimelineEntrySchema ── */
  describe("MinaTimelineEntrySchema", () => {
    it("accepts valid entry", () => {
      const result = MinaTimelineEntrySchema.parse({ age: "10", year: "E300", event: "Event" })
      expect(result.age).toBe("10")
    })
  })

  /* ── PlatformEntrySchema ── */
  describe("PlatformEntrySchema", () => {
    it("accepts all valid platform types", () => {
      for (const type of ["PORTAL", "SOCIAL", "ARCHIVE", "MUSIC", "VISUAL", "STORY"]) {
        const result = PlatformEntrySchema.parse({
          name: "Test", desc: "Desc", type, color: "#FFF", bg: "#000", url: "https://example.com",
        })
        expect(result.type).toBe(type)
      }
    })

    it("rejects invalid type", () => {
      expect(() => PlatformEntrySchema.parse({
        name: "T", desc: "D", type: "INVALID", color: "#FFF", bg: "#000", url: "https://x.com",
      })).toThrow()
    })
  })

  /* ── Shared Schema re-exports ── */
  describe("Shared schema re-exports", () => {
    it("shared AbilityTypeSchema works the same as card AbilityTypeSchema", () => {
      expect(SharedAbilityTypeSchema.parse("攻撃")).toBe(AbilityTypeSchema.parse("攻撃"))
    })

    it("shared RaritySchema works the same as card RaritySchema", () => {
      expect(SharedRaritySchema.parse("SR")).toBe(RaritySchema.parse("SR"))
    })

    it("shared CategorySchema works the same as wiki CategorySchema", () => {
      expect(SharedCategorySchema.parse("キャラクター")).toBe(CategorySchema.parse("キャラクター"))
    })

    it("shared EnemyDifficultySchema works the same", () => {
      expect(SharedEnemyDifficultySchema.parse("BOSS")).toBe(EnemyDifficultySchema.parse("BOSS"))
    })

    it("shared EnemyPhaseSchema works the same", () => {
      const shared = SharedEnemyPhaseSchema.parse({ triggerHpPercent: 50, message: "M", attackBonus: 0 })
      const orig = EnemyPhaseSchema.parse({ triggerHpPercent: 50, message: "M", attackBonus: 0 })
      expect(shared).toEqual(orig)
    })
  })
})
