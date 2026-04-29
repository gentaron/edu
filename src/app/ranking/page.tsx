import React from "react"
import Link from "next/link"
import {
  Star,
  Crown,
  TrendingUp,
  ArrowLeft,
  Gem,
  Building2,
  Landmark,
  Clock,
  Info,
  Globe2,
} from "lucide-react"
import { CIVILIZATION_LEADERS } from "@/lib/civilization-data"
import { StarField } from "@/components/edu/star-field"

/* ─── Data ─── */
interface RankingEntry {
  rank: number
  name: string
  title: string
  wealth: string
  wealthNum: number // for sorting/display
  source: string
  affiliation: string
  era: string
  isHistorical: boolean
  wikiId: string
}

const RANKING_DATA: RankingEntry[] = [
  {
    rank: 1,
    name: "アルゼン・カーリーン",
    title: "グランベル大統領",
    wealth: "150兆n",
    wealthNum: 1500000,
    source: "宇宙最大経済圏・量子経済・次元間技術",
    affiliation: "グランベル / 5大文明圏",
    era: "現在",
    isHistorical: false,
    wikiId: "アルゼン・カーリーン",
  },
  {
    rank: 2,
    name: "ミカエル・ガブリエリ",
    title: "ファールージャ社CEO",
    wealth: "8兆5,000億n",
    wealthNum: 85000,
    source: "次元技術・武器開発",
    affiliation: "ファールージャ社 / V7",
    era: "E515〜現在",
    isHistorical: false,
    wikiId: "ミカエル・ガブリエリ",
  },
  {
    rank: 3,
    name: "アイク・ロペス",
    title: "SSレンジ首脳",
    wealth: "4兆2,000億n",
    wealthNum: 42000,
    source: "国際交易・通信網支配",
    affiliation: "SSレンジ / V7",
    era: "E515〜現在",
    isHistorical: false,
    wikiId: "アイク・ロペス",
  },
  {
    rank: 4,
    name: "グレイモンド・ハウザー",
    title: "ティエリア総帥",
    wealth: "3兆8,000億n",
    wealthNum: 38000,
    source: "軍事技術輸出・防衛ネットワーク",
    affiliation: "ティエリア / 5大文明圏",
    era: "現在",
    isHistorical: false,
    wikiId: "グレイモンド・ハウザー",
  },
  {
    rank: 5,
    name: "レイド・カキザキ",
    title: "アイアン・シンジケート首脳",
    wealth: "2兆8,000億n",
    wealthNum: 28000,
    source: "重工業・軍需生産",
    affiliation: "アイアン・シンジケート / V7",
    era: "E515〜現在",
    isHistorical: false,
    wikiId: "レイド・カキザキ",
  },
  {
    rank: 6,
    name: "ネイサン・コリンド",
    title: "ディオクレニス科学宰相",
    wealth: "2兆5,000億n",
    wealthNum: 25000,
    source: "宇宙探査技術・次元技術研究",
    affiliation: "ディオクレニス / 5大文明圏",
    era: "現在",
    isHistorical: false,
    wikiId: "ネイサン・コリンド",
  },
  {
    rank: 7,
    name: "マドリス・カーネル",
    title: "ファルージャ評議会代表",
    wealth: "2兆1,000億n",
    wealthNum: 21000,
    source: "文化交流・外交・調停",
    affiliation: "ファルージャ / 5大文明圏",
    era: "現在",
    isHistorical: false,
    wikiId: "マドリス・カーネル",
  },
  {
    rank: 8,
    name: "リアナ・ソリス",
    title: "エレシオン女王",
    wealth: "1兆8,000億n",
    wealthNum: 18000,
    source: "医療技術・環境再生技術",
    affiliation: "エレシオン / 5大文明圏",
    era: "現在",
    isHistorical: false,
    wikiId: "リアナ・ソリス",
  },
  {
    rank: 9,
    name: "ティナ/グエ",
    title: "地下街の支配者",
    wealth: "1兆9,500億n",
    wealthNum: 19500,
    source: "地下経済の掌握・情報網",
    affiliation: "地下街",
    era: "E400〜現在",
    isHistorical: false,
    wikiId: "Tina/Gue",
  },
  {
    rank: 10,
    name: "フィオナ",
    title: "ブルーローズ統率者",
    wealth: "1兆4,000億n",
    wealthNum: 14000,
    source: "V7外交・暗躍資金",
    affiliation: "ブルーローズ / V7",
    era: "E490〜現在",
    isHistorical: false,
    wikiId: "フィオナ",
  },
  {
    rank: 11,
    name: "ゼナ",
    title: "Eros-7女性商人",
    wealth: "4,500億n",
    wealthNum: 4500,
    source: "貿易ネットワーク・軍資金供給",
    affiliation: "Eros-7 / マトリカル・リフォーム",
    era: "E525〜現在",
    isHistorical: false,
    wikiId: "ゼナ",
  },
  {
    rank: 12,
    name: "カーラ・ヴェルム",
    title: "スクイーズ・アビス建設者",
    wealth: "3,800億n",
    wealthNum: 3800,
    source: "搾取プラズマ弾生産",
    affiliation: "Eros-7",
    era: "E380〜E505",
    isHistorical: false,
    wikiId: "カーラ・ヴェルム",
  },
  {
    rank: 13,
    name: "セリア・ドミニクス",
    title: "セリア黄金期の創設者",
    wealth: "1,800億n",
    wealthNum: 1800,
    source: "nトークン経済の確立・次元エネルギー技術",
    affiliation: "Selinopolis/Dominion（歴史的人物）",
    era: "E335〜E370",
    isHistorical: true,
    wikiId: "セリア・ドミニクス",
  },
  {
    rank: 14,
    name: "エル・フォルハウス",
    title: '革命家「新時代のルーキー」',
    wealth: "1,500億n",
    wealthNum: 1500,
    source: "完全自由経済の確立",
    affiliation: "コーポラタムパブリカ（歴史的人物）",
    era: "E150",
    isHistorical: true,
    wikiId: "エル・フォルハウス",
  },
  {
    rank: 15,
    name: "アルファ・ケイン",
    title: "シャドウ・リベリオンのリーダー",
    wealth: "1,200億n",
    wealthNum: 1200,
    source: "量子ファイナンス・コア掌握",
    affiliation: "シャドウ・リベリオン（歴史的人物）",
    era: "E318",
    isHistorical: true,
    wikiId: "アルファ・ケイン",
  },
]

