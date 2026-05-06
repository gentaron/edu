import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ── PvE カード（10枚）── */
const pveCards = [
  {
    name: "アイリス・ブルーワイヤ",
    nameEn: "Iris Blue Wire",
    attack: 5,
    defense: 0,
    cost: 3,
    effect: "敵単体に5ダメージ。トリニティ・アライアンス指導者の必殺技。",
    imageUrl: "/edu-iris.png",
    flavorText: "「ブルーワイヤは俺の意志だ。」",
    loreSource: "IRIS_1",
  },
  {
    name: "ウォーター・オーブ",
    nameEn: "Water Orb",
    attack: 3,
    defense: 2,
    cost: 2,
    effect: "敵単体に3ダメージ。次ターン、受けるダメージを2軽減する。",
    imageUrl: "/edu-iris.png",
    flavorText: "水は形を変え、あらゆる脅威を受け流す。",
    loreSource: "IRIS_2",
  },
  {
    name: "レイラ・プラズマカノン",
    nameEn: "Layla Plasma Cannon",
    attack: 4,
    defense: 0,
    cost: 2,
    effect: "敵単体に4ダメージ。スライム危機で戦果を上げた重火器。",
    imageUrl: "/edu-aurali.png",
    flavorText: "「スライムの巣は焼却済み。次の任務は？」",
    loreSource: "IRIS_3",
  },
  {
    name: "ディアナの加護",
    nameEn: "Diana's Blessing",
    attack: 0,
    defense: 4,
    cost: 2,
    effect: "このターン、受けるダメージを4無効化する。",
    imageUrl: "/edu-diana.png",
    flavorText: "初代ワンダーウーマンの名を冠した防壁。",
    loreSource: "DianaWorld",
  },
  {
    name: "ケイトの共鳴",
    nameEn: "Kate's Resonance",
    attack: 2,
    defense: 2,
    cost: 1,
    effect: "敵に2ダメージ。プレイヤーのHPを2回復する。",
    imageUrl: "/edu-kate-claudia.png",
    flavorText: "「光と音を永遠にする。」",
    loreSource: "IRIS_4",
  },
  {
    name: "ネオンコロシアム",
    nameEn: "Neon Colosseum",
    attack: 3,
    defense: 1,
    cost: 2,
    effect: "敵単体に3ダメージ。追加で手札を1枚引く。",
    imageUrl: "/edu-hero.png",
    flavorText: "戦士決定戦の舞台。誰が覇者となるか。",
    loreSource: "IRIS_2",
  },
  {
    name: "次元極地平",
    nameEn: "Dimension Horizon",
    attack: 5,
    defense: 0,
    cost: 3,
    effect: "敵全体に2ダメージ。次元技術による広範囲攻撃。",
    imageUrl: "/edu-liminal.png",
    flavorText: "高次元の扉を開く鍵、空間ホールの源。",
    loreSource: "IRIS_3",
  },
  {
    name: "フィオナの策略",
    nameEn: "Fiona's Scheme",
    attack: 4,
    defense: 0,
    cost: 2,
    effect: "敵単体に4ダメージ。しかしプレイヤーは1ダメージ受ける。",
    imageUrl: "/edu-fiona.png",
    flavorText: "裏切り者の策は常に刃に二刃がある。",
    loreSource: "IRIS_4",
  },
  {
    name: "弦太郎の陣",
    nameEn: "Gentaro's Formation",
    attack: 1,
    defense: 3,
    cost: 1,
    effect: "このターン、受けるダメージを3軽減。次ターン攻撃+1。",
    imageUrl: "/edu-auralis.png",
    flavorText: "Lv569の経験が生む完璧な防陣。",
    loreSource: "Gentaroworld",
  },
  {
    name: "リリーの歌声",
    nameEn: "Lily's Song",
    attack: 3,
    defense: 1,
    cost: 2,
    effect: "敵に3ダメージ。戦闘ログに詩を刻む。",
    imageUrl: "/edu-lillie-steiner.png",
    flavorText: "「感情の炎」は消えることを知らない。",
    loreSource: "IRIS_1",
  },
];

