export const FACTION_TREES = [
  {
    name: "テクロサス系譜",
    color: "border-edu-accent2",
    dotColor: "bg-edu-accent2",
    textColor: "text-edu-accent2",
    description:
      "E15年のファランクス創設に始まる、最古にして最大の軍事系譜。E295年にテクロサスが統合し、E470年の東方支隊を経て、現在のボグダス・ジャベリンへと至る。",
    keyMembers: ["ファリエル", "ニニギス・カラス", "セバスチャン・ヴァレリウス", "ガレス"],
    alliances: "トリニティ・アライアンスと同盟関係。V7及びブルーローズとは協調関係にある。",
    nodes: [
      { year: "E15", name: "ファランクス" },
      { year: "E295", name: "テクロサス" },
      { year: "E470", name: "東方支隊" },
      { year: "現在", name: "ボグダス・ジャベリン" },
    ],
  },
  {
    name: "Alpha Venom系譜",
    color: "border-red-400",
    dotColor: "bg-red-400",
    textColor: "text-red-400",
    description:
      "E420年のΣ-Unit実験に端を発する暗殺・破壊活動の系譜。シルバー・ヴェノムからアルファ・ヴェノム、ゴールデン・ヴェノムへと進化し、最強の毒殺術を継承する。",
    keyMembers: ["マスター・ヴェノム", "イズミ", "レヴィリア・サーペンティナ", "レオン"],
    alliances: "独立系組織。シルバー・ヴェノム残党（ラストマン）が分離している。",
    nodes: [
      { year: "E420", name: "Σ-Unit" },
      { year: "E475", name: "シルバー・ヴェノム" },
      { year: "E500", name: "アルファ・ヴェノム / ゴールデン・ヴェノム" },
    ],
  },
  {
    name: "政体系譜",
    color: "border-edu-accent2",
    dotColor: "bg-edu-accent2",
    textColor: "text-edu-accent2",
    description:
      "E285年のZAMLT創設から始まる政治的系譜。セリア黄金期、エヴァトロン統治期を経て、ポスト・エヴァトロン分裂により西にValoria、東にトリニティ、異次元にEros-7が生まれた。",
    keyMembers: ["セリア・ドミニクス", "アイリス", "ジェン", "ミナ・エウレカ・エルンスト"],
    alliances: "トリニティ・アライアンスが中心。Valoria連合圏は独立勢力として対立軸にある。",
    nodes: [
      { year: "E285", name: "ZAMLT" },
      { year: "E335", name: "セリア黄金期" },
      { year: "E400", name: "エヴァトロン" },
      {
        year: "E475",
        name: "ポスト・エヴァトロン",
        children: ["西: Valoria", "東: トリニティ", "V7"],
      },
    ],
  },
  {
    name: "Eros-7 統治系譜",
    color: "border-pink-400",
    dotColor: "bg-pink-400",
    textColor: "text-pink-400",
    description:
      "Eros-7の独自のマトリカル社会における統治体制の変遷。初期の搾取生物危機を経てシルヴィア・クロウが男性指令省を設立。ZAMLTとの統合期を経て、E525年にはシャドウ・ユニオンによるマトリカル・リフォーム運動が勃発する。",
    keyMembers: [
      "リリス・ヴェイン",
      "シルヴィア・クロウ",
      "カーラ・ヴェルム",
      "アヤカ・リン",
      "ガロ",
      "ゼナ",
    ],
    alliances:
      "マトリカル・カウンシル（体制側）vs シャドウ・ユニオン（反体制側）。マトリカル・リフォーム運動がE525年に社会変革を推進。",
    nodes: [
      { year: "E0", name: "Eros-7開拓期" },
      { year: "E97", name: "搾取生物危機 → 男性指令省設立" },
      { year: "E330", name: "シャドウ・ユニオン結成" },
      { year: "E380", name: "スライム危機" },
      { year: "E525", name: "マトリカル・リフォーム運動" },
    ],
  },
  {
    name: "宇宙帝国・銀河統合系譜",
    color: "border-cyan-400",
    dotColor: "bg-cyan-400",
    textColor: "text-cyan-400",
    description:
      "M104銀河全域にわたる政治的統合の系譜。バーズ帝国に始まり、ロンバルディア帝国、テラン朝共和制を経て、最終的に銀河系コンソーシアムによる銀河規模の統合が実現される。UECOとヒーローエージェンシーの統合がその基盤となった。",
    keyMembers: ["ファランクス創設者", "ロンバルディア皇帝", "ネオクラン同盟指導者"],
    alliances:
      "銀河系コンソーシアムが中心。トゥキディデスの罠（新興大国vs現大国の不可避的対立）の回避を志向。",
    nodes: [
      { year: "E15", name: "バーズ帝国（ファランクス樹立）" },
      { year: "E62", name: "テラン朝共和制" },
      { year: "E275", name: "ロンバルディア帝国 vs セクスタス連合" },
      { year: "E495", name: "銀河系コンソーシアム設立" },
      {
        year: "E500",
        name: "ネオクラン同盟 + UECO + ヒーローエージェンシー統合",
        children: ["M104銀河全域統治"],
      },
    ],
  },
  {
    name: "アポロン・Dominion大戦系譜",
    color: "border-yellow-400",
    dotColor: "bg-yellow-400",
    textColor: "text-yellow-400",
    description: "アポロン文明圏（ロナン・アーサ、GDP125兆ドル）とDominion/Selinopolis（セリア・ドミニクス、GDP81兆ドル）の全面戦争。ロナンの同盟提案拒絶を端緒にケンタウロスレーザーとG4ファントムパルスが交差。セリアのヴェノム艦隊がアポロン・セントラリスを攻略。両文明壊滅の後、エヴァトロンがDominionを吸収。",
    keyMembers: ["セリア・ドミニクス", "ロナン・アーサ", "グリム・ダルゴス", "ヴァイロン・デアクス"],
    alliances: "セリア・エヴァトロン同盟（対アポロン）→ 戦後エヴァトロンがDominionを裏切って吸収。グランベルがエヴァトロンに武器供与。",
    nodes: [
      { year: "大戦前", name: "Selinopolis（GDP81兆）vs アポロン（GDP125兆）" },
      { year: "大戦", name: "ケンタウロスレーザー vs G4ファントムパルス" },
      { year: "決戦", name: "ヴェノム艦隊 → アポロン・セントラリス攻略" },
      { year: "戦後", name: "エヴァトロンによるDominion吸収・セリア追放" },
    ],
  },
  {
    name: "現代宇宙勢力ランキング",
    color: "border-edu-accent",
    dotColor: "bg-edu-accent",
    textColor: "text-edu-accent",
    description: "第一回宇宙連合会合（オルダシティ開催）を経て形成された現代宇宙の力関係。グランベル（経済1位）、エレシオン（医療2位）、ティエリア（軍事3位）が鼎立し、ファルージャ（文化）、ディオクレニス（探査）、エレシュ（宗教）、プロキオ（貿易）、ロースター（通信）が続く。グランベルとティエリアの間にトゥキディデスの罠の危険性が指摘されている。",
    keyMembers: ["アルゼン・カーリーン", "グレイモンド・ハウザー", "女王リアナ・ソリス", "マドリス・カーネル", "ネイサン・コリンド"],
    alliances: "宇宙連合会合で多極的協力体制が議論されたが、グランベル・ティエリア間の緊張は継続。",
    nodes: [
      { year: "1位", name: "グランベル（経済・GDP150兆ドル）" },
      { year: "2位", name: "エレシオン（医療・環境再生）" },
      { year: "3位", name: "ティエリア（軍事・防衛ネットワーク）" },
      { year: "4位", name: "ファルージャ（文化・外交）" },
      { year: "5位", name: "ディオクレニス（探査・科学）" },
    ],
  },
]