/* ─── Rank Badge ─── */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-14 h-14 shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-edu-accent bg-edu-accent/10">
          <Crown className="w-6 h-6 text-edu-accent" />
        </div>
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-14 h-14 shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-edu-muted bg-edu-surface">
          <span className="text-lg font-black text-edu-text">2</span>
        </div>
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-14 h-14 shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-edu-accent/50 bg-edu-accent/5">
          <span className="text-lg font-black text-edu-accent">3</span>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center w-14 h-14 shrink-0">
      <div className="flex items-center justify-center w-12 h-12 rounded-full border border-edu-border bg-edu-surface">
        <span className="text-lg font-bold text-edu-muted">{rank}</span>
      </div>
    </div>
  )
}

/* ─── Wealth Bar ─── */
function WealthBar({
  wealthNum,
  maxWealth,
  rank,
}: {
  wealthNum: number
  maxWealth: number
  rank: number
}) {
  const pct = (wealthNum / maxWealth) * 100
  const barColor =
    rank === 1
      ? "bg-edu-accent"
      : rank === 2
        ? "bg-edu-muted"
        : rank === 3
          ? "bg-edu-accent/70"
          : "bg-edu-accent2"

  return (
    <div className="w-full h-1.5 rounded-full bg-edu-surface overflow-hidden">
      <div
        className={`h-full rounded-full ${barColor} transition-all duration-1000`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* ─── Ranking Card ─── */
function RankingCard({
  entry,
  maxWealth,
}: {
  entry: RankingEntry
  maxWealth: number
}) {
  const isTop3 = entry.rank <= 3
  const borderColor =
    entry.rank === 1
      ? "border-edu-accent/40 hover:border-edu-accent/60"
      : entry.rank === 2
        ? "border-edu-border hover:border-edu-muted"
        : entry.rank === 3
          ? "border-edu-accent/30 hover:border-edu-accent/50"
          : "border-edu-border hover:border-edu-accent2/40"

  return (
    <div
      className={`group relative edu-card rounded-xl border ${borderColor} p-5 sm:p-6 transition-all duration-300`}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        {/* Rank Badge */}
        <RankBadge rank={entry.rank} />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-lg font-bold truncate ${
                    isTop3 ? "text-edu-accent" : "text-edu-text"
                  }`}
                >
                  <Link
                    href={`/wiki/${encodeURIComponent(entry.wikiId)}`}
                    className="hover:underline"
                  >
                    {entry.name}
                  </Link>
                </h3>
                {entry.isHistorical && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-edu-surface border border-edu-border text-edu-muted whitespace-nowrap">
                    歴史的人物
                  </span>
                )}
              </div>
              <p className="text-sm text-edu-muted">{entry.title}</p>
            </div>

            {/* Wealth Display */}
            <div className="text-right shrink-0">
              <p
                className={`text-xl sm:text-2xl font-black tabular-nums ${
                  isTop3 ? "text-edu-accent" : "text-edu-accent2"
                }`}
              >
                {entry.wealth}
              </p>
              <p className="text-[10px] text-edu-muted tracking-wider">推定資産額</p>
            </div>
          </div>

          {/* Wealth Bar */}
          <div className="mb-4">
            <WealthBar
              wealthNum={entry.wealthNum}
              maxWealth={maxWealth}
              rank={entry.rank}
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-edu-muted">
              <Gem className="w-3.5 h-3.5 text-edu-accent2 shrink-0" />
              <span className="truncate">{entry.source}</span>
            </div>
            <div className="flex items-center gap-2 text-edu-muted">
              <Building2 className="w-3.5 h-3.5 text-edu-accent2 shrink-0" />
              <span className="truncate">{entry.affiliation}</span>
            </div>
            <div className="flex items-center gap-2 text-edu-muted">
              <Clock className="w-3.5 h-3.5 text-edu-accent shrink-0" />
              <span className="truncate">{entry.era}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Footer Notes ─── */
function FooterNotes() {
  return (
    <div className="edu-card rounded-xl border border-edu-border p-6 mt-12">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-4 h-4 text-edu-accent2" />
        <h3 className="text-sm font-bold text-edu-text">脚注</h3>
      </div>
      <ul className="space-y-2.5 text-xs text-edu-muted leading-relaxed">
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-edu-accent2 mt-1.5 shrink-0" />
          <span>
            本ランキングはEDU世界観（Wiki・ストーリー）に基づく推定資産額です
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-edu-accent2 mt-1.5 shrink-0" />
          <span>
            nトークン: E16連星系の基軸通貨。ZAMLT量子ファイナンス・コアで95%の取引を処理
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-edu-accent mt-1.5 shrink-0" />
          <span>
            ギガポリス第四繁栄期のGDPは年間14京nトークンに達した歴史がある
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
          <span>
            上位に宇宙5大文明圏の指導者（グランベル・ティエリア・ディオクレニス・ファルージャ・エレシオン）がランクイン。Alzen Carlinは150兆nで全宇宙最高額
          </span>
        </li>
      </ul>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function RankingPage() {
  const maxWealth = RANKING_DATA[0]?.wealthNum ?? 0

  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />

      <div className="relative z-10">
        {/* Hero Header */}
        <header className="pt-28 pb-12 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-edu-surface border border-edu-border mb-6">
              <TrendingUp className="w-8 h-8 text-edu-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-edu-text mb-4 leading-tight">
              世界長者番付
            </h1>
            <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-edu-accent to-transparent mb-6" />
            <p className="text-sm sm:text-base text-edu-muted max-w-2xl mx-auto leading-relaxed">
              E16連星系経済圏における富豪ランキング。現代の実力者から歴史的人物まで、
              推定資産額をnトークンで公開。次元技術、星間交易、量子ファイナンス —
              宇宙規模の富の分布を網羅。
            </p>

            {/* Summary Stats */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
              <div className="edu-card rounded-lg px-4 py-3 min-w-[120px]">
                <p className="text-xl font-black text-edu-accent tabular-nums">
                  15
                </p>
                <p className="text-[10px] text-edu-muted tracking-wider">
                  ランクイン
                </p>
              </div>
              <div className="edu-card rounded-lg px-4 py-3 min-w-[120px]">
                <p className="text-xl font-black text-edu-accent2 tabular-nums">
                  150兆
                </p>
                <p className="text-[10px] text-edu-muted tracking-wider">
                  最高推定資産 (n)
                </p>
              </div>
              <div className="edu-card rounded-lg px-4 py-3 min-w-[120px]">
                <p className="text-xl font-black text-edu-accent2 tabular-nums">
                  12
                </p>
                <p className="text-[10px] text-edu-muted tracking-wider">
                  勢力・組織
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Ranking List */}
        <main className="px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-4">
              {RANKING_DATA.map((entry) => (
                <RankingCard
                  key={entry.rank}
                  entry={entry}
                  maxWealth={maxWealth}
                />
              ))}
            </div>

            {/* Civilization Leaders Section */}
            <div className="mt-12 mb-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Globe2 className="w-5 h-5 text-edu-accent" />
                  <h2 className="text-xl font-bold text-edu-text">文明圏指導者</h2>
                </div>
                <p className="text-xs text-edu-muted">宇宙5大文明圏の指導者 — 国家規模の力を持つ指導者たち</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CIVILIZATION_LEADERS.map((leader, i) => (
                  <Link
                    key={leader.wikiId}
                    href={`/wiki/${encodeURIComponent(leader.wikiId)}`}
                    className="edu-card rounded-xl border border-edu-border hover:border-edu-accent/30 p-5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-edu-surface border border-edu-border">
                        <span className="text-sm font-bold text-edu-accent">#{i + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-edu-text">{leader.name}</h3>
                        <p className={`text-xs ${leader.civilizationColor}`}>{leader.title}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-edu-muted">文明圏</span>
                        <span className={leader.civilizationColor}>{leader.civilization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-edu-muted">規模</span>
                        <span className="text-edu-accent2">{leader.wealth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-edu-muted">時代</span>
                        <span className="text-edu-accent">{leader.era}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-edu-muted">出自</span>
                        <span className="text-edu-muted">{leader.source}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Notes */}
            <FooterNotes />
          </div>
        </main>
      </div>
    </div>
  )
}
