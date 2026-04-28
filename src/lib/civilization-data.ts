/* ═══════════════════════════════════════════════════════
   civilization-data.ts — 宇宙5大文明圏データ
   ═══════════════════════════════════════════════════════ */

export interface Civilization {
  id: string
  rank: number
  name: string
  nameEn: string
  color: string
  borderColor: string
  bgColor: string
  icon: string
  leader: string
  leaderWikiId: string
  capital?: string
  gdp?: string
  specialization: string
  description: string
  history: string
  currentStatus: string
  relationships: string[]
  wikiId: string
  href: string
  isHistorical?: boolean
  planets?: string[]
}

export interface CivilizationLeader {
  name: string
  title: string
  civilization: string
  civilizationColor: string
  wealth: string
  source: string
  era: string
  wikiId: string
}

/* ── 現在の宇宙5大文明圏 ── */
export const TOP_CIVILIZATIONS: Civilization[] = [
  {
    id: "granbell",
    rank: 1,
    name: "グランベル",
    nameEn: "Granbell",
    color: "text-amber-400",
    borderColor: "border-amber-400/30 hover:border-amber-400/60",
    bgColor: "from-amber-500/20 via-amber-600/10 to-amber-700/20",
    icon: "Crown",
    leader: "アルゼン・カーリーン大統領",
    leaderWikiId: "アルゼン・カーリーン",
    capital: "オルダシティ",
    gdp: "150京ドル（宇宙全体の約25%）",
    specialization: "量子経済・次元間技術・マルチバース開拓",
    description:
      "宇宙最大の経済圏。GDP150兆ドルで宇宙全体の約25%を占める圧倒的な経済大国。首都オルダシティは宇宙最大の金融センターであり、量子経済システムと次元間技術で他勢力を完全に圧倒している。",
    history:
      "台頭前は宇宙第2位のGDP。アポロン・Dominion大戦を傍観し、戦後の混乱期に他勢力が疲弊する中で急浮上した。初期リーダーはマスター・クインシアスであり、セリアのドミニクス時代を高く評価していた。アルゼン・カーリーン大統領の下で経済帝国を完成させ、現在に至る。エヴァトロンに対し高次元エネルギー兵器、量子制御ミサイル、重力崩壊弾頭などの武器供与を行った。",
    currentStatus:
      "第一回宇宙連合会合の開催地。カーリーン大統領が「争いを超え、共存と繁栄の道を見つけることが次世代への責任」と演説するなど、表向きは協調路線。しかし、その経済的支配力は他勢力に緊張を与えている。",
    relationships: [
      "エレシオン — 経済援助と医療技術供与のパートナー",
      "ティエリア — トゥキディデスの罠の危険性が指摘される対立関係",
      "ファルージャ — 文化外交面での協力",
      "ディオクレニス — 科学技術分野での提携",
      "エヴァトロン — 武器供与を通じた影響力拡大",
    ],
    planets: ["グランベル・プライム", "ノヴァ・エコー", "クインシアス", "ヴェルディ・ステーション"],
    wikiId: "グランベル",
    href: "/civilizations/granbell",
  },
  {
    id: "elyseon",
    rank: 2,
    name: "エレシオン",
    nameEn: "Elyseon",
    color: "text-emerald-400",
    borderColor: "border-emerald-400/30 hover:border-emerald-400/60",
    bgColor: "from-emerald-500/20 via-emerald-600/10 to-emerald-700/20",
    icon: "Heart",
    leader: "女王リアナ・ソリス",
    leaderWikiId: "女王リアナ・ソリス",
    specialization: "医療技術・環境再生技術・平和外交",
    description:
      "医療技術と環境再生技術で宇宙をリードする平和主義文明圏。支配ではなく「生命の維持と再生」を根幹理念とし、他文明圏からの尊敬を集めている。",
    history:
      "長年にわたり医療・環境分野で技術革新を続け、多くの文明圏に技術を提供してきた。リアナ・ソリス女王の治世の下、平和外交を宇宙規模で展開し、対立の緩和に寄与している。",
    currentStatus:
      "ティエリアの軍拡路線に強く反対。ディオクレニスの宇宙探査提案を支持。グランベルの宇宙連合会合で平和的解決を訴え、技術共有の推進を掲げる。",
    relationships: [
      "グランベル — 経済援助と技術供与の関係",
      "ティエリア — 軍拡反対で対立",
      "ディオクレニス — 宇宙探査提案に協力的",
      "ファルージャ — 平和外交で連携",
    ],
    planets: ["エレシオン・プライム", "ソラリス", "ヴィータ", "リーファ"],
    wikiId: "エレシオン",
    href: "/civilizations/elyseon",
  },
  {
    id: "tyeria",
    rank: 3,
    name: "ティエリア",
    nameEn: "Tyeria",
    color: "text-rose-400",
    borderColor: "border-rose-400/30 hover:border-rose-400/60",
    bgColor: "from-rose-500/20 via-rose-600/10 to-rose-700/20",
    icon: "Shield",
    leader: "総帥グレイモンド・ハウザー",
    leaderWikiId: "グレイモンド・ハウザー",
    specialization: "軍事力・防衛ネットワーク・軍事技術輸出",
    description:
      "宇宙最強の軍事力を誇る文明圏。軍事技術の輸出を経済基盤とし、その防衛ネットワークは宇宙随一と言われる。グレイモンド・ハウザー総帥の下、「軍事力なくして平和は守れない」という信条に基づき強大な軍備を維持している。",
    history:
      "古くから軍事技術の研究に注力し、他文明圏に対する軍事技術輸出で経済基盤を確立。グランベルの経済的支配が進む中、軍事力で均衡を保つ政策をとってきた。",
    currentStatus:
      "グランベルの経済的支配に対し軍事力で均衡を図る。エレシオンのリアナ女王とは軍拡を巡って対立。トゥキディデスの罠の危険性が指摘されている。",
    relationships: [
      "グランベル — 経済vs軍事の構造的対立",
      "エレシオン — 軍拡方針で対立",
      "ファルージャ — 調停の対象",
      "ディオクレニス — トゥキディデスの罠の提起者",
    ],
    planets: ["ティエリア・フォートレス", "シールド・バース", "アーミーナ", "ヴァンガード"],
    wikiId: "ティエリア",
    href: "/civilizations/tyeria",
  },
  {
    id: "fallujah",
    rank: 4,
    name: "ファルージャ",
    nameEn: "Fallujah",
    color: "text-violet-400",
    borderColor: "border-violet-400/30 hover:border-violet-400/60",
    bgColor: "from-violet-500/20 via-violet-600/10 to-violet-700/20",
    icon: "Scale",
    leader: "評議会代表マドリス・カーネル",
    leaderWikiId: "マドリス・カーネル",
    specialization: "文化的影響力・外交・勢力間調停",
    description:
      "文化的影響力と外交力で宇宙に君臨する文明圏。対立する勢力間の調停役として重要な地位を占め、「文化の力が宇宙全体を結びつける鍵」という理念を掲げている。",
    history:
      "古くから文化・芸術分野で独自の発展を遂げ、他文明圏に文化的影響を与え続けてきた。マドリス・カーネル代表の下、外交による問題解決を推進。",
    currentStatus:
      "グランベルの経済的支配に対する懸念を表明。ティエリアとエレシオンの対立の調停を試みる。宇宙連合会合で文化的交流の促進を提案。",
    relationships: [
      "グランベル — 経済的支配への懸念",
      "ティエリア — 調停の対象",
      "エレシオン — 平和外交で連携",
      "ディオクレニス — 文化交流で協力",
    ],
    planets: ["ファルージャ・ハブ", "アーティザ", "ビブロ", "メロディ"],
    wikiId: "ファルージャ",
    href: "/civilizations/fallujah",
  },
  {
    id: "dioclenis",
    rank: 5,
    name: "ディオクレニス",
    nameEn: "Dioclenis",
    color: "text-cyan-400",
    borderColor: "border-cyan-400/30 hover:border-cyan-400/60",
    bgColor: "from-cyan-500/20 via-cyan-600/10 to-cyan-700/20",
    icon: "Telescope",
    leader: "科学宰相ネイサン・コリンド",
    leaderWikiId: "ネイサン・コリンド",
    specialization: "宇宙探査・科学技術研究",
    description:
      "宇宙探査と科学技術研究の最前線に立つ文明圏。科学宰相ネイサン・コリンドの下、「トゥキディデスの罠」を提起し、宇宙共同探査プロジェクトを提案するなど、先見性のある政策を展開。",
    history:
      "科学技術の研究開発に特化し、宇宙探査の分野で多大な成果を挙げてきた。ネイサン・コリンドの下、4つの具体的提案（平和協定、UECO設立、技術共有、文化交流）を行った。",
    currentStatus:
      "宇宙連合会合で宇宙共同探査プロジェクトを提案。グランベルとティエリアの対立に「トゥキディデスの罠」の概念を適用し、警告を発している。",
    relationships: [
      "グランベル — トゥキディデスの罠の対象",
      "ティエリア — トゥキディデスの罠の対象",
      "エレシオン — 探査提案に支持",
      "ファルージャ — 文化交流で協力",
    ],
    planets: ["コリンド・ステーション", "ネオ・フロンティア", "オデッセイ", "スペクトラ"],
    wikiId: "ディオクレニス",
    href: "/civilizations/dioclenis",
  },
]

