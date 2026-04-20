"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  ArrowLeft,
  Star,
  Users,
  Zap,
  Shield,
  Swords,
  Globe2,
  BookOpen,
  Crown,
  Sparkles,
  MapPin,
  Wrench,
  ChevronDown,
  X,
  Scroll,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   DATA TYPES
   ═══════════════════════════════════════════════════════════════ */

type Category = "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史";

interface WikiEntry {
  id: string;
  name: string;
  nameEn?: string;
  category: Category;
  subCategory?: string;
  description: string;
  era?: string;
  affiliation?: string;
  tier?: string;
}

/* ═══════════════════════════════════════════════════════════════
   WIKI DATA — CHARACTERS
   ═══════════════════════════════════════════════════════════════ */

const CHARACTERS: WikiEntry[] = [
  /* Gigapolis/West Continent */
  {
    id: "Diana",
    name: "Diana",
    nameEn: "Diana",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "初代Wonder Woman。E260〜E280に台頭。AURALIS Protoの文化的恩恵をもたらした伝説的人物。",
    era: "E260〜E280",
    affiliation: "Gigapolis西大陸",
    tier: "神格・歴史的人物",
  },
  {
    id: "Jen",
    name: "Jen",
    nameEn: "Jen",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Lv938+。E319年にValoria宮殿を掌握。現在もValoria連合圏を主導する現役最強格。",
    era: "E319〜現在",
    affiliation: "Valoria連合圏",
    tier: "Tier 1",
  },
  {
    id: "Tina/Gue",
    name: "Tina/Gue",
    nameEn: "Tina / Gue",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E400年以降、Gigapolis地下街最深部を実効支配。",
    era: "E400〜現在",
    affiliation: "Gigapolis地下街",
    tier: "Tier 1",
  },
  {
    id: "セリア・ドミニクス",
    name: "セリア・ドミニクス",
    nameEn: "Celia Dominicus",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E335〜E370年にAlpha Kaneを倒しSelinopolisと改名。セリア黄金期の創設者。フェルミ音楽・nトークン経済・AURALISすべての頂点に到達した歴史的人物。",
    era: "E335〜E370",
    affiliation: "Selinopolis（旧Gigapolis）",
    tier: "神格・歴史的人物",
  },
  {
    id: "アルファ・ケイン",
    name: "アルファ・ケイン",
    nameEn: "Alpha Kane",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E318年覚醒。戦士決定戦の元チャンピオン。シャドウ・リベリオンのリーダー。ZAMLT量子ファイナンス・コアにハッキングしギガポリス解放戦でメガタワーを占拠。",
    era: "E318〜",
    affiliation: "シャドウ・リベリオン",
    tier: "神格・歴史的人物",
  },
  {
    id: "エリオス・ウォルド",
    name: "エリオス・ウォルド",
    nameEn: "Elios Wald",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "テリアン反乱軍の指導者。エヴァトロンに抵抗したが、E470年に処刑。",
    era: "?〜E470",
    affiliation: "テリアン反乱軍",
    tier: "歴史的人物",
  },
  {
    id: "エル・フォルハウス",
    name: "エル・フォルハウス",
    nameEn: "El Folhaus",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "通称「新時代のルーキー」。E150年にギガポリスのセントラル・タワーを占拠。完全自由経済を確立。",
    era: "E150",
    affiliation: "コーポラタムパブリカ",
    tier: "歴史的人物",
  },
  {
    id: "ティムール・シャー",
    name: "ティムール・シャー",
    nameEn: "Timur Shah",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "移民団のリーダー。10次元ホラズム理論の提唱者。仮想多元宇宙「ペルセポネ」を設計。",
    era: "E0頃",
    affiliation: "移民団",
    tier: "歴史的人物",
  },
  {
    id: "レイラ・ヴィレル・ノヴァ",
    name: "レイラ・ヴィレル・ノヴァ",
    nameEn: "Layla Virell Nova",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Pink Voltage。E325年AURALIS参加。E380〜E400スライム危機で英雄的活躍。E400年冷凍保存。現在AURALIS第二世代。",
    era: "E325〜E400（冷凍）→ E522〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 1",
  },
  {
    id: "弦太郎",
    name: "弦太郎",
    nameEn: "Gentaro",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description: "Lv569。AURALIS関連人物。",
    era: "E325〜",
    affiliation: "AURALIS関連",
    tier: "Tier 2",
  },

  /* AURALIS */
  {
    id: "Kate Patton（初代）",
    name: "Kate Patton（初代）",
    nameEn: "Kate Patton (1st Gen)",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS Collective創設者の1人。E290年正式組織化。E400年エヴァトロン弾圧で逮捕・消息不明。",
    era: "E290〜E400",
    affiliation: "AURALIS Collective第一世代",
    tier: "神格・歴史的人物",
  },
  {
    id: "Kate Patton（新代）",
    name: "Kate Patton（新代）",
    nameEn: "Kate Patton (2nd Gen)",
    category: "キャラクター",
    subCategory: "AURALIS",
    description: "AURALIS第二世代。大地の豊かさ・安定を体現。",
    era: "E522〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 2",
  },
  {
    id: "Lillie Ardent（初代）",
    name: "Lillie Ardent（初代）",
    nameEn: "Lillie Ardent (1st Gen)",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS Collective創設者の1人。Kate初代と共にE290年に組織化。E400年消息不明。",
    era: "E290〜E400",
    affiliation: "AURALIS Collective第一世代",
    tier: "神格・歴史的人物",
  },
  {
    id: "Lillie Ardent（新代）",
    name: "Lillie Ardent（新代）",
    nameEn: "Lillie Ardent (2nd Gen)",
    category: "キャラクター",
    subCategory: "AURALIS",
    description: "AURALIS第二世代。情熱的で大胆。",
    era: "E522〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 2",
  },
  {
    id: "ミナ・エウレカ・エルンスト",
    name: "ミナ・エウレカ・エルンスト",
    nameEn: "Mina Eureka Ernst",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS第二世代。E499年ノスタルジア・コロニー誕生。AI研究員。Genesis Vault創設者。リミナル・フォージ創設者。",
    era: "E499〜現在（29歳）",
    affiliation: "AURALIS Collective第二世代 / リミナル・フォージ",
    tier: "Tier 2",
  },
  {
    id: "Ninny Offenbach",
    name: "Ninny Offenbach",
    nameEn: "Ninny Offenbach",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS第二世代。無邪気で爆発的な活力。原初個体はAlpha Kane時代に別惑星へ。クローン技術で遺伝子継承しGigapolisに再帰還。",
    era: "新代〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 2",
  },

  /* Iris/Crescent */
  {
    id: "アイリス",
    name: "アイリス",
    nameEn: "Iris",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "IRIS現代ランキング1位。ヴァーミリオンの英雄。ブルーワイヤとウォーター・オーブの使い手。トリニティ・アライアンス指導者。E480年頃から活動開始。",
    era: "E480〜現在",
    affiliation: "トリニティ・アライアンス / 元ヴァーミリオン諜報機関長",
    tier: "Tier 1",
  },
  {
    id: "ウィリー",
    name: "ウィリー",
    nameEn: "Willy",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "アイリスのパートナー兼元恋人。",
    era: "E490〜",
    affiliation: "ヴァーミリオン",
    tier: "Tier 2",
  },
  {
    id: "エレナ",
    name: "エレナ",
    nameEn: "Elena",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ヴァーミリオン諜報機関元本部長。アイリスの直属の上司。",
    era: "?〜E505頃",
    affiliation: "ヴァーミリオン諜報機関",
    tier: "Tier 2",
  },
  {
    id: "セバスチャン・ヴァレリウス",
    name: "セバスチャン・ヴァレリウス",
    nameEn: "Sebastian Valerius",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンリーダー。IRIS現代ランキング4位。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    tier: "Tier 2",
  },
  {
    id: "ガレス",
    name: "ガレス",
    nameEn: "Gareth",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリン副リーダー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    tier: "Tier 2",
  },
  {
    id: "フィオナ",
    name: "フィオナ",
    nameEn: "Klaus Fiona",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ブルーローズ統率者。V7急先鋒。IRIS現代ランキング2位。のちにアルファ・ヴェノムと内通。",
    era: "E490〜現在",
    affiliation: "ブルーローズ / アルファ・ヴェノム（内通）",
    tier: "Tier 2",
  },
  {
    id: "マリーナ・ボビン",
    name: "マリーナ・ボビン",
    nameEn: "Marina Bobbin",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ミエルテンガ総統。真の黒幕の可能性。IRIS現代ランキング3位。",
    era: "E515〜現在",
    affiliation: "ミエルテンガ",
    tier: "Tier 2",
  },
  {
    id: "カスチーナ・テンペスト",
    name: "カスチーナ・テンペスト",
    nameEn: "Castina Tempest",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "クロセヴィア首脳。IRIS現代ランキング5位。",
    era: "E515〜現在",
    affiliation: "クロセヴィア",
    tier: "Tier 2",
  },
  {
    id: "イズミ",
    name: "イズミ",
    nameEn: "Izumi",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "アルファ・ヴェノムリーダー。両性具有。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
    tier: "Tier 2",
  },
  {
    id: "レオン",
    name: "レオン",
    nameEn: "Leon",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "シルバー・ヴェノム幹部。",
    era: "E485〜",
    affiliation: "シルバー・ヴェノム",
    tier: "Tier 2",
  },
  {
    id: "ヴィヴィエッタ",
    name: "ヴィヴィエッタ",
    nameEn: "四楓院ヴィヴィエッタ",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "元捕虜。アイリスの救出作戦で救出された。",
    era: "?〜E512",
    affiliation: "捕虜（のち救出）",
    tier: "Tier 2",
  },
  {
    id: "レヴィリア・サーペンティナ",
    name: "レヴィリア・サーペンティナ",
    nameEn: "Levilia Serpentina",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "シルバー・ヴェノム幹部。",
    era: "?〜現在",
    affiliation: "シルバー・ヴェノム",
    tier: "Tier 2",
  },
  {
    id: "クラウス・フィオナ",
    name: "クラウス・フィオナ",
    nameEn: "Klaus Fiona",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ファールージャ社COO。アイリス救出作戦に参加。",
    era: "E510頃",
    affiliation: "ファールージャ社",
    tier: "Tier 2",
  },

  /* Eros-7 */
  {
    id: "リリス・ヴェイン",
    name: "リリス・ヴェイン",
    nameEn: "Lilith Vaine",
    category: "キャラクター",
    subCategory: "Eros-7",
    description: "女性リーダー。搾取生物の制御技術を開発。",
    era: "E0頃",
    affiliation: "Eros-7",
    tier: "歴史的人物",
  },
  {
    id: "シルヴィア・クロウ",
    name: "シルヴィア・クロウ",
    nameEn: "Sylvia Crow",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "女性リーダー。エスパー能力で搾取生物危機を収束。男性指令省を設立。",
    era: "E97〜E101",
    affiliation: "Eros-7",
    tier: "歴史的人物",
  },
  {
    id: "カーラ・ヴェルム",
    name: "カーラ・ヴェルム",
    nameEn: "Cara Verm",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "スクイーズ・アビス（560階地下搾取施設）を建設。",
    era: "E380〜E505",
    affiliation: "Eros-7",
    tier: "Tier 2",
  },
  {
    id: "ガロ",
    name: "ガロ",
    nameEn: "Garo",
    category: "キャラクター",
    subCategory: "Eros-7",
    description: "シャドウ・ユニオン指導者。アヤカ・リンの盟友。",
    era: "E330〜",
    affiliation: "シャドウ・ユニオン",
    tier: "Tier 2",
  },
  {
    id: "アヤカ・リン",
    name: "アヤカ・リン",
    nameEn: "Ayaka Rin",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "Lv.842。搾精生物専門ハンター。マトリカル・リフォーム運動を組織。",
    era: "E380〜",
    affiliation: "シャドウ・ユニオン / マトリカル・リフォーム運動",
    tier: "Tier 1",
  },
];

