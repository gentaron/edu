import Link from "next/link"
import React from "react"
import { Users } from "lucide-react"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"
import { MINA_TIMELINE } from "@/lib/mina-data"

export default function MinaPage() {
  return (
    <div className="min-h-screen bg-edu-bg">
      <PageHeader
        icon={<Users className="w-6 h-6 text-blue-400" />}
        title="ミナ・エウレカ・エルンスト"
        subtitle={
          <>
            Mina Eureka Ernst —{" "}
            <Link
              href={`/wiki/${encodeURIComponent("AURALIS")}`}
              className="text-edu-accent2 hover:underline"
            >
              AURALIS
            </Link>
            第二世代、{" "}
            <Link
              href={`/wiki/${encodeURIComponent("リミナル・フォージ")}`}
              className="text-edu-accent2 hover:underline"
            >
              リミナル・フォージ
            </Link>
            創設者
          </>
        }
        wikiHref={`/wiki/${encodeURIComponent("ミナ・エウレカ・エルンスト")}`}
      />

      <RevealSection>
        <div className="max-w-6xl mx-auto px-4 pb-20">
          {/* 概説 */}
          <div className="edu-card rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> ミナ・エウレカ・エルンストとは
            </h2>
            <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
              <p>
                <span className="text-edu-accent2 font-medium">ミナ・エウレカ・エルンスト</span>{" "}
                は、E16連星系において最も影響力のある人物の一人である。{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("AURALIS")}`}
                  className="text-edu-accent2 hover:underline"
                >
                  AURALIS Collective
                </Link>{" "}
                の第二世代メンバーであり、同時に{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("リミナル・フォージ")}`}
                  className="text-edu-accent hover:underline"
                >
                  リミナル・フォージ
                </Link>{" "}
                の創設者として、E528年の現代から過去の地球（AD
                2026年）への時空通信プロジェクトを主導している。彼女の多彩な才能と行動力は、E16文明の技術的・文化的発展に多大な影響を与えている。
              </p>
              <p>
                E499年に{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("ノスタルジア・コロニー")}`}
                  className="text-edu-accent2 hover:underline"
                >
                  ノスタルジア・コロニー
                </Link>{" "}
                で生まれたミナは、AB型の血液型を持ち、青い長髪と長身という特徴的な外見を有する。彼女の性格はマイペースで先進的、そして承認欲求があると自己分析しており、その人間性がAURALIS
                の活動やリミナル・フォージの構想に独自の色彩を与えている。座右の銘は「Veni, vidi,
                vici」であり、人生を主観的に捉えるスタンスを持つ。
              </p>
              <p>
                AI研究員としての専門性を背景に、彼女は{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("ペルセポネ")}`}
                  className="text-edu-accent2 hover:underline"
                >
                  ペルセポネ
                </Link>{" "}
                仮想宇宙の構築や{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("次元極地平")}`}
                  className="text-edu-accent2 hover:underline"
                >
                  次元極地平（Dimension Horizon）
                </Link>{" "}
                の研究に深く関わっている。その研究成果がリミナル・フォージの基盤技術となり、E528年からAD
                2026年への情報伝達を可能にした。現在はナシゴレンを楽しみながら{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("宇宙連合会合")}`}
                  className="text-edu-accent2 hover:underline"
                >
                  宇宙連合会合
                </Link>{" "}
                をモニタリングする日々を送っている。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Character Portrait */}
            <div className="lg:col-span-1">
              <div className="edu-card rounded-xl overflow-hidden transition-all duration-300">
                <div className="relative">
                  <img
                    src="https://raw.githubusercontent.com/gentaron/image/main/MinaEurekaErnst.png"
                    alt="ミナ・エウレカ・エルンスト"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-edu-bg via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xl font-bold text-edu-text">ミナ・エウレカ・エルンスト</p>
                    <p className="text-xs text-edu-accent2">Mina Eureka Ernst</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="edu-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-edu-accent2 mb-4 uppercase tracking-wider">
                  プロフィール
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {(
                    [
                      ["生年月日", "E499年8月16日"],
                      ["年齢", "29歳"],
                      ["血液型", "AB型"],
                      [
                        "出生地",
                        <Link
                          key="wl"
                          href={`/wiki/${encodeURIComponent("ノスタルジア・コロニー")}`}
                          className="text-edu-accent2 hover:underline"
                        >
                          ノスタルジア・コロニー
                        </Link>,
                      ],
                      ["外見", "青い長髪・長身"],
                      ["性格", "マイペース・先進的・承認欲求あり"],
                    ] as [string, React.ReactNode][]
                  ).map(([k, v]) => (
                    <div key={k}>
                      <p className="text-edu-muted text-xs mb-0.5">{k}</p>
                      <p className="text-edu-text font-medium">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="edu-card rounded-xl p-6">
                  <h3 className="text-sm font-bold text-edu-accent mb-3 uppercase tracking-wider">
                    座右の銘
                  </h3>
                  <p className="text-edu-text italic text-sm mb-2">
                    &ldquo;Veni, vidi, vici&rdquo;
                  </p>
                  <p className="text-edu-muted text-xs">人生則主観</p>
                </div>
                <div className="edu-card rounded-xl p-6">
                  <h3 className="text-sm font-bold text-edu-accent2 mb-3 uppercase tracking-wider">
                    特技
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["テニス（右利き）", "Hoi4", "Civilization"].map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-edu-accent2/15 text-edu-accent2 px-2.5 py-1 rounded-full border border-edu-accent2/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="edu-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-green-400 mb-4 uppercase tracking-wider">
                  人生年表
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MINA_TIMELINE.map((t) => (
                    <div
                      key={t.year}
                      className="bg-edu-bg/50 rounded-lg p-3 border border-edu-border/50 hover:border-edu-accent2/30 transition-colors"
                    >
                      <p className="text-xs text-edu-accent2 font-medium">
                        {t.age} ({t.year})
                      </p>
                      <p className="text-xs text-edu-muted mt-1">{t.event}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-edu-accent2/10 border border-edu-accent2/20 rounded-lg">
                  <p className="text-xs text-edu-accent2">
                    📡 現在: ナシゴレンと宇宙連合会合をモニタリング中
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      <footer className="relative border-t border-edu-border/50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/" className="text-xs text-edu-muted hover:text-edu-accent transition-colors">
            ← トップページに戻る
          </Link>
        </div>
      </footer>
    </div>
  )
}
