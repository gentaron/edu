import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type GameCard, type Enemy, type AbilityType } from "./card-data";

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
          next.splice(toIndex, 0, moved);
          return { deck: next };
        }),
      clearDeck: () => set({ deck: [] }),
      setDeckName: (name) => set({ deckName: name }),
    }),
    { name: "edu-deck" }
  )
);

/* ═══════════════════════════════════════════════════════
   Field-based Battle Store
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
  playerHp: number;
  playerMaxHp: number;
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

const PLAYER_MAX_HP = 40;

function charMaxHp(card: GameCard): number {
  const base = card.rarity === "SR" ? 14 : card.rarity === "R" ? 10 : 8;
  return base + card.defense;
}

function addLog(
  setter: (fn: (s: BattleState) => Partial<BattleState>) => void,
  msg: string
) {
  setter((s) => ({ log: [...s.log.slice(-29), msg] }));
}

export const useBattleStore = create<BattleState>((set, get) => ({
  phase: "idle",
  playerHp: PLAYER_MAX_HP,
  playerMaxHp: PLAYER_MAX_HP,
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
    const hpPenalty = enemy.id === "frost-guardian" ? 5 : 0;
    const field: FieldChar[] = deck.map((c) => ({
      card: c,
      hp: charMaxHp(c),
      maxHp: charMaxHp(c),
      isDown: false,
    }));
    set({
      phase: "playerTurn",
      playerHp: PLAYER_MAX_HP - hpPenalty,
      playerMaxHp: PLAYER_MAX_HP,
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
      ],
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
    let newPlayerHp = s.playerHp;
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
            newPlayerHp = Math.max(0, newPlayerHp - 1);
            logMsg += " 🔥熱で1ダメージ！";
          }
        }
        break;
      }
      case "効果": {
        const eff = card.effect;
        const val = card.effectValue;
        const canDamage = !isVoidKingPhase3;
        if (eff.includes("回復") && eff.includes("ダメージ") && eff.includes("シールド")) {
          const healVal = val;
          const shieldVal = Math.max(1, Math.floor(val * 0.7));
          newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + healVal);
          newShield += shieldVal;
          logMsg = `✨ ${card.name}の${card.effect}！ HP${healVal}回復＋シールド+${shieldVal}`;
        } else if (eff.includes("ダメージ") && eff.includes("回復")) {
          const dmg = val;
          const heal = Math.max(1, Math.floor(val * 0.5));
          if (canDamage) newEnemyHp = Math.max(0, newEnemyHp - dmg);
          newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + heal);
          if (canDamage) {
            logMsg = `✨ ${card.name}の${card.effect}！ 敵に${dmg}ダメージ＋HP${heal}回復！`;
          } else {
            logMsg = `✨ ${card.name}の効果！ HP${heal}回復！（ダメージは吸収）`;
          }
        } else if (eff.includes("ダメージ") && eff.includes("シールド")) {
          const dmg = val;
          const shieldVal = Math.max(1, Math.floor(val * 0.7));
          if (canDamage) newEnemyHp = Math.max(0, newEnemyHp - dmg);
          newShield += shieldVal;
          if (canDamage) {
            logMsg = `✨ ${card.name}の${card.effect}！ 敵に${dmg}ダメージ＋シールド+${shieldVal}！`;
          } else {
            logMsg = `✨ ${card.name}の効果！ シールド+${shieldVal}！（ダメージは吸収）`;
          }
        } else if (eff.includes("回復")) {
          const heal = val;
          newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + heal);
          logMsg = `✨ ${card.name}の${card.effect}！ HP${heal}回復！`;
        } else if (eff.includes("ダメージ")) {
          const dmg = val;
          if (canDamage) {
            newEnemyHp = Math.max(0, newEnemyHp - dmg);
            logMsg = `✨ ${card.name}の${card.effect}！ 敵に${dmg}ダメージ！`;
          } else {
            logMsg = `✨ ${card.name}の効果…虚無に吸収された！`;
          }
        } else if (eff.includes("シールド")) {
          const shieldVal = val;
          newShield += shieldVal;
          logMsg = `✨ ${card.name}の${card.effect}！ シールド+${shieldVal}！`;
        } else if (eff.includes("低下")) {
          newEnemyAttackReduction = Math.min(newEnemyAttackReduction + val, 10);
          logMsg = `✨ ${card.name}の${card.effect}！ 敵の攻撃力-${val}！`;
        } else if (eff.includes("次元ピラミッド")) {
          if (canDamage) newEnemyHp = Math.max(0, newEnemyHp - 5);
          newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + 3);
          if (canDamage) {
            logMsg = `✨ 次元ピラミッド展開！ 敵に5ダメージ＋HP3回復！`;
          } else {
            logMsg = `✨ 次元ピラミッド展開！ HP3回復！（ダメージは吸収）`;
          }
        } else {
          newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + val);
          logMsg = `✨ ${card.name}の${card.effect}！ HP${val}回復！`;
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
      playerHp: newPlayerHp,
      shieldBuffer: newShield,
      enemyAttackReduction: newEnemyAttackReduction,
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

    let totalBonus = 0;
    for (const p of enemy.phases) {
      if (hpPercent <= p.triggerHpPercent) {
        totalBonus += p.attackBonus;
      }
    }

    const baseAttack = Math.max(0, enemy.attackPower + totalBonus - s.enemyAttackReduction);
    const damage = Math.max(0, baseAttack - s.shieldBuffer);
    addLog(set, `💥 ${enemy.name}の攻撃！ ${damage}ダメージ！`);

    let newPlayerHp = Math.max(0, s.playerHp - damage);

    if (s.poisonActive) {
      newPlayerHp = Math.max(0, newPlayerHp - 1);
      addLog(set, "☠️ 毒により1ダメージ！");
    }

    let newFieldChars = [...s.fieldCharacters];
    let hitCharIdx: number | null = null;

    function randomCharDamage(fieldChars: FieldChar[], dmg: number, emoji: string, msgPrefix: string) {
      const alive = fieldChars.filter((fc) => !fc.isDown);
      if (alive.length === 0) return fieldChars;
      const target = alive[Math.floor(Math.random() * alive.length)];
      const idx = fieldChars.findIndex((fc) => fc.card.id === target.card.id);
      const newHp = Math.max(0, target.hp - dmg);
      fieldChars[idx] = { ...target, hp: newHp, isDown: newHp <= 0 };
      hitCharIdx = idx;
      if (newHp <= 0) {
        addLog(set, `${emoji} ${msgPrefix}${target.card.name}を撃破！ ${target.card.name}は戦闘不能！`);
      } else {
        addLog(set, `${emoji} ${msgPrefix}${target.card.name}に${dmg}ダメージ！`);
      }
      return fieldChars;
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
        const target = remainingAlive[Math.floor(Math.random() * remainingAlive.length)];
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
        playerHp: newPlayerHp,
        enemyHp: newEnemyHp,
        shieldBuffer: 0,
        enemyAttackReduction: 0,
        fieldCharacters: newFieldChars,
        turn: newTurn,
        screenShake: false,
        charHitIndex: null,
      });

      const allDown = newFieldChars.every((fc) => fc.isDown);
      if (newPlayerHp <= 0 || allDown) {
        const reason = allDown && newPlayerHp > 0
          ? "味方が全員戦闘不能になった…"
          : "プレイヤーは倒された...";
        set((prev) => ({
          phase: "defeat",
          log: [...prev.log, `💀 ${reason}`],
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
      if (hpPercent <= s.selectedEnemy.phases[i].triggerHpPercent) {
        if (i >= newPhase) newPhase = i + 1;
      }
    }
    if (newPhase > s.enemyCurrentPhase) {
      addLog(set, `⚠️ ${s.selectedEnemy.phases[newPhase - 1].message}`);
      set({ enemyCurrentPhase: newPhase });
      if (s.selectedEnemy.id === "void-reaper") {
        const newHp = Math.max(0, s.playerHp - 4);
        addLog(set, `🌪️ 次元断絶の衝撃で4ダメージ！`);
        const aliveChars = get().fieldCharacters.filter((fc) => !fc.isDown);
        const updatedChars = [...get().fieldCharacters];
        if (aliveChars.length > 0) {
          const target = aliveChars[Math.floor(Math.random() * aliveChars.length)];
          const idx = updatedChars.findIndex((fc) => fc.card.id === target.card.id);
          const charHp = Math.max(0, target.hp - 3);
          updatedChars[idx] = { ...target, hp: charHp, isDown: charHp <= 0 };
          if (charHp <= 0) {
            addLog(set, `🌪️ 次元断絶が${target.card.name}を巻き込んだ！ ${target.card.name}は戦闘不能！`);
          } else {
            addLog(set, `🌪️ 次元断絶が${target.card.name}に3ダメージ！`);
          }
          set({ playerHp: newHp, fieldCharacters: updatedChars });
        } else {
          set({ playerHp: newHp });
        }
      }
    }
  },

  resetBattle: () =>
    set({
      phase: "idle",
      playerHp: PLAYER_MAX_HP,
      playerMaxHp: PLAYER_MAX_HP,
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
