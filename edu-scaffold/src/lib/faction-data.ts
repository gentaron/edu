export const FACTION_TREES = [
  {
    name: "テクロサス系譜",
    nameEn: "Tekrosas Lineage",
    color: "border-edu-accent2",
    dotColor: "bg-edu-accent2",
    textColor: "text-edu-accent2",
    description:
      "E15年のファランクス創設に始まる、最古にして最大の軍事系譜。E295年にテクロサスが統合し、E470年の東方支隊を経て、現在のボグダス・ジャベリンへと至る。",
    descriptionEn:
      "The oldest and largest military lineage, beginning with the founding of Phalanx in E15. Tekrosas unified it in E295, through the Eastern Detachment in E470, leading to the current Bogdas Javelin.",
    keyMembers: ["ファリエル", "ニニギス・カラス", "セバスチャン・ヴァレリウス", "ガレス"],
    keyMembersEn: ["Fariel", "Ninigis Karas", "Sebastian Valerius", "Gales"],
    alliances: "トリニティ・アライアンスと同盟関係。V7及びブルーローズとは協調関係にある。",
    alliancesEn: "Allied with Trinity Alliance. Cooperative relations with V7 and Blue Rose.",
    nodes: [
      { year: "E15", name: "ファランクス", nameEn: "Phalanx" },
      { year: "E295", name: "テクロサス", nameEn: "Tekrosas" },
      { year: "E470", name: "東方支隊", nameEn: "Eastern Detachment" },
      { year: "現在", name: "ボグダス・ジャベリン", nameEn: "Bogdas Javelin" },
    ],
  },
  {
    name: "Alpha Venom系譜",
    nameEn: "Alpha Venom Lineage",
    color: "border-red-400",
    dotColor: "bg-red-400",
    textColor: "text-red-400",
    description:
      "E420年のΣ-Unit実験に端を発する暗殺・破壊活動の系譜。シルバー・ヴェノムからアルファ・ヴェノム、ゴールデン・ヴェノムへと進化し、最強の毒殺術を継承する。",
    descriptionEn:
      "A lineage of assassination and destruction originating from the Σ-Unit experiment in E420. Evolved from Silver Venom to Alpha Venom and Golden Venom, inheriting the deadliest poison arts.",
    keyMembers: ["マスター・ヴェノム", "イズミ", "レヴィリア・サーペンティナ", "レオン"],
    keyMembersEn: ["Master Venom", "Izumi", "Leviria Serpentina", "Leon"],
    alliances: "独立系組織。シルバー・ヴェノム残党（ラストマン）が分離している。",
    alliancesEn: "Independent organization. Silver Venom remnants (Lastman) have splintered off.",
    nodes: [
      { year: "E420", name: "Σ-Unit", nameEn: "Σ-Unit" },
      { year: "E475", name: "シルバー・ヴェノム", nameEn: "Silver Venom" },
      {
        year: "E500",
        name: "アルファ・ヴェノム / ゴールデン・ヴェノム",
        nameEn: "Alpha Venom / Golden Venom",
      },
    ],
  },
  {
    name: "政体系譜",
    nameEn: "Political Lineage",
    color: "border-edu-accent2",
    dotColor: "bg-edu-accent2",
    textColor: "text-edu-accent2",
    description:
      "E285年のZAMLT創設から始まる政治的系譜。セリア黄金期、エヴァトロン統治期を経て、ポスト・エヴァトロン分裂により西にValoria、東にトリニティ、異次元にEros-7が生まれた。",
    descriptionEn:
      "A political lineage beginning with ZAMLT's founding in E285. Through Celia's Golden Age and Evatron's rule, the post-Evatron schism birthed Valoria in the west, Trinity in the east, and Eros-7 in another dimension.",
    keyMembers: ["セリア・ドミニクス", "アイリス", "ジェン", "ミナ・エウレカ・エルンスト"],
    keyMembersEn: ["Celia Dominicus", "Iris", "Jen", "Mina Eureka Ernst"],
    alliances: "トリニティ・アライアンスが中心。Valoria連合圏は独立勢力として対立軸にある。",
    alliancesEn:
      "Trinity Alliance is central. The Valoria Alliance exists as an independent opposing force.",
    nodes: [
      { year: "E285", name: "ZAMLT", nameEn: "ZAMLT" },
      { year: "E335", name: "セリア黄金期", nameEn: "Celia's Golden Age" },
      { year: "E400", name: "エヴァトロン", nameEn: "Evatron" },
      {
        year: "E475",
        name: "ポスト・エヴァトロン",
        nameEn: "Post-Evatron",
        children: ["西: Valoria", "東: トリニティ", "V7"],
        childrenEn: ["West: Valoria", "East: Trinity", "V7"],
      },
    ],
  },
  {
    name: "Eros-7 統治系譜",
    nameEn: "Eros-7 Governance Lineage",
    color: "border-pink-400",
    dotColor: "bg-pink-400",
    textColor: "text-pink-400",
    description:
      "Eros-7の独自のマトリカル社会における統治体制の変遷。初期のリーチ・ドレイン危機を経てシルヴィア・クロウが男性指令省を設立。ZAMLTとの統合期を経て、E525年にはシャドウ・ユニオンによるマトリカル・リフォーム運動が勃発する。",
    descriptionEn:
      "Changes in the governance system of Eros-7's unique matriarchal society. After the initial Leechdrain crisis, Sylvia Crow established the Male Directive Bureau. Following ZAMLT integration, the Shadow Union's Matriarchal Reform Movement erupts in E525.",
    keyMembers: [
      "リリス・ヴェイン",
      "シルヴィア・クロウ",
      "カーラ・ヴェルム",
      "アヤカ・リン",
      "ガロ",
      "ゼナ",
    ],
    keyMembersEn: ["Lilith Vain", "Sylvia Crow", "Carla Verm", "Ayaka Rin", "Galo", "Zena"],
    alliances:
      "マトリカル・カウンシル（体制側）vs シャドウ・ユニオン（反体制側）。マトリカル・リフォーム運動がE525年に社会変革を推進。",
    alliancesEn:
      "Matriarchal Council (establishment) vs Shadow Union (anti-establishment). The Matriarchal Reform Movement drives social change in E525.",
    nodes: [
      { year: "E0", name: "Eros-7開拓期", nameEn: "Eros-7 Pioneer Era" },
      {
        year: "E97",
        name: "リーチ・ドレイン危機 → 男性指令省設立",
        nameEn: "Leechdrain Crisis → Male Directive Bureau Established",
      },
      { year: "E330", name: "シャドウ・ユニオン結成", nameEn: "Shadow Union Formed" },
      { year: "E380", name: "スライム危機", nameEn: "Slime Crisis" },
      { year: "E525", name: "マトリカル・リフォーム運動", nameEn: "Matriarchal Reform Movement" },
    ],
  },
  {
    name: "宇宙帝国・銀河統合系譜",
    nameEn: "Cosmic Empire & Galactic Integration",
    color: "border-cyan-400",
    dotColor: "bg-cyan-400",
    textColor: "text-cyan-400",
    description:
      "M104銀河全域にわたる政治的統合の系譜。バーズ帝国に始まり、ロンバルディア帝国、テラン朝共和制を経て、最終的に銀河系コンソーシアムによる銀河規模の統合が実現される。UECOとヒーローエージェンシーの統合がその基盤となった。",
    descriptionEn:
      "A lineage of political integration spanning the entire M104 Galaxy. Beginning with the Birds Empire, through the Lombardia Empire and Terran Republic, culminating in galactic-scale unification by the Galactic Consortium. The integration of UECO and Hero Agency served as its foundation.",
    keyMembers: ["ファランクス創設者", "ロンバルディア皇帝", "ネオクラン同盟指導者"],
    keyMembersEn: ["Phalanx Founder", "Lombardia Emperor", "Neo-Clan Alliance Leader"],
    alliances:
      "銀河系コンソーシアムが中心。ヘゲモニー・パラドックス（新興大国vs現大国の不可避的対立）の回避を志向。",
    alliancesEn:
      "Galactic Consortium is central. Aims to avoid the Hegemony Paradox (inevitable conflict between rising and established powers).",
    nodes: [
      {
        year: "E15",
        name: "バーズ帝国（ファランクス樹立）",
        nameEn: "Birds Empire (Phalanx Founded)",
      },
      { year: "E62", name: "テラン朝共和制", nameEn: "Terran Republic" },
      {
        year: "E275",
        name: "ロンバルディア帝国 vs セクスタス連合",
        nameEn: "Lombardia Empire vs Sextus Alliance",
      },
      { year: "E495", name: "銀河系コンソーシアム設立", nameEn: "Galactic Consortium Established" },
      {
        year: "E500",
        name: "ネオクラン同盟 + UECO + ヒーローエージェンシー統合",
        nameEn: "Neo-Clan Alliance + UECO + Hero Agency Integration",
        children: ["M104銀河全域統治"],
        childrenEn: ["M104 Galaxy-Wide Governance"],
      },
    ],
  },
  {
    name: "アポロン・Dominion大戦系譜",
    nameEn: "Apollo-Dominion War",
    color: "border-yellow-400",
    dotColor: "bg-yellow-400",
    textColor: "text-yellow-400",
    description:
      "アポロン文明圏（ロナン・アーサ、GDP125兆ドル）とDominion/Selinopolis（セリア・ドミニクス、GDP81兆ドル）の全面戦争。ロナンの同盟提案拒絶を端緒にケンタウロスレーザーとG4ファントムパルスが交差。セリアのヴェノム艦隊がアポロン・セントラリスを攻略。両文明壊滅の後、エヴァトロンがDominionを吸収。",
    descriptionEn:
      "A total war between the Apollon civilization (Ronan Arthur, GDP 125T) and Dominion/Selinopolis (Celia Dominicus, GDP 81T). Triggered by Ronan's rejected alliance proposal, the Centaurus Laser clashed with G4 Phantom Pulse. Celia's Venom Fleet conquered Apollon Centralis. Both civilizations annihilated; Evatron absorbed Dominion.",
    keyMembers: [
      "セリア・ドミニクス",
      "ロナン・アーサ",
      "グリム・ダルゴス",
      "ヴァイロン・デアクス",
    ],
    keyMembersEn: ["Celia Dominicus", "Ronan Arthur", "Grim Dargos", "Viron Daxe"],
    alliances:
      "セリア・エヴァトロン同盟（対アポロン）→ 戦後エヴァトロンがDominionを裏切って吸収。グランベルがエヴァトロンに武器供与。",
    alliancesEn:
      "Celia-Evatron alliance (against Apollon) → Post-war Evatron betrayed and absorbed Dominion. Grandel supplied weapons to Evatron.",
    nodes: [
      {
        year: "大戦前",
        name: "Selinopolis（GDP81兆）vs アポロン（GDP125兆）",
        nameEn: "Selinopolis (GDP 81T) vs Apollon (GDP 125T)",
      },
      {
        year: "大戦",
        name: "ケンタウロスレーザー vs G4ファントムパルス",
        nameEn: "Centaurus Laser vs G4 Phantom Pulse",
      },
      {
        year: "決戦",
        name: "ヴェノム艦隊 → アポロン・セントラリス攻略",
        nameEn: "Venom Fleet → Apollon Centralis Conquest",
      },
      {
        year: "戦後",
        name: "エヴァトロンによるDominion吸収・セリア追放",
        nameEn: "Evatron Absorbs Dominion · Celia Exiled",
      },
    ],
  },
  {
    name: "現代宇宙勢力ランキング",
    nameEn: "Modern Cosmic Power Rankings",
    color: "border-edu-accent",
    dotColor: "bg-edu-accent",
    textColor: "text-edu-accent",
    description:
      "第一回宇宙連合会合（オルダシティ開催）を経て形成された現代宇宙の力関係。グランベル（経済1位）、エレシオン（医療2位）、ティエリア（軍事3位）が鼎立し、ファルージャ（文化）、ディオクレニス（探査）、エレシュ（宗教）、プロキオ（貿易）、ロースター（通信）が続く。グランベルとティエリアの間にヘゲモニー・パラドックスの危険性が指摘されている。",
    descriptionEn:
      "The contemporary cosmic power balance formed after the First Cosmic Assembly (held in Aldacity). Grandel (#1 economy), Elyseon (#2 medical), and Tyeria (#3 military) stand as the three pillars, followed by Fallujah (culture), Dioclenis (exploration), Eresh (religion), Prokio (trade), and Roastar (communications). The danger of a Hegemony Paradox between Grandel and Tyeria has been noted.",
    keyMembers: [
      "アルゼン・カーリーン",
      "グレイモンド・ハウザー",
      "女王リアナ・ソリス",
      "マドリス・カーネル",
      "ネイサン・コリンド",
    ],
    keyMembersEn: [
      "Arzen Carleen",
      "Greymond Hauser",
      "Queen Liana Solis",
      "Madris Cernel",
      "Nathan Corind",
    ],
    alliances: "宇宙連合会合で多極的協力体制が議論されたが、グランベル・ティエリア間の緊張は継続。",
    alliancesEn:
      "Multipolar cooperation was discussed at the Cosmic Assembly, but tension between Grandel and Tyeria continues.",
    nodes: [
      {
        year: "1位",
        name: "グランベル（経済・GDP150兆ドル）",
        nameEn: "Grandel (Economy · GDP 150T)",
      },
      {
        year: "2位",
        name: "エレシオン（医療・環境再生）",
        nameEn: "Elyseon (Medical · Environmental Regeneration)",
      },
      {
        year: "3位",
        name: "ティエリア（軍事・防衛ネットワーク）",
        nameEn: "Tyeria (Military · Defense Network)",
      },
      { year: "4位", name: "ファルージャ（文化・外交）", nameEn: "Fallujah (Culture · Diplomacy)" },
      {
        year: "5位",
        name: "ディオクレニス（探査・科学）",
        nameEn: "Dioclenis (Exploration · Science)",
      },
    ],
  },
]
