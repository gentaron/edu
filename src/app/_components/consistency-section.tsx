import React from "react"
import { AlertTriangle } from "lucide-react"
import { RevealSection, SectionHeader } from "@/platform/reveal-section"

export function ConsistencySection() {
  return (
    <section id="consistency" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<AlertTriangle className="w-6 h-6 text-edu-accent" />}
            title="⭐ 整合性ノート"
            subtitle="Eternal Dominion Universeにおける重要な設定整合性の確認"
          />
        </RevealSection>
        <RevealSection>
          <div className="space-y-4">
            {/* Note 1 */}
            <div className="edu-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-edu-accent/15 flex items-center justify-center text-sm font-bold text-edu-accent">
                  1
                </div>
                <h3 className="text-base font-bold text-edu-accent">「ギガポリス」名称の整合性</h3>
              </div>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  ミナ・エウレカは「
                  <span className="text-edu-text font-medium">Gigapolis</span>」と呼んでいる。
                </p>
                <p>
                  彼女の時代（E499〜E528）、この都市はエヴァトロンによって「
                  <span className="text-red-400 font-medium">エヴァポリス（Evapolis）</span>
                  」と改名されていた。
                </p>
                <p>しかし、これはあくまでエヴァトロン側が付けた一方的な名称に過ぎない。</p>
                <p>
                  ミナをはじめとする人々は、セリア黄金期の伝統的な名称「
                  <span className="text-edu-accent2 font-medium">Gigapolis</span>
                  」を精神的故郷の名として使い続けている。
                </p>
                <p>
                  E475以降のポスト・エヴァトロン期では、歴史的正当性を持つ「Gigapolis」の名称復帰が進んでいる。
                </p>
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-xs font-medium">
                    ✓ 結論: ミナが「Gigapolis」と呼ぶことには全く矛盾がない
                  </p>
                </div>
              </div>
            </div>

            {/* Note 2 */}
            <div className="edu-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-edu-accent2/15 flex items-center justify-center text-sm font-bold text-edu-accent2">
                  2
                </div>
                <h3 className="text-base font-bold text-edu-accent2">
                  AURALIS初代は5名ではなかった
                </h3>
              </div>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  第二世代（現行）は
                  <span className="text-edu-accent font-medium">5名体制</span>（Kate Patton, Lillie
                  Ardent, Layla, Mina, Ninny）。
                </p>
                <p>しかし、第一世代（E290〜）は5名ではなかった。</p>
                <p>
                  初代は <span className="text-edu-text font-medium">Kate Claudia</span> と{" "}
                  <span className="text-edu-text font-medium">Lily Steiner</span>{" "}
                  を中心とする集団で、Layla Virell NovaがE325以降に参加。
                </p>
                <p>初代の正確な構成員数は記録が散逸しており不明。</p>
                <p>
                  「名」の継承制度（Kate Claudia → Kate Patton, Lily Steiner → Lillie
                  Ardent）はAURALISの伝統だが、組織形態自体は代ごとに異なる。
                </p>
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-xs font-medium">
                    ✓ 結論:
                    第二世代の5人体制は「復興期の新たな形」であり、初代をそのまま模倣したものではない
                  </p>
                </div>
              </div>
            </div>

            {/* Note 3 */}
            <div className="edu-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-pink-500/15 flex items-center justify-center text-sm font-bold text-pink-400">
                  3
                </div>
                <h3 className="text-base font-bold text-pink-400">
                  Laylaは冷凍保存から復活 — ミナたちと同年代
                </h3>
              </div>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  これまでの記述ではLaylaが「サイバネティクス強化による200年以上の現役」とされていたが、
                  <span className="text-red-400 font-medium">これは誤り</span>。
                </p>
                <p>
                  実際にはエヴァトロン時代の弾圧の中で、その実力ゆえに
                  <span className="text-edu-text font-medium">特別措置として冷凍保存</span>
                  されていた。サイバネティクスによる寿命延伸ではない。
                </p>
                <p>
                  復活後のLaylaはミナ・Kate Patton・Lillie Ardentと
                  <span className="text-edu-accent2 font-medium">同年代</span>
                  であり、「E325からの200年現役」という説明は当てはまらない。
                </p>
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-xs font-medium">
                    ✓ 結論: Laylaは冷凍保存からの復活であり、現在は第二世代の他メンバーと同年代
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}
