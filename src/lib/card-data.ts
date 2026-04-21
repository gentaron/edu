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
   64枚のキャラクターカードプール
   Wiki全キャラクターを1枚ずつのカードとして収録
   ═══════════════════════════════════════════════════════ */
const I = (n: string) => `https://raw.githubusercontent.com/gentaron/image/main/${n}`;

export const ALL_CARDS: GameCard[] = [
  /* ════════════════════════════════════════
     必殺 SR ×14 — 伝説級キャラクター
     ════════════════════════════════════════ */
  {
    id: "char-diana",
    name: "ディアナ",
    type: "必殺",
    attack: 10, defense: 0, cost: 4,
    imageUrl: I("Diana.png"),
    flavorText: "「初代Wonder Woman。光の裁きが悪を断つ。」",
    rarity: "SR",
  },
  {
    id: "char-jen",
    name: "ジェン",
    type: "必殺",
    attack: 11, defense: 0, cost: 4,
    imageUrl: I("Jen.png"),
    flavorText: "「Lv938+。Valoriaの覇者が放つ絶対的一撃。」",
    rarity: "SR",
  },
  {
    id: "char-celia",
    name: "セリア・ドミニクス",
    type: "必殺",
    attack: 12, defense: 0, cost: 4,
    imageUrl: I("CeliaDminix.png"),
    flavorText: "「黄金期の女王。一撃に全ての栄光を込めて。」",
    rarity: "SR",
  },
  {
    id: "char-alpha-kane",
    name: "アルファ・ケイン",
    type: "必殺",
    attack: 11, defense: 0, cost: 4,
    imageUrl: I("AlphaKane.png"),
    flavorText: "「シャドウ・リベリオンの魂。量子ハックで世界を変えた。」",
    rarity: "SR",
  },
  {
    id: "char-layla",
    name: "レイラ・ヴィレル・ノヴァ",
    type: "必殺",
    attack: 12, defense: 0, cost: 4,
    imageUrl: I("LaylaVirelNova.png"),
    flavorText: "「Pink Voltageの最終演舞。プラズマが全てを焼き尽くす。」",
    rarity: "SR",
  },
  {
    id: "char-kate-claudia",
    name: "ケイト・クラウディア",
    type: "必殺",
    attack: 10, defense: 0, cost: 4,
    imageUrl: I("KateClaudia.png"),
    flavorText: "「AURALIS創設者。共鳴の極致が敵を滅ぼす。」",
    rarity: "SR",
  },
  {
    id: "char-lily-steiner",
    name: "リリー・スタイナー",
    type: "必殺",
    attack: 9, defense: 0, cost: 3,
    imageUrl: I("LillieSteiner.png"),
    flavorText: "「最終章の歌。旋律が刃となり敵を貫く。」",
    rarity: "SR",
  },
  {
    id: "char-mina",
    name: "ミナ・エウレカ・エルンスト",
    type: "必殺",
    attack: 10, defense: 0, cost: 4,
    imageUrl: I("MinaEurekaErnst.png"),
    flavorText: "「超次元弾発射。次元を超えた一撃が標的を消滅させる。」",
    rarity: "SR",
  },
  {
    id: "char-iris",
    name: "アイリス",
    type: "必殺",
    attack: 11, defense: 0, cost: 4,
    imageUrl: I("Iris.png"),
    flavorText: "「トリニティの指導者。次元の刃で運命を断ち切る。」",
    rarity: "SR",
  },
  {
    id: "char-sylvia-crow",
    name: "シルヴィア・クロウ",
    type: "必殺",
    attack: 10, defense: 0, cost: 4,
    imageUrl: I("SylviaCrow.png"),
    flavorText: "「Eros-7のエスパー。念動力の嵐が敵を圧倒する。」",
    rarity: "SR",
  },
  {
    id: "char-ayaka-rin",
    name: "アヤカ・リン",
    type: "必殺",
    attack: 11, defense: 0, cost: 4,
    imageUrl: I("AyakaRin.png"),
    flavorText: "「Lv.842搾精ハンター。カウパー波が全てを狩る。」",
    rarity: "SR",
  },
  {
    id: "char-fariel",
    name: "ファリエル",
    type: "必殺",
    attack: 9, defense: 0, cost: 3,
    imageUrl: I("Fariel.png"),
    flavorText: "「ボグダス最強の戦力。旋風の一撃が山を断つ。」",
    rarity: "SR",
  },
  {
    id: "char-ninigis",
    name: "ニニギス・カラス",
    type: "必殺",
    attack: 8, defense: 0, cost: 3,
    imageUrl: I("NinigisKaras.png"),
    flavorText: "「ボグダスの切り札。カラスの如き速さで標的を屠る。」",
    rarity: "SR",
  },
  {
    id: "char-slime-woman",
    name: "スライム・ウーマン",
    type: "必殺",
    attack: 0, defense: 0, cost: 4,
    effect: "敵に8ダメージ＋1枚ドロー",
    imageUrl: I("SlimeWoman.png"),
    flavorText: "「高次元からの干渉。スライムの波が全てを飲み込む。」",
    rarity: "SR",
  },

  /* ════════════════════════════════════════
     攻撃 R ×13 — 中堅戦闘キャラクター
     ════════════════════════════════════════ */
  {
    id: "char-erios-wald",
    name: "エリオス・ウォルド",
    type: "攻撃",
    attack: 5, defense: 0, cost: 2,
    imageUrl: I("EriosWald.png"),
    flavorText: "「テリアン反乱軍の旗手。自由のための剣。」",
    rarity: "R",
  },
  {
    id: "char-gentaro",
    name: "弦太郎",
    type: "攻撃",
    attack: 5, defense: 0, cost: 2,
    imageUrl: I("Gentaro.png"),
    flavorText: "「Lv569。AURALISを支える不屈の戦士。」",
    rarity: "R",
  },
  {
    id: "char-sebastian",
    name: "セバスチャン・ヴァレリウス",
    type: "攻撃",
    attack: 5, defense: 0, cost: 2,
    imageUrl: I("SebastianValerius.png"),
    flavorText: "「ボグダス・ジャベリンの指揮官。正確無比な一射。」",
    rarity: "R",
  },
  {
    id: "char-gareth",
    name: "ガレス",
    type: "攻撃",
    attack: 4, defense: 0, cost: 2,
    imageUrl: I("Gareth.png"),
    flavorText: "「ボグダスの猛将。正面突破を信条とする。」",
    rarity: "R",
  },
  {
    id: "char-leon",
    name: "レオン",
    type: "攻撃",
    attack: 5, defense: 0, cost: 2,
    imageUrl: I("Leon.png"),
    flavorText: "「シルバー・ヴェノム幹部。冷酷な一撃。」",
    rarity: "R",
  },
  {
    id: "char-izumi-attack",
    name: "イズミ",
    type: "攻撃",
    attack: 6, defense: 0, cost: 2,
    imageUrl: I("Izumi.png"),
    flavorText: "「アルファ・ヴェノムのリーダー。両性具有の戦闘力。」",
    rarity: "R",
  },
  {
    id: "char-goldilocks",
    name: "ゴルディロックス",
    type: "攻撃",
    attack: 4, defense: 0, cost: 2,
    imageUrl: I("Goldilocks.png"),
    flavorText: "「アルファ・ヴェノムの破壊担当。」",
    rarity: "R",
  },
  {
    id: "char-lastman",
    name: "ラストマン",
    type: "攻撃",
    attack: 6, defense: 0, cost: 3,
    imageUrl: I("Lastman.png"),
    flavorText: "「シルバー・ヴェノム残党。最後の力を振り絞る一撃。」",
    rarity: "R",
  },
  {
    id: "char-temirtaron",
    name: "テミルタロン",
    type: "攻撃",
    attack: 5, defense: 0, cost: 2,
    imageUrl: I("Temirtaron.png"),
    flavorText: "「サイケデリック・コスモロジーの具現化。」",
    rarity: "R",
  },
  {
    id: "char-lilith-vane",
    name: "リリス・ヴェイン",
    type: "攻撃",
    attack: 5, defense: 0, cost: 2,
    imageUrl: I("LilithVane.png"),
    flavorText: "「Eros-7の女性リーダー。搾取技術の制圧者。」",
    rarity: "R",
  },
  {
    id: "char-garo",
    name: "ガロ",
    type: "攻撃",
    attack: 5, defense: 0, cost: 2,
    imageUrl: I("Garo.png"),
    flavorText: "「シャドウ・ユニオンの男性リーダー。反逆の剣。」",
    rarity: "R",
  },
  {
    id: "char-karla-velm",
    name: "カーラ・ヴェルム",
    type: "攻撃",
    attack: 4, defense: 0, cost: 2,
    imageUrl: I("KarlaVelm.png"),
    flavorText: "「スクイーズ・アビスの建設者。搾取プラズマ弾。」",
    rarity: "R",
  },
  {
    id: "char-aria-sol",
    name: "アリア・ソル",
    type: "攻撃",
    attack: 4, defense: 0, cost: 2,
    imageUrl: I("AriaSol.png"),
    flavorText: "「惑星連邦構想の推進者。次元の光で敵を射抜く。」",
    rarity: "R",
  },

  /* ════════════════════════════════════════
     攻撃 C ×9 — 一般戦闘キャラクター
     ════════════════════════════════════════ */
  {
    id: "char-gabby",
    name: "フレデリック・ギャビー",
    type: "攻撃",
    attack: 2, defense: 0, cost: 1,
    imageUrl: I("FredericGabby.png"),
    flavorText: "「ボグダスの歴戦の兵。着実な一撃。」",
    rarity: "C",
  },
  {
    id: "char-miyushari",
    name: "ミユシャリ",
    type: "攻撃",
    attack: 3, defense: 0, cost: 2,
    imageUrl: I("Miyushari.png"),
    flavorText: "「ボグダス・ジャベリンの歩兵部隊。」",
    rarity: "C",
  },
  {
    id: "char-yeshibato",
    name: "イェシバトー",
    type: "攻撃",
    attack: 3, defense: 0, cost: 2,
    imageUrl: I("Yeshibato.png"),
    flavorText: "「ボグダス・ジャベリンの斥候兵。」",
    rarity: "C",
  },
  {
    id: "char-yonik",
    name: "ヨニック",
    type: "攻撃",
    attack: 3, defense: 0, cost: 2,
    imageUrl: I("Yonik.png"),
    flavorText: "「ブルーローズの戦士。堅実な剣術。」",
    rarity: "C",
  },
  {
    id: "char-bobristy",
    name: "ボブリスティ",
    type: "攻撃",
    attack: 2, defense: 0, cost: 1,
    imageUrl: I("Bobristy.png"),
    flavorText: "「アルファ・ヴェノムの突撃兵。」",
    rarity: "C",
  },
  {
    id: "char-aike-lopez",
    name: "アイク・ロペス",
    type: "攻撃",
    attack: 3, defense: 0, cost: 2,
    imageUrl: I("AikeLopez.png"),
    flavorText: "「SSレンジ / V7の戦闘要員。」",
    rarity: "C",
  },
  {
    id: "char-katarina",
    name: "カタリナ",
    type: "攻撃",
    attack: 3, defense: 0, cost: 1,
    imageUrl: I("Katarina.png"),
    flavorText: "「アルファ・ヴェノムの暗殺者。速い一撃。」",
    rarity: "C",
  },
  {
    id: "char-reid-kakizaki",
    name: "レイド・カキザキ",
    type: "攻撃",
    attack: 3, defense: 0, cost: 1,
    imageUrl: I("ReidKakizaki.png"),
    flavorText: "「アイアン・シンジケートの戦士。」",
    rarity: "C",
  },
  {
    id: "char-mikael-gabrieli",
    name: "ミカエル・ガブリエリ",
    type: "攻撃",
    attack: 2, defense: 0, cost: 1,
    imageUrl: I("MikaelGabrieli.png"),
    flavorText: "「ファールージャ社の警備員。」",
    rarity: "C",
  },

  /* ════════════════════════════════════════
     防御 R ×8 — 守護者キャラクター
     ════════════════════════════════════════ */
  {
    id: "char-tina-gue",
    name: "ティナ/グエ",
    type: "防御",
    attack: 0, defense: 5, cost: 2,
    imageUrl: I("TinaGue.png"),
    flavorText: "「地下街の支配者。深い闇が仲間を守る。」",
    rarity: "R",
  },
  {
    id: "char-kate-patton",
    name: "ケイト・パットン",
    type: "防御",
    attack: 0, defense: 4, cost: 2,
    imageUrl: I("KatePatton.png"),
    flavorText: "「AURALIS第二世代。癒やしの共鳴で隊を守る。」",
    rarity: "R",
  },
  {
    id: "char-castina",
    name: "カスチーナ・テンペスト",
    type: "防御",
    attack: 0, defense: 4, cost: 2,
    imageUrl: I("CastinaTempest.png"),
    flavorText: "「クロセヴィアの守護者。嵐の如き防壁。」",
    rarity: "R",
  },
  {
    id: "char-elena",
    name: "エレナ",
    type: "防御",
    attack: 0, defense: 5, cost: 2,
    imageUrl: I("Elena.png"),
    flavorText: "「ヴァーミリオン元機関長。経験に裏打ちされた結界。」",
    rarity: "R",
  },
  {
    id: "char-aina",
    name: "アイナ・フォン・リースフェルト",
    type: "防御",
    attack: 0, defense: 5, cost: 2,
    imageUrl: I("AinaVonRiesfeld.png"),
    flavorText: "「ボグダス歴戦の防衛兵。堅牢な盾。」",
    rarity: "R",
  },
  {
    id: "char-casteria",
    name: "カステリア・グレンヴェルト",
    type: "防御",
    attack: 0, defense: 4, cost: 2,
    imageUrl: I("CasteriaGrenvelt.png"),
    flavorText: "「Gigapolis西大陸の防衛者。」",
    rarity: "R",
  },
  {
    id: "char-timur-shah",
    name: "ティムール・シャー",
    type: "防御",
    attack: 0, defense: 5, cost: 2,
    imageUrl: I("TimurShah.png"),
    flavorText: "「移民団のリーダー。10次元理論の防壁。」",
    rarity: "R",
  },
  {
    id: "char-zena",
    name: "ゼナ",
    type: "防御",
    attack: 0, defense: 4, cost: 2,
    imageUrl: I("Zena.png"),
    flavorText: "「Eros-7の女性商人。商売の利益で軍資金を供給。」",
    rarity: "R",
  },

  /* ════════════════════════════════════════
     防御 C ×5 — 一般守護キャラクター
     ════════════════════════════════════════ */
  {
    id: "char-vivietta",
    name: "ヴィヴィエッタ",
    type: "防御",
    attack: 0, defense: 2, cost: 1,
    imageUrl: I("Vivietta.png"),
    flavorText: "「四楓院ヴィヴィエッタ。救出された後も力を尽くす。」",
    rarity: "C",
  },
  {
    id: "char-sheron",
    name: "シェロン・ジェラス",
    type: "防御",
    attack: 0, defense: 2, cost: 1,
    imageUrl: I("SheronJeras.png"),
    flavorText: "「ボグダスの後方支援兵。」",
    rarity: "C",
  },
  {
    id: "char-ilmise",
    name: "イルミーゼ",
    type: "防御",
    attack: 0, defense: 2, cost: 1,
    imageUrl: I("Ilmise.png"),
    flavorText: "「ボグダスの衛生兵。負傷者を守る。」",
    rarity: "C",
  },
  {
    id: "char-piatrino",
    name: "ピアトリーノ",
    type: "防御",
    attack: 0, defense: 3, cost: 2,
    imageUrl: I("Piatrino.png"),
    flavorText: "「ブルーローズの防衛兵。」",
    rarity: "C",
  },
  {
    id: "char-myu",
    name: "ミュー",
    type: "防御",
    attack: 0, defense: 3, cost: 1,
    imageUrl: I("Myu.png"),
    flavorText: "「Gigapolisの守護存在。」",
    rarity: "C",
  },
  {
    id: "char-gil",
    name: "ギル",
    type: "防御",
    attack: 0, defense: 2, cost: 1,
    imageUrl: I("Gil.png"),
    flavorText: "「アルファ・ヴェノムの盾役。」",
    rarity: "C",
  },

  /* ════════════════════════════════════════
     効果 R ×11 — 戦術家キャラクター
     ════════════════════════════════════════ */
  {
    id: "char-el-forhaus",
    name: "エル・フォルハウス",
    type: "効果",
    attack: 0, defense: 0, cost: 2,
    effect: "1枚ドロー＋HPを2回復",
    imageUrl: I("ElForhaus.png"),
    flavorText: "「新時代のルーキー。経済改革の先駆者。」",
    rarity: "R",
  },
  {
    id: "char-lillie-ardent",
    name: "リリー・アーデント",
    type: "効果",
    attack: 0, defense: 0, cost: 2,
    effect: "HPを4回復",
    imageUrl: I("LillieArdent.png"),
    flavorText: "「AURALIS第二世代。献身的な癒やしの手。」",
    rarity: "R",
  },
  {
    id: "char-ninny",
    name: "ニニー・オッフェンバッハ",
    type: "効果",
    attack: 0, defense: 0, cost: 2,
    effect: "敵に3ダメージ＋1枚ドロー",
    imageUrl: I("NinnyOffenbach.png"),
    flavorText: "「クローン継承のハッカー。計算された一撃。」",
    rarity: "R",
  },
  {
    id: "char-fiona",
    name: "フィオナ",
    type: "効果",
    attack: 0, defense: 0, cost: 2,
    effect: "敵に3ダメージ＋1枚ドロー",
    imageUrl: I("Fiona.png"),
    flavorText: "「ブルーローズのCOO。計算高い策略。」",
    rarity: "R",
  },
  {
    id: "char-marina",
    name: "マリーナ・ボビン",
    type: "効果",
    attack: 0, defense: 0, cost: 2,
    effect: "HPを3回復",
    imageUrl: I("MarinaBobbin.png"),
    flavorText: "「ミエルテンガ総統。国を癒やす手。」",
    rarity: "R",
  },
  {
    id: "char-levilia",
    name: "レヴィリア・サーペンティナ",
    type: "効果",
    attack: 0, defense: 0, cost: 3,
    effect: "敵に4ダメージ＋1枚ドロー",
    imageUrl: I("LeviliaSerpentina.png"),
    flavorText: "「シルバー・ヴェノムの毒蛇。見えない毒牙。」",
    rarity: "R",
  },
  {
    id: "char-willie",
    name: "ウィリー",
    type: "効果",
    attack: 0, defense: 0, cost: 2,
    effect: "1枚ドロー＋HPを2回復",
    imageUrl: I("Willie.png"),
    flavorText: "「アイリスのパートナー。常に側で支える。」",
    rarity: "R",
  },
  {
    id: "char-white-noise",
    name: "ホワイトノイズ",
    type: "効果",
    attack: 0, defense: 0, cost: 2,
    effect: "1枚ドロー＋HPを2回復",
    imageUrl: I("WhiteNoise.png"),
    flavorText: "「ボグダスの通信兵。情報の流れが勝利を導く。」",
    rarity: "R",
  },
  {
    id: "char-wadrina",
    name: "ワドリナ",
    type: "効果",
    attack: 0, defense: 0, cost: 2,
    effect: "1枚ドロー＋HPを2回復",
    imageUrl: I("Wadrina.png"),
    flavorText: "「ボグダスの後方要員。」",
    rarity: "R",
  },
  {
    id: "char-azazel",
    name: "アザゼル・ヘクトパス",
    type: "効果",
    attack: 0, defense: 0, cost: 3,
    effect: "敵に5ダメージ",
    imageUrl: I("AzazelHectopus.png"),
    flavorText: "「ヴァーミリオンの異形戦力。触手の一撃。」",
    rarity: "R",
  },
  {
    id: "char-jun",
    name: "ジュン",
    type: "効果",
    attack: 0, defense: 0, cost: 2,
    effect: "敵に2ダメージ＋1枚ドロー",
    imageUrl: I("Jun.png"),
    flavorText: "「スライム・ウーマンと関わりを持つ者。不可解な力。」",
    rarity: "R",
  },

  /* ════════════════════════════════════════
     効果 C ×11 — 一般補助キャラクター
     ════════════════════════════════════════ */
  {
    id: "char-aj",
    name: "AJ",
    type: "効果",
    attack: 0, defense: 0, cost: 1,
    effect: "1枚ドロー",
    imageUrl: I("AJ.png"),
    flavorText: "「アルファ・ヴェノムの情報屋。」",
    rarity: "C",
  },
  {
    id: "char-sitra",
    name: "シトラ・セレス",
    type: "効果",
    attack: 0, defense: 0, cost: 1,
    effect: "1枚ドロー",
    imageUrl: I("SitraCeles.png"),
    flavorText: "「Gigapolisの謎めいた存在。」",
    rarity: "C",
  },



  {
    id: "char-master-venom",
    name: "マスター・ヴェノム",
    type: "効果",
    attack: 0, defense: 0, cost: 2,
    effect: "敵に3ダメージ＋1枚ドロー",
    imageUrl: I("MasterVenom.png"),
    flavorText: "「シルバー・ヴェノムの創設者。毒の知識。」",
    rarity: "C",
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
