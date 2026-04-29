import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type GameCard, type Enemy, type AbilityType } from "./card-data";
import { charMaxHp, calculateEffectDamage, calculateEnemyDamage } from "./battle-logic";

/* ═══════════════════════════════════════════════════════
   Deck Store
   ═══════════════════════════════════════════════════════ */

interface DeckState {
  deck: GameCard[];
  deckName: string;
  addCard: (card: GameCard) => void;
  removeCard: (cardId: string) => void;
  moveCard: (fromIndex: number, toIndex: number) => void;
  clearDeck: () => void;
  setDeckName: (name: string) => void;
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set) => ({
      deck: [],
      deckName: "マイデッキ",
      addCard: (card) =>
        set((s) => {
          const alreadyExists = s.deck.some((c) => c.id === card.id);
          if (s.deck.length >= 5 || alreadyExists) return s;
          return { deck: [...s.deck, card] };
        }),
      removeCard: (cardId) =>
        set((s) => ({
          deck: s.deck.filter((c) => c.id !== cardId),
        })),
      moveCard: (fromIndex, toIndex) =>
        set((s) => {
          if (fromIndex < 0 || fromIndex >= s.deck.length) return s;
          if (toIndex < 0 || toIndex >= s.deck.length) return s;
          const next = [...s.deck];
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved!);
          return { deck: next };
        }),
      clearDeck: () => set({ deck: [] }),
      setDeckName: (name) => set({ deckName: name }),
    }),
    { name: "edu-deck" }
  )
);

/* ═══════════════════════════════════════════════════════
   Field-based Battle Store — Individual Character HP
   ═══════════════════════════════════════════════════════ */

type BattlePhase =
  | "idle"
  | "playerTurn"
  | "resolving"
  | "enemyTurn"
  | "victory"
  | "defeat";

export interface FieldChar {
  card: GameCard;
  hp: number;
  maxHp: number;
  isDown: boolean;
}

interface BattleState {
  phase: BattlePhase;
  shieldBuffer: number;
  selectedEnemy: Enemy | null;
  enemyHp: number;
  enemyCurrentPhase: number;
  turn: number;
  fieldCharacters: FieldChar[];
  selectedCharIndex: number | null;
  playerAbility: AbilityType | null;
  poisonActive: boolean;
  enemyAttackReduction: number;
  log: string[];
  lastAbilityUsed: AbilityType | null;
  lastCharIndex: number | null;
  screenShake: boolean;
  enemyFlash: boolean;
  healFlash: boolean;
  shieldFlash: boolean;
  charHitIndex: number | null;

  startBattle: (enemy: Enemy, deck: GameCard[]) => void;
  selectCharacter: (index: number) => void;
  playAbility: (ability: AbilityType) => void;
  executeEnemyTurn: () => void;
  checkPhaseTransition: () => void;
  resetBattle: () => void;
}

function addLog(
  setter: (fn: (s: BattleState) => Partial<BattleState>) => void,
  msg: string
) {
  setter((s) => ({ log: [...s.log.slice(-29), msg] }));
}

/** Pick a random alive character and apply damage. Returns updated fieldChars + hitIndex. */
function hitRandomChar(
  fieldChars: FieldChar[],
  damage: number,
  setter: (fn: (s: BattleState) => Partial<BattleState>) => void,
  emoji: string,
  msgPrefix: string
): { fieldChars: FieldChar[]; hitIndex: number | null } {
  const alive = fieldChars.filter((fc) => !fc.isDown);
  if (alive.length === 0) return { fieldChars, hitIndex: null };
  const target = alive[Math.floor(Math.random() * alive.length)]!;
  const idx = fieldChars.findIndex((fc) => fc.card.id === target.card.id);
  const newHp = Math.max(0, target.hp - damage);
  const updated = [...fieldChars];
  updated[idx] = { ...target, hp: newHp, isDown: newHp <= 0 };
  if (newHp <= 0) {
    addLog(setter, `${emoji} ${msgPrefix}${target.card.name}を撃破！ ${target.card.name}は戦闘不能！`);
  } else {
    addLog(setter, `${emoji} ${msgPrefix}${target.card.name}に${damage}ダメージ！`);
  }
  return { fieldChars: updated, hitIndex: idx };
}

