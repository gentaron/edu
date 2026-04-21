import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type GameCard, type Enemy, type AbilityType } from "./card-data";

/* ═══════════════════════════════════════════════════════
   Deck Store — 構築画面用（localStorage永続化）
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
        set((s) => {
          const next = s.deck.filter((c) => c.id !== cardId);
          return { deck: next };
        }),

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
   Battle Store — バトル画面用
   ═══════════════════════════════════════════════════════ */

type BattlePhase = "idle" | "playerTurn" | "resolving" | "enemyTurn" | "victory" | "defeat";

interface BattleState {
  phase: BattlePhase;
  playerHp: number;
  playerMaxHp: number;
  shieldBuffer: number;
  selectedEnemy: Enemy | null;
  enemyHp: number;
  enemyCurrentPhase: number;
  turn: number;
  currentCardIndex: number;
  deckOrder: GameCard[];
  playerAbility: AbilityType | null;
  poisonActive: boolean;
  enemyAttackReduction: number;
  log: string[];

  startBattle: (enemy: Enemy, deck: GameCard[]) => void;
  playAbility: (ability: AbilityType) => void;
  checkPhaseTransition: () => void;
  executeEnemyTurn: () => void;
  resetBattle: () => void;
}

const PLAYER_MAX_HP = 30;

