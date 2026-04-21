import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameCard, Enemy } from "./card-data";

/* ═══════════════════════════════════════════════════════
   Deck Store — 構築画面用（localStorage永続化）
   ═══════════════════════════════════════════════════════ */

interface DeckState {
  deck: GameCard[];
  deckName: string;
  addCard: (card: GameCard) => void;
  removeCard: (cardId: string) => void;
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
          const sameCount = s.deck.filter((c) => c.id === card.id).length;
          if (s.deck.length >= 20 || sameCount >= 2) return s;
          return { deck: [...s.deck, card] };
        }),

      removeCard: (cardId) =>
        set((s) => {
          const idx = s.deck.findIndex((c) => c.id === cardId);
          if (idx === -1) return s;
          const next = [...s.deck];
          next.splice(idx, 1);
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

type BattlePhase = "idle" | "main" | "enemy" | "victory" | "defeat";

interface BattleState {
  phase: BattlePhase;
  playerHp: number;
  playerMaxHp: number;
  playerMana: number;
  shieldBuffer: number;
  hand: GameCard[];
  battleDeck: GameCard[];
  discard: GameCard[];
  field: GameCard[];
  selectedEnemy: Enemy | null;
  enemyHp: number;
  enemyCurrentPhase: number;
  turn: number;
  cardsPlayedThisTurn: number;
  poisonActive: boolean;
  log: string[];

  startBattle: (enemy: Enemy, deck: GameCard[]) => void;
  drawCard: () => void;
  playCard: (cardId: string) => void;
  endTurn: () => void;
  resetBattle: () => void;
}

const PLAYER_MAX_HP = 30;
const MAX_HAND = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function addLog(
  setter: (fn: (s: BattleState) => Partial<BattleState>) => void,
  msg: string
) {
  setter((s) => ({ log: [...s.log.slice(-9), msg] }));
}

export const useBattleStore = create<BattleState>((set, get) => ({
  phase: "idle",
  playerHp: PLAYER_MAX_HP,
  playerMaxHp: PLAYER_MAX_HP,
  playerMana: 0,
  shieldBuffer: 0,
  hand: [],
  battleDeck: [],
  discard: [],
  field: [],
  selectedEnemy: null,
  enemyHp: 0,
  enemyCurrentPhase: 0,
  turn: 0,
  cardsPlayedThisTurn: 0,
  poisonActive: false,
  log: [],

  startBattle: (enemy, deck) => {
    const shuffled = shuffle([...deck]);
    const isFrost = enemy.id === "frost-guardian";
    const initialDraw = isFrost ? 1 : 3;
    const hand = shuffled.slice(0, initialDraw);
    const remaining = shuffled.slice(initialDraw);

    set({
      phase: "main",
      playerHp: PLAYER_MAX_HP,
      playerMaxHp: PLAYER_MAX_HP,
      playerMana: 3,
      shieldBuffer: 0,
      hand,
      battleDeck: remaining,
      discard: [],
      field: [],
      selectedEnemy: enemy,
      enemyHp: enemy.maxHp,
      enemyCurrentPhase: 0,
      turn: 1,
      cardsPlayedThisTurn: 0,
      poisonActive: enemy.id === "venom-hydra",
      log: [`⚔️ ${enemy.name} との戦闘開始！`],
    });
  },

  drawCard: () => {
    const s = get();
    if (s.hand.length >= MAX_HAND) return;

    let deck = [...s.battleDeck];
    let discard = [...s.discard];

    if (deck.length === 0) {
      if (discard.length === 0) return;
      deck = shuffle(discard);
      discard = [];
      addLog(set, "墓地をシャッフルして山札に戻した。");
    }

    const [drawn, ...rest] = deck;
    set({ hand: [...s.hand, drawn], battleDeck: rest, discard });
  },

  playCard: (cardId) => {
    const s = get();
    if (s.phase !== "main") return;

    const card = s.hand.find((c) => c.id === cardId);
    if (!card) return;
    if (s.playerMana < card.cost) return;

    // 深淵の大蜘蛛: 偶数ターンは1枚制限
    if (
      s.selectedEnemy?.id === "void-spider" &&
      s.turn % 2 === 0 &&
      s.cardsPlayedThisTurn >= 1
    ) {
      return;
    }

    const newHand = s.hand.filter((c) => c.id !== cardId);
    const newField = [...s.field, card];
    let newEnemyHp = s.enemyHp;
    let newPlayerHp = s.playerHp;
    let newShield = s.shieldBuffer;
    let logMsg = `🎭 ${card.name}を使用！`;

    const enemyId = s.selectedEnemy?.id;

    if (card.type === "攻撃") {
      newEnemyHp = Math.max(0, newEnemyHp - card.attack);
      logMsg += ` 敵に${card.attack}ダメージ！`;
    } else if (card.type === "防御") {
      let defValue = card.defense;
      if (enemyId === "iron-golem") {
        defValue = Math.floor(defValue / 2);
        logMsg += " 防御は半減！";
      }
      newShield += defValue;
      logMsg += ` シールド+${defValue}`;
      if (enemyId === "flame-spirit") {
        newPlayerHp = Math.max(0, newPlayerHp - 1);
        logMsg += " 熱で1ダメージ！";
      }
    } else if (card.type === "効果" && card.effect) {
      if (card.effect.includes("ドロー") && card.effect.includes("ダメージ")) {
        const dmgMatch = card.effect.match(/(\d+)ダメージ/);
        const dmg = dmgMatch ? parseInt(dmgMatch[1]) : 2;
        newEnemyHp = Math.max(0, newEnemyHp - dmg);
        logMsg += ` 敵に${dmg}ダメージ！`;
        setTimeout(() => get().drawCard(), 0);
        logMsg += " 1枚ドロー！";
      } else if (card.effect.includes("ドロー") && card.effect.includes("回復")) {
        const healMatch = card.effect.match(/(\d+)回復/);
        const heal = healMatch ? parseInt(healMatch[1]) : 2;
        newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + heal);
        logMsg += ` HP${heal}回復！`;
        setTimeout(() => get().drawCard(), 0);
        logMsg += " 1枚ドロー！";
      } else if (card.effect.includes("ダメージ")) {
        const dmgMatch = card.effect.match(/(\d+)ダメージ/);
        const dmg = dmgMatch ? parseInt(dmgMatch[1]) : 2;
        newEnemyHp = Math.max(0, newEnemyHp - dmg);
        logMsg += ` 敵に${dmg}ダメージ！`;
      } else if (card.effect.includes("回復")) {
        const healMatch = card.effect.match(/(\d+)回復/);
        const heal = healMatch ? parseInt(healMatch[1]) : 3;
        newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + heal);
        logMsg += ` HP${heal}回復！`;
      }
    } else if (card.type === "必殺") {
      let dmg = card.attack;
      if (enemyId === "void-king" && s.enemyCurrentPhase === 2) {
        dmg *= 2;
        logMsg += " 必殺ダメージ2倍！";
      }
      newEnemyHp = Math.max(0, newEnemyHp - dmg);
      logMsg += ` 必殺で${dmg}ダメージ！`;
    }

    addLog(set, logMsg);

    set({
      hand: newHand,
      field: newField,
      playerMana: s.playerMana - card.cost,
      enemyHp: newEnemyHp,
      playerHp: newPlayerHp,
      shieldBuffer: newShield,
      cardsPlayedThisTurn: s.cardsPlayedThisTurn + 1,
    });

    if (newEnemyHp <= 0) {
      set((prev) => ({
        phase: "victory",
        log: [
          ...prev.log,
          `🏆 ${prev.selectedEnemy!.name} を撃破！`,
          prev.selectedEnemy!.reward,
        ],
      }));
      return;
    }

    get().checkPhaseTransition();
  },

  endTurn: () => {
    const s = get();
    if (s.phase !== "main") return;

    const newDiscard = [...s.discard, ...s.field];
    addLog(set, "— プレイヤーターン終了 —");
    set({ phase: "enemy", field: [], discard: newDiscard });

    setTimeout(() => {
      const cs = get();
      if (cs.phase !== "enemy" || !cs.selectedEnemy) return;

      const enemy = cs.selectedEnemy;
      const hpPercent = (cs.enemyHp / enemy.maxHp) * 100;

      // Sum attack bonus from all active phases
      let totalBonus = 0;
      for (const p of enemy.phases) {
        if (hpPercent <= p.triggerHpPercent) {
          totalBonus += p.attackBonus;
        }
      }

      const totalAttack = enemy.attackPower + totalBonus;
      const damage = Math.max(0, totalAttack - cs.shieldBuffer);

      addLog(set, `💥 ${enemy.name}の攻撃！ ${damage}ダメージ！`);

      let newPlayerHp = Math.max(0, cs.playerHp - damage);

      // 毒ダメージ
      if (cs.poisonActive) {
        newPlayerHp = Math.max(0, newPlayerHp - 1);
        addLog(set, "☠️ 毒により1ダメージ！");
      }

      // 敵自己回復
      let newEnemyHp = cs.enemyHp;
      for (const p of enemy.phases) {
        if (p.selfHealPerTurn && hpPercent <= p.triggerHpPercent) {
          newEnemyHp = Math.min(enemy.maxHp, newEnemyHp + p.selfHealPerTurn);
          addLog(set, `💚 ${enemy.name}が${p.selfHealPerTurn}HP回復！`);
        }
      }

      set({
        playerHp: newPlayerHp,
        enemyHp: newEnemyHp,
        shieldBuffer: 0,
      });

      if (newPlayerHp <= 0) {
        set((prev) => ({
          phase: "defeat",
          log: [...prev.log, "💀 プレイヤーは倒された..."],
        }));
        return;
      }

      // 次ターン
      const newTurn = cs.turn + 1;
      const newMana = Math.min(newTurn + 1, 6);
      set({
        phase: "main",
        turn: newTurn,
        playerMana: newMana,
        cardsPlayedThisTurn: 0,
      });
      addLog(set, `— ターン${newTurn} — マナ${newMana}`);
      setTimeout(() => get().drawCard(), 100);
    }, 800);
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

      // ヴォイドリーパー: フェーズ移行で手札没収
      if (s.selectedEnemy.id === "void-reaper") {
        const discarded = [...s.hand];
        addLog(set, `🌪️ 手札${discarded.length}枚を吹き飛ばされた！`);
        set({ hand: [], discard: [...s.discard, ...discarded] });
      }
    }
  },

  resetBattle: () =>
    set({
      phase: "idle",
      playerHp: PLAYER_MAX_HP,
      playerMaxHp: PLAYER_MAX_HP,
      playerMana: 0,
      shieldBuffer: 0,
      hand: [],
      battleDeck: [],
      discard: [],
      field: [],
      selectedEnemy: null,
      enemyHp: 0,
      enemyCurrentPhase: 0,
      turn: 0,
      cardsPlayedThisTurn: 0,
      poisonActive: false,
      log: [],
    }),
}));