/* ═══════════════════════════════════════════════════════════════
   WIKI DATA — TERMINOLOGY
   ═══════════════════════════════════════════════════════════════ */

const TERMINOLOGY: WikiEntry[] = [
  /* 宇宙・天文 */
  {
    id: "E16連星系",
    name: "E16連星系",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "M104銀河（ソンブレロ銀河）ハロー領域に位置する連星系。主星Ea16（黄白色巨星）と伴星Eb16（赤色矮星）からなる。",
  },
  {
    id: "Ea16",
    name: "Ea16",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の主星。スペクトル型K2、質量1.2太陽質量。",
  },
  {
    id: "Eb16",
    name: "Eb16",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の伴星。スペクトル型M3、質量0.4太陽質量。",
  },
  {
    id: "シンフォニー・オブ・スターズ",
    name: "シンフォニー・オブ・スターズ",
    nameEn: "Symphony of Stars",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の中心惑星。Ea16のハビタブルゾーン内に位置。自転周期44時間4分、重力0.92G。",
  },
  {
    id: "Eros-7",
    name: "Eros-7",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16外縁惑星。重力1.1G、薄い酸素大気。女性主導のマトリカル社会が形成された。",
  },
  {
    id: "惑星ビブリオ",
    name: "惑星ビブリオ",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "学術都市惑星。ロレンツィオ国際大学がある。",
  },
  {
    id: "惑星Solaris",
    name: "惑星Solaris",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "Ninny Offenbachの原初個体が離脱した惑星。",
  },
  {
    id: "M104銀河",
    name: "M104銀河",
    nameEn: "M104 Galaxy",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "ソンブレロ銀河。E16連星系が位置する銀河。",
  },
  {
    id: "ノスタルジア・コロニー",
    name: "ノスタルジア・コロニー",
    nameEn: "Nostalgia Colony",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "ミナ・エウレカの出生地。E509年にAlpha Venomに攻撃された。",
  },

  /* 歴史・時代 */
  {
    id: "東暦",
    name: "東暦（E暦）",
    category: "歴史",
    subCategory: "歴史・時代",
    description: "E1 = AD 3501から始まる暦法。",
  },
  {
    id: "バーズ帝国",
    name: "バーズ帝国",
    nameEn: "Birds Empire",
    category: "歴史",
    subCategory: "歴史・時代",
    description: "E15〜E61年。軍閥ファランクスによる星系統一。",
  },
  {
    id: "セリア黄金期",
    name: "セリア黄金期",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E335〜E370年。フェルミ音楽・nトークン経済・AURALISの頂点。",
  },
  {
    id: "パクス・ロンバルディカ",
    name: "パクス・ロンバルディカ",
    nameEn: "Pax Lombardica",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E205〜E278年。コーポラタムパブリカの全盛期。",
  },
  {
    id: "スライム危機",
    name: "スライム危機",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E380〜E400年。搾取生物の遺伝子変異による大災害。",
  },
  {
    id: "テクノ文化ルネサンス",
    name: "テクノ文化ルネサンス",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E475〜E500年。次元極地平技術の民主化と文化融合。",
  },

  /* 組織・制度 */
  {
    id: "AURALIS",
    name: "AURALIS Collective",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "「光と音を永遠にする」を理念とする音楽・文化集団。第一世代（E290〜）と第二世代（E522〜）。",
  },
  {
    id: "ZAMLT",
    name: "ZAMLT",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "E301〜E318年。5超巨大企業国家の統合体。量子ファイナンス・コアで経済を掌握。",
  },
  {
    id: "ネオクラン同盟",
    name: "ネオクラン同盟",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "分散統治モデルを推進する同盟。UECO統合後は銀河系コンソーシアムの中核。",
  },
  {
    id: "UECO",
    name: "UECO",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "星間経済協同組合。ヒーローエージェンシーと統合。",
  },
  {
    id: "シャドウ・リベリオン",
    name: "シャドウ・リベリオン",
    category: "組織",
    subCategory: "組織・制度",
    description: "ZAMLT期の低階層反乱組織。",
  },
  {
    id: "A-Registry",
    name: "A-Registry（A籍）",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "旅券・市民階級制度。Z1〜Z50に再編された。",
  },
  {
    id: "nトークン",
    name: "nトークン",
    category: "組織",
    subCategory: "組織・制度",
    description: "E16連星系の基軸通貨。",
  },

  /* クレセント地方 */
  {
    id: "クレセント大地方",
    name: "クレセント大地方",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "シンフォニー・オブ・スターズの東大陸に位置する地域。",
  },
  {
    id: "ヴァーミリオン",
    name: "ヴァーミリオン",
    nameEn: "Vermillion",
    category: "地理",
    subCategory: "クレセント地方",
    description: "ドミニオン・ヴァーミリオン。アイリスの母国。",
  },
  {
    id: "ブルーローズ",
    name: "ブルーローズ",
    nameEn: "Blue Rose",
    category: "地理",
    subCategory: "クレセント地方",
    description: "フィオナが統率する国家。V7の中心。",
  },
  {
    id: "ミエルテンガ",
    name: "ミエルテンガ",
    category: "地理",
    subCategory: "クレセント地方",
    description: "マリーナ・ボビンが総統を務める国家。",
  },
  {
    id: "クロセヴィア",
    name: "クロセヴィア",
    category: "地理",
    subCategory: "クレセント地方",
    description: "カスチーナ・テンペストが首脳を務める国家。",
  },
  {
    id: "SSレンジ",
    name: "SSレンジ",
    category: "地理",
    subCategory: "クレセント地方",
    description: "アイク・ロペスが首脳を務める国家。",
  },
  {
    id: "アイアン・シンジケート",
    name: "アイアン・シンジケート",
    category: "地理",
    subCategory: "クレセント地方",
    description: "レイド・カキザキが首脳を務める国家。",
  },
  {
    id: "SUDOM",
    name: "SUDOM",
    category: "地理",
    subCategory: "クレセント地方",
    description: "クレセント地方の国家の一つ。",
  },
  {
    id: "ファティマ連邦",
    name: "ファティマ連邦",
    category: "地理",
    subCategory: "クレセント地方",
    description: "クレセント地方の国家の一つ。",
  },
  {
    id: "スターク三国",
    name: "スターク三国",
    category: "地理",
    subCategory: "クレセント地方",
    description: "クレセント地方の国家群。",
  },

  /* 軍事・対立組織 */
  {
    id: "シルバー・ヴェノム",
    name: "シルバー・ヴェノム",
    nameEn: "Silver Venom",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "E475年、エヴァトロンΣ-Unit残党から独立した暗黒組織。",
  },
  {
    id: "アルファ・ヴェノム",
    name: "アルファ・ヴェノム",
    nameEn: "Alpha Venom",
    category: "組織",
    subCategory: "軍事・対立組織",
    description: "シルバー・ヴェノムの後継組織。イズミがリーダー。",
  },
  {
    id: "ゴールデン・ヴェノム",
    name: "ゴールデン・ヴェノム",
    nameEn: "Golden Venom",
    category: "組織",
    subCategory: "軍事・対立組織",
    description: "シルバー・ヴェノムの分派組織。",
  },
  {
    id: "ボグダス・ジャベリン",
    name: "ボグダス・ジャベリン",
    nameEn: "Bogdas Javelin",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "セバスチャン・ヴァレリウス率いる軍事組織。テクロサス系譜。",
  },
  {
    id: "V7",
    name: "V7（Vital Seven）",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "クレセント地方の7カ国連合。E515年設立。",
  },
  {
    id: "トリニティ・アライアンス",
    name: "トリニティ・アライアンス",
    nameEn: "Trinity Alliance",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "ヴァーミリオン・ミエルテンガ・ボグダス・ジャベリンの3勢力連合。E520年結成。",
  },

  /* 技術・概念 */
  {
    id: "次元極地平",
    name: "次元極地平",
    nameEn: "Dimension Horizon",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ブラックホール理論を応用した高次元空間アクセス技術。",
  },
  {
    id: "ペルセポネ",
    name: "ペルセポネ",
    nameEn: "Persephone",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ティムール・シャーが設計した仮想多元宇宙。プライマリー・フィールドとして再構築。",
  },
  {
    id: "リミナル・フォージ",
    name: "リミナル・フォージ",
    nameEn: "Liminal Forge",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "E525年設立。ApoloniumとDimension Horizon技術を組み合わせた時相放送プロジェクト。",
  },
  {
    id: "Genesis_Vault",
    name: "Genesis Vault",
    category: "技術",
    subCategory: "技術・概念",
    description: "ミナ・エウレカが運営するブログ。2,000本突破。",
  },
  {
    id: "空間ホール",
    name: "空間ホール",
    category: "技術",
    subCategory: "技術・概念",
    description: "安定した次元間ポータル。",
  },
  {
    id: "次元ピラミッド",
    name: "次元ピラミッド",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "4層構造: Tier Ω（高次元）→ Tier Σ（ペルセポネ）→ Tier Ε（E16）→ Tier Δ（地球AD2026）。",
  },
  {
    id: "搾取生物",
    name: "搾取生物",
    nameEn: "Squeezing Organisms",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "性的エネルギーを吸収する生物。Eros-7で問題化。",
  },
  {
    id: "名の継承制度",
    name: "名の継承制度",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "AURALISの伝統。Kate Patton, Lillie Ardentなどの「名」が世代を超えて継承される。",
  },
  {
    id: "戦士決定戦",
    name: "戦士決定戦",
    category: "用語",
    subCategory: "技術・概念",
    description: "ネオンコロシアムで行われる戦士決定の儀式。",
  },

  /* その他 */
  {
    id: "ファールージャ社",
    name: "ファールージャ社",
    category: "組織",
    subCategory: "その他",
    description: "ミカエル・ガブリエリがCEOの企業。",
  },
  {
    id: "ネオンコロシアム",
    name: "ネオンコロシアム",
    category: "地理",
    subCategory: "その他",
    description:
      "Gigapolisの闘技場。戦士決定戦や文化イベントが開催される。",
  },
  {
    id: "ギガポリス",
    name: "ギガポリス",
    nameEn: "Gigapolis",
    category: "地理",
    subCategory: "その他",
    description:
      "シンフォニー・オブ・スターズ西大陸の主要都市。E400年エヴァトロンにより一時「エヴァポリス」と改名。",
  },
  {
    id: "ジマ・オイル",
    name: "ジマ・オイル",
    category: "用語",
    subCategory: "その他",
    description:
      "クレセント地方の石油資源。アイリスが襲撃作戦を実行。",
  },
  {
    id: "エヴァトロン",
    name: "エヴァトロン",
    nameEn: "Evatron",
    category: "組織",
    subCategory: "その他",
    description:
      "E400年Gigapolisを支配した組織。AURALISを弾圧。E475年崩壊。",
  },
  {
    id: "テクロサス",
    name: "テクロサス",
    category: "組織",
    subCategory: "その他",
    description:
      "軍閥ファランクスから派生した軍事系譜。ボグダス・ジャベリンの起源。",
  },
];

