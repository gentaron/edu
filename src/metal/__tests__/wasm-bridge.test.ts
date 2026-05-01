import { describe, it, expect, beforeEach } from "vitest"
import {
  abilityTypeToIndex,
  indexToAbilityType,
  isWasmReady,
  resetWasmEngine,
  wasmCalculateDamage,
  wasmExecuteEnemyTurn,
  wasmCheckPhaseTransition,
  wasmSimulateBattle,
  __injectWasmModuleForTesting,
} from "@/metal/wasm-bridge"
import type { WasmBattleModule } from "@/metal/wasm-bridge"

describe("WASM Bridge", () => {
  beforeEach(() => {
    resetWasmEngine()
  })

  /* ── abilityTypeToIndex ── */
  describe("abilityTypeToIndex", () => {
    it("maps 攻撃 to 0", () => {
      expect(abilityTypeToIndex("攻撃")).toBe(0)
    })

    it("maps 防御 to 1", () => {
      expect(abilityTypeToIndex("防御")).toBe(1)
    })

    it("maps 効果 to 2", () => {
      expect(abilityTypeToIndex("効果")).toBe(2)
    })

    it("maps 必殺 to 3", () => {
      expect(abilityTypeToIndex("必殺")).toBe(3)
    })

    it("maps all ability types to unique indices", () => {
      const indices = ["攻撃", "防御", "効果", "必殺"].map(abilityTypeToIndex)
      expect(new Set(indices).size).toBe(4)
    })
  })

  /* ── indexToAbilityType ── */
  describe("indexToAbilityType", () => {
    it("maps 0 to 攻撃", () => {
      expect(indexToAbilityType(0)).toBe("攻撃")
    })

    it("maps 1 to 防御", () => {
      expect(indexToAbilityType(1)).toBe("防御")
    })

    it("maps 2 to 効果", () => {
      expect(indexToAbilityType(2)).toBe("効果")
    })

    it("maps 3 to 必殺", () => {
      expect(indexToAbilityType(3)).toBe("必殺")
    })

    it("returns null for out-of-range index (negative)", () => {
      expect(indexToAbilityType(-1)).toBeNull()
    })

    it("returns null for out-of-range index (4+)", () => {
      expect(indexToAbilityType(4)).toBeNull()
      expect(indexToAbilityType(100)).toBeNull()
    })
  })

  /* ── Roundtrip consistency ── */
  describe("ability type roundtrip", () => {
    it("abilityTypeToIndex -> indexToAbilityType is identity", () => {
      const types = ["攻撃", "防御", "効果", "必殺"] as const
      for (const type of types) {
        const idx = abilityTypeToIndex(type)
        expect(indexToAbilityType(idx)).toBe(type)
      }
    })
  })

  /* ── isWasmReady ── */
  describe("isWasmReady", () => {
    it("returns false initially", () => {
      expect(isWasmReady()).toBe(false)
    })

    it("returns true after injecting mock module", () => {
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn(),
        simulate_battle_wasm: vi.fn(),
      }
      __injectWasmModuleForTesting(mockModule)
      expect(isWasmReady()).toBe(true)
    })

    it("returns false after reset", () => {
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn(),
        simulate_battle_wasm: vi.fn(),
      }
      __injectWasmModuleForTesting(mockModule)
      expect(isWasmReady()).toBe(true)
      resetWasmEngine()
      expect(isWasmReady()).toBe(false)
    })
  })

  /* ── wasmCalculateDamage (with injected mock) ── */
  describe("wasmCalculateDamage", () => {
    it("returns null when WASM is not ready", () => {
      resetWasmEngine()
      const result = wasmCalculateDamage({
        character: {
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
        },
        ability: "攻撃",
      })
      expect(result).toBeNull()
    })

    it("returns result from injected WASM module", () => {
      const mockResult = { damage: 10, heal: 0, shield: 0, attack_reduction: 0, log: "10 damage!" }
      const mockModule = {
        calculate_damage_wasm: vi.fn().mockReturnValue(mockResult),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn(),
        simulate_battle_wasm: vi.fn(),
      } as unknown as WasmBattleModule
      __injectWasmModuleForTesting(mockModule)

      const result = wasmCalculateDamage({
        character: {
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
        },
        ability: "攻撃",
      })
      expect(result).toEqual(mockResult)
      expect(mockModule.calculate_damage_wasm).toHaveBeenCalled()
    })

    it("returns null when WASM throws an error", () => {
      const mockModule = {
        calculate_damage_wasm: vi.fn().mockImplementation(() => {
          throw new Error("WASM error")
        }),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn(),
        simulate_battle_wasm: vi.fn(),
      } as unknown as WasmBattleModule
      __injectWasmModuleForTesting(mockModule)

      // Suppress console.warn during test
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      const result = wasmCalculateDamage({
        character: {
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
        },
        ability: "攻撃",
      })
      expect(result).toBeNull()
      warnSpy.mockRestore()
    })
  })

  /* ── wasmExecuteEnemyTurn ── */
  describe("wasmExecuteEnemyTurn", () => {
    it("returns null when WASM is not ready", () => {
      resetWasmEngine()
      const result = wasmExecuteEnemyTurn({
        turn: 1,
        enemyHp: 100,
        enemyMaxHp: 200,
        enemyPhase: 0,
        shieldBuffer: 0,
        field: [],
        enemy: {
          id: "enemy-1",
          name: "Test Enemy",
          title: "Tester",
          maxHp: 200,
          attackPower: 10,
          imageUrl: "/enemy.png",
          description: "Desc",
          difficulty: "NORMAL",
          reward: "Reward",
          phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
        },
        poisonActive: false,
        enemyAttackReduction: 0,
      })
      expect(result).toBeNull()
    })

    it("returns result from injected WASM module", () => {
      const mockResult = { updated_field: [], new_enemy_hp: 90, logs: ["Enemy attacks!"] }
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn().mockReturnValue(mockResult),
        check_phase_transition_wasm: vi.fn(),
        simulate_battle_wasm: vi.fn(),
      } as unknown as WasmBattleModule
      __injectWasmModuleForTesting(mockModule)

      const result = wasmExecuteEnemyTurn({
        turn: 1,
        enemyHp: 100,
        enemyMaxHp: 200,
        enemyPhase: 0,
        shieldBuffer: 0,
        field: [],
        enemy: {
          id: "enemy-1",
          name: "Test Enemy",
          title: "Tester",
          maxHp: 200,
          attackPower: 10,
          imageUrl: "/enemy.png",
          description: "Desc",
          difficulty: "NORMAL",
          reward: "Reward",
          phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
        },
        poisonActive: false,
        enemyAttackReduction: 0,
      })
      expect(result).toEqual(mockResult)
    })

    it("returns null when WASM throws", () => {
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn().mockImplementation(() => {
          throw new Error("WASM error")
        }),
        check_phase_transition_wasm: vi.fn(),
        simulate_battle_wasm: vi.fn(),
      } as unknown as WasmBattleModule
      __injectWasmModuleForTesting(mockModule)

      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
      const result = wasmExecuteEnemyTurn({
        turn: 1,
        enemyHp: 100,
        enemyMaxHp: 200,
        enemyPhase: 0,
        shieldBuffer: 0,
        field: [],
        enemy: {
          id: "enemy-1",
          name: "Test Enemy",
          title: "Tester",
          maxHp: 200,
          attackPower: 10,
          imageUrl: "/enemy.png",
          description: "Desc",
          difficulty: "NORMAL",
          reward: "Reward",
          phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
        },
        poisonActive: false,
        enemyAttackReduction: 0,
      })
      expect(result).toBeNull()
      warnSpy.mockRestore()
    })
  })

  /* ── wasmCheckPhaseTransition ── */
  describe("wasmCheckPhaseTransition", () => {
    it("returns null when WASM is not ready", () => {
      resetWasmEngine()
      const result = wasmCheckPhaseTransition({
        enemyHp: 50,
        enemyMaxHp: 100,
        enemyPhase: 0,
        enemy: {
          id: "enemy-1",
          name: "Test Enemy",
          title: "Tester",
          maxHp: 100,
          attackPower: 10,
          imageUrl: "/enemy.png",
          description: "Desc",
          difficulty: "NORMAL",
          reward: "Reward",
          phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
        },
      })
      expect(result).toBeNull()
    })

    it("returns transition message from WASM", () => {
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn().mockReturnValue("Phase transition!"),
        simulate_battle_wasm: vi.fn(),
      } as unknown as WasmBattleModule
      __injectWasmModuleForTesting(mockModule)

      const result = wasmCheckPhaseTransition({
        enemyHp: 50,
        enemyMaxHp: 100,
        enemyPhase: 0,
        enemy: {
          id: "enemy-1",
          name: "Test Enemy",
          title: "Tester",
          maxHp: 100,
          attackPower: 10,
          imageUrl: "/enemy.png",
          description: "Desc",
          difficulty: "NORMAL",
          reward: "Reward",
          phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
        },
      })
      expect(result).toBe("Phase transition!")
    })

    it("returns null when WASM returns null (no transition)", () => {
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn().mockReturnValue(null),
        simulate_battle_wasm: vi.fn(),
      } as unknown as WasmBattleModule
      __injectWasmModuleForTesting(mockModule)

      const result = wasmCheckPhaseTransition({
        enemyHp: 90,
        enemyMaxHp: 100,
        enemyPhase: 0,
        enemy: {
          id: "enemy-1",
          name: "Test Enemy",
          title: "Tester",
          maxHp: 100,
          attackPower: 10,
          imageUrl: "/enemy.png",
          description: "Desc",
          difficulty: "NORMAL",
          reward: "Reward",
          phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
        },
      })
      expect(result).toBeNull()
    })

    it("returns null when WASM throws", () => {
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn().mockImplementation(() => {
          throw new Error("WASM error")
        }),
        simulate_battle_wasm: vi.fn(),
      } as unknown as WasmBattleModule
      __injectWasmModuleForTesting(mockModule)

      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
      const result = wasmCheckPhaseTransition({
        enemyHp: 50,
        enemyMaxHp: 100,
        enemyPhase: 0,
        enemy: {
          id: "enemy-1",
          name: "Test Enemy",
          title: "Tester",
          maxHp: 100,
          attackPower: 10,
          imageUrl: "/enemy.png",
          description: "Desc",
          difficulty: "NORMAL",
          reward: "Reward",
          phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
        },
      })
      expect(result).toBeNull()
      warnSpy.mockRestore()
    })
  })

  /* ── wasmSimulateBattle ── */
  describe("wasmSimulateBattle", () => {
    it("returns null when WASM is not ready", () => {
      resetWasmEngine()
      const result = wasmSimulateBattle([], {
        id: "enemy-1",
        name: "Test",
        title: "Tester",
        maxHp: 100,
        attackPower: 10,
        imageUrl: "/enemy.png",
        description: "Desc",
        difficulty: "NORMAL",
        reward: "Reward",
        phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
      })
      expect(result).toBeNull()
    })

    it("returns simulation result from injected WASM module", () => {
      const mockResult = { victory: true, turns: 5, final_enemy_hp: 0, survivors: 3 }
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn(),
        simulate_battle_wasm: vi.fn().mockReturnValue(mockResult),
      } as unknown as WasmBattleModule
      __injectWasmModuleForTesting(mockModule)

      const result = wasmSimulateBattle([], {
        id: "enemy-1",
        name: "Test",
        title: "Tester",
        maxHp: 100,
        attackPower: 10,
        imageUrl: "/enemy.png",
        description: "Desc",
        difficulty: "NORMAL",
        reward: "Reward",
        phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
      })
      expect(result).toEqual(mockResult)
    })

    it("returns null when WASM throws", () => {
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn(),
        simulate_battle_wasm: vi.fn().mockImplementation(() => {
          throw new Error("WASM error")
        }),
      } as unknown as WasmBattleModule
      __injectWasmModuleForTesting(mockModule)

      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
      const result = wasmSimulateBattle([], {
        id: "enemy-1",
        name: "Test",
        title: "Tester",
        maxHp: 100,
        attackPower: 10,
        imageUrl: "/enemy.png",
        description: "Desc",
        difficulty: "NORMAL",
        reward: "Reward",
        phases: [{ triggerHpPercent: 50, message: "Phase 2", attackBonus: 10 }],
      })
      expect(result).toBeNull()
      warnSpy.mockRestore()
    })
  })

  /* ── resetWasmEngine ── */
  describe("resetWasmEngine", () => {
    it("resets WASM module state", () => {
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn(),
        simulate_battle_wasm: vi.fn(),
      }
      __injectWasmModuleForTesting(mockModule)
      expect(isWasmReady()).toBe(true)

      resetWasmEngine()
      expect(isWasmReady()).toBe(false)
    })
  })

  /* ── __injectWasmModuleForTesting ── */
  describe("__injectWasmModuleForTesting", () => {
    it("sets the internal WASM module", () => {
      const mockModule = {
        calculate_damage_wasm: vi.fn(),
        execute_enemy_turn_wasm: vi.fn(),
        check_phase_transition_wasm: vi.fn(),
        simulate_battle_wasm: vi.fn(),
      }
      __injectWasmModuleForTesting(mockModule)
      expect(isWasmReady()).toBe(true)
    })
  })
})