function addLog(
  setter: (fn: (s: BattleState) => Partial<BattleState>) => void,
  msg: string
) {
  setter((s) => ({ log: [...s.log.slice(-19), msg] }));
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
  currentCardIndex: 0,
  deckOrder: [],
  playerAbility: null,
  poisonActive: false,
  enemyAttackReduction: 0,
  log: [],

  startBattle: (enemy, deck) => {
    // 氷獄の守護者: 開始時HP-5
    const hpPenalty = enemy.id === "frost-guardian" ? 5 : 0;

    set({
      phase: "playerTurn",
      playerHp: PLAYER_MAX_HP - hpPenalty,
      playerMaxHp: PLAYER_MAX_HP,
      shieldBuffer: 0,
      selectedEnemy: enemy,
      enemyHp: enemy.maxHp,
      enemyCurrentPhase: 0,
      turn: 1,
      currentCardIndex: 0,
      deckOrder: [...deck],
      playerAbility: null,
      poisonActive: enemy.id === "venom-hydra",
      enemyAttackReduction: 0,
      log: [
        `⚔️ ${enemy.name} との戦闘開始！`,
        `— カード ${deck.length}/5 —`,
      ],
    });
  },

  playAbility: (ability) => {
    const s = get();
    if (s.phase !== "playerTurn") return;
    if (s.currentCardIndex >= s.deckOrder.length) return;

    const card = s.deckOrder[s.currentCardIndex];
    const enemy = s.selectedEnemy;
    if (!enemy) return;

    set({ phase: "resolving", playerAbility: ability });

    let newEnemyHp = s.enemyHp;
    let newPlayerHp = s.playerHp;
    let newShield = s.shieldBuffer;
    let newEnemyAttackReduction = s.enemyAttackReduction;
    let logMsg = "";

    const enemyId = enemy.id;
    const isVoidKingPhase3 = enemyId === "void-king" && s.enemyCurrentPhase >= 2;
    const isVoidKingPhase2Plus = enemyId === "void-king" && s.enemyCurrentPhase >= 1;

    switch (ability) {
      case "攻撃": {
        // Void King phase 3: only 必殺 can deal damage in final phase
        if (isVoidKingPhase3) {
          logMsg = `🎭 ${card.name}の攻撃…しかし虚無に吸収された！`;
        } else {
          newEnemyHp = Math.max(0, newEnemyHp - card.attack);
          logMsg = `⚔️ ${card.name}の攻撃！ 敵に${card.attack}ダメージ！`;
        }
        break;
      }

      case "防御": {
        // 深淵の大蜘蛛: 偶数ターンは防御不可
        if (enemyId === "void-spider" && s.turn % 2 === 0) {
          logMsg = `🚫 深淵の大蜘蛛の干渉で防御が封じられた！`;
        } else {
          let defValue = card.defense;
          // 鉄塊ゴーレム: 防御半減
          if (enemyId === "iron-golem") {
            defValue = Math.floor(defValue / 2);
            logMsg = `🛡️ ${card.name}の防御！ シールド+${defValue}（半減！）`;
          } else {
            logMsg = `🛡️ ${card.name}の防御！ シールド+${defValue}`;
          }
          newShield += defValue;
          // 炎の精霊王: 防御ごとに1ダメージ
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

        // Void King phase 3: only 必殺 can deal damage in final phase
        const canDamage = !isVoidKingPhase3;

        if (eff.includes("回復") && eff.includes("ダメージ") && eff.includes("シールド")) {
          // "HPをX回復＋シールド+Y" pattern (e.g., Casteria)
          const healVal = val;
          const shieldVal = Math.max(1, Math.floor(val * 0.7));
          if (canDamage) {
            // Some effects also have damage component
          }
          newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + healVal);
          newShield += shieldVal;
          logMsg = `✨ ${card.name}の${card.effect}！ HP${healVal}回復＋シールド+${shieldVal}`;
        } else if (eff.includes("ダメージ") && eff.includes("回復")) {
          const dmg = val;
          const heal = Math.max(1, Math.floor(val * 0.5));
          if (canDamage) {
            newEnemyHp = Math.max(0, newEnemyHp - dmg);
          }
          newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + heal);
          if (canDamage) {
            logMsg = `✨ ${card.name}の${card.effect}！ 敵に${dmg}ダメージ＋HP${heal}回復！`;
          } else {
            logMsg = `✨ ${card.name}の効果！ HP${heal}回復！（ダメージは吸収）`;
          }
        } else if (eff.includes("ダメージ") && eff.includes("シールド")) {
          const dmg = val;
          const shieldVal = Math.max(1, Math.floor(val * 0.7));
          if (canDamage) {
            newEnemyHp = Math.max(0, newEnemyHp - dmg);
          }
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
          newEnemyAttackReduction = Math.min(newEnemyAttackReduction + val, 8);
          logMsg = `✨ ${card.name}の${card.effect}！ 敵の攻撃力-${val}！`;
        } else if (eff.includes("次元ピラミッド")) {
          // Special: deals 5 damage + 3 heal
          if (canDamage) {
            newEnemyHp = Math.max(0, newEnemyHp - 5);
          }
          newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + 3);
          if (canDamage) {
            logMsg = `✨ 次元ピラミッド展開！ 敵に5ダメージ＋HP3回復！`;
          } else {
            logMsg = `✨ 次元ピラミッド展開！ HP3回復！（ダメージは吸収）`;
          }
        } else {
          // Fallback: heal
          newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + val);
          logMsg = `✨ ${card.name}の${card.effect}！ HP${val}回復！`;
        }
        break;
      }

      case "必殺": {
        let dmg = card.ultimate;
        // Void King phase 3: 必殺 deals 2x damage
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

    // Check victory
    if (newEnemyHp <= 0) {
      set((prev) => ({
        phase: "victory",
        enemyHp: 0,
        log: [
          ...prev.log,
          `🏆 ${prev.selectedEnemy!.name} を撃破！`,
          prev.selectedEnemy!.reward,
        ],
      }));
      return;
    }

    set({
      enemyHp: newEnemyHp,
      playerHp: newPlayerHp,
      shieldBuffer: newShield,
      enemyAttackReduction: newEnemyAttackReduction,
    });

    // Check phase transitions
    get().checkPhaseTransition();

    // Enemy turn after delay
    setTimeout(() => {
      get().executeEnemyTurn();
    }, 1000);
  },

  executeEnemyTurn: () => {
    const s = get();
    if (!s.selectedEnemy) return;
    if (s.phase === "victory" || s.phase === "defeat") return;

    const enemy = s.selectedEnemy;
    const hpPercent = (s.enemyHp / enemy.maxHp) * 100;

    set({ phase: "enemyTurn" });

    // Sum attack bonus from all active phases
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

    // 毒ダメージ
    if (s.poisonActive) {
      newPlayerHp = Math.max(0, newPlayerHp - 1);
      addLog(set, "☠️ 毒により1ダメージ！");
    }

    // 敵自己回復
    let newEnemyHp = s.enemyHp;
    for (const p of enemy.phases) {
      if (p.selfHealPerTurn && hpPercent <= p.triggerHpPercent) {
        newEnemyHp = Math.min(enemy.maxHp, newEnemyHp + p.selfHealPerTurn);
        addLog(set, `💚 ${enemy.name}が${p.selfHealPerTurn}HP回復！`);
      }
    }

    const nextCardIndex = s.currentCardIndex + 1;

    set({
      playerHp: newPlayerHp,
      enemyHp: newEnemyHp,
      shieldBuffer: 0,
      enemyAttackReduction: 0,
      currentCardIndex: nextCardIndex,
      playerAbility: null,
    });

    if (newPlayerHp <= 0) {
      set((prev) => ({
        phase: "defeat",
        log: [...prev.log, "💀 プレイヤーは倒された..."],
      }));
      return;
    }

    // Check if all cards used
    if (nextCardIndex >= s.deckOrder.length) {
      set((prev) => ({
        phase: "defeat",
        log: [...prev.log, "💀 カードが全て使い果たされた…"],
      }));
      return;
    }

    // Next turn
    const newTurn = s.turn + 1;
    const remaining = s.deckOrder.length - nextCardIndex;
    set({
      phase: "playerTurn",
      turn: newTurn,
    });
    addLog(set, `— ターン${newTurn} — 残り${remaining}枚`);
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

      // ヴォイドリーパー: フェーズ移行で3ダメージ
      if (s.selectedEnemy.id === "void-reaper") {
        const newHp = Math.max(0, s.playerHp - 3);
        addLog(set, `🌪️ 次元断絶の衝撃で3ダメージ！`);
        set({ playerHp: newHp });
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
      currentCardIndex: 0,
      deckOrder: [],
      playerAbility: null,
      poisonActive: false,
      enemyAttackReduction: 0,
      log: [],
    }),
}));