/* ═══════════════════════════════════════════════════════════════
   ALL ENTRIES MERGED
   ═══════════════════════════════════════════════════════════════ */

const ALL_ENTRIES: WikiEntry[] = [...CHARACTERS, ...TERMINOLOGY];

/* ═══════════════════════════════════════════════════════════════
   CATEGORY CONFIG
   ═══════════════════════════════════════════════════════════════ */

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  キャラクター: {
    label: "キャラクター",
    icon: <Users className="w-3.5 h-3.5" />,
    color: "text-nebula-purple",
    bg: "bg-nebula-purple/15",
    border: "border-nebula-purple/30",
  },
  用語: {
    label: "用語",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "text-cosmic-muted",
    bg: "bg-cosmic-surface",
    border: "border-cosmic-border",
  },
  組織: {
    label: "組織",
    icon: <Swords className="w-3.5 h-3.5" />,
    color: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
  },
  地理: {
    label: "地理",
    icon: <Globe2 className="w-3.5 h-3.5" />,
    color: "text-electric-blue",
    bg: "bg-electric-blue/15",
    border: "border-electric-blue/30",
  },
  技術: {
    label: "技術",
    icon: <Wrench className="w-3.5 h-3.5" />,
    color: "text-gold-accent",
    bg: "bg-gold-accent/15",
    border: "border-gold-accent/30",
  },
  歴史: {
    label: "歴史",
    icon: <Scroll className="w-3.5 h-3.5" />,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
  },
};

