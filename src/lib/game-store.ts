import { create } from "zustand";
import { GameCard, Enemy } from "./card-data";

export type GamePhase =
  | "select"
  | "draw"
  | "main"
  | "enemy"
  | "victory"
  | "defeat";

interface GameState {
  phase: GamePhase;
  playerHp: number;
  playerMaxHp: number;
  playerMana: number;
  hand: GameCard[];
  deck: GameCard[];
  discard: GameCard[];
  field: GameCard[];
  selectedEnemy: Enemy | null;
  enemyHp: number;
  turn: number;
  log: string[];
  shieldBuffer: number;
  triggeredPhases: Set<string>;

  selectEnemy: (enemy: Enemy, allCards: GameCard[]) => void;
  drawCard: () => void;
  playCard: (cardId: string) => void;
  endTurn: () => void;
  resetGame: () => void;
}

const PLAYER_MAX_HP = 30;
const MAX_HAND = 5;
const MAX_FIELD = 4;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "select",
  playerHp: PLAYER_MAX_HP,
  playerMaxHp: PLAYER_MAX_HP,
  playerMana: 0,
  hand: [],
  deck: [],
  discard: [],
  field: [],
  selectedEnemy: null,
  enemyHp: 0,
  turn: 0,
  log: [],
  shieldBuffer: 0,
  triggeredPhases: new Set<string>(),

  selectEnemy: (enemy, allCards) => {
    // Build deck: 2 copies of each card = 24 cards
    const deck: GameCard[] = [];
    for (const card of allCards) {
      deck.push({ ...card, id: `${card.id}_a` });
      deck.push({ ...card, id: `${card.id}_b` });
    }
    const shuffled = shuffle(deck);
    const initialHand = shuffled.slice(0, 3);
    const remaining = shuffled.slice(3);

    set({
      phase: "main",
      playerHp: PLAYER_MAX_HP,
      playerMaxHp: PLAYER_MAX_HP,
      playerMana: 3,
      hand: initialHand,
      deck: remaining,
      discard: [],
      field: [],
      selectedEnemy: enemy,
      enemyHp: enemy.maxHp,
      turn: 1,
      log: [`⚔️ ${enemy.name} との戦闘開始！`],
      shieldBuffer: 0,
      triggeredPhases: new Set<string>(),
    });
  },

  drawCard: () => {
    const s = get();
    if (s.hand.length >= MAX_HAND) return;

    let deck = [...s.deck];
    let discard = [...s.discard];

    if (deck.length === 0) {
      if (discard.length === 0) return;
      deck = shuffle(discard);
      discard = [];
      get().addLogInternal("墓地をシャッフルして山札に戻した。");
    }

    const [drawn, ...rest] = deck;
    set({ hand: [...s.hand, drawn], deck: rest, discard });
  },

  playCard: (cardId) => {
    const s = get();
    if (s.phase !== "main") return;

    const card = s.hand.find((c) => c.id === cardId);
    if (!card) return;
    if (s.playerMana < card.cost) return;

    const newHand = s.hand.filter((c) => c.id !== cardId);
    const newField = [...s.field, card];
    let newEnemyHp = s.enemyHp;
    let newPlayerHp = s.playerHp;
    let logMsg = `🎭 ${card.name}を使用！`;

    if (card.type === "攻撃") {
      newEnemyHp = Math.max(0, newEnemyHp - card.attack);
      logMsg += ` 敵に${card.attack}ダメージ！`;
    } else if (card.type === "防御") {
      logMsg += ` 次の被ダメージを${card.defense}軽減。`;
      set({ shieldBuffer: s.shieldBuffer + card.defense });
    } else if (card.type === "効果" && card.effect) {
      if (card.effect.includes("ダメージ") && card.effect.includes("回復")) {
        const dmgMatch = card.effect.match(/(\d+)ダメージ/);
        const healMatch = card.effect.match(/(\d+)回復/);
        const dmg = dmgMatch ? parseInt(dmgMatch[1]) : 2;
        const heal = healMatch ? parseInt(healMatch[1]) : 3;
        newEnemyHp = Math.max(0, newEnemyHp - dmg);
        newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + heal);
        logMsg += ` 敵に${dmg}ダメージ！HP${heal}回復！`;
      } else if (card.effect.includes("ダメージ")) {
        const dmgMatch = card.effect.match(/(\d+)ダメージ/);
        const dmg = dmgMatch ? parseInt(dmgMatch[1]) : 2;
        newEnemyHp = Math.max(0, newEnemyHp - dmg);
        logMsg += ` 敵に${dmg}ダメージ！`;
      } else if (card.effect.includes("回復")) {
        const healMatch = card.effect.match(/(\d+)回復/);
        const heal = healMatch ? parseInt(healMatch[1]) : 3;
        newPlayerHp = Math.min(s.playerMaxHp, s.playerHp + heal);
        logMsg += ` HPを${heal}回復！`;
      }
    }

    get().addLogInternal(logMsg);

    set({
      hand: newHand,
      field: newField,
      playerMana: s.playerMana - card.cost,
      enemyHp: newEnemyHp,
      playerHp: newPlayerHp,
    });

    if (newEnemyHp <= 0) {
      set((prev) => ({
        phase: "victory",
        log: [...prev.log, `🏆 ${get().selectedEnemy!.name} を撃破！`, get().selectedEnemy!.reward],
      }));
    }
  },

  endTurn: () => {
    const s = get();
    if (s.phase !== "main") return;

    // Move field → discard
    const newDiscard = [...s.discard, ...s.field];
    get().addLogInternal("— プレイヤーターン終了 —");

    set({
      phase: "enemy",
      field: [],
      discard: newDiscard,
    });

    // Enemy attack after delay
    setTimeout(() => {
      const cs = get();
      if (cs.phase !== "enemy" || !cs.selectedEnemy) return;

      const enemy = cs.selectedEnemy;
      const hpPercent = (cs.enemyHp / enemy.maxHp) * 100;
      let attackBonus = 0;

      // Check phase triggers
      const newTriggered = new Set(cs.triggeredPhases);
      for (const phase of enemy.phases) {
        if (hpPercent <= phase.triggerHpPercent && !newTriggered.has(`${enemy.id}_${phase.triggerHpPercent}`)) {
          newTriggered.add(`${enemy.id}_${phase.triggerHpPercent}`);
          attackBonus += phase.attackBonus;
          get().addLogInternal(`⚠️ ${phase.message}`);
        }
      }
      set({ triggeredPhases: newTriggered });

      // Spirit Walker special: heal when below 30%
      if (enemy.id === "spirit-walker" && hpPercent <= 30) {
        const healAmount = 2;
        const newEnemyHp = Math.min(enemy.maxHp, cs.enemyHp + healAmount);
        set({ enemyHp: newEnemyHp });
        get().addLogInternal(`👻 霊体ウォーカーが${healAmount}HP回復した！`);
      }

      // Calculate damage
      const currentShield = get().shieldBuffer;
      const totalAttack = enemy.attackPower + attackBonus;
      const damage = Math.max(0, totalAttack - currentShield);

      get().addLogInternal(`💥 ${enemy.name}の攻撃！ ${damage}ダメージ！`);

      const newPlayerHp = Math.max(0, cs.playerHp - damage);
      set({
        playerHp: newPlayerHp,
        shieldBuffer: 0,
      });

      // Check defeat
      if (newPlayerHp <= 0) {
        set((prev) => ({
          phase: "defeat",
          log: [...prev.log, "💀 プレイヤーは倒された..."],
        }));
        return;
      }

      // Next turn
      setTimeout(() => {
        const ns = get();
        if (ns.phase !== "enemy") return;
        const newTurn = ns.turn + 1;
        const newMana = Math.min(newTurn + 2, 6);
        set({
          phase: "main",
          turn: newTurn,
          playerMana: newMana,
        });
        get().addLogInternal(`— ターン${newTurn} — マナ${newMana}`);
        // Draw 1 card
        get().drawCard();
      }, 600);
    }, 800);
  },

  resetGame: () => {
    set({
      phase: "select",
      playerHp: PLAYER_MAX_HP,
      playerMaxHp: PLAYER_MAX_HP,
      playerMana: 0,
      hand: [],
      deck: [],
      discard: [],
      field: [],
      selectedEnemy: null,
      enemyHp: 0,
      turn: 0,
      log: [],
      shieldBuffer: 0,
      triggeredPhases: new Set<string>(),
    });
  },

  // Internal helper — not part of public interface
  addLogInternal: (msg: string) => {
    set((s) => ({ log: [...s.log, msg] }));
  },
}));
