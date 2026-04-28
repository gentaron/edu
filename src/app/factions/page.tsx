import Link from "next/link"
import { Swords, Users, Globe2 } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"
import { FACTION_TREES } from "@/lib/faction-data"

function FactionNode({
  node,
  color,
  dotColor,
  isLast,
}: {
  node: (typeof FACTION_TREES)[0]["nodes"][0]
  color: string
  dotColor: string
  isLast: boolean
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${dotColor} shrink-0`} />
        {!isLast && (
          <div
            className={`w-0.5 flex-1 min-h-[24px] ${color.replace("border-", "bg-")} opacity-30`}
          />
        )}
      </div>
      <div className="pb-4">
        <span className="text-xs text-edu-muted">{node.year}</span>
        <p className={`text-sm font-medium ${color.replace("border-", "text-")}`}>{node.name}</p>
        {node.children && (
          <div className="flex flex-wrap gap-2 mt-2">
            {node.children.map((child) => (
              <span
                key={child}
                className="text-xs bg-edu-surface px-2 py-0.5 rounded text-edu-muted"
              >
                {child}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FactionsPage() {
  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Swords className="w-6 h-6 text-red-400" />}
          title="勢力系譜"
          subtitle="全宇宙の主要勢力の系統図 — E16・Eros-7・銀河規模組織"
          wikiHref="/wiki#テクロサス"
        />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 pb-20">
            {/* 概説 */}
            <div className="edu-card rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-400" /> 勢力系譜とは
              </h2>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  E16連星系の政治地图は、多数の国家・組織・勢力が複雑に絡み合う多極的な構造を持つ。
                  <span className="text-edu-accent2 font-medium">テクロサス帝国</span>
                  を始祖とする勢力系統は、古代からの血脈を受け継ぎながらも、分裂・統合・再編を繰り返してきた。各勢力は独自のイデオロギーと目的を持ち、時には同盟を結び、時には激しい対立を繰り広げている。
                </p>
                <p>
                  現代のE16星系は、大きく三つの陣営に分かれている。
                  <span className="text-cyan-400 font-medium">トリニティ・アライアンス</span>
                  （アイリス指導）はヴァーミリオン・ミエルテンガ・ボグダス・ジャベリンの3勢力連合であり、星系の安定を図る最大の勢力である。
                  <span className="text-blue-400 font-medium">V7（Vital Seven）</span>
                  はフィオナが急先鋒の7カ国連合で、ブルーローズやSSレンジ、アイアン・シンジケートなどが参加している。そして
                  <span className="text-red-400 font-medium">アルファ・ヴェノム</span>
                  はイズミ率いる暗黒組織であり、シルバー・ヴェノムの後継として星系の秩序を脅かす存在である。
                </p>
                <p>
                  さらにE16の枠を超え、
                  <span className="text-pink-400 font-medium">Eros-7</span>
                  ではマトリカル・カウンシルとシャドウ・ユニオンが独自の社会制度を巡って対立し、銀河規模では
                  <span className="text-cyan-400 font-medium">銀河系コンソーシアム</span>
                  がバーズ帝国から続く壮大な統合の歴史の到達点として機能している。以下の系統図は、E16・Eros-7・銀河全域にわたる各勢力の歴史的変遷を視覚的に整理したものである。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FACTION_TREES.map((tree) => (
                <div
                  key={tree.name}
                  className="edu-card rounded-xl p-4 sm:p-6 transition-all duration-300"
                >
                  <h3
                    className={`text-sm sm:text-base font-bold ${tree.textColor} mb-4 flex items-center gap-2`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${tree.dotColor}`} />
                    {tree.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-edu-muted leading-relaxed mb-4">
                    {tree.description}
                  </p>
                  <div className="mb-4">
                    <p className="text-[10px] sm:text-[11px] font-bold text-edu-text mb-2 flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-edu-accent2" /> 主要メンバー
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tree.keyMembers.map((m) => (
                        <span
                          key={m}
                          className="text-[10px] px-2 py-0.5 rounded bg-edu-surface/50 border border-edu-border/30 text-edu-text"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <p className="text-[10px] sm:text-[11px] font-bold text-edu-text mb-1.5 flex items-center gap-1.5">
                      <Globe2 className="w-3 h-3 text-edu-accent2" /> 同盟・関係
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-edu-muted leading-relaxed">
                      {tree.alliances}
                    </p>
                  </div>
                  <div className="border-t border-edu-border/30 pt-4">
                    {tree.nodes.map((node, idx) => (
                      <FactionNode
                        key={idx}
                        node={node}
                        color={tree.color}
                        dotColor={tree.dotColor}
                        isLast={idx === tree.nodes.length - 1}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        <footer className="relative border-t border-edu-border/50 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/"
              className="text-xs text-edu-muted hover:text-edu-accent transition-colors"
            >
              ← トップページに戻る
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