/* ── エネミー（3体）── */
const enemies = [
  {
    name: "次元竜レヴィアタン",
    nameEn: "Dimension Dragon Leviathan",
    maxHp: 30,
    attack: 5,
    imageUrl: "/edu-hero.png",
    description:
      "次元極地平の実験で生まれた変異竜。M104銀河の深淵から出現し、E16星系に脅威をもたらす。",
    attackPattern: JSON.stringify([
      { phase: 1, dmg: 3, message: "レヴィアタンが鋭い爪で切り裂いてきた！", special: null },
      { phase: 1, dmg: 3, message: "竜の尾による薙ぎ払い攻撃！", special: null },
      { phase: 2, dmg: 5, message: "レヴィアタンが炎を吐き出した！", special: "fire_breath" },
      { phase: 2, dmg: 5, message: "次元の裂け目から放たれる業火！", special: "fire_breath" },
      { phase: 2, dmg: 7, message: "怒り狂うレヴィアタンが最終攻撃を放つ！", special: "enrage" },
    ]),
    reward: "次元竜討伐の勲章を獲得した。ギガポリス・セントラル・タワーにその名が刻まれるだろう。",
  },
  {
    name: "霊体ウォーカー",
    nameEn: "Phantom Walker",
    maxHp: 20,
    attack: 3,
    imageUrl: "/edu-liminal.png",
    description:
      "ペルセポネ仮想宇宙から漏れ出した霊体実体。物理攻撃が通りにくく、毎ターン自己修復を行う。",
    attackPattern: JSON.stringify([
      { phase: 1, dmg: 2, message: "霊体が冷たい手を伸ばしてきた...", special: "lifesteal_1" },
      { phase: 1, dmg: 2, message: "虚無の叫びが響き渡る！", special: "lifesteal_1" },
      { phase: 1, dmg: 3, message: "霊体が実体化し、強烈な一撃を放つ！", special: "lifesteal_2" },
    ]),
    reward: "霊体の残響が静まり、ペルセポネへの道が一時的に安定した。",
  },
  {
    name: "堕落天使エヴァトロン",
    nameEn: "Fallen Angel Evatron",
    maxHp: 50,
    attack: 7,
    imageUrl: "/edu-hero.png",
    description:
      "E400年にGigapolisを支配した覇王。Σ-Unitの精神操作技術と次元兵器を駆使する最強のボス。3フェーズ制。",
    attackPattern: JSON.stringify([
      { phase: 1, dmg: 4, message: "エヴァトロンが次元波動を放つ！", special: null },
      { phase: 1, dmg: 4, message: "Σ-Unitの残響がプレイヤーの精神を侵食する...", special: null },
      { phase: 1, dmg: 5, message: "エヴァトロンの冷酷な眼光が突き刺さる！", special: null },
      { phase: 2, dmg: 6, message: "第2形態 — エヴァトロンが次元門を展開した！", special: "dimension_door" },
      { phase: 2, dmg: 6, message: "空間の裂け目から暗黒エネルギーが溢れ出す！", special: "dimension_door" },
      { phase: 2, dmg: 7, message: "重力崩壊弾頭の起動音...！", special: null },
      { phase: 3, dmg: 8, message: "最終形態 — 堕落天使が真の力を解放した！", special: "fallen_form" },
      { phase: 3, dmg: 9, message: "全次元を覆い尽くす絶望の波動！", special: "fallen_form" },
      { phase: 3, dmg: 10, message: "エヴァトロンの最終攻撃 — 星系を滅ぼす力！", special: "apocalypse" },
    ]),
    reward: "エヴァトロンの支配は終わりを告げた。ギガポリスの自由が取り戻された。",
  },
];

async function main() {
  console.log("🌱 Seeding PvE cards...");

  for (const card of pveCards) {
    await prisma.pveCard.upsert({
      where: { id: card.nameEn.toLowerCase().replace(/[^a-z0-9]/g, "_") },
      update: card,
      create: {
        ...card,
        id: card.nameEn.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      },
    });
  }
  console.log(`✅ ${pveCards.length} PvE cards seeded`);

  console.log("🌱 Seeding enemies...");
  for (const enemy of enemies) {
    await prisma.enemy.upsert({
      where: { id: enemy.nameEn.toLowerCase().replace(/[^a-z0-9]/g, "_") },
      update: enemy,
      create: {
        ...enemy,
        id: enemy.nameEn.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      },
    });
  }
  console.log(`✅ ${enemies.length} enemies seeded`);

  console.log("🎉 PvE seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
