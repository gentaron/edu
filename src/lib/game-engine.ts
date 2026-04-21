import { create } from "zustand";
import seedrandom from "seedrandom";

/* ═══ Types ═══ */
export type CardData = {
  id: string;
  name: string;
  nameEn?: string;
  attack: number;
  defense: number;
  cost: number;
  effect?: string;
  imageUrl: string;
  flavorText?: string;
};

export type AttackStep = {
  phase: number;
  dmg: number;
  message: string;
  special?: string | null;
};

export type EnemyData = {
  id: string;
  name: string;
  nameEn?: string;
  maxHp: number;
  attack: number;
  imageUrl: string;
  description?: string;
  attackPattern: string;
  reward?: string;
};

export type GamePhase = "draw" | "main" | "enemy" | "result";

export type GameResult = "victory" | "defeat" | null;

/* ═══ Helpers ═══ */
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseAttackPattern(json: string): AttackStep[] {
  try {
    return JSON.parse(json);
  } catch {
    return [{ phase: 1, dmg: 3, message: "攻撃してきた！", special: null }];
  }
}

/* ═══ Store State ═══ */
type GameState = {
  phase: GamePhase;
  playerHp: number;
  playerMaxHp: number;
  playerMana: number;
  playerMaxMana: number;
  hand: CardData[];
  deck: CardData[];
  discard: CardData[];
  field: CardData[];
  enemy: EnemyData | null;
  enemyHp: number;
  enemyPhase: number;
  enemyAttackIndex: number;
  log: string[];
  turn: number;
  result: GameResult;
  rng: () => number;

  /* Actions */
  startBattle: (enemy: EnemyData) => void;
  drawCard: () => void;
  playCard: (cardId: string) => void;
  endPlayerTurn: () => void;
  checkResult: () => void;
  addLog: (msg: string) => void;
};

const MAX_HAND = 5;
const MAX_FIELD = 4;
const INITIAL_HP = 30;

