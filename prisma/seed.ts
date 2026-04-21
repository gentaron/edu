import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const cards = [
  // ── Characters ──
  { id: "card_iris", name: "アイリス", type: "character", cost: 5, power: 7, description: "IRIS現代ランキング1位。ブルーワイヤとウォーター・オーブの使い手。トリニティ・アライアンス指導者。", loreRef: "IRIS_1" },
  { id: "card_jen", name: "ジェン", type: "character", cost: 6, power: 8, description: "Lv938+。Valoria連合圏を主導する現役最強格。ZAMLT崩壊後の権力真空を埋める。", loreRef: "Jenstoryep1" },
  { id: "card_layla", name: "レイラ・ヴィレル・ノヴァ", type: "character", cost: 4, power: 6, description: "Pink Voltage。AURALIS Collective第二世代。スライム危機で英雄的活躍。E400年冷凍保存。", loreRef: "LAYLA" },
  { id: "card_kate_claudia", name: "ケイト・クラウディア", type: "character", cost: 3, power: 4, description: "AURALIS Collective創設者。通称「設計者」。「光と音を永遠のものに」。", loreRef: "kateclaudiaandlilliesteiner" },
  { id: "card_lily_steiner", name: "リリー・スタイナー", type: "character", cost: 3, power: 4, description: "AURALIS Collective創設者。「感情の炎」。性別の境界を歌う表現は神話となった。", loreRef: "kateclaudiaandlilliesteiner" },
  { id: "card_alpha_kane", name: "アルファ・ケイン", type: "character", cost: 5, power: 7, description: "シャドウ・リベリオンのリーダー。戦士決定戦の元チャンピオン。", loreRef: "nebura" },
  { id: "card_celia", name: "セリア・ドミニクス", type: "character", cost: 5, power: 6, description: "E335〜E370年にSelinopolisと改名。セリア黄金期の創設者。", loreRef: "nebura" },
  { id: "card_ayaka_rin", name: "アヤカ・リン", type: "character", cost: 4, power: 5, description: "Lv.842。搾取生物専門ハンター。マトリカル・リフォーム運動を組織。", loreRef: "sitra" },
  { id: "card_fiona", name: "フィオナ", type: "character", cost: 3, power: 5, description: "ブルーローズ統率者。IRIS現代ランキング2位。", loreRef: "IRIS_1" },
  { id: "card_diana", name: "ディアナ", type: "character", cost: 3, power: 4, description: "初代Wonder Woman。AURALIS Protoの文化的恩恵をもたらした伝説的人物。", loreRef: "DianaWorld" },
  { id: "card_gentaro", name: "弦太郎", type: "character", cost: 3, power: 3, description: "Lv569。AURALIS Collectiveの活動に深く関わる人物。", loreRef: "Gentaroworld" },
  { id: "card_garo", name: "ガロ", type: "character", cost: 2, power: 3, description: "シャドウ・ユニオン指導者。アヤカ・リンの盟友。", loreRef: "sitra" },
  { id: "card_sebastian", name: "セバスチャン・ヴァレリウス", type: "character", cost: 4, power: 5, description: "ボグダス・ジャベリンリーダー。IRIS現代ランキング4位。", loreRef: "IRIS_1" },
  { id: "card_marina", name: "マリーナ・ボビン", type: "character", cost: 4, power: 5, description: "ミエルテンガ総統。IRIS現代ランキング3位。", loreRef: "IRIS_1" },
  { id: "card_izumi", name: "イズミ", type: "character", cost: 4, power: 5, description: "アルファ・ヴェノムリーダー。アイリス最大の敵対者。", loreRef: "IRIS_1" },
  { id: "card_slime_woman", name: "スライム・ウーマン", type: "character", cost: 7, power: 9, description: "ペルセポネ事故で顕現した超越的存在。Tier 1最強格。", loreRef: "Junandslime" },
  { id: "card_tina_gue", name: "ティナ/グエ", type: "character", cost: 4, power: 5, description: "Gigapolis地下街最深部を実効支配。地下世界の真の権力者。", loreRef: "gue" },
  { id: "card_jun", name: "ジュン", type: "character", cost: 2, power: 2, description: "Slime Womanとの特異な相互作用を持つ人物。", loreRef: "Junandslime" },
  { id: "card_elios", name: "エリオス・ウォルド", type: "character", cost: 3, power: 3, description: "テリアン反乱軍の指導者。悲劇の英雄。", loreRef: "gue" },
  { id: "card_castina", name: "カスチーナ・テンペスト", type: "character", cost: 3, power: 4, description: "クロセヴィア首脳。IRIS現代ランキング5位。", loreRef: "IRIS_1" },

  // ── Events ──
  { id: "card_slime_crisis", name: "スライム危機", type: "event", cost: 3, power: 4, description: "E380〜E400年。搾取生物の遺伝子変異による大災害。相手に4ダメージ。" },
  { id: "card_celia_golden", name: "セリア黄金期", type: "event", cost: 4, power: 3, description: "E335〜E370年。フェルミ音楽・nトークン経済の頂点。相手に3ダメージ。" },
  { id: "card_eltna_war", name: "エルトナ戦争", type: "event", cost: 2, power: 3, description: "大規模軍事衝突。相手に3ダメージ。" },
  { id: "card_terian_revolt", name: "テリアン反乱", type: "event", cost: 1, power: 2, description: "エヴァトロン支配に対する武装抵抗。相手に2ダメージ。" },
  { id: "card_tech_renaissance", name: "テクノ文化ルネサンス", type: "event", cost: 2, power: 2, description: "E475〜E500年。次元極地平技術の民主化と文化融合。2ダメージ。" },
  { id: "card_pax_lombardica", name: "パクス・ロンバルディカ", type: "event", cost: 3, power: 3, description: "E205〜E278年。コーポラタムパブリカの全盛期。3ダメージ。" },
  { id: "card_matrical_reform", name: "マトリカル・リフォーム", type: "event", cost: 2, power: 2, description: "Eros-7における社会変革運動。2ダメージ。" },
  { id: "card_shadow_rebellion", name: "シャドウ・リベリオン", type: "event", cost: 3, power: 3, description: "ZAMLTに対する武装解放運動。3ダメージ。" },

  // ── Tech ──
  { id: "card_blue_wire", name: "ブルーワイヤ", type: "tech", cost: 2, power: 3, description: "アイリスの武器。青い光のワイヤーで攻撃。3ダメージ。" },
  { id: "card_water_orb", name: "ウォーター・オーブ", type: "tech", cost: 3, power: 4, description: "水属性のオーブ。広範囲攻撃が可能。4ダメージ。" },
  { id: "card_bikini_barrier", name: "ビキニバリア", type: "tech", cost: 1, power: 0, description: "アンダーグリッド深部で使用される防壁。サポートカード。" },
  { id: "card_plasma_cannon", name: "プラズマカノン", type: "tech", cost: 4, power: 5, description: "高エネルギープラズマを射出する重火器。5ダメージ。" },
  { id: "card_couper_wave", name: "カウパー波", type: "tech", cost: 2, power: 3, description: "ビキニバリアと併用される波動技術。3ダメージ。" },
  { id: "card_neuro_link", name: "ニューロリンク", type: "tech", cost: 3, power: 3, description: "脳波直接インターフェース。3ダメージ。" },
  { id: "card_quantum_finance", name: "量子ファイナンス・コア", type: "tech", cost: 5, power: 6, description: "ZAMLTの経済支配システム。6ダメージ。" },

  // ── Locations ──
  { id: "card_gigapolis", name: "ギガポリス", type: "location", cost: 3, power: 0, description: "E16最大の都市。味方場キャラ全ての戦力+1。" },
  { id: "card_selinopolis", name: "Selinopolis", type: "location", cost: 2, power: 0, description: "旧Gigapolis。セリア黄金期の首都。味方+1。" },
  { id: "card_eros7", name: "Eros-7", type: "location", cost: 2, power: 0, description: "女性主導のマトリカル社会を持つ外縁惑星。味方+1。" },
  { id: "card_vermillion", name: "ヴァーミリオン", type: "location", cost: 3, power: 0, description: "クレセント大地方の国家。アイリスの故郷。味方+1。" },
  { id: "card_crescent", name: "クレセント大地方", type: "location", cost: 2, power: 0, description: "シンフォニー・オブ・スターズの大陸。味方+1。" },
  { id: "card_temple_horizon", name: "テンプル・オブ・ホライゾン", type: "location", cost: 3, power: 0, description: "次元ピラミッドの原型。味方+1。" },
];