/* ── その他の文明圏 ── */
export const OTHER_CIVILIZATIONS: Civilization[] = [
  {
    id: "eresh",
    rank: 6,
    name: "エレシュ",
    nameEn: "Eresh",
    color: "text-purple-400",
    borderColor: "border-purple-400/30 hover:border-purple-400/60",
    bgColor: "from-purple-500/20 via-purple-600/10 to-purple-700/20",
    icon: "Sparkles",
    leader: "大司教",
    leaderWikiId: "大司教",
    specialization: "宗教・精神的影響力",
    description:
      "宇宙規模の信仰共同体を形成する宗教・精神的文明圏。大司教と神官長から成るオラクルが最高意思決定機関として機能し、その予言は極めて高い的中率を誇る。中枢聖星ヴェズレル（『真理の星』）を中心に、次元境界近くに建造されたサンクチュアリを主たる聖地としている。次元共鳴を用いた瞑想と予言の伝統が他文明圏にも広く影響を与えている。",
    history:
      "古代より次元境界の共鳴現象に基づく独自の精神修練法を発展させ、やがてオラクル（大司教＋神官長）を頂点とする神政体制を確立した。中枢聖星ヴェズレルを『真理の星』として神聖視し、次元境界近くにサンクチュアリを建造して信仰の中心とした。セラフィムを外部担当機関とし、活発な布教活動を通じて他文明圏への精神的影響力を拡大。その予言の高精度さにより、グランベル、ティエリアを含む複数の文明圏の政治的決断に直接的な影響を与えてきた。ファルージャのマドリス・カーネルとは古くから外交関係を維持し、文化的・精神的交流を深めている。",
    currentStatus:
      "オラクルによる次元共鳴予言が宇宙規模の意思決定に影響を与え続けている。サンクチュアリは全宇宙からの巡礼者で賑わい、セラフィムは他文明圏との外交・布教活動を積極的に展開中。ヴェズレルを拠点とする次元共鳴瞑想の実践は、科学的研究対象としても注目されている。",
    relationships: [
      "ファルージャ — マドリス・カーネルを通じた外交・精神的交流",
      "グランベル — 予言を通じた政治的影響力の行使",
      "ティエリア — 精神的指針の提供と軍事的緊張緩和の調停",
      "プロキオ — サンクチュアリへの巡礼ルートを通じた経済的つながり",
      "ロースター — 次元共鳴通信技術の共同研究",
    ],
    wikiId: "エレシュ",
    href: "/civilizations/eresh",
    planets: ["エレシュ・サンクチュアリ", "オラクル", "ヴェズレル", "セラフィム"],
  },
  {
    id: "prokio",
    rank: 7,
    name: "プロキオ",
    nameEn: "Prokio",
    color: "text-orange-400",
    borderColor: "border-orange-400/30 hover:border-orange-400/60",
    bgColor: "from-orange-500/20 via-orange-600/10 to-orange-700/20",
    icon: "Package",
    leader: "商工会議長",
    leaderWikiId: "商工会議長",
    specialization: "宇宙規模の交易・物流",
    description:
      "宇宙中のあらゆる貿易ルートを掌握する交易・物流文明圏。商工会議長を最高責任者とし、プロキオ・ネクサスを中心拠点として全宇宙の商取引を管理している。コマース部門が全商業取引を統轄し、AI物流ルーティングネットワーク『Lane System』が最適な輸送経路を算出。オープンアーキテクチャによりグランベルやエレシオンにも統合されている。プロキオ・ネクサスでの価格設定が宇宙全体のベースライン価格を決定する。",
    history:
      "古くから宇宙各地の交易拠点を統合し、次第に全貿易ルートの掌握に至った。商工会議長の指導の下、コマース部門が組織化され、商取引の標準化を推進。AI物流ルーティングネットワーク『Lane System』の開発により、宇宙規模の物流最適化を実現した。このオープンアーキテクチャ設計により、グランベルとエレシオンが自勢力内にLane Systemを統合。さらに、n-tokenと互換性を持つ『Prokio Clear』汎用決済システムを開発し、全文明圏間の決済を統一した。バザール・ネットワークを通じた市場プラットフォームの運用で、その経済活動はすべての文明圏の経済に直接的な影響を与えている。",
    currentStatus:
      "プロキオ・ネクサスでの価格設定が宇宙全体のベースライン価格として機能し続けている。Lane Systemのオープンアーキテクチャがさらに多くの文明圏に採用され、Prokio Clear決済システムの普及により取引の標準化が進行中。商工会議長は全宇宙の経済安定に向けた政策調整を継続中。",
    relationships: [
      "グランベル — Lane Systemの統合とProkio Clear決済の採用",
      "エレシオン — Lane Systemの統合と医療物資優先配送協定",
      "ティエリア — 軍事物資の物流管理を通じた関係",
      "ファルージャ — 文化財・芸術品の交易ルート提供",
      "ディオクレニス — 科学機器の優先物流協定",
      "エレシュ — サンクチュアリへの巡礼ルート運営",
    ],
    planets: ["プロキオ・ネクサス", "コマース", "レーン", "バザール"],
    wikiId: "プロキオ",
    href: "/civilizations/prokio",
  },
  {
    id: "roastar",
    rank: 8,
    name: "ロースター",
    nameEn: "Roastar",
    color: "text-pink-400",
    borderColor: "border-pink-400/30 hover:border-pink-400/60",
    bgColor: "from-pink-500/20 via-pink-600/10 to-pink-700/20",
    icon: "Radio",
    leader: "通信長官",
    leaderWikiId: "通信長官",
    specialization: "次元間通信・量子ネットワーク",
    description:
      "次元間通信と量子ネットワーク技術の革新に特化した技術文明圏。通信長官を最高責任者とし、ロースター・コアを中心拠点として量子コンピューティング研究を推進している。シグナル・オペレーションが全宇宙の衛星通信ネットワークを管理し、クアンタ・ラボで最先端の量子プロトコル研究を実施。『Link Protocol』は全文明圏で使用される唯一の汎用通信規格であり、現在のバージョンはLink 7.2。オープンイノベーションモデルにより、新技術は数ヶ月で全宇宙に展開される。",
    history:
      "次元間通信の研究から出発し、やがて全文明圏の通信インフラを統合するまでに成長した。ロースター・コアに量子コンピューティング・センターを建設し、全宇宙の通信を一元管理する体制を確立。シグナル・オペレーションによる衛星通信ネットワークの構築で、次元境界を越えた安定通信を実現。『Link Protocol』を汎用通信規格として策定し、全文明圏が採用。クアンタ・ラボでは常時最先端の量子プロトコル研究が行われ、ディオクレニスの研究者も参加。次元不安定の早期警戒システムをロースター・コアに構築し、ティエリアの防衛ネットワークと接続して緊急ルーティングを確保している。Link 7.2の登場により、次世代量子技術が通信品質を飛躍的に向上させた。",
    currentStatus:
      "Link 7.2の普及が全宇宙で進行中。次世代量子技術の研究がクアンタ・ラボで加速しており、オープンイノベーションモデルにより新技術の全宇宙展開が数ヶ月単位で実現。ロースター・コアの次元不安定早期警戒システムは全文明圏の安全に不可欠なインフラとして機能している。通信長官の下、全文明圏の通信トラフィックの安定運用を継続中。",
    relationships: [
      "ティエリア — 防衛ネットワークと接続し緊急ルーティングを確保",
      "ディオクレニス — クアンタ・ラボでの共同研究、研究者の派遣",
      "グランベル — 通信インフラの主要顧客、技術標準の協調",
      "エレシオン — 医療通信回線の優先確保協定",
      "ファルージャ — 文化放送ネットワークの運営支援",
      "エレシュ — 次元共鳴通信技術の共同研究",
    ],
    planets: ["ロースター・コア", "シグナル", "クアンタ", "リンク"],
    wikiId: "ロースター",
    href: "/civilizations/roastar",
  },
]