const FILTER_CATEGORIES: ("全て" | Category)[] = [
  "全て",
  "キャラクター",
  "用語",
  "組織",
  "地理",
  "技術",
  "歴史",
];

/* ═══════════════════════════════════════════════════════════════
   SEEDED PRNG FOR STARS
   ═══════════════════════════════════════════════════════════════ */

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ═══════════════════════════════════════════════════════════════
   STAR FIELD
   ═══════════════════════════════════════════════════════════════ */

function StarField() {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: seededRandom(i * 7 + 1)() * 100,
        top: seededRandom(i * 13 + 3)() * 100,
        size: seededRandom(i * 17 + 5)() * 2.5 + 0.5,
        delay: seededRandom(i * 23 + 7)() * 5,
        duration: seededRandom(i * 29 + 11)() * 3 + 2,
        opacity: seededRandom(i * 31 + 13)() * 0.7 + 0.3,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WIKI CARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function WikiCard({ entry, isExpanded, onToggle }: { entry: WikiEntry; isExpanded: boolean; onToggle: () => void }) {
  const catConfig = CATEGORY_CONFIG[entry.category];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isExpanded]);

  return (
    <div
      id={entry.id}
      ref={ref}
      className={`glass-card glass-card-hover rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isExpanded ? "ring-1 ring-nebula-purple/50 shadow-lg shadow-nebula-purple/10" : ""
      }`}
      onClick={onToggle}
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${catConfig.color} ${catConfig.bg} ${catConfig.border}`}
              >
                {catConfig.icon}
                {entry.subCategory || catConfig.label}
              </span>
              {entry.tier && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-accent/15 text-gold-accent border border-gold-accent/30">
                  {entry.tier}
                </span>
              )}
            </div>
            <h3 className={`text-sm sm:text-base font-bold ${catConfig.color} leading-tight`}>
              {entry.name}
              {entry.nameEn && (
                <span className="text-[11px] font-normal text-cosmic-muted ml-1.5">
                  {entry.nameEn}
                </span>
              )}
            </h3>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-cosmic-muted shrink-0 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Brief description (always shown) */}
        <p className="text-xs sm:text-sm text-cosmic-muted leading-relaxed line-clamp-2">
          {entry.description}
        </p>

        {/* Meta info (compact) */}
        {(entry.era || entry.affiliation) && !isExpanded && (
          <div className="flex flex-wrap gap-2 mt-3">
            {entry.era && (
              <span className="text-[10px] text-electric-blue bg-electric-blue/10 px-1.5 py-0.5 rounded">
                {entry.era}
              </span>
            )}
            {entry.affiliation && (
              <span className="text-[10px] text-cosmic-muted bg-cosmic-surface px-1.5 py-0.5 rounded truncate max-w-[200px]">
                {entry.affiliation}
              </span>
            )}
          </div>
        )}

        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-cosmic-border/30 space-y-3">
            <p className="text-sm text-cosmic-text/90 leading-relaxed">
              {entry.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {entry.era && (
                <div className="bg-cosmic-dark/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-cosmic-muted mb-0.5">時代</p>
                  <p className="text-xs text-electric-blue font-medium">{entry.era}</p>
                </div>
              )}
              {entry.affiliation && (
                <div className="bg-cosmic-dark/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-cosmic-muted mb-0.5">所属</p>
                  <p className="text-xs text-cosmic-text font-medium">{entry.affiliation}</p>
                </div>
              )}
              {entry.tier && (
                <div className="bg-cosmic-dark/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-cosmic-muted mb-0.5">Tier</p>
                  <p className="text-xs text-gold-accent font-medium">{entry.tier}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN WIKI PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function WikiPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"全て" | Category>("全て");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* Handle hash on mount */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setExpandedId(decodeURIComponent(hash));
      // Small delay to allow render
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, []);

  /* Filter entries */
  const filteredEntries = useMemo(() => {
    let entries = ALL_ENTRIES;

    // Category filter
    if (activeCategory !== "全て") {
      entries = entries.filter((e) => e.category === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      entries = entries.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.nameEn && e.nameEn.toLowerCase().includes(q)) ||
          e.description.toLowerCase().includes(q) ||
          (e.subCategory && e.subCategory.toLowerCase().includes(q)) ||
          (e.affiliation && e.affiliation.toLowerCase().includes(q)) ||
          (e.era && e.era.toLowerCase().includes(q))
      );
    }

    return entries;
  }, [search, activeCategory]);

  /* Stats */
  const totalEntries = ALL_ENTRIES.length;
  const charCount = ALL_ENTRIES.filter((e) => e.category === "キャラクター").length;
  const termCount = totalEntries - charCount;

  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cosmic-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-14">
            <a
              href="/"
              className="flex items-center gap-2 text-cosmic-muted hover:text-electric-blue transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">EDU</span>
            </a>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-nebula-purple" />
              <span className="text-sm font-bold text-cosmic-gradient">EDU Wiki</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cosmic-gradient mb-3 tracking-wider">
              EDU 百科事典
            </h1>
            <p className="text-sm text-cosmic-muted max-w-xl mx-auto">
              Eternal Dominion Universe — キャラクター・用語・組織・地理の全データ
            </p>
            <div className="flex justify-center gap-4 mt-4 text-xs text-cosmic-muted">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-nebula-purple" />
                キャラクター {charCount}
              </span>
              <span className="text-cosmic-border">|</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-electric-blue" />
                用語・その他 {termCount}
              </span>
              <span className="text-cosmic-border">|</span>
              <span>計 {totalEntries}項目</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="glass-card rounded-xl flex items-center gap-3 px-4 py-3 transition-all duration-200 focus-within:ring-1 focus-within:ring-nebula-purple/50">
              <Search className="w-4 h-4 text-cosmic-muted shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="検索…（名前、英語名、説明文など）"
                className="flex-1 bg-transparent text-sm text-cosmic-text placeholder:text-cosmic-muted/60 outline-none"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    searchRef.current?.focus();
                  }}
                  className="text-cosmic-muted hover:text-cosmic-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const config = cat !== "全て" ? CATEGORY_CONFIG[cat] : null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    isActive
                      ? cat === "全て"
                        ? "bg-nebula-purple/20 border-nebula-purple/50 text-nebula-purple"
                        : `${config?.bg} ${config?.border} ${config?.color}`
                      : "bg-transparent border-cosmic-border/30 text-cosmic-muted hover:bg-cosmic-surface hover:border-cosmic-border"
                  }`}
                >
                  {cat === "全て" ? (
                    <Sparkles className="w-3 h-3" />
                  ) : (
                    config?.icon
                  )}
                  {cat === "全て" ? `全て (${totalEntries})` : `${cat} (${
                    ALL_ENTRIES.filter((e) => e.category === cat).length
                  })`}
                </button>
              );
            })}
          </div>

          {/* Results info */}
          <div className="mb-6 text-xs text-cosmic-muted">
            {search || activeCategory !== "全て" ? (
              <span>
                {filteredEntries.length} 件の結果
                {search && (
                  <span>
                    {" "}
                    — 「<span className="text-electric-blue">{search}</span>」で検索中
                  </span>
                )}
              </span>
            ) : (
              <span>全 {filteredEntries.length} 項目を表示中</span>
            )}
          </div>

          {/* Cards Grid */}
          {filteredEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(100vh-380px)] overflow-y-auto pr-1 custom-scrollbar">
              {filteredEntries.map((entry) => (
                <WikiCard
                  key={entry.id}
                  entry={entry}
                  isExpanded={expandedId === entry.id}
                  onToggle={() =>
                    setExpandedId((prev) => (prev === entry.id ? null : entry.id))
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-cosmic-border mx-auto mb-4" />
              <p className="text-cosmic-muted text-sm">
                該当する項目が見つかりません
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("全て");
                }}
                className="mt-4 text-xs text-electric-blue hover:underline"
              >
                フィルターをリセット
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cosmic-border/50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent" />
          <p className="text-xs text-cosmic-muted">
            EDU 百科事典 — Eternal Dominion Universe 統合時空構造書 v3.0
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-electric-blue hover:underline transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            メインページに戻る
          </a>
        </div>
      </footer>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 10, 26, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(42, 42, 94, 0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 58, 237, 0.5);
        }
      `}</style>
    </div>
  );
}
