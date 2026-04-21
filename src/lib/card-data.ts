/* ═══════════════════════════════════════════════════
   card-data.ts — Static card & enemy definitions
   Prisma-free, works in Netlify static build
   ═══════════════════════════════════════════════════ */

export type CardType = "攻撃" | "防御" | "効果";

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
}

export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  attackPower: number;
  imageUrl: string;
  description: string;
  reward: string;
  phases: {
    triggerHpPercent: number;
    message: string;
    attackBonus: number;
  }[];
}

/* ─── 12 Cards ─── */
export const ALL_CARDS: GameCard[] = [
  // ── 攻撃カード 4枚 ──
  {
    id: "card-iris-blazer",
    name: "アイリス・ブレイザー",
    type: "攻撃",
    attack: 3,
    defense: 0,
    cost: 1,
    effect: "敵に3ダメージ",
    imageUrl: "/edu-iris.png",
    flavorText: "「青い炎が闇を焼き尽くす。」",
  },
  {
    id: "card-plasma-cannon",
    name: "レイラ・プラズマカノン",
    type: "攻撃",
    attack: 5,
    defense: 0,
    cost: 2,
    effect: "敵に5ダメージ",
    imageUrl: "/edu-fiona.png",
    flavorText: "「レイラの必殺技。プラズマが全てを貫く。」",
  },
  {
    id: "card-dimension-slash",
    name: "次元斬り",
    type: "攻撃",
    attack: 4,
    defense: 0,
    cost: 2,
    effect: "敵に4ダメージ",
    imageUrl: "/edu-liminal.png",
    flavorText: "次元の裂け目から放たれる一撃。",
  },
  {
    id: "card-auralis-judgment",
    name: "AURALISの裁き",
    type: "攻撃",
    attack: 6,
    defense: 0,
    cost: 3,
    effect: "敵に6ダメージ",
    imageUrl: "/edu-auralis.png",
    flavorText: "「AURALISの法が、異形を断罪する。」",
  },
  // ── 防御カード 4枚 ──
  {
    id: "card-diana-blessing",
    name: "ディアナの加護",
    type: "防御",
    attack: 0,
    defense: 4,
    cost: 2,
    effect: "次の敵攻撃を4軽減",
    imageUrl: "/edu-diana.png",
    flavorText: "「ディアナの光が、仲間を守る盾となる。」",
  },
  {
    id: "card-neon-shield",
    name: "ネオンシールド",
    type: "防御",
    attack: 0,
    defense: 3,
    cost: 1,
    effect: "次の敵攻撃を3軽減",
    imageUrl: "/edu-hero.png",
    flavorText: "ホログラムの盾が敵の攻撃を弾く。",
  },
  {
    id: "card-gentaro-barrier",
    name: "弦太郎の陣",
    type: "防御",
    attack: 0,
    defense: 2,
    cost: 1,
    effect: "次の敵攻撃を2軽減",
    imageUrl: "/edu-auralis.png",
    flavorText: "「しっかり守る、それが俺の役目だ。」",
  },
  {
    id: "card-kate-resonance",
    name: "ケイトの共鳴盾",
    type: "防御",
    attack: 0,
    defense: 5,
    cost: 2,
    effect: "次の敵攻撃を5軽減",
    imageUrl: "/edu-kate-claudia.png",
    flavorText: "「共鳴する心が、最強の防壁を生む。」",
  },
  // ── 効果カード 4枚 ──
  {
    id: "card-lily-song",
    name: "リリーの癒やしの歌",
    type: "効果",
    attack: 0,
    defense: 0,
    cost: 2,
    effect: "HPを3回復",
    imageUrl: "/edu-lillie-steiner.png",
    flavorText: "「歌が傷を癒やす。闇の中でも、歌声は届く。」",
  },
  {
    id: "card-mina-pulse",
    name: "ミナの超次元パルス",
    type: "効果",
    attack: 0,
    defense: 0,
    cost: 2,
    effect: "敵に2ダメージ",
    imageUrl: "/edu-diana.png",
    flavorText: "「次元を超えたパルスが、敵を内側から破壊する。」",
  },
  {
    id: "card-fiona-strategy",
    name: "フィオナの策略",
    type: "効果",
    attack: 0,
    defense: 0,
    cost: 3,
    effect: "敵に4ダメージ",
    imageUrl: "/edu-fiona.png",
    flavorText: "「計算通りよ。敵はもう終わり。」",
  },
  {
    id: "card-celia-nullify",
    name: "セリアの無効化",
    type: "効果",
    attack: 0,
    defense: 0,
    cost: 3,
    effect: "敵に3ダメージ。HPを2回復",
    imageUrl: "/edu-celia.png",
    flavorText: "「無効化完了。次の計画に移ります。」",
  },
];

/* ─── 3 Enemies ─── */
export const ENEMIES: Enemy[] = [
  {
    id: "stardust-dragon",
    name: "スターダスト・ドラゴン",
    maxHp: 30,
    attackPower: 4,
    imageUrl: "/logo.svg",
    description:
      "E16連星系の深部に棲む古代竜。星屑を纏い、その息吹は小惑星を灰に変えると言われる。",
    reward: "星屑の欠片を入手した",
    phases: [
      {
        triggerHpPercent: 50,
        message: "ドラゴンが怒り狂い、オーラが膨れ上がった！",
        attackBonus: 2,
      },
    ],
  },
  {
    id: "spirit-walker",
    name: "霊体ウォーカー",
    maxHp: 20,
    attackPower: 3,
    imageUrl: "/edu-iris.png",
    description:
      "次元境界を彷徨う幽霊のような存在。実体を持たず、傷ついても自ら再生する。",
    reward: "霊体の核を入手した",
    phases: [
      {
        triggerHpPercent: 30,
        message: "霊体が濃密になり、傷が急速に癒えていく...",
        attackBonus: 0,
      },
    ],
  },
  {
    id: "fallen-angel",
    name: "堕落した天使",
    maxHp: 50,
    attackPower: 6,
    imageUrl: "/edu-aurali.png",
    description:
      "かつてAURALISの守護者だったが、次元崩壊に巻き込まれ堕天した存在。3段階の形態変化を持つ最強のボス。",
    reward: "堕天の羽根を入手した",
    phases: [
      {
        triggerHpPercent: 66,
        message: "堕天使の翼が黒く染まり、力が増幅した！",
        attackBonus: 1,
      },
      {
        triggerHpPercent: 33,
        message: "堕天使が最終形態へ移行... 絶望的な力が溢れ出す！",
        attackBonus: 3,
      },
    ],
  },
];
