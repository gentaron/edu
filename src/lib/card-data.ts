/* ═══════════════════════════════════════════════════════
   card-data.ts — Static card pool & enemy definitions
   Prisma-free, works in Netlify static build
   ═══════════════════════════════════════════════════════ */

export type CardType = "攻撃" | "防御" | "効果" | "必殺";

export interface GameCard {
  id: string;
  name: string;
  type: CardType;
  attack: number;
  defense: number;
  cost: number;
  effect?: string;
  imageUrl: string;
  flavorText: string;
  rarity: "C" | "R" | "SR";
}

export interface EnemyPhase {
  triggerHpPercent: number;
  message: string;
  attackBonus: number;
  selfHealPerTurn?: number;
}

export interface Enemy {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  attackPower: number;
  imageUrl: string;
  description: string;
  difficulty: "NORMAL" | "HARD" | "BOSS" | "FINAL";
  reward: string;
  phases: EnemyPhase[];
  specialRule?: string;
}

/* ═══════════════════════════════════════════════════════
   25枚のカードプール
   ═══════════════════════════════════════════════════════ */
export const ALL_CARDS: GameCard[] = [
  /* ── 攻撃(C) ×7 ── */
  {
    id: "atk-iris-blazer",
    name: "アイリス・ブレイザー",
    type: "攻撃",
    attack: 2,
    defense: 0,
    cost: 1,
    imageUrl: "/edu-iris.png",
    flavorText: "「青い炎が闇を焼き尽くす。」",
    rarity: "C",
  },
  {
    id: "atk-kate-shot",
    name: "ケイトの共鳴弾",
    type: "攻撃",
    attack: 3,
    defense: 0,
    cost: 1,
    imageUrl: "/edu-kate-claudia.png",
    flavorText: "「共鳴する弾丸が、全てを貫く。」",
    rarity: "C",
  },
  {
    id: "atk-layla-strike",
    name: "レイラの瞬撃",
    type: "攻撃",
    attack: 3,
    defense: 0,
    cost: 2,
    imageUrl: "/LaylaVirelNova.png",
    flavorText: "「一瞬の閃きが、山を断つ。」",
    rarity: "C",
  },
  {
    id: "atk-diana-arrow",
    name: "ディアナの光矢",
    type: "攻撃",
    attack: 2,
    defense: 0,
    cost: 1,
    imageUrl: "/edu-diana.png",
    flavorText: "「光の矢よ、悪を射貫け。」",
    rarity: "C",
  },
  {
    id: "atk-lillie-note",
    name: "リリーの戦いの歌",
    type: "攻撃",
    attack: 3,
    defense: 0,
    cost: 2,
    imageUrl: "/edu-lillie-steiner.png",
    flavorText: "「歌が武器になる時、それが最強の旋律だ。」",
    rarity: "C",
  },
  {
    id: "atk-mina-pulse",
    name: "ミナの超次元弾",
    type: "攻撃",
    attack: 4,
    defense: 0,
    cost: 2,
    imageUrl: "/MinaEurekaErnst.png",
    flavorText: "「次元を超えた弾丸が、標的を消滅させる。」",
    rarity: "C",
  },
  {
    id: "atk-hero-slash",
    name: "ヒーローの斬撃",
    type: "攻撃",
    attack: 3,
    defense: 0,
    cost: 1,
    imageUrl: "/edu-hero.png",
    flavorText: "「一太刀、未来を切り開く。」",
    rarity: "C",
  },

  /* ── 攻撃(R) ×3 ── */
  {
    id: "atk-iris-plasma",
    name: "アイリス・プラズマカノン",
    type: "攻撃",
    attack: 5,
    defense: 0,
    cost: 2,
    imageUrl: "/edu-iris.png",
    flavorText: "「プラズマの奔流が、敵を跡形もなく消し去る。」",
    rarity: "R",
  },
  {
    id: "atk-layla-storm",
    name: "レイラの嵐撃",
    type: "攻撃",
    attack: 6,
    defense: 0,
    cost: 3,
    imageUrl: "/LaylaVirelNova.png",
    flavorText: "「嵐が呼ぶのは終わりの風だ。」",
    rarity: "R",
  },
  {
    id: "atk-celia-judgment",
    name: "セリアの裁断",
    type: "攻撃",
    attack: 7,
    defense: 0,
    cost: 3,
    imageUrl: "/edu-celia.png",
    flavorText: "「無効化の最後は、一撃の裁断。」",
    rarity: "R",
  },

  /* ── 防御(C) ×4 ── */
  {
    id: "def-diana-shield",
    name: "ディアナの結界",
    type: "防御",
    attack: 0,
    defense: 2,
    cost: 1,
    imageUrl: "/edu-diana.png",
    flavorText: "「私の結界が、あなたを守る。」",
    rarity: "C",
  },
  {
    id: "def-neon-wall",
    name: "ネオンバリア",
    type: "防御",
    attack: 0,
    defense: 3,
    cost: 2,
    imageUrl: "/edu-hero.png",
    flavorText: "「ホログラムの壁が、敵の攻撃を弾く。」",
    rarity: "C",
  },
  {
    id: "def-gentaro-stance",
    name: "弦太郎の構え",
    type: "防御",
    attack: 0,
    defense: 2,
    cost: 1,
    imageUrl: "/edu-auralis.png",
    flavorText: "「しっかり守る。それが俺の流儀だ。」",
    rarity: "C",
  },
  {
    id: "def-lillie-aria",
    name: "リリーの守護アリア",
    type: "防御",
    attack: 0,
    defense: 4,
    cost: 2,
    imageUrl: "/edu-lillie-steiner.png",
    flavorText: "「優しい旋律が、鎧となる。」",
    rarity: "C",
  },

  /* ── 防御(R) ×2 ── */
  {
    id: "def-kate-fortress",
    name: "ケイトの共鳴要塞",
    type: "防御",
    attack: 0,
    defense: 5,
    cost: 2,
    imageUrl: "/edu-kate-claudia.png",
    flavorText: "「共鳴する壁が、どんな攻撃も受け止める。」",
    rarity: "R",
  },
  {
    id: "def-diana-sanctuary",
    name: "ディアナの聖域",
    type: "防御",
    attack: 0,
    defense: 6,
    cost: 2,
    imageUrl: "/edu-diana.png",
    flavorText: "「聖なる光が、一切の邪悪を拒絶する。」",
    rarity: "R",
  },

  /* ── 効果(C) ×4 ── */
  {
    id: "fx-fiona-trick",
    name: "フィオナの策略",
    type: "効果",
    attack: 0,
    defense: 0,
    cost: 2,
    effect: "敵に2ダメージ＋1枚ドロー",
    imageUrl: "/edu-fiona.png",
    flavorText: "「計算通りよ。一石二鳴。」",
    rarity: "C",
  },
  {
    id: "fx-ninny-hack",
    name: "ニニーのハッキング",
    type: "効果",
    attack: 0,
    defense: 0,
    cost: 2,
    effect: "敵に2ダメージ＋1枚ドロー",
    imageUrl: "/NinnyOffenbach.png",
    flavorText: "「ハッキング完了。ボーナスもついてきた。」",
    rarity: "C",
  },
  {
    id: "fx-kate-heal",
    name: "ケイトの癒やし",
    type: "効果",
    attack: 0,
    defense: 0,
    cost: 2,
    effect: "HPを3回復",
    imageUrl: "/KatePatton.png",
    flavorText: "「大丈夫、すぐに治るよ。」",
    rarity: "C",
  },
  {
    id: "fx-layla-rally",
    name: "レイラの号令",
    type: "効果",
    attack: 0,
    defense: 0,
    cost: 2,
    effect: "1枚ドロー＋HPを2回復",
    imageUrl: "/LaylaVirelNova.png",
    flavorText: "「全軍、前へ！退路はない！」",
    rarity: "C",
  },

  /* ── 効果(R) ×2 ── */
  {
    id: "fx-auralis-storm",
    name: "AURALISの全域攻撃",
    type: "効果",
    attack: 0,
    defense: 0,
    cost: 3,
    effect: "全体に5ダメージ",
    imageUrl: "/edu-auralis.png",
    flavorText: "「AURALISの力が、全方位を薙ぎ払う。」",
    rarity: "R",
  },
  {
    id: "fx-diana-resurrect",
    name: "ディアナの復活",
    type: "効果",
    attack: 0,
    defense: 0,
    cost: 3,
    effect: "HPを5回復",
    imageUrl: "/edu-diana.png",
    flavorText: "「光よ、もう一度命を注げ。」",
    rarity: "R",
  },

  /* ── 必殺(SR) ×3 ── */
  {
    id: "sr-iris-dimension",
    name: "アイリス・次元斬り",
    type: "必殺",
    attack: 8,
    defense: 0,
    cost: 4,
    imageUrl: "/edu-iris.png",
    flavorText: "「次元の刃で、運命を断ち切る！」",
    rarity: "SR",
  },
  {
    id: "sr-layla-final",
    name: "レイラ・最終演舞",
    type: "必殺",
    attack: 10,
    defense: 0,
    cost: 4,
    imageUrl: "/LaylaVirelNova.png",
    flavorText: "「これが、私の最後の舞だ——！」",
    rarity: "SR",
  },
  {
    id: "sr-auralis-crusade",
    name: "AURALISの終焉十字軍",
    type: "必殺",
    attack: 12,
    defense: 0,
    cost: 4,
    imageUrl: "/edu-aurali.png",
    flavorText: "「終焉すらも、我々の前にひれ伏す。」",
    rarity: "SR",
  },
];

