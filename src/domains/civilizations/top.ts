import type { CivilizationId, WikiId } from "../../platform/schemas/branded"
import type { Civilization } from "@/types"

export const TOP_CIVILIZATIONS: Civilization[] = [
  {
    id: "granbell" as CivilizationId,
    rank: 1,
    name: "グランベル",
    nameEn: "Granbell",
    color: "text-amber-400",
    borderColor: "border-amber-400/30 hover:border-amber-400/60",
    bgColor: "from-amber-500/20 via-amber-600/10 to-amber-700/20",
    icon: "Crown",
    leader: "アルゼン・カーリーン大統領",
    leaderWikiId: "アルゼン・カーリーン" as WikiId,
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
      "ティエリア — ヘゲモニー・パラドックスの危険性が指摘される対立関係",
      "ファルージャ — 文化外交面での協力",
      "ディオクレニス — 科学技術分野での提携",
      "エヴァトロン — 武器供与を通じた影響力拡大",
    ],
    planets: ["グランベル・プライム", "ノヴァ・エコー", "クインシアス", "ヴェルディ・ステーション"],
    wikiId: "グランベル" as WikiId,
    href: "/civilizations/granbell",
  },
  {
    id: "elyseon" as CivilizationId,
    rank: 2,
    name: "エレシオン",
    nameEn: "Elyseon",
    color: "text-emerald-400",
    borderColor: "border-emerald-400/30 hover:border-emerald-400/60",
    bgColor: "from-emerald-500/20 via-emerald-600/10 to-emerald-700/20",
    icon: "Heart",
    leader: "女王リアナ・ソリス",
    leaderWikiId: "女王リアナ・ソリス" as WikiId,
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
    wikiId: "エレシオン" as WikiId,
    href: "/civilizations/elyseon",
  },
  {
    id: "tyeria" as CivilizationId,
    rank: 3,
    name: "ティエリア",
    nameEn: "Tyeria",
    color: "text-rose-400",
    borderColor: "border-rose-400/30 hover:border-rose-400/60",
    bgColor: "from-rose-500/20 via-rose-600/10 to-rose-700/20",
    icon: "Shield",
    leader: "総帥グレイモンド・ハウザー",
    leaderWikiId: "グレイモンド・ハウザー" as WikiId,
    specialization: "軍事力・防衛ネットワーク・軍事技術輸出",
    description:
      "宇宙最強の軍事力を誇る文明圏。軍事技術の輸出を経済基盤とし、その防衛ネットワークは宇宙随一と言われる。グレイモンド・ハウザー総帥の下、「軍事力なくして平和は守れない」という信条に基づき強大な軍備を維持している。",
    history:
      "古くから軍事技術の研究に注力し、他文明圏に対する軍事技術輸出で経済基盤を確立。グランベルの経済的支配が進む中、軍事力で均衡を保つ政策をとってきた。",
    currentStatus:
      "グランベルの経済的支配に対し軍事力で均衡を図る。エレシオンのリアナ女王とは軍拡を巡って対立。ヘゲモニー・パラドックスの危険性が指摘されている。",
    relationships: [
      "グランベル — 経済vs軍事の構造的対立",
      "エレシオン — 軍拡方針で対立",
      "ファルージャ — 調停の対象",
      "ディオクレニス — ヘゲモニー・パラドックスの提起者",
    ],
    planets: ["ティエリア・フォートレス", "シールド・バース", "アーミーナ", "ヴァンガード"],
    wikiId: "ティエリア" as WikiId,
    href: "/civilizations/tyeria",
  },
  {
    id: "fallujah" as CivilizationId,
    rank: 4,
    name: "ファルージャ",
    nameEn: "Fallujah",
    color: "text-violet-400",
    borderColor: "border-violet-400/30 hover:border-violet-400/60",
    bgColor: "from-violet-500/20 via-violet-600/10 to-violet-700/20",
    icon: "Scale",
    leader: "評議会代表マドリス・カーネル",
    leaderWikiId: "マドリス・カーネル" as WikiId,
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
    wikiId: "ファルージャ" as WikiId,
    href: "/civilizations/fallujah",
  },
  {
    id: "dioclenis" as CivilizationId,
    rank: 5,
    name: "ディオクレニス",
    nameEn: "Dioclenis",
    color: "text-cyan-400",
    borderColor: "border-cyan-400/30 hover:border-cyan-400/60",
    bgColor: "from-cyan-500/20 via-cyan-600/10 to-cyan-700/20",
    icon: "Telescope",
    leader: "科学宰相ネイサン・コリンド",
    leaderWikiId: "ネイサン・コリンド" as WikiId,
    specialization: "宇宙探査・科学技術研究",
    description:
      "宇宙探査と科学技術研究の最前線に立つ文明圏。科学宰相ネイサン・コリンドの下、「ヘゲモニー・パラドックス」を提起し、宇宙共同探査プロジェクトを提案するなど、先見性のある政策を展開。",
    history:
      "科学技術の研究開発に特化し、宇宙探査の分野で多大な成果を挙げてきた。ネイサン・コリンドの下、4つの具体的提案（平和協定、UECO設立、技術共有、文化交流）を行った。",
    currentStatus:
      "宇宙連合会合で宇宙共同探査プロジェクトを提案。グランベルとティエリアの対立に「ヘゲモニー・パラドックス」の概念を適用し、警告を発している。",
    relationships: [
      "グランベル — ヘゲモニー・パラドックスの対象",
      "ティエリア — ヘゲモニー・パラドックスの対象",
      "エレシオン — 探査提案に支持",
      "ファルージャ — 文化交流で協力",
    ],
    planets: ["コリンド・ステーション", "ネオ・フロンティア", "オデッセイ", "スペクトラ"],
    wikiId: "ディオクレニス" as WikiId,
    href: "/civilizations/dioclenis",
  },
]
