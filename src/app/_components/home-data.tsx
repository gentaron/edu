import React from "react"
import {
  Globe2,
  Users,
  Swords,
  Crown,
  Scroll,
  Radio,
  Shield,
  Sparkles,
  BookOpen,
  ExternalLink,
  Atom,
} from "lucide-react"

export const SECTION_PAGES = [
  {
    href: "/universe",
    icon: <Globe2 className="w-6 h-6" />,
    title: "全宇宙・星系構造",
    titleEn: "Universe & Star Systems",
    desc: "E16連星系、Eros-7、惑星ビブリオ、惑星Solaris — M104銀河全域の天文データ",
    descEn:
      "E16 Binary System, Eros-7, Planet Biblios, Planet Solaris — astronomical data across the M104 Galaxy",
  },
  {
    href: "/civilizations",
    icon: <Globe2 className="w-6 h-6" />,
    title: "宇宙5大文明圏",
    titleEn: "Five Great Galactic Civilizations",
    desc: "グランベル・エレシオン・ティエリア・ファルージャ・ディオクレニス — 宇宙勢力の全貌",
    descEn: "Grandbell, Eression, Thielia, Faruja, Diocrenis — the full scope of galactic powers",
  },
  {
    href: "/timeline",
    icon: <Scroll className="w-6 h-6" />,
    title: "統合年表",
    titleEn: "Unified Timeline",
    desc: "AD3500〜E528の全宇宙人類史。バーズ帝国から銀河系コンソーシアムまで",
    descEn:
      "Complete universal history from AD3500 to E528 — from the Byrds Empire to the Galactic Consortium",
  },
  {
    href: "/auralis",
    icon: <Sparkles className="w-6 h-6" />,
    title: "AURALIS Collective",
    titleEn: "AURALIS Collective",
    desc: "「光と音を永遠にする」— 第一世代〜第二世代の完全記録",
    descEn:
      '"Where Light and Sound Become Eternal" — complete records from the 1st to 2nd Generation',
  },
  {
    href: "/mina",
    icon: <Users className="w-6 h-6" />,
    title: "ミナ・エウレカ・エルンスト",
    titleEn: "Mina Eureka Ernst",
    desc: "AURALIS第二世代。リミナル・フォージ創設者",
    descEn: "AURALIS 2nd Generation. Founder of the Liminal Forge",
  },
  {
    href: "/liminal",
    icon: <Radio className="w-6 h-6" />,
    title: "リミナル・フォージ",
    titleEn: "Liminal Forge",
    desc: "E528からAD2026へ、時空を超えた放送プロジェクト",
    descEn: "Broadcasting across spacetime — from E528 to AD2026",
  },
  {
    href: "/iris",
    icon: <Shield className="w-6 h-6" />,
    title: "アイリス",
    titleEn: "Iris",
    desc: "トリニティ・アライアンス指導者。IRIS 1位の戦士と政治",
    descEn: "Leader of the Trinity Alliance. The IRIS #1 warrior and politics",
  },
  {
    href: "/characters",
    icon: <Crown className="w-6 h-6" />,
    title: "キャラクターTier表",
    titleEn: "Character Tier List",
    desc: "全64キャラクターのカードデータと勢力別一覧",
    descEn: "Card data and faction roster for all 64 characters",
  },
  {
    href: "/factions",
    icon: <Swords className="w-6 h-6" />,
    title: "勢力系譜",
    titleEn: "Faction Lineage",
    desc: "テクロサス・アルファ・ヴェノム・政体系・Eros-7・宇宙帝国系の全系譜",
    descEn:
      "Complete lineage — Tekrosath, Alpha, Venom, Political factions, Eros-7, and Cosmic Empire lines",
  },
  {
    href: "/technology",
    icon: <Atom className="w-6 h-6" />,
    title: "技術体系",
    titleEn: "Technology Systems",
    desc: "7つのコア技術の物理学的解説と次元階梯パンディクト",
    descEn: "Physical analysis of 7 core technologies and the Dimensional Ladder Pandect",
  },
]

export const QUICK_ACCESS_CARDS = [
  {
    href: "/wiki",
    icon: <BookOpen className="w-7 h-7" />,
    title: "EDU Wiki 百科事典",
    titleEn: "EDU Wiki Encyclopedia",
    desc: "全宇宙の百科事典。E16・Eros-7・ビブリオ・Solarisのキャラクター・歴史・組織を網羅",
    descEn:
      "The complete encyclopedia of the universe — characters, history, and organizations of E16, Eros-7, Biblios, and Solaris",
    tag: "READ",
  },
  {
    href: "/story",
    icon: <Scroll className="w-7 h-7" />,
    title: "Story 小説集",
    titleEn: "Story Collection",
    desc: "5章20話の連作小説。黎明編から新世界編までの全文収録",
    descEn:
      "5 chapters, 20 episodes — the complete serial novel from the Dawn Arc to the New World Arc",
    tag: "STORY",
  },
  {
    href: "/card-game/select",
    icon: <Swords className="w-7 h-7" />,
    title: "PvE バトル",
    titleEn: "PvE Battle",
    desc: "NORMAL・HARD・BOSS・FINALの4段階10種の敵と戦う",
    descEn: "Battle across 4 difficulty tiers — NORMAL, HARD, BOSS, FINAL — against 10 enemy types",
    tag: "BATTLE",
  },
  {
    href: "/ranking",
    icon: <ExternalLink className="w-7 h-7" />,
    title: "世界長者番付",
    titleEn: "World Wealth Ranking",
    desc: "E16経済圏の富豪ランキング。推定資産をnトークンで公開",
    descEn: "Wealth ranking of the E16 economic zone — estimated assets published in n-tokens",
    tag: "RANKING",
  },
]