/* ── 歴史的文明圏 ── */
export const HISTORICAL_CIVILIZATIONS: Civilization[] = [
  {
    id: "dominion",
    rank: 0,
    name: "Dominion / Selinopolis",
    nameEn: "Dominion / Selinopolis",
    color: "text-edu-accent",
    borderColor: "border-edu-accent/30 hover:border-edu-accent/60",
    bgColor: "from-amber-500/20 via-edu-accent/10 to-amber-600/20",
    icon: "Crown",
    leader: "セリア・ドミニクス",
    leaderWikiId: "セリア・ドミニクス",
    capital: "Selinopolis（旧Gigapolis）",
    gdp: "81兆ドル（最盛期）→ 23兆ドル（大戦後）",
    specialization: "次元エネルギー技術（Phovos）・女性主導社会",
    description:
      "セリア・ドミニクスがGigapolisを掌握しSelinopolisに改名して建国。次元エネルギー技術のPhovosを中核とし、女性主導社会で繁栄した。最盛期GDP81兆ドル。アポロン大戦後はエヴァトロンに吸収される。",
    history:
      "E335〜E370年のセリア黄金期。フェルミ音楽の頂点、nトークン経済の確立、AURALISの最盛期を導いた。アポロン大戦にエヴァトロンと共に参戦したが、戦後GDP23兆に激減。その後、ヴァイロン・デアクス率いるエヴァトロンによって買収・吸収された。",
    currentStatus: "現在はエヴァトロンに吸収され、E16系を支配下に置いている。",
    relationships: [
      "エヴァトロン — 同盟→吸収",
      "アポロン文明圏 — 全面戦争",
      "グランベル — マスター・クインシアスがセリアを高評価",
    ],
    planets: ["Symphony of Stars", "Eros-7", "E16小惑星帯"],
    wikiId: "セリア・ドミニクス",
    href: "",
    isHistorical: true,
  },
  {
    id: "apollon",
    rank: 0,
    name: "アポロン文明圏",
    nameEn: "Apollon Civilization",
    color: "text-red-400",
    borderColor: "border-red-400/30 hover:border-red-400/60",
    bgColor: "from-red-500/20 via-red-600/10 to-red-700/20",
    icon: "Swords",
    leader: "ロナン・アーサ",
    leaderWikiId: "ロナン・アーサ",
    capital: "アポロン・セントラリス",
    gdp: "125兆ドル（最盛期）→ 32億ドル（大戦後）",
    specialization: "アポロンの騎士団・ケンタウロスレーザー",
    description:
      "ロナン・アーサ率いる英雄的文明圏。最盛期GDP125兆ドル。アポロンの騎士団とケンタウロスレーザーを擁し、Dominionとの全面戦争を戦ったが、セリアのヴェノム艦隊により壊滅。",
    history:
      "ロナン・アーサがセリアに同盟を提案したが拒絶されたことが戦争の端緒。ケンタウロスレーザーとG4ファントムパルスが交差する激戦の末、セリアのヴェノム艦隊がアポロン・セントラリスを攻略。GDP32億に激減し、文明圏としての機能を失った。",
    currentStatus: "壊滅状態。GDP32億ドルに激減。",
    relationships: ["Dominion — 同盟拒絶→全面戦争", "エヴァトロン — 戦後の混乱に関連"],
    planets: ["アポロン・セントラリス（崩壊）", "アレス", "ヘファイストス", "アテナ"],
    wikiId: "アポロン・Dominion大戦",
    href: "",
    isHistorical: true,
  },
  {
    id: "evatron",
    rank: 14,
    name: "エヴァトロン",
    nameEn: "Evatron",
    color: "text-gray-400",
    borderColor: "border-gray-400/30 hover:border-gray-400/60",
    bgColor: "from-gray-500/20 via-gray-600/10 to-gray-700/20",
    icon: "Skull",
    leader: "グリム・ダルゴス（初代）→ ヴァイロン・デアクス",
    leaderWikiId: "グリム・ダルゴス",
    capital: "Evapolis",
    gdp: "33兆ドル（同盟時）→ 14位（現在）",
    specialization: "男尊女卑文化・E16系支配",
    description:
      "男尊女卑文化を基盤とする文明圏。グリム・ダルゴスが初代リーダー。Dominionと同盟しアポロン大戦に参戦。戦後、疲弊したDominionを買収・吸収。ヴァイロン・デアクスが統治者に任命され、E16系を支配下に置いた。",
    history:
      "セリアとの同盟を承認。アポロン大戦ではDominion側として参戦。戦後、ヴァイロン・デアクスが戦後の疲弊したDominionを買収・吸収。エヴァトロンの文化・価値観をDominion全土に浸透させた。現在もE16系に影響を与え続けている。",
    currentStatus: "現在14位。セリアンズの抵抗に直面。",
    relationships: [
      "Dominion — 同盟→吸収",
      "アポロン文明圏 — 大戦の敵対",
      "セリアンズ — 抵抗に直面",
    ],
    planets: ["エヴァ・プライム", "Evapolis（Gigapolis）", "ゴルゴン", "タルタロス"],
    wikiId: "エヴァトロン",
    href: "",
    isHistorical: true,
  },
]