export const useGameStore = create<GameState>((set, get) => ({
  phase: "draw",
  playerHp: INITIAL_HP,
  playerMaxHp: INITIAL_HP,
  playerMana: 0,
  playerMaxMana: 3,
  hand: [],
  deck: [],
  discard: [],
  field: [],
  enemy: null,
  enemyHp: 0,
  enemyPhase: 1,
  enemyAttackIndex: 0,
  log: [],
  turn: 0,
  result: null,
  rng: () => Math.random(),

  addLog: (msg) =>
    set((s) => ({ log: [...s.log, `【${s.turn}】${msg}`] })),

  startBattle: (enemy) => {
    const rng = seedrandom(Date.now().toString());
    // Build a deck: duplicate cards to make 20-card deck
    const baseDeck: CardData[] = [];
    const templates: Omit<CardData, "id">[] = [
      { name: "アイリス・ブルーワイヤ", attack: 5, defense: 0, cost: 3, effect: "敵単体に5ダメージ。", imageUrl: "/edu-iris.png", flavorText: "「ブルーワイヤは俺の意志だ。」" },
      { name: "ウォーター・オーブ", attack: 3, defense: 2, cost: 2, effect: "敵に3ダメージ。次ターン被ダメージ-2。", imageUrl: "/edu-iris.png" },
      { name: "レイラ・プラズマカノン", attack: 4, defense: 0, cost: 2, effect: "敵単体に4ダメージ。", imageUrl: "/edu-aurali.png" },
      { name: "ディアナの加護", attack: 0, defense: 4, cost: 2, effect: "被ダメージを4無効化。", imageUrl: "/edu-diana.png" },
      { name: "ケイトの共鳴", attack: 2, defense: 2, cost: 1, effect: "敵に2ダメージ。HP2回復。", imageUrl: "/edu-kate-claudia.png" },
      { name: "ネオンコロシアム", attack: 3, defense: 1, cost: 2, effect: "敵に3ダメージ。手札1枚引く。", imageUrl: "/edu-hero.png" },
      { name: "次元極地平", attack: 5, defense: 0, cost: 3, effect: "敵全体に2ダメージ。", imageUrl: "/edu-liminal.png" },
      { name: "フィオナの策略", attack: 4, defense: 0, cost: 2, effect: "敵に4ダメージ。自ら1ダメージ。", imageUrl: "/edu-fiona.png" },
      { name: "弦太郎の陣", attack: 1, defense: 3, cost: 1, effect: "被ダメージ-3。次ターン攻撃+1。", imageUrl: "/edu-auralis.png" },
      { name: "リリーの歌声", attack: 3, defense: 1, cost: 2, effect: "敵に3ダメージ。", imageUrl: "/edu-lillie-steiner.png" },
    ];

    // 2 copies each = 20 cards
    for (const t of templates) {
      for (let i = 0; i < 2; i++) {
        baseDeck.push({ ...t, id: `${t.name}_${i}` });
      }
    }

    const shuffledDeck = shuffle(baseDeck, rng);
    const initialHand = shuffledDeck.slice(0, 4);
    const remainingDeck = shuffledDeck.slice(4);

    set({
      phase: "main",
      playerHp: INITIAL_HP,
      playerMaxHp: INITIAL_HP,
      playerMana: 3,
      playerMaxMana: 3,
      hand: initialHand,
      deck: remainingDeck,
      discard: [],
      field: [],
      enemy,
      enemyHp: enemy.maxHp,
      enemyPhase: 1,
      enemyAttackIndex: 0,
      log: [`⚔️ ${enemy.name} との戦闘開始！`],
      turn: 1,
      result: null,
      rng,
    });
  },

  drawCard: () => {
    const s = get();
    if (s.hand.length >= MAX_HAND) {
      get().addLog("手札がいっぱいで引けない。");
      return;
    }

    let deck = [...s.deck];
    let discard = [...s.discard];

    if (deck.length === 0) {
      if (discard.length === 0) {
        get().addLog("山札も墓地も空 — カードを引けない。");
        return;
      }
      deck = shuffle(discard, s.rng);
      discard = [];
      get().addLog("墓地をシャッフルして山札に戻した。");
    }

    const [drawn, ...rest] = deck;
    set({ hand: [...s.hand, drawn], deck: rest, discard });
    get().addLog(`${drawn.name} を引いた。`);
  },

  playCard: (cardId) => {
    const s = get();
    const card = s.hand.find((c) => c.id === cardId);
    if (!card) return;

    if (s.phase !== "main") {
      get().addLog("今はカードを出せない。");
      return;
    }
    if (s.field.length >= MAX_FIELD) {
      get().addLog("場がいっぱいでカードを出せない。");
      return;
    }
    if (s.playerMana < card.cost) {
      get().addLog(`マナが足りない（必要: ${card.cost}、所持: ${s.playerMana}）。`);
      return;
    }

    const newHand = s.hand.filter((c) => c.id !== cardId);
    const newField = [...s.field, card];
    const newDiscard = [...s.discard];
    let newEnemyHp = s.enemyHp;
    let newPlayerHp = s.playerHp;
    let logMsg = `${card.name} を場に出した！`;

    // Apply card effects
    if (card.attack > 0 && card.defense === 0) {
      // Pure attack card
      newEnemyHp = Math.max(0, newEnemyHp - card.attack);
      logMsg += ` 敵に${card.attack}ダメージ！`;
    } else if (card.attack > 0 && card.defense > 0) {
      // Hybrid
      newEnemyHp = Math.max(0, newEnemyHp - card.attack);
      logMsg += ` 敵に${card.attack}ダメージ！${card.defense > 0 ? ` 防御${card.defense}を獲得。` : ""}`;
    } else if (card.attack === 0 && card.defense > 0) {
      // Pure defense — heal by defense value
      newPlayerHp = Math.min(s.playerMaxHp, newPlayerHp + card.defense);
      logMsg += ` HPを${card.defense}回復！`;
    }

    // Special effects
    if (card.name === "ケイトの共鳴") {
      newPlayerHp = Math.min(s.playerMaxHp, newPlayerHp + 2);
      logMsg += " HPをさらに2回復！";
    }
    if (card.name === "フィオナの策略") {
      newPlayerHp = Math.max(0, newPlayerHp - 1);
      logMsg += " しかし自らも1ダメージを受けた。";
    }
    if (card.name === "ネオンコロシアム") {
      // Draw extra card
      setTimeout(() => get().drawCard(), 0);
      logMsg += " 手札を1枚追加で引く！";
    }

    get().addLog(logMsg);

    // Move played card to discard at end of turn (keep on field for now)
    set({
      hand: newHand,
      field: newField,
      playerMana: s.playerMana - card.cost,
      enemyHp: newEnemyHp,
      playerHp: newPlayerHp,
    });

    get().checkResult();
  },

  endPlayerTurn: () => {
    const s = get();
    if (s.phase !== "main") return;

    // Move field cards to discard
    const newDiscard = [...s.discard, ...s.field];

    get().addLog("— プレイヤーターン終了 —");
    set({
      phase: "enemy",
      field: [],
      discard: newDiscard,
    });

    // Execute enemy attack after brief delay
    setTimeout(() => {
      const currentState = get();
      if (currentState.phase !== "enemy" || !currentState.enemy) return;

      const pattern = parseAttackPattern(currentState.enemy.attackPattern);
      const currentPhasePattern = pattern.filter(
        (p) => p.phase === currentState.enemyPhase
      );
      const attackIndex = currentState.enemyAttackIndex % currentPhasePattern.length;
      const attack = currentPhasePattern[attackIndex];

      if (!attack) {
        // No pattern for this phase — basic attack
        const dmg = currentState.enemy.attack;
        get().addLog(`${currentState.enemy.name} が${dmg}ダメージの攻撃をしてきた！`);
        set({ playerHp: Math.max(0, currentState.playerHp - dmg) });
      } else {
        let dmg = attack.dmg;

        // Calculate defense from field (field is empty after endPlayerTurn, use base defense)
        get().addLog(attack.message);

        // Special: lifesteal
        if (attack.special?.startsWith("lifesteal")) {
          const heal = parseInt(attack.special.replace("lifesteal_", ""), 10) || 1;
          set({
            playerHp: Math.max(0, currentState.playerHp - dmg),
            enemyHp: Math.min(
              currentState.enemy.maxHp,
              currentState.enemyHp + heal
            ),
          });
          get().addLog(`${currentState.enemy.name} は${heal}HP回復した！`);
        } else {
          set({ playerHp: Math.max(0, currentState.playerHp - dmg) });
        }

        // Advance enemy phase based on HP thresholds
        const afterState = get();
        const hpRatio = afterState.enemyHp / afterState.enemy!.maxHp;
        let newEnemyPhase = currentState.enemyPhase;
        if (hpRatio <= 0.33 && currentState.enemy.maxHp >= 50) {
          newEnemyPhase = 3;
        } else if (hpRatio <= 0.6 && currentState.enemy.maxHp >= 30) {
          newEnemyPhase = 2;
        }

        if (newEnemyPhase !== currentState.enemyPhase) {
          get().addLog(
            `⚠️ ${currentState.enemy.name} がフェーズ${newEnemyPhase}に移行した！`
          );
          set({ enemyPhase: newEnemyPhase, enemyAttackIndex: 0 });
        } else {
          set({
            enemyAttackIndex: attackIndex + 1,
          });
        }
      }

      get().checkResult();
    }, 800);
  },

  checkResult: () => {
    const s = get();
    if (s.result) return;

    if (s.enemyHp <= 0) {
      set({
        phase: "result",
        result: "victory",
        log: [
          ...s.log,
          `🏆 ${s.enemy!.name} を撃破した！`,
          s.enemy!.reward || "戦闘に勝利した。",
        ],
      });
    } else if (s.playerHp <= 0) {
      set({
        phase: "result",
        result: "defeat",
        log: [...s.log, "💀 プレイヤーは倒された..."],
      });
    } else if (s.phase === "enemy") {
      // Enemy turn done, go to draw phase
      setTimeout(() => {
        const cs = get();
        if (cs.result) return;
        const newTurn = cs.turn + 1;
        const newMana = Math.min(cs.playerMaxMana, 3); // cap at 3
        set({
          phase: "draw",
          turn: newTurn,
          playerMana: newMana,
        });
        get().addLog(`— ターン${newTurn} — マナ${newMana}を回復。`);
        // Auto-draw 1 card at start of draw phase
        setTimeout(() => {
          const drawState = get();
          if (drawState.phase === "draw") {
            drawState.drawCard();
            set({ phase: "main" });
          }
        }, 400);
      }, 600);
    }
  },
}));
