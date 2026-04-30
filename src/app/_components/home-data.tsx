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
    desc: "E16連星系、Eros-7、惑星ビブリオ、惑星Solaris — M104銀河全域の天文データ",
  },
  {
    href: "/civilizations",
    icon: <Globe2 className="w-6 h-6" />,
    title: "宇宙5大文明圏",
    desc: "グランベル・エレシオン・ティエリア・ファルージャ・ディオクレニス — 宇宙勢力の全貌",
  },
  {
    href: "/timeline",
    icon: <Scroll className="w-6 h-6" />,
    title: "統合年表",
    desc: "AD3500〜E528の全宇宙人類史。バーズ帝国から銀河系コンソーシアムまで",
  },
  {
    href: "/auralis",
    icon: <Sparkles className="w-6 h-6" />,
    title: "AURALIS Collective",
    desc: "「光と音を永遠にする」— 第一世代〜第二世代の完全記録",
  },
  {
    href: "/mina",
    icon: <Users className="w-6 h-6" />,
    title: "ミナ・エウレカ・エルンスト",
    desc: "AURALIS第二世代。リミナル・フォージ創設者",
  },
  {
    href: "/liminal",
    icon: <Radio className="w-6 h-6" />,
    title: "リミナル・フォージ",
    desc: "E528からAD2026へ、時空を超えた放送プロジェクト",
  },
  {
    href: "/iris",
    icon: <Shield className="w-6 h-6" />,
    title: "アイリス",
    desc: "トリニティ・アライアンス指導者。IRIS 1位の戦士と政治",
  },
  {
    href: "/characters",
    icon: <Crown className="w-6 h-6" />,
    title: "キャラクターTier表",
    desc: "全64キャラクターのカードデータと勢力別一覧",
  },
  {
    href: "/factions",
    icon: <Swords className="w-6 h-6" />,
    title: "勢力系譜",
    desc: "テクロサス・アルファ・ヴェノム・政体系・Eros-7・宇宙帝国系の全系譜",
  },
  {
    href: "/technology",
    icon: <Atom className="w-6 h-6" />,
    title: "技術体系",
    desc: "7つのコア技術の物理学的解説と次元階梯パンディクト",
  },
]

export const QUICK_ACCESS_CARDS = [
  {
    href: "/wiki",
    icon: <BookOpen className="w-7 h-7" />,
    title: "EDU Wiki 百科事典",
    desc: "全宇宙の百科事典。E16・Eros-7・ビブリオ・Solarisのキャラクター・歴史・組織を網羅",
    tag: "READ",
  },
  {
    href: "/story",
    icon: <Scroll className="w-7 h-7" />,
    title: "Story 小説集",
    desc: "5章20話の連作小説。黎明編から新世界編までの全文収録",
    tag: "STORY",
  },
  {
    href: "/card-game/select",
    icon: <Swords className="w-7 h-7" />,
    title: "PvE バトル",
    desc: "NORMAL・HARD・BOSS・FINALの4段階10種の敵と戦う",
    tag: "BATTLE",
  },
  {
    href: "/ranking",
    icon: <ExternalLink className="w-7 h-7" />,
    title: "世界長者番付",
    desc: "E16経済圏の富豪ランキング。推定資産をnトークンで公開",
    tag: "RANKING",
  },
]