/* ── 文明圏指導者（ランキング用） ── */
export const CIVILIZATION_LEADERS: CivilizationLeader[] = [
  {
    name: "アルゼン・カーリーン",
    title: "グランベル大統領",
    civilization: "グランベル",
    civilizationColor: "text-amber-400",
    wealth: "150兆ドル（国家GDP）",
    source: "宇宙最大経済圏の指導",
    era: "現在",
    wikiId: "アルゼン・カーリーン",
  },
  {
    name: "女王リアナ・ソリス",
    title: "エレシオン女王",
    civilization: "エレシオン",
    civilizationColor: "text-emerald-400",
    wealth: "医療技術・環境再生（非公開）",
    source: "宇宙第2位の医療大国",
    era: "現在",
    wikiId: "女王リアナ・ソリス",
  },
  {
    name: "総帥グレイモンド・ハウザー",
    title: "ティエリア総帥",
    civilization: "ティエリア",
    civilizationColor: "text-rose-400",
    wealth: "軍事技術輸出（非公開）",
    source: "宇宙最強の軍事力",
    era: "現在",
    wikiId: "グレイモンド・ハウザー",
  },
  {
    name: "マドリス・カーネル",
    title: "ファルージャ評議会代表",
    civilization: "ファルージャ",
    civilizationColor: "text-violet-400",
    wealth: "文化外交収入（非公開）",
    source: "宇宙第4位の文化的影響力",
    era: "現在",
    wikiId: "マドリス・カーネル",
  },
  {
    name: "ネイサン・コリンド",
    title: "ディオクレニス科学宰相",
    civilization: "ディオクレニス",
    civilizationColor: "text-cyan-400",
    wealth: "科学技術研究費（非公開）",
    source: "宇宙探査の最前線",
    era: "現在",
    wikiId: "ネイサン・コリンド",
  },
  {
    name: "大司教",
    title: "エレシュ大司教",
    civilization: "エレシュ",
    civilizationColor: "text-purple-400",
    wealth: "宗教的影響力（非公開）",
    source: "宇宙最大の信仰共同体",
    era: "現在",
    wikiId: "大司教",
  },
  {
    name: "商工会議長",
    title: "プロキオ商工会議長",
    civilization: "プロキオ",
    civilizationColor: "text-orange-400",
    wealth: "全宇宙貿易取引（非公開）",
    source: "宇宙全貿易ルートの掌握",
    era: "現在",
    wikiId: "商工会議長",
  },
  {
    name: "通信長官",
    title: "ロースター通信長官",
    civilization: "ロースター",
    civilizationColor: "text-pink-400",
    wealth: "通信インフラ収入（非公開）",
    source: "全宇宙通信インフラの管理",
    era: "現在",
    wikiId: "通信長官",
  },
]
