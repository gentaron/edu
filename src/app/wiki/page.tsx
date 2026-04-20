"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
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
  User,
  ExternalLink,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   DATA TYPES
   ═══════════════════════════════════════════════════════════════ */

type Category = "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史";

interface SourceLink {
  url: string;
  label: string;
}

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
  image?: string;
  sourceLinks?: SourceLink[];
}

/* ═══════════════════════════════════════════════════════════════
   WIKI DATA — CHARACTERS
   ═══════════════════════════════════════════════════════════════ */

const CHARACTERS: WikiEntry[] = [
  /* Gigapolis/West Continent */
  {
    id: "Diana",
    name: "ディアナ",
    nameEn: "Diana",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "初代Wonder Woman。E260〜E280に台頭。AURALIS Protoの文化的恩恵をもたらした伝説的人物。",
    era: "E260〜E280",
    affiliation: "Gigapolis西大陸",
    tier: "神格・歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Diana.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/DianaWorld.txt", label: "Diana's Story" }],
  },
  {
    id: "Jen",
    name: "ジェン",
    nameEn: "Jen",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Lv938+。E319年にValoria宮殿を掌握し、ZAMLT崩壊後の権力真空を埋める形で台頭。現在もValoria連合圏を主導する現役最強格の一人。Alpha Kaneのギガポリス解放戦に触発されたとも言われ、新ZAMLT期の混乱を鎮め西大陸の安定を確立した。EDU現代において最古参のTier 1アクティブ勢力として、セリア黄金期の記憶を持つ数少ない存在。",
    era: "E319〜現在",
    affiliation: "Valoria連合圏",
    tier: "Tier 1",
    sourceLinks: [
      { url: "https://raw.githubusercontent.com/gentaron/edutext/main/Jenstoryep1.txt", label: "Jen's Story Ep1" },
      { url: "https://raw.githubusercontent.com/gentaron/edutext/main/Jenstoryep2.txt", label: "Jen's Story Ep2" },
      { url: "https://raw.githubusercontent.com/gentaron/edutext/main/Jenstoryep3.txt", label: "Jen's Story Ep3" },
    ],
  },
  {
    id: "Tina/Gue",
    name: "ティナ/グエ",
    nameEn: "Tina / Gue",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E400年以降、Gigapolis地下街最深部を実効支配。エヴァトロン支配期（E400〜E475）において、表の支配者エヴァトロンとは別に地下世界の真の権力者として暗躍。TinaとGueの二つの名で呼ばれることから、正体に関する諸説が存在する。地下経済の掌握と独自の情報ネットワークを駆使して、エヴァトロン崩壊後もその影響力を維持し続けている。",
    era: "E400〜現在",
    affiliation: "Gigapolis地下街",
    tier: "Tier 1",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/gue.txt", label: "Gue's Story" }],
  },
  {
    id: "セリア・ドミニクス",
    name: "セリア・ドミニクス",
    nameEn: "Celia Dminix",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E335〜E370年にAlpha Kaneを倒しSelinopolisと改名。セリア黄金期の創設者。フェルミ音楽・nトークン経済・AURALISすべての頂点に到達した歴史的人物。",
    era: "E335〜E370",
    affiliation: "Selinopolis（旧Gigapolis）",
    tier: "神格・歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/CeliaDminix.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/nebura.txt", label: "Alpha Cain & Celia Dominix's Story" }],
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
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/nebura.txt", label: "Alpha Cain & Celia Dominix's Story" }],
  },
  {
    id: "エリオス・ウォルド",
    name: "エリオス・ウォルド",
    nameEn: "Elios Wald",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "テリアン反乱軍の指導者。エヴァトロンによるGigapolis支配（E400〜E475）に対して、数十年にわたり武装抵抗を組織した悲劇の英雄。A籍制度の廃止と市民の自由回復を掲げ、低階層住民から広範な支持を集めた。しかしE470年にエヴァトロン軍に捕縛され公開処刑。彼の死はテクロサス東方支隊のクレセント大地方常駐（E470）を促す契機となり、のちのクレセント政治情勢に間接的な影響を与えた。",
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
    image: "https://raw.githubusercontent.com/gentaron/image/main/LaylaVirelNova.png",
    sourceLinks: [
      { url: "https://raw.githubusercontent.com/gentaron/edutext/main/laylastats.txt", label: "Layla's Battle Records 1" },
      { url: "https://raw.githubusercontent.com/gentaron/edutext/main/laylastats2.txt", label: "Layla's Battle Records 2" },
      { url: "https://raw.githubusercontent.com/gentaron/edutext/main/LAYLA.txt", label: "Layla Virel Nova's Story" },
    ],
  },
  {
    id: "弦太郎",
    name: "弦太郎",
    nameEn: "Gentaro",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Lv569。E325年頃AURALIS周辺で登場。「光と音を永遠にする」理念に共鳴し、AURALIS Collectiveの活動に深く関わる人物。セリア黄金期（E335〜E370）からエヴァトロン弾圧（E400）、そして第二世代再興（E522）まで、長きにわたりAURALISの興亡を見守り続けてきた。レイラ・ヴィレル・ノヴァのAURALIS参加とも関連があり、彼女のスライム危機での英雄的活躍を近くで目撃した可能性がある。E522年の第二世代正式発足後もAURALISに関連して活動を継続しているとされる。",
    era: "E325〜現在",
    affiliation: "AURALIS関連",
    tier: "Tier 2",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/Gentaroworld.txt", label: "Gentaro's Story" }],
  },

  /* AURALIS */
  {
    id: "Kate Claudia",
    name: "ケイト・クラウディア",
    nameEn: "Kate Claudia",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS Collective創設者。通称「設計者」。E270年にLily Steinerと出会い、表現を諦めない人々の集団「AURALIS」を立ち上げた。E290年正式組織化。「光と音を永遠のものに」を理念とし、リリーが感情の炎ならケイトはその形を与える鋳型だった。E335〜E370年のセリア黄金期にAURALISを最盛期へ導く。E400年エヴァトロン弾圧で逮捕・消息不明。その名は新代のKate Pattonに継承された。",
    era: "E270〜E400",
    affiliation: "AURALIS Collective第一世代（創設者）",
    tier: "神格・歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/KateClaudia.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/kateclaudiaandlilliesteiner.txt", label: "Kate Claudia & Lillie Steiner's Story" }],
  },
  {
    id: "Kate Patton",
    name: "ケイト・パットン",
    nameEn: "Kate Patton",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS Collective第二世代。初代Kate Claudiaの「名」を継承。大地の豊かさ・安定を体現。E522年の第二世代正式発足時に参画。",
    era: "E522〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/KatePatton.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/Auralishentai.txt", label: "AURALIS Spinoff" }],
  },
  {
    id: "Lily Steiner",
    name: "リリー・スタイナー",
    nameEn: "Lily Steiner",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS Collective創設者。本名Lily Steiner、AURALIS公称名「Lillie Ardent 初代」。E270年にKate Claudiaと出会いAURALISを共同創設。「感情の炎」と称され、舞台上で性別の境界を歌う表現は神話となった。レイラのコールドスリープを誰よりも近くで見守り、目覚めるたびに「おかえり」と迎えた。E400年エヴァトロン弾圧で逮捕・最後のステージで「AURALISは消えない。灰から、また燃える」と言い残す。その名は新代のLillie Ardentに継承された。",
    era: "E270〜E400",
    affiliation: "AURALIS Collective第一世代（創設者）",
    tier: "神格・歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/LillieSteiner.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/kateclaudiaandlilliesteiner.txt", label: "Kate Claudia & Lillie Steiner's Story" }],
  },
  {
    id: "Lillie Ardent",
    name: "リリー・アーデント",
    nameEn: "Lillie Ardent",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS Collective第二世代。初代Lily Steinerの「名」を継承。情熱的で大胆。E522年の第二世代正式発足時に参画。",
    era: "E522〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/LillieArdent.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/Auralishentai.txt", label: "AURALIS Spinoff" }],
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
    image: "https://raw.githubusercontent.com/gentaron/image/main/MinaEurekaErnst.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/Auralishentai.txt", label: "AURALIS Spinoff" }],
  },
  {
    id: "Ninny Offenbach",
    name: "ニニー・オッフェンバッハ",
    nameEn: "Ninny Offenbach",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS第二世代。無邪気で爆発的な活力。原初個体はAlpha Kane時代に別惑星へ。クローン技術で遺伝子継承しGigapolisに再帰還。",
    era: "新代〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/NinnyOffenbach.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/Auralishentai.txt", label: "AURALIS Spinoff" }],
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
    image: "https://raw.githubusercontent.com/gentaron/image/main/Iris.png",
    sourceLinks: [
      { url: "https://raw.githubusercontent.com/gentaron/edutext/main/IRIS_1.txt", label: "Iris's Story Ep1" },
      { url: "https://raw.githubusercontent.com/gentaron/edutext/main/IRIS_2.txt", label: "Iris's Story Ep2" },
      { url: "https://raw.githubusercontent.com/gentaron/edutext/main/IRIS_3.txt", label: "Iris's Story Ep3" },
      { url: "https://raw.githubusercontent.com/gentaron/edutext/main/IRIS_4.txt", label: "Iris's Story Ep4" },
    ],
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
      "ボグダス・ジャベリンリーダー。IRIS現代ランキング4位。E490年頃にヴァーミリオンに恒久駐在を開始。テクロサス系譜（E15ファランクス → E295三頭政治改編 → E470東方支隊）を継承する軍事組織の当代指導者。副リーダー・ガレスを筆頭とする精鋭部隊を率い、アイリスのシルバー・ヴェノムに対抗や救出作戦（E510・E519）で中核的な役割を果たした。トリニティ・アライアンスの軍事的支柱として、V7との冷戦期においても安定した戦力を維持。",
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
      "ブルーローズ統率者。V7急先鋒。IRIS現代ランキング2位。E490年頃からクレセント政治の表舞台に登場。アイリス救出作戦（E510）でボグダス・ジャベリンと連携して活躍し、V7設立（E515）に向けて外交を主導。E520年のトリニティ・アライアンス結成後、ミエルテンガ総統への就任をアイリスに推薦するなど協調的姿勢を見せていたが、E523〜E525年にアルファ・ヴェノムと内通していることが発覚。腹心のピアトリーノを通じてブルーローズ地下街を掌握し、二重スパイとしてクレセント全域に激震をもたらした。",
    era: "E490〜現在",
    affiliation: "ブルーローズ / アルファ・ヴェノム（内通）",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Fiona.png",
  },
  {
    id: "マリーナ・ボビン",
    name: "マリーナ・ボビン",
    nameEn: "Marina Bobbin",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ミエルテンガ総統。IRIS現代ランキング3位。E515年のV7設立からクレセント政治の中核を担う。表向きはトリニティ・アライアンスの盟友として振る舞うが、フィオナの裏切り（E523〜E525）との共謀説が浮上しており、クレセント全域における「真の黒幕」の可能性が指摘されている。E520年のアイリスのミエルテンガ首脳就任自体がフィオナの推薦によるものであり、マリーナの関与が疑われている。高圧的な政治手腕と深い情報網で知られ、ランキング3位の実力は伊達ではないとされる。",
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
    description:
      "クロセヴィア首脳。IRIS現代ランキング5位。E515年のV7設立メンバーの一人。テンペストの名が示す通り、荒波のような政治的判断力でクロセヴィアを率いる。V7 vs トリニティの二大陣営対立において、明確な陣営選択を避け独自路線を歩む戦略家。Casteria Grenvelt（カステリア・グレンヴェルト）とは全くの別人物であり、混同を避けるべき。",
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
    description:
      "アルファ・ヴェノムリーダー。両性具有。E518年にシルバー・ヴェノム残党を吸収し、アルファ・ヴェノムを大幅に勢力拡大。E519年には自らの指揮でアイリスの再拉致を成功させるなど、極めて高い戦略的判断力と実行力を持つ。ボブリスティ・ギル・カタリナ・ゴルディロックス・AJらを率い、フィオナを内通者として抱き込むことでV7内部からトリニティ・アライアンスを弱体化させる二重工作を展開。アイリス最大の敵対者。",
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
    id: "ミユシャリ",
    name: "ミユシャリ",
    nameEn: "Miyushari",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリンメンバー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
  },
  {
    id: "ファリエル",
    name: "ファリエル",
    nameEn: "Fariel",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリンメンバー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
  },
  {
    id: "アイナ",
    name: "アイナ・フォン・リースフェルト",
    nameEn: "Aina von Riesfeldt",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリンメンバー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
  },
  {
    id: "ギャビー",
    name: "フレデリック・ギャビー",
    nameEn: "Frederick Gabby",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリンメンバー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
  },
  {
    id: "シェロン",
    name: "シェロン・ジェラス",
    nameEn: "Sheron Jeras",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリンメンバー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
  },
  {
    id: "イルミーゼ",
    name: "イルミーゼ",
    nameEn: "Ilmise",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリンメンバー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
  },
  {
    id: "ホワイトノイズ",
    name: "ホワイトノイズ",
    nameEn: "White Noise",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリンメンバー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
  },
  {
    id: "ワドリナ",
    name: "ワドリナ",
    nameEn: "Wadorina",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリンメンバー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
  },
  {
    id: "ニニギス",
    name: "ニニギス・カラス",
    nameEn: "Ninigisu Karasu",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリンメンバー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
  },
  {
    id: "イェシバトー",
    name: "イェシバトー",
    nameEn: "Yeshibato",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ボグダス・ジャベリンメンバー。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
  },
  {
    id: "アザゼル",
    name: "アザゼル・ヘクトパス",
    nameEn: "Azazel Hectopass",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "元ヴァーミリオン首脳。",
    era: "?〜E480頃",
    affiliation: "ヴァーミリオン",
  },
  {
    id: "ピアトリーノ",
    name: "ピアトリーノ",
    nameEn: "Piatorino",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "フィオナの腹心。ブルー・ローズ地下街担当。",
    era: "E515〜現在",
    affiliation: "ブルーローズ",
  },
  {
    id: "アイク・ロペス",
    name: "アイク・ロペス",
    nameEn: "Ike Lopez",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "SSレンジ首脳。V7メンバー。",
    era: "E515〜現在",
    affiliation: "SSレンジ / V7",
  },
  {
    id: "レイド・カキザキ",
    name: "レイド・カキザキ",
    nameEn: "Raid Kakizaki",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "アイアン・シンジケート首脳。V7メンバー。",
    era: "E515〜現在",
    affiliation: "アイアン・シンジケート / V7",
  },
  {
    id: "ミカエル・ガブリエリ",
    name: "ミカエル・ガブリエリ",
    nameEn: "Mikael Gabrieli",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ファールージャ社CEO。",
    era: "E515〜現在",
    affiliation: "ファールージャ社",
  },
  {
    id: "ヨニック",
    name: "ヨニック",
    nameEn: "Yonick",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "ブルー・ローズ政府最高司令官。",
    era: "E515〜現在",
    affiliation: "ブルーローズ",
  },
  {
    id: "マスター・ヴェノム",
    name: "マスター・ヴェノム",
    nameEn: "Master Venom",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "シルバー・ヴェノムリーダー。通称「影の支配者」。本名不明。",
    era: "E475〜E500頃",
    affiliation: "シルバー・ヴェノム",
    tier: "Tier 2",
  },
  {
    id: "ゴルディロックス",
    name: "ゴルディロックス",
    nameEn: "Goldilocks",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "アルファ・ヴェノムメンバー。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
  },
  {
    id: "カタリナ",
    name: "カタリナ",
    nameEn: "Catalina",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "アルファ・ヴェノムメンバー。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
  },
  {
    id: "ボブリスティ",
    name: "ボブリスティ",
    nameEn: "Boblisti",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "アルファ・ヴェノムメンバー。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
  },
  {
    id: "ギル",
    name: "ギル",
    nameEn: "Gil",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "アルファ・ヴェノムメンバー。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
  },
  {
    id: "ラストマン",
    name: "ラストマン",
    nameEn: "Lastman",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "シルバー・ヴェノム残党。",
    era: "E500〜",
    affiliation: "シルバー・ヴェノム残党",
  },
  {
    id: "AJ",
    name: "AJ",
    nameEn: "Alfred Juce",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description: "アルファ・ヴェノムメンバー。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
  },
  {
    id: "Slime_Woman",
    name: "スライム・ウーマン",
    nameEn: "Slime Woman",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E340年、ティムール・シャーが設計した仮想多元宇宙「ペルセポネ」の実験事故により、高次元世界（Tier Ω）からE16通常次元（Tier Ε）に顕現した超越的存在。スライム危機（E380〜E400）の遠因となった搾取生物の遺伝子変異にも間接的に関与している可能性がある。Tier 1アクティブ現役最強格であり、その能力の正体は高次元物理学の未解明領域に属する。人間社会の枠組みに完全に適応しているわけではなく、特定の個人（Junなど）とのみ特異な相互作用を示す。E340年の顕現から約200年近く存在し続ける、EDU中最も謎めいた存在。",
    era: "E340〜現在",
    affiliation: "不明（高次元存在）",
    tier: "Tier 1",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/Junandslime.txt", label: "Jun's Story" }],
  },
  {
    id: "テミルタロン",
    name: "テミルタロン",
    nameEn: "Temirtalon",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description: "物理学者。サイケデリック・コスモロジーを提唱し次元ピラミッドの原型を構想。テンプル・オブ・ホライゾンを設計。",
    era: "E80〜E90",
    affiliation: "テンプル・オブ・ホライゾン",
    tier: "歴史的人物",
  },
  {
    id: "アリア・ソル",
    name: "アリア・ソル",
    nameEn: "Aria Sol",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description: "E151年の新ヘルシンキ宣言で惑星連邦構想を提案。次元極地平を活用した星間議会を構想。",
    era: "E151頃",
    affiliation: "惑星連邦構想派",
    tier: "歴史的人物",
  },
  {
    id: "ゼナ",
    name: "ゼナ",
    nameEn: "Zena",
    category: "キャラクター",
    subCategory: "Eros-7",
    description: "女性商人。アヤカ・リン・ガロと同盟を結びマトリカル・リフォーム運動に参加。",
    era: "E525〜",
    affiliation: "マトリカル・リフォーム運動",
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
      "Lv.842。搾精生物専門ハンター。マトリカル・リフォーム運動を組織。E380年のスライム危機では、ビキニバリア・カウパー波を駆使してアンダーグリッド深部でスライムの巣を破壊。プライマリー・フィールド経由で全市民に戦闘記録中継し、英雄的な名声を確立。E525年にはシャドウ・ユニオン男性リーダー・ガロや女性商人ゼナと同盟を結び、労働時間短縮・精子レジストリ男女平等化を掲げるマトリカル・リフォーム運動を本格的に組織。Eros-7社会変革の原動力。",
    era: "E380〜現在",
    affiliation: "シャドウ・ユニオン / マトリカル・リフォーム運動",
    tier: "Tier 1",
  },

  /* 新規キャラクター */
  {
    id: "カステリア・グレンヴェルト",
    name: "カステリア・グレンヴェルト",
    nameEn: "Casteria Grenvelt",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "カスチーナ・テンペスト（Castina Tempest、クロセヴィア首脳）とは別人。Gigapolis西大陸を拠点とする人物。クレセント地方の政治情勢とは直接的な関わりを持たないが、西大陸の社会における独自の視点を提供する存在。",
    era: "不詳",
    affiliation: "Gigapolis西大陸",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/CasteriaGrenvelt.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/kasuteriasan.txt", label: "Casteria Grenvelt's Story" }],
  },
  {
    id: "シトラ・セレス",
    name: "シトラ・セレス",
    nameEn: "Sitra Celes",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E16連星系のどこかで活動する個人。EDU世界の主要な事件群とは別の視点から世界を体験する存在。",
    era: "不詳",
    affiliation: "不詳",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/SitraCeles.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/sitra.txt", label: "Sitra Celes's Story" }],
  },
  {
    id: "ミュー",
    name: "ミュー",
    nameEn: "Myu",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E16連星系における個人の物語を軸に、英雄たちとは異なる規模の、しかし等しくEDU世界の一部である生活と冒険を描く。テクノ文化ルネサンス（E475〜E500）以降の現代社会を舞台にしている可能性が高い。",
    era: "不詳",
    affiliation: "不詳",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Myu.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/Myustory.txt", label: "Myu's Story" }],
  },
  {
    id: "ジュン",
    name: "ジュン",
    nameEn: "Jun",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Slime Woman（E340年ペルセポネ事故で顕現した高次元存在）との特異な相互作用を持つ人物。高次元存在であるSlime Womanが人間社会でどのように振る舞うのか、そして特定の個人との間に何が生じるのかを描く、EDU宇宙論にとって重要な物語。",
    era: "E340以降〜現在",
    affiliation: "不詳（Slime Womanとの関連）",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Jun.png",
    sourceLinks: [{ url: "https://raw.githubusercontent.com/gentaron/edutext/main/Junandslime.txt", label: "Jun's Story" }],
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
      "AURALISの伝統。初代Kate Claudiaの「Kate」、初代Lily Steinerの「Lillie Ardent」などの「名」が世代を超えて継承される。同じ特性を持つ者が名を受け継ぐ。",
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

  /* 西大陸都市 */
  {
    id: "Chem",
    name: "Chem",
    category: "地理",
    subCategory: "西大陸都市",
    description: "Gigapolis圏の都市の一つ。",
  },
  {
    id: "Abrivo",
    name: "Abrivo",
    category: "地理",
    subCategory: "西大陸都市",
    description: "Gigapolis圏の都市の一つ。",
  },
  {
    id: "Troyane",
    name: "Troyane",
    category: "地理",
    subCategory: "西大陸都市",
    description: "Gigapolis圏の都市の一つ。",
  },
  {
    id: "Ronve",
    name: "Ronve",
    category: "地理",
    subCategory: "西大陸都市",
    description: "Gigapolis圏の都市の一つ。",
  },
  {
    id: "Poitiers",
    name: "Poitiers",
    category: "地理",
    subCategory: "西大陸都市",
    description: "Gigapolis圏の都市の一つ。",
  },
  {
    id: "Lille",
    name: "Lille",
    category: "地理",
    subCategory: "西大陸都市",
    description: "Gigapolis圏の都市の一つ。",
  },
  {
    id: "Valoria",
    name: "Valoria",
    category: "地理",
    subCategory: "西大陸都市",
    description: "Gigapolis圏の都市。Valoria宮殿があり、JenがE319年に掌握。現在Valoria連合圏の中心。",
  },
  {
    id: "Persepolis",
    name: "Persepolis",
    category: "地理",
    subCategory: "西大陸都市",
    description: "Gigapolis圏の都市の一つ。",
  },
  {
    id: "Selinopolis",
    name: "Selinopolis",
    category: "地理",
    subCategory: "西大陸都市",
    description: "旧Gigapolis。セリア・ドミニクスがAlpha Kaneを倒した後、Selinopolisと改名。",
  },
  {
    id: "エヴァポリス",
    name: "エヴァポリス",
    nameEn: "Evapolis",
    category: "地理",
    subCategory: "西大陸都市",
    description: "Gigapolisのエヴァトロンによる一時的な改名。E475年エヴァトロン崩壊後、Gigapolisの名称が復帰。",
  },
  {
    id: "パラトン",
    name: "パラトン",
    category: "地理",
    subCategory: "西大陸都市",
    description: "E6年に形成された初期都市圏。Gigapolis圏の原型。",
  },
  {
    id: "地下街",
    name: "地下街",
    category: "地理",
    subCategory: "西大陸都市",
    description: "Gigapolisの地下構造。Tina/Gueが最深部を実効支配。アンダーグリッドと接続。",
  },

  /* 施設・建造物 */
  {
    id: "ネオンクレーター宮殿",
    name: "ネオンクレーター宮殿",
    nameEn: "Neon Crater Palace",
    category: "地理",
    subCategory: "施設・建造物",
    description: "Eros-7のシンボル。初期は高さ800m・100階建て。ZAMLT期に1.5km・200階に拡張。",
  },
  {
    id: "スクイーズ・アビス",
    name: "スクイーズ・アビス",
    nameEn: "Squeeze Abyss",
    category: "地理",
    subCategory: "施設・建造物",
    description: "Eros-7の560階地下搾取施設。カーラ・ヴェルムが建設。搾取プラズマ弾を生産。",
  },
  {
    id: "アンダーグリッド",
    name: "アンダーグリッド",
    nameEn: "Undergrid",
    category: "地理",
    subCategory: "施設・建造物",
    description: "Gigapolisの地下ネットワーク。スライム危機ではスライムの巣が形成され、アヤカ・リンが制圧。",
  },
  {
    id: "セントラル・タワー",
    name: "セントラル・タワー",
    nameEn: "Central Tower",
    category: "地理",
    subCategory: "施設・建造物",
    description: "Gigapolisの中心タワー。E150年にエル・フォルハウスが占拠。E524年に諸世界連邦サミット開催。",
  },
  {
    id: "オアシス・ハウス",
    name: "オアシス・ハウス",
    nameEn: "Oasis House",
    category: "地理",
    subCategory: "施設・建造物",
    description: "レイラ・ヴィレル・ノヴァがスライム危機時に拠点とした場所。",
  },
  {
    id: "ロレンツィオ国際大学",
    name: "ロレンツィオ国際大学",
    category: "地理",
    subCategory: "施設・建造物",
    description: "惑星ビブリオにある国際大学。ミナがE514年にAI学部に入学。",
  },
  /* 戦争・歴史事件 */
  {
    id: "エルトナ戦争",
    name: "エルトナ戦争",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E14年。前衛意識 vs 原始意識の対立。人種的緊張の起源となる。",
  },
  {
    id: "アフター戦争",
    name: "アフター戦争",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E62〜E77年。チョンクォン戦争と共にテラン朝共和制への移行をもたらした。",
  },
  {
    id: "チョンクォン戦争",
    name: "チョンクォン戦争",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E62〜E77年。アフター戦争と並ぶテラン朝共和制移行の契機。",
  },
  {
    id: "テラン朝共和制",
    name: "テラン朝共和制",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E62〜E77年の戦争を経て成立した共和制体制。",
  },
  {
    id: "ロンバルディア戦争",
    name: "ロンバルディア戦争",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E88〜E98年。M104銀河規模の大戦。",
  },
  {
    id: "メルディア戦争",
    name: "メルディア戦争",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E275〜E288年。ロンバルディア帝国 vs セクスタス連合。次元兵器投入でロンバルディア勝利。第五次繁栄を招く。",
  },
  {
    id: "マーストリヒト革命",
    name: "マーストリヒト革命",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E150年。エル・フォルハウスがギガポリスのセントラル・タワーを占拠し、完全自由経済を確立。",
  },
  {
    id: "クワンナラ革命",
    name: "クワンナラ革命",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E108〜E114年。分権化・Clan復権をもたらした革命。",
  },
  {
    id: "新ヘルシンキ宣言",
    name: "新ヘルシンキ宣言",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E151年。アリア・ソルが惑星連邦構想を提案。次元極地平を活用した星間議会の構想。",
  },
  {
    id: "コーラの疫病",
    name: "コーラの疫病",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E208年。アンドロメダ系移民の遺伝子に特異的に作用するウイルス。人口15%（約4,500万人）死亡。シャドウ・リベリオン結成の契機。",
  },
  {
    id: "アポロン-ドミニオン戦争",
    name: "アポロン-ドミニオン戦争",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E370年。次元エネルギー鉱脈の支配権を巡るE16 vs M104銀河軍事国家集団。E16の次元兵器が勝利。",
  },
  {
    id: "テリアン反乱",
    name: "テリアン反乱",
    category: "歴史",
    subCategory: "戦争・事件",
    description: "E400〜E470年。エリオス・ウォルド率いるテリアン反乱軍がエヴァトロンに抵抗。E470年エリオス処刑。",
  },
  {
    id: "技術啓蒙時代",
    name: "技術啓蒙時代",
    category: "歴史",
    subCategory: "歴史・時代",
    description: "E80〜E90年。バイオエンジニアリングの爆発的進化。ナノセル・インプラント一般化。人口約5,000万人に達しギガポリスの原型形成。",
  },
  {
    id: "テクノ宗教運動",
    name: "テクノ宗教運動",
    category: "歴史",
    subCategory: "歴史・時代",
    description: "次元極地平を「宇宙の意志」と神聖視する運動。テンプル・オブ・ホライゾン建設。",
  },

  /* 組織・制度（追加） */
  {
    id: "コーポラタムパブリカ",
    name: "コーポラタムパブリカ",
    nameEn: "Corporatum Publica",
    category: "組織",
    subCategory: "組織・制度",
    description: "企業国家体制。E97年頃の第三繁栄期に正式成立。E150年のマーストリヒト革命で完全自由経済へ。",
  },
  {
    id: "シャドウ・ユニオン",
    name: "シャドウ・ユニオン",
    nameEn: "Shadow Union",
    category: "組織",
    subCategory: "組織・制度",
    description: "Eros-7の反体制組織。ガロが指導者。ZAMLT期にナノハッキング技術でバイオリアクター妨害活動を展開。",
  },
  {
    id: "男性指令省",
    name: "男性指令省",
    category: "組織",
    subCategory: "組織・制度",
    description: "Eros-7でシルヴィア・クロウが設立。精子レジストリを運用。",
  },
  {
    id: "マトリカル・カウンシル",
    name: "マトリカル・カウンシル",
    category: "組織",
    subCategory: "組織・制度",
    description: "Eros-7の統治機関。搾取抑制剤でシャドウ・ユニオンの反乱を鎮圧。",
  },
  {
    id: "マトリカル・リフォーム運動",
    name: "マトリカル・リフォーム運動",
    category: "組織",
    subCategory: "組織・制度",
    description: "E525年にアヤカ・リン・ガロ・ゼナが組織。労働時間短縮・精子レジストリ男女平等化を目標。",
  },
  {
    id: "ヒーローエージェンシー",
    name: "ヒーローエージェンシー",
    nameEn: "Hero Agency",
    category: "組織",
    subCategory: "組織・制度",
    description: "ネオクラン同盟と統合され銀河系コンソーシアム設立の中核となった組織。",
  },
  {
    id: "銀河系コンソーシアム",
    name: "銀河系コンソーシアム",
    category: "組織",
    subCategory: "組織・制度",
    description: "E495〜E500年に設立。ネオクラン同盟・UECO・ヒーローエージェンシーの統合体。トゥキディデスの罠回避を志向。",
  },
  {
    id: "テンプル・オブ・ホライゾン",
    name: "テンプル・オブ・ホライゾン",
    nameEn: "Temple of Horizon",
    category: "組織",
    subCategory: "組織・制度",
    description: "テクノ宗教運動の拠点。テミルタロンが次元極地平を神聖視して建設。",
  },
  {
    id: "Σ-Unit",
    name: "Σ-Unit",
    nameEn: "Sigma Unit",
    category: "組織",
    subCategory: "組織・制度",
    description: "E420年にエヴァトロン軍が極秘設立。精神操作・生体改造技術を持つ。のちのシルバー・ヴェノム・アルファ・ヴェノムの起源。",
  },
  {
    id: "テリアン反乱軍",
    name: "テリアン反乱軍",
    category: "組織",
    subCategory: "軍事・対立組織",
    description: "エリオス・ウォルドが率いたエヴァトロンに対する反乱軍。",
  },
  {
    id: "ロンバルディア帝国",
    name: "ロンバルディア帝国",
    nameEn: "Lombardia Empire",
    category: "組織",
    subCategory: "軍事・対立組織",
    description: "メルディア戦争でセクスタス連合と戦った帝国。次元兵器を投入して勝利。",
  },
  {
    id: "セクスタス連合",
    name: "セクスタス連合",
    nameEn: "Sextus Alliance",
    category: "組織",
    subCategory: "軍事・対立組織",
    description: "M104銀河周辺勢力の連合。メルディア戦争でロンバルディア帝国と対峙。",
  },
  {
    id: "クラン・フォーラム",
    name: "クラン・フォーラム",
    nameEn: "Clan Forum",
    category: "組織",
    subCategory: "組織・制度",
    description: "E325年に設立されたネオクラン同盟の下部組織。低階層の声を可視化する役割。",
  },
  {
    id: "ヴェルリット一族",
    name: "ヴェルリット一族",
    nameEn: "Verlit Clan",
    category: "組織",
    subCategory: "軍事・対立組織",
    description: "ラブマーク使いの「魔女」の一族。アイリスがクレセントで遭遇した敵対勢力。",
  },
  {
    id: "ファランクス",
    name: "ファランクス",
    nameEn: "Phalanx",
    category: "組織",
    subCategory: "軍事・対立組織",
    description: "E15〜E61年のバーズ帝国を樹立した軍閥。テクロサスの起源。",
  },

  /* 技術・概念（追加） */
  {
    id: "Apolonium",
    name: "Apolonium",
    category: "技術",
    subCategory: "技術・概念",
    description: "リミナル・フォージの中核技術。Dimension Horizonと組み合わせ時相放送を実現。",
  },
  {
    id: "時相放送",
    name: "時相放送",
    nameEn: "Temporal Broadcast",
    category: "技術",
    subCategory: "技術・概念",
    description: "リミナル・フォージの放送方式。E528年の芸術を地球AD2026年のインターネット上に放送。",
  },
  {
    id: "クオリア・コア",
    name: "クオリア・コア",
    nameEn: "Qualia Core",
    category: "技術",
    subCategory: "技術・概念",
    description: "感情のデジタル化技術。ペルセポネ仮想宇宙にプライマリー・フィールドとして組み込まれ、実体験に近い感覚を獲得。",
  },
  {
    id: "プライマリー・フィールド",
    name: "プライマリー・フィールド",
    nameEn: "Primary Field",
    category: "技術",
    subCategory: "技術・概念",
    description: "ペルセポネ仮想宇宙の主要構成要素。クオリア・コアにより実体験レベルの感覚を提供。",
  },
  {
    id: "量子ファイナンス・コア",
    name: "量子ファイナンス・コア",
    category: "技術",
    subCategory: "技術・概念",
    description: "ZAMLTの中核技術。nトークン取引の95%を掌握。E318年にアルファ・ケインがハッキング。",
  },
  {
    id: "量子バイオバンク",
    name: "量子バイオバンク",
    category: "技術",
    subCategory: "技術・概念",
    description: "ZAMLTとEros-7男性指令省が統合した生体データバンク。",
  },
  {
    id: "ナノセル・インプラント",
    name: "ナノセル・インプラント",
    category: "技術",
    subCategory: "技術・概念",
    description: "技術啓蒙時代（E80〜E90）に一般化。放射線耐性・長寿命化をもたらす。",
  },
  {
    id: "ナノハッキング技術",
    name: "ナノハッキング技術",
    category: "技術",
    subCategory: "技術・概念",
    description: "シャドウ・ユニオンが使用。Eros-7のバイオリアクター妨害活動に展開。",
  },
  {
    id: "搾取触手",
    name: "搾取触手",
    category: "技術",
    subCategory: "技術・概念",
    description: "搾取生物の標準化された形態の一つ。ZAMLTとEros-7で大量生産。",
  },
  {
    id: "搾取ヒル",
    name: "搾取ヒル",
    category: "技術",
    subCategory: "技術・概念",
    description: "搾取生物の形態の一つ。E330年とE318年に1,000体ずつ破壊事件が発生。",
  },
  {
    id: "搾取バクテリア",
    name: "搾取バクテリア",
    category: "技術",
    subCategory: "技術・概念",
    description: "搾取生物の形態の一つ。E505年にナノメディシン（遺伝子修復剤）として再設計。",
  },
  {
    id: "搾取プラズマ弾",
    name: "搾取プラズマ弾",
    category: "技術",
    subCategory: "技術・概念",
    description: "スライムエネルギーを凝縮した破壊兵器。カーラ・ヴェルムがスクイーズ・アビスで生産。",
  },
  {
    id: "ナノメディシン",
    name: "ナノメディシン",
    category: "技術",
    subCategory: "技術・概念",
    description: "E505年に搾取バクテリアを転用して開発された遺伝子修復剤。",
  },
  {
    id: "ナノファイバーブーツ",
    name: "ナノファイバーブーツ",
    category: "技術",
    subCategory: "技術・概念",
    description: "レイラ・ヴィレル・ノヴァが装備する強化ブーツ。高機動戦闘を可能にする。",
  },
  {
    id: "強化グローブ",
    name: "強化グローブ",
    category: "技術",
    subCategory: "技術・概念",
    description: "レイラ・ヴィレル・ノヴァが装備。100tパンチ力を発揮。",
  },
  {
    id: "プラズマカノン",
    name: "プラズマカノン",
    category: "技術",
    subCategory: "技術・概念",
    description: "レイラがスライム焼却に使用したプラズマ兵器。",
  },
  {
    id: "ビキニバリア",
    name: "ビキニバリア",
    category: "技術",
    subCategory: "技術・概念",
    description: "アヤカ・リンが使用する防御技術。搾精生物の攻撃を防ぐ。",
  },
  {
    id: "カウパー波",
    name: "カウパー波",
    category: "技術",
    subCategory: "技術・概念",
    description: "アヤカ・リンの攻撃技術。ビキニバリアと組み合わせて使用。",
  },
  {
    id: "ニューロリンク・インターフェース",
    name: "ニューロリンク・インターフェース",
    category: "技術",
    subCategory: "技術・概念",
    description: "ティムール・シャーがペルセポネ設計に使用。移民が意識をアップロードし過酷環境を克服する技術。",
  },
  {
    id: "量子演算コア",
    name: "量子演算コア",
    category: "技術",
    subCategory: "技術・概念",
    description: "ペルセポネ仮想宇宙を稼働させる量子コンピューティングの中核。",
  },
  {
    id: "曲率航法",
    name: "曲率航法",
    category: "技術",
    subCategory: "技術・概念",
    description: "宇宙航行技術。量子テレポーテーションと共に大移民ルートを構成。",
  },
  {
    id: "量子テレポーテーション",
    name: "量子テレポーテーション",
    category: "技術",
    subCategory: "技術・概念",
    description: "短距離空間転送技術。地球からE16への移民ルートの中継技術。",
  },
  {
    id: "重力崩壊弾頭",
    name: "重力崩壊弾頭",
    category: "技術",
    subCategory: "技術・概念",
    description: "Alpha Venomがノスタルジア・コロニー攻撃で使用。10歳のミナに「戦略への目覚め」をもたらした。",
  },
  {
    id: "次元兵器",
    name: "次元兵器",
    category: "技術",
    subCategory: "技術・概念",
    description: "空間ホール質量破壊兵器。アポロン-ドミニオン戦争（E370年）でE16が勝利。",
  },
  {
    id: "ディメンション・ブリッジ",
    name: "ディメンション・ブリッジ",
    nameEn: "Dimension Bridge",
    category: "技術",
    subCategory: "技術・概念",
    description: "恒久的星間ポータル。E289〜E300年に運用開始。M104銀河全体との貿易を10倍に拡大。",
  },
  {
    id: "バイオリアクター",
    name: "バイオリアクター",
    category: "技術",
    subCategory: "技術・概念",
    description: "搾取生物のエネルギーを変換する装置。リリス・ヴェインが開発。",
  },
  {
    id: "ブラックダイス",
    name: "ブラックダイス",
    nameEn: "Black Dice",
    category: "技術",
    subCategory: "技術・概念",
    description: "アイリスの特殊武器。戦闘術と戦略分析に組み合わせて使用するダイス型武装。",
  },
  {
    id: "ブルーワイヤ",
    name: "ブルーワイヤ",
    nameEn: "Blue Wire",
    category: "技術",
    subCategory: "技術・概念",
    description: "アイリスの代名詞的武装。特殊な青色ワイヤーを操作し、敵の拘束・移動・攻撃に使用。",
  },
  {
    id: "ウォーター・オーブ",
    name: "ウォーター・オーブ",
    nameEn: "Water Orb",
    category: "技術",
    subCategory: "技術・概念",
    description: "アイリスの水属性能力。ウォーターオーブを生成・操作し防御・攻撃に運用。",
  },
  {
    id: "フェルミ音楽",
    name: "フェルミ音楽",
    category: "用語",
    subCategory: "技術・概念",
    description: "セリア黄金期（E335〜E370）に最盛期を迎えた音楽体系。AURALISの創作理念の源流。",
  },
  {
    id: "エスパー能力",
    name: "エスパー能力",
    category: "技術",
    subCategory: "技術・概念",
    description: "テレパシー・エネルギー操作の超能力。シルヴィア・クロウが搾取生物危機の収束に使用。",
  },
  {
    id: "10次元ホラズム理論",
    name: "10次元ホラズム理論",
    category: "技術",
    subCategory: "技術・概念",
    description: "ティムール・シャーが提唱した高次元物理学理論。ペルセポネと次元ピラミッドの理論的基盤。",
  },
  {
    id: "サイケデリック・コスモロジー",
    name: "サイケデリック・コスモロジー",
    category: "用語",
    subCategory: "技術・概念",
    description: "テミルタロンが提唱。次元極地平の宇宙論的解釈。次元ピラミッドの原型を構想。",
  },
  {
    id: "ラブマーク",
    name: "ラブマーク",
    category: "用語",
    subCategory: "技術・概念",
    description: "ヴェルリット一族（魔女）が使用する特殊な印。詳細不明。",
  },
  {
    id: "精子レジストリ",
    name: "精子レジストリ",
    category: "用語",
    subCategory: "組織・制度",
    description: "Eros-7の男性指令省が運用。E525年のマトリカル・リフォーム運動で男女平等化が要求される。",
  },
  {
    id: "トゥキディデスの罠",
    name: "トゥキディデスの罠",
    category: "用語",
    subCategory: "用語",
    description: "新興大国が現大国を脅かす際に戦争が不可避となる国際政治理論。銀河系コンソーシアムが回避を志向。",
  },

  /* 民族集団 */
  {
    id: "フェンドラ人",
    name: "フェンドラ人",
    nameEn: "Fendra",
    category: "用語",
    subCategory: "民族集団",
    description: "技術志向の北欧系移民集団。3移民集団の一つ。",
  },
  {
    id: "アーキアン",
    name: "アーキアン",
    nameEn: "Archian",
    category: "用語",
    subCategory: "民族集団",
    description: "環境適応に優れたアジア系移民集団。3移民集団の一つ。",
  },
  {
    id: "ポロンポロ",
    name: "ポロンポロ",
    nameEn: "Polonpolo",
    category: "用語",
    subCategory: "民族集団",
    description: "文化保存を重視するオセアニア系移民集団。3移民集団の一つ。",
  },
  {
    id: "Iris_Worlds",
    name: "Iris Worlds",
    category: "用語",
    subCategory: "用語",
    description: "アイリス物語の公式サイト。https://irisworlds.netlify.app/story",
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
   CANON SOURCE LINKS (used in WikiCard)
   ═══════════════════════════════════════════════════════════════ */
function CanonSourceLinks({ links }: { links: SourceLink[] }) {
  return (
    <div className="mt-3 pt-3 border-t border-cosmic-border/30">
      <p className="text-[10px] text-cosmic-muted mb-2 uppercase tracking-wider font-bold flex items-center gap-1.5">
        <Scroll className="w-3 h-3" />
        関連資料
      </p>
      <div className="space-y-1.5">
        {links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-nebula-purple/15 bg-nebula-purple/5 text-xs text-nebula-purple/80 hover:bg-nebula-purple/10 transition-all duration-200 hover:scale-[1.01]"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{link.label}</span>
            </a>
        ))}
      </div>
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
        <div className="flex items-start gap-4 mb-3">
          {/* Avatar / Icon */}
          <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-nebula-purple/40 bg-cosmic-dark/80 flex items-center justify-center">
            {entry.image ? (
              <Image
                src={entry.image}
                alt={entry.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-nebula-purple/60" />
            )}
          </div>
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
            {/* Large portrait */}
            {entry.image && (
              <div className="flex justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-2 border-nebula-purple/30 shadow-lg shadow-nebula-purple/10">
                  <Image
                    src={entry.image}
                    alt={entry.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
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
            {entry.sourceLinks && entry.sourceLinks.length > 0 && (
              <CanonSourceLinks links={entry.sourceLinks} />
            )}
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