export const useBattleStore = create<BattleState>((set, get) => ({
  phase: "idle",
  shieldBuffer: 0,
  selectedEnemy: null,
  enemyHp: 0,
  enemyCurrentPhase: 0,
  turn: 0,
  fieldCharacters: [],
  selectedCharIndex: null,
  playerAbility: null,
  poisonActive: false,
  enemyAttackReduction: 0,
  log: [],
  lastAbilityUsed: null,
  lastCharIndex: null,
  screenShake: false,
  enemyFlash: false,
  healFlash: false,
  shieldFlash: false,
  charHitIndex: null,

  startBattle: (enemy, deck) => {
    const field: FieldChar[] = deck.map((c) => {
      let hp = charMaxHp(c);
      // Frost guardian: reduce each character by 1 HP at start
      if (enemy.id === "frost-guardian") {
        hp = Math.max(1, hp - 1);
      }
      return { card: c, hp, maxHp: charMaxHp(c), isDown: false };
    });
    set({
      phase: "playerTurn",
      shieldBuffer: 0,
      selectedEnemy: enemy,
      enemyHp: enemy.maxHp,
      enemyCurrentPhase: 0,
      turn: 1,
      fieldCharacters: field,
      selectedCharIndex: null,
      playerAbility: null,
      poisonActive: enemy.id === "venom-hydra",
      enemyAttackReduction: 0,
      log: [
        `⚔️ ${enemy.name} との戦闘開始！`,
        `— 5体の味方がフィールドに出撃！ —`,
        enemy.id === "frost-guardian" ? "❄️ 絶対零度の冷気が味方全体を襲う！全員に1ダメージ！" : "",
      ].filter(Boolean),
      lastAbilityUsed: null,
      lastCharIndex: null,
      screenShake: false,
      enemyFlash: false,
      healFlash: false,
      shieldFlash: false,
      charHitIndex: null,
    });
  },

  selectCharacter: (index) => {
    const s = get();
    if (s.phase !== "playerTurn") return;
    const fc = s.fieldCharacters[index];
    if (!fc || fc.isDown) return;
    set({ selectedCharIndex: index });
  },

  playAbility: (ability) => {
    const s = get();
    if (s.phase !== "playerTurn") return;
    if (s.selectedCharIndex === null) return;
    const fc = s.fieldCharacters[s.selectedCharIndex];
    if (!fc || fc.isDown) return;
    const card = fc.card;
    const enemy = s.selectedEnemy;
    if (!enemy) return;

    // Working copy of field characters (for healing)
    let newFieldChars = s.fieldCharacters.map((c) => ({ ...c }));
    const selIdx = s.selectedCharIndex;

    set({
      phase: "resolving",
      playerAbility: ability,
      lastAbilityUsed: ability,
      lastCharIndex: s.selectedCharIndex,
      screenShake: ability === "必殺",
      enemyFlash: ability === "攻撃" || ability === "必殺",
      healFlash: ability === "効果" && card.effect.includes("回復"),
      shieldFlash: ability === "防御" || (ability === "効果" && card.effect.includes("シールド")),
      charHitIndex: null,
    });

    let newEnemyHp = s.enemyHp;
    let newShield = s.shieldBuffer;
    let newEnemyAttackReduction = s.enemyAttackReduction;
    let logMsg = "";
    const enemyId = enemy.id;
    const isVoidKingPhase3 = enemyId === "void-king" && s.enemyCurrentPhase >= 3;

    switch (ability) {
      case "攻撃": {
        if (isVoidKingPhase3) {
          logMsg = `🎭 ${card.name}の攻撃…しかし虚無に吸収された！`;
        } else {
          newEnemyHp = Math.max(0, newEnemyHp - card.attack);
          logMsg = `⚔️ ${card.name}の攻撃！ 敵に${card.attack}ダメージ！`;
        }
        break;
      }
      case "防御": {
        if (enemyId === "void-spider" && s.turn % 2 === 0) {
          logMsg = `🚫 深淵の大蜘蛛の干渉で防御が封じられた！`;
        } else {
          let defValue = card.defense;
          if (enemyId === "iron-golem") {
            defValue = Math.floor(defValue / 2);
            logMsg = `🛡️ ${card.name}の防御！ シールド+${defValue}（半減！）`;
          } else {
            logMsg = `🛡️ ${card.name}の防御！ シールド+${defValue}`;
          }
          newShield += defValue;
          if (enemyId === "flame-spirit") {
            // Self-damage goes to selected character
            const selChar = newFieldChars[selIdx]!;
            const newHp = Math.max(0, selChar.hp - 1);
            newFieldChars[selIdx] = { ...selChar, hp: newHp, isDown: newHp <= 0 };
            logMsg += ` 🔥熱で${card.name}に1ダメージ！`;
          }
        }
        break;
      }
      case "効果": {
        const result = calculateEffectDamage(
          card.effect, card.effectValue, card.name, enemyId, isVoidKingPhase3
        );
        newEnemyHp = Math.max(0, newEnemyHp - result.damage);
        newShield += result.shield;
        newEnemyAttackReduction = Math.min(newEnemyAttackReduction + result.attackReduction, 10);
        logMsg = result.log;

        // Apply healing to selected character
        if (result.heal > 0) {
          const selChar = newFieldChars[selIdx]!;
          const newHp = Math.min(selChar.maxHp, selChar.hp + result.heal);
          newFieldChars[selIdx] = { ...selChar, hp: newHp, isDown: false };
        }
        break;
      }
      case "必殺": {
        let dmg = card.ultimate;
        if (isVoidKingPhase3) {
          dmg *= 2;
          logMsg = `💥 ${card.ultimateName}！！ 必殺ダメージ2倍で${dmg}ダメージ！！`;
        } else {
          logMsg = `💥 ${card.ultimateName}！！ ${dmg}ダメージ！！`;
        }
        newEnemyHp = Math.max(0, newEnemyHp - dmg);
        break;
      }
    }

    addLog(set, logMsg);

    if (newEnemyHp <= 0) {
      setTimeout(() => {
        set((prev) => ({
          phase: "victory",
          enemyHp: 0,
          fieldCharacters: newFieldChars,
          screenShake: false,
          enemyFlash: false,
          healFlash: false,
          shieldFlash: false,
          charHitIndex: null,
          log: [...prev.log, `🏆 ${prev.selectedEnemy!.name} を撃破！`, prev.selectedEnemy!.reward],
        }));
      }, 800);
      return;
    }

    set({
      enemyHp: newEnemyHp,
      shieldBuffer: newShield,
      enemyAttackReduction: newEnemyAttackReduction,
      fieldCharacters: newFieldChars,
    });
    get().checkPhaseTransition();

    setTimeout(() => {
      set({ screenShake: false, enemyFlash: false, healFlash: false, shieldFlash: false });
      get().executeEnemyTurn();
    }, 1200);
  },

  executeEnemyTurn: () => {
    const s = get();
    if (!s.selectedEnemy) return;
    if (s.phase === "victory" || s.phase === "defeat") return;

    const enemy = s.selectedEnemy;
    const hpPercent = (s.enemyHp / enemy.maxHp) * 100;

    set({
      phase: "enemyTurn",
      screenShake: true,
      selectedCharIndex: null,
      playerAbility: null,
      charHitIndex: null,
    });

    // Calculate enemy base damage using pure function
    const { damage: effectiveDamage } = calculateEnemyDamage(
      enemy, s.enemyHp, s.shieldBuffer, s.enemyAttackReduction
    );
    addLog(set, `💥 ${enemy.name}の攻撃！ ${effectiveDamage}ダメージ！`);

    // Main attack → random alive character
    let newFieldChars = [...s.fieldCharacters];
    let hitCharIdx: number | null = null;
    if (effectiveDamage > 0) {
      const alive = newFieldChars.filter((fc) => !fc.isDown);
      if (alive.length > 0) {
        const target = alive[Math.floor(Math.random() * alive.length)]!;
        const idx = newFieldChars.findIndex((fc) => fc.card.id === target.card.id);
        if (idx !== -1) {
          const newHp = Math.max(0, target.hp - effectiveDamage);
          newFieldChars[idx] = { ...target, hp: newHp, isDown: newHp <= 0 };
          hitCharIdx = idx;
          if (newHp <= 0) {
            addLog(set, `💀 ${target.card.name}は戦闘不能になった！`);
          } else {
            addLog(set, `💥 ${target.card.name}に${effectiveDamage}ダメージ！`);
          }
        }
      }
    }

    // Poison damage → random alive character
    if (s.poisonActive) {
      const alive = newFieldChars.filter((fc) => !fc.isDown);
      if (alive.length > 0) {
        const target = alive[Math.floor(Math.random() * alive.length)]!;
        const idx = newFieldChars.findIndex((fc) => fc.card.id === target.card.id);
        if (idx !== -1) {
          const newHp = Math.max(0, target.hp - 1);
          newFieldChars[idx] = { ...target, hp: newHp, isDown: newHp <= 0 };
          hitCharIdx = idx;
          if (newHp <= 0) {
            addLog(set, `☠️ 毒により${target.card.name}が戦闘不能！`);
          } else {
            addLog(set, `☠️ 毒により${target.card.name}に1ダメージ！`);
          }
        }
      }
    }

    // Enemy-specific special abilities targeting characters
    function randomCharDamage(fieldChars: FieldChar[], dmg: number, emoji: string, msgPrefix: string) {
      const result = hitRandomChar(fieldChars, dmg, set, emoji, msgPrefix);
      if (result.hitIndex !== null) hitCharIdx = result.hitIndex;
      return result.fieldChars;
    }

    const enemyHpPct = (s.enemyHp / enemy.maxHp) * 100;
    if (enemy.id === "frost-guardian" && enemyHpPct <= 50 && s.turn % 2 === 0) {
      newFieldChars = randomCharDamage(newFieldChars, 3, "❄️", "絶対零度の冷気が");
    }
    if (enemy.id === "flame-spirit" && enemyHpPct <= 50) {
      newFieldChars = randomCharDamage(newFieldChars, 2, "🔥", "業火が");
    }
    if (enemy.id === "void-spider" && enemyHpPct <= 40 && s.turn % 2 === 1) {
      newFieldChars = randomCharDamage(newFieldChars, 2, "🕸️", "捕縛糸が");
    }
    if (enemy.id === "fallen-angel" && enemyHpPct <= 50) {
      newFieldChars = randomCharDamage(newFieldChars, 2, "✝️", "裁きの光が");
    }
    if (enemy.id === "void-reaper" && s.enemyCurrentPhase >= 2) {
      newFieldChars = randomCharDamage(newFieldChars, 3, "🌪️", "時空の刃が");
    }
    if (enemy.id === "void-reaper" && enemyHpPct <= 50) {
      newFieldChars = randomCharDamage(newFieldChars, 2, "🌪️", "虚無の刃が");
    }
    if (enemy.id === "void-king" && s.enemyCurrentPhase >= 1) {
      const alive = newFieldChars.filter((fc) => !fc.isDown);
      const targets = Math.min(alive.length, s.enemyCurrentPhase);
      for (let i = 0; i < targets; i++) {
        const remainingAlive = newFieldChars.filter((fc) => !fc.isDown);
        if (remainingAlive.length === 0) break;
        const target = remainingAlive[Math.floor(Math.random() * remainingAlive.length)]!;
        const idx = newFieldChars.findIndex((fc) => fc.card.id === target.card.id);
        if (idx === -1) continue;
        const dmg = 2 + s.enemyCurrentPhase;
        const newHp = Math.max(0, target.hp - dmg);
        newFieldChars[idx] = { ...target, hp: newHp, isDown: newHp <= 0 };
        hitCharIdx = idx;
        if (newHp <= 0) {
          addLog(set, `🌀 虚無の波が${target.card.name}を飲み込んだ！ ${target.card.name}は戦闘不能！`);
        } else {
          addLog(set, `🌀 虚無の波が${target.card.name}に${dmg}ダメージ！`);
        }
      }
    }
    if (enemy.id === "void-king" && enemyHpPct <= 45) {
      newFieldChars = randomCharDamage(newFieldChars, 3, "🌀", "存在の侵食が");
    }

    // Enemy self-heal
    let newEnemyHp = s.enemyHp;
    for (const p of enemy.phases) {
      if (p.selfHealPerTurn && hpPercent <= p.triggerHpPercent) {
        newEnemyHp = Math.min(enemy.maxHp, newEnemyHp + p.selfHealPerTurn);
        addLog(set, `💚 ${enemy.name}が${p.selfHealPerTurn}HP回復！`);
      }
    }

    const newTurn = s.turn + 1;

    setTimeout(() => {
      set({
        enemyHp: newEnemyHp,
        shieldBuffer: 0,
        enemyAttackReduction: 0,
        fieldCharacters: newFieldChars,
        turn: newTurn,
        screenShake: false,
        charHitIndex: hitCharIdx,
      });

      // Defeat condition: all characters down
      const allDown = newFieldChars.every((fc) => fc.isDown);
      if (allDown) {
        set((prev) => ({
          phase: "defeat",
          log: [...prev.log, `💀 味方が全員戦闘不能になった…`],
        }));
        return;
      }

      set({ phase: "playerTurn" });
      addLog(set, `— ターン${newTurn} —`);
    }, 1000);
  },

  checkPhaseTransition: () => {
    const s = get();
    if (!s.selectedEnemy) return;
    const hpPercent = (s.enemyHp / s.selectedEnemy.maxHp) * 100;
    let newPhase = 0;
    for (let i = s.selectedEnemy.phases.length - 1; i >= 0; i--) {
      if (hpPercent <= s.selectedEnemy.phases[i]!.triggerHpPercent) {
        if (i >= newPhase) newPhase = i + 1;
      }
    }
    if (newPhase > s.enemyCurrentPhase) {
      addLog(set, `⚠️ ${s.selectedEnemy.phases[newPhase - 1]!.message}`);
      set({ enemyCurrentPhase: newPhase });
      if (s.selectedEnemy.id === "void-reaper") {
        // Phase transition damage → random character (previously was playerHp)
        const updatedChars = [...get().fieldCharacters];
        const aliveChars = updatedChars.filter((fc) => !fc.isDown);
        if (aliveChars.length > 0) {
          const target = aliveChars[Math.floor(Math.random() * aliveChars.length)]!;
          const idx = updatedChars.findIndex((fc) => fc.card.id === target.card.id);
          const charHp = Math.max(0, target.hp - 4);
          updatedChars[idx] = { ...target, hp: charHp, isDown: charHp <= 0 };
          addLog(set, `🌪️ 次元断絶の衝撃で${target.card.name}に4ダメージ！`);
          if (charHp <= 0) {
            addLog(set, `🌪️ ${target.card.name}は次元断絶に飲み込まれた！`);
          }
          // Additional 3 damage to another character
          const remainingAlive = updatedChars.filter((fc) => !fc.isDown);
          if (remainingAlive.length > 0) {
            const target2 = remainingAlive[Math.floor(Math.random() * remainingAlive.length)]!;
            const idx2 = updatedChars.findIndex((fc) => fc.card.id === target2.card.id);
            const charHp2 = Math.max(0, target2.hp - 3);
            updatedChars[idx2] = { ...target2, hp: charHp2, isDown: charHp2 <= 0 };
            if (charHp2 <= 0) {
              addLog(set, `🌪️ 次元断絶が${target2.card.name}を巻き込んだ！ ${target2.card.name}は戦闘不能！`);
            } else {
              addLog(set, `🌪️ 次元断絶が${target2.card.name}に3ダメージ！`);
            }
          }
          set({ fieldCharacters: updatedChars });
        }
      }
    }
  },

  resetBattle: () =>
    set({
      phase: "idle",
      shieldBuffer: 0,
      selectedEnemy: null,
      enemyHp: 0,
      enemyCurrentPhase: 0,
      turn: 0,
      fieldCharacters: [],
      selectedCharIndex: null,
      playerAbility: null,
      poisonActive: false,
      enemyAttackReduction: 0,
      log: [],
      lastAbilityUsed: null,
      lastCharIndex: null,
      screenShake: false,
      enemyFlash: false,
      healFlash: false,
      shieldFlash: false,
      charHitIndex: null,
    }),
}));