async function main() {
  console.log("🌱 Seeding cards...");

  for (const card of cards) {
    await prisma.card.upsert({
      where: { id: card.id },
      update: card,
      create: card,
    });
  }

  console.log(`✅ ${cards.length} cards seeded`);

  // Create demo decks
  const irisDeck = await prisma.deck.create({
    data: {
      name: "トリニティ・アライアンス",
      cards: {
        create: [
          { cardId: "card_iris", count: 3 },
          { cardId: "card_sebastian", count: 3 },
          { cardId: "card_fiona", count: 3 },
          { cardId: "card_blue_wire", count: 3 },
          { cardId: "card_water_orb", count: 3 },
          { cardId: "card_vermillion", count: 2 },
          { cardId: "card_eltna_war", count: 3 },
          { cardId: "card_plasma_cannon", count: 2 },
          { cardId: "card_bikini_barrier", count: 2 },
          { cardId: "card_slime_crisis", count: 3 },
          { cardId: "card_terian_revolt", count: 3 },
        ],
      },
    },
  });
  console.log(`✅ Deck created: ${irisDeck.name}`);

  const venomDeck = await prisma.deck.create({
    data: {
      name: "アルファ・ヴェノム",
      cards: {
        create: [
          { cardId: "card_izumi", count: 3 },
          { cardId: "card_marina", count: 3 },
          { cardId: "card_castina", count: 3 },
          { cardId: "card_couper_wave", count: 3 },
          { cardId: "card_neuro_link", count: 3 },
          { cardId: "card_crescent", count: 2 },
          { cardId: "card_shadow_rebellion", count: 3 },
          { cardId: "card_quantum_finance", count: 2 },
          { cardId: "card_garo", count: 3 },
          { cardId: "card_matrical_reform", count: 2 },
          { cardId: "card_tech_renaissance", count: 3 },
        ],
      },
    },
  });
  console.log(`✅ Deck created: ${venomDeck.name}`);

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