/* ═══════════════════════════════════════════════════════
   10体のエネミー
   ═══════════════════════════════════════════════════════ */
export const ENEMIES: Enemy[] = [
  /* ── NORMAL ×4 ── */
  {
    id: "stardust-dragon",
    name: "スターダスト・ドラゴン",
    title: "星屑の守護者",
    maxHp: 28,
    attackPower: 4,
    imageUrl: "/logo.svg",
    description:
      "E16連星系の深部に棲む古代竜。星屑を纏い、その息吹は小惑星を灰に変える。",
    difficulty: "NORMAL",
    reward: "星屑の鱗を入手",
    phases: [
      { triggerHpPercent: 50, message: "翼を広げ炎を吐く！", attackBonus: 2 },
    ],
  },
  {
    id: "phantom-walker",
    name: "霊体ウォーカー",
    title: "彷徨える亡者",
    maxHp: 22,
    attackPower: 3,
    imageUrl: "/logo.svg",
    description:
      "次元境界を彷徨う幽霊のような存在。実体を持たず、傷ついても自ら再生する。",
    difficulty: "NORMAL",
    reward: "霊体の核を入手",
    phases: [
      {
        triggerHpPercent: 40,
        message: "霊体が揺らめく…",
        attackBonus: 1,
        selfHealPerTurn: 2,
      },
    ],
    specialRule: "HP40%以下から毎ターン2回復する",
  },
  {
    id: "iron-golem",
    name: "鉄塊ゴーレム",
    title: "廃工場の番人",
    maxHp: 35,
    attackPower: 5,
    imageUrl: "/logo.svg",
    description:
      "放棄された軍事工場で自動稼働する巨大な機械番人。装甲はどんな攻撃も弾く。",
    difficulty: "NORMAL",
    reward: "精製鉄塊を入手",
    phases: [
      { triggerHpPercent: 60, message: "装甲が赤く焼ける！", attackBonus: 3 },
    ],
    specialRule: "防御カードの効果が半減する（シールド値÷2）",
  },
  {
    id: "venom-hydra",
    name: "毒沼ヒュドラ",
    title: "沼地の多頭竜",
    maxHp: 30,
    attackPower: 3,
    imageUrl: "/logo.svg",
    description:
      "瘴気に満ちた沼に潜む多頭の竜。首を斬っても再生し、毒で敵を蝕む。",
    difficulty: "NORMAL",
    reward: "毒腺エキスを入手",
    phases: [
      { triggerHpPercent: 66, message: "首が1本再生した！", attackBonus: 1 },
      { triggerHpPercent: 33, message: "さらに首が増える！", attackBonus: 2 },
    ],
    specialRule: "毎ターン終了時プレイヤーに1毒ダメージ",
  },
  /* ── HARD ×3 ── */
  {
    id: "frost-guardian",
    name: "氷獄の守護者",
    title: "絶対零度の鎧",
    maxHp: 38,
    attackPower: 5,
    imageUrl: "/logo.svg",
    description:
      "永久凍土の最深部で眠る氷の巨人。その鎧は絶対零度の冷気で硬化している。",
    difficulty: "HARD",
    reward: "永久凍土の結晶を入手",
    phases: [
      {
        triggerHpPercent: 50,
        message: "氷の鎧が砕け…本体が現れた！",
        attackBonus: 4,
      },
    ],
    specialRule: "バトル開始時プレイヤーの手札が2枚少ない（初期ドロー1枚）",
  },
  {
    id: "flame-spirit",
    name: "炎の精霊王",
    title: "業火の化身",
    maxHp: 32,
    attackPower: 6,
    imageUrl: "/logo.svg",
    description:
      "太古の火山に宿る炎の精霊。その熱量は防壁すら溶かし、近づく者を灰に変える。",
    difficulty: "HARD",
    reward: "業火の核石を入手",
    phases: [
      { triggerHpPercent: 70, message: "炎が激しくなる！", attackBonus: 2 },
      { triggerHpPercent: 30, message: "核爆発！", attackBonus: 4 },
    ],
    specialRule: "防御カードを使うたびに自分が1ダメージ",
  },
  {
    id: "void-spider",
    name: "深淵の大蜘蛛",
    title: "虚無の糸使い",
    maxHp: 40,
    attackPower: 4,
    imageUrl: "/logo.svg",
    description:
      "次元の裂け目に巣食う巨大蜘蛛。透明な糸で獲物を縛り上げ、動きを封じる。",
    difficulty: "HARD",
    reward: "次元の糸を入手",
    phases: [
      { triggerHpPercent: 45, message: "捕縛糸を放つ！", attackBonus: 2 },
    ],
    specialRule: "偶数ターンはプレイヤーがカードを1枚しか使えない",
  },
  /* ── BOSS ×2 ── */
  {
    id: "fallen-angel",
    name: "堕落した天使",
    title: "翼なき裁判者",
    maxHp: 50,
    attackPower: 6,
    imageUrl: "/logo.svg",
    description:
      "かつてAURALISの守護天使だったが、次元崩壊に巻き込まれ堕天した。3段階の怒りを持つ。",
    difficulty: "BOSS",
    reward: "堕天の羽根を入手",
    phases: [
      {
        triggerHpPercent: 66,
        message: "神の怒りを解放する！",
        attackBonus: 2,
      },
      {
        triggerHpPercent: 33,
        message: "最後の審判…！",
        attackBonus: 4,
        selfHealPerTurn: 3,
      },
    ],
    specialRule: "HP33%以下から毎ターン3回復＋攻撃力+4",
  },
  {
    id: "void-reaper",
    name: "ヴォイドリーパー",
    title: "時空の刈り手",
    maxHp: 55,
    attackPower: 7,
    imageUrl: "/logo.svg",
    description:
      "虚無から現れ、存在そのものを刈り取る死神。3フェーズの力で時空を歪める。",
    difficulty: "BOSS",
    reward: "虚無の鎌を入手",
    phases: [
      { triggerHpPercent: 75, message: "時空が歪む…", attackBonus: 1 },
      { triggerHpPercent: 50, message: "次元切断！", attackBonus: 3 },
      { triggerHpPercent: 25, message: "存在が消えていく…", attackBonus: 5 },
    ],
    specialRule: "フェーズ移行時プレイヤーの手札をすべて捨てる",
  },
  /* ── FINAL ×1 ── */
  {
    id: "void-king",
    name: "虚無の王",
    title: "終焉の支配者",
    maxHp: 70,
    attackPower: 8,
    imageUrl: "/logo.svg",
    description:
      "全ての虚無の根源。宇宙の終わりを体現する存在。必殺カードのみが最終フェーズを突破できる。",
    difficulty: "FINAL",
    reward: "虚無の王冠を入手。全クリア達成！",
    phases: [
      { triggerHpPercent: 80, message: "宇宙が震える…", attackBonus: 2 },
      { triggerHpPercent: 55, message: "虚無の爆発！", attackBonus: 4 },
      {
        triggerHpPercent: 30,
        message: "終焉の意志…！",
        attackBonus: 6,
        selfHealPerTurn: 5,
      },
    ],
    specialRule: "HP30%以下から毎ターン5回復。必殺カードのみが最終フェーズを突破できる",
  },
];
