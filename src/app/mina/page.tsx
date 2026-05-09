"use client"

import Link from "next/link"
import React from "react"
import { Users } from "lucide-react"
import { type Lang, tl } from "@/lib/lang"
import { useLang } from "@/lib/use-lang"
import { RevealSection, SectionHeader } from "@/platform/reveal-section"
import { PageHeader } from "@/platform/page-header"
import { MINA_TIMELINE } from "@/lib/mina-data"

export default function MinaPage() {
  const { lang } = useLang()

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
            </Link>{" "}
            {tl("第二世代、", "2nd Gen, ", lang)}
            <Link
              href={`/wiki/${encodeURIComponent("リミナル・フォージ")}`}
              className="text-edu-accent2 hover:underline"
            >
              {lang === "en" ? "Liminal Forge" : "リミナル・フォージ"}
            </Link>{" "}
            {tl("創設者", "Founder", lang)}
          </>
        }
        wikiHref={`/wiki/${encodeURIComponent("ミナ・エウレカ・エルンスト")}`}
      />

      <RevealSection>
        <div className="max-w-6xl mx-auto px-4 pb-20">
          {/* 概説 */}
          <div className="edu-card rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />{" "}
              {tl("ミナ・エウレカ・エルンストとは", "About Mina Eureka Ernst", lang)}
            </h2>
            <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
              <p>
                <span className="text-edu-accent2 font-medium">
                  {lang === "en" ? "Mina Eureka Ernst" : "ミナ・エウレカ・エルンスト"}
                </span>{" "}
                {tl(
                  "は、E16連星系において最も影響力のある人物の一人である。",
                  " is one of the most influential figures in the E16 binary star system.",
                  lang
                )}{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("AURALIS")}`}
                  className="text-edu-accent2 hover:underline"
                >
                  AURALIS Collective
                </Link>{" "}
                {tl(
                  "の第二世代メンバーであり、同時に",
                  " 2nd Gen member, and simultaneously the founder of ",
                  lang
                )}
                <Link
                  href={`/wiki/${encodeURIComponent("リミナル・フォージ")}`}
                  className="text-edu-accent hover:underline"
                >
                  {lang === "en" ? "Liminal Forge" : "リミナル・フォージ"}
                </Link>
                {lang === "en"
                  ? ", leading the spacetime communication project from E528 to AD 2026 Earth. Her diverse talents and initiative have had a profound impact on E16 civilization's technological and cultural development."
                  : "の創設者として、E528年の現代から過去の地球（AD 2026年）への時空通信プロジェクトを主導している。彼女の多彩な才能と行動力は、E16文明の技術的・文化的発展に多大な影響を与えている。"}
              </p>
              <p>
                {lang === "en" ? (
                  <>
                    Born in E499 at{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("ノスタルジア・コロニー")}`}
                      className="text-edu-accent2 hover:underline"
                    >
                      Nostalgia Colony
                    </Link>
                    , Mina has blood type AB and distinctive long blue hair with a tall stature. She
                    describes her personality as easygoing, progressive, and approval-seeking, which
                    gives AURALIS's activities and the Liminal Forge concept a unique character. Her
                    motto is "Veni, vidi, vici," and she takes a subjective approach to life.
                  </>
                ) : (
                  <>
                    E499年に{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("ノスタルジア・コロニー")}`}
                      className="text-edu-accent2 hover:underline"
                    >
                      ノスタルジア・コロニー
                    </Link>{" "}
                    で生まれたミナは、AB型の血液型を持ち、青い長髪と長身という特徴的な外見を有する。彼女の性格はマイペースで先進的、そして承認欲求があると自己分析しており、その人間性がAURALIS
                    の活動やリミナル・フォージの構想に独自の色彩を与えている。座右の銘は「Veni,
                    vidi, vici」であり、人生を主観的に捉えるスタンスを持つ。
                  </>
                )}
              </p>
              <p>
                {lang === "en" ? (
                  <>
                    With her expertise as an AI researcher, she is deeply involved in the
                    construction of{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("ペルセポネ")}`}
                      className="text-edu-accent2 hover:underline"
                    >
                      Persephone
                    </Link>{" "}
                    virtual universe and the research of{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("次元極地平")}`}
                      className="text-edu-accent2 hover:underline"
                    >
                      Dimension Horizon
                    </Link>
                    . These research outcomes became the foundational technology of Liminal Forge,
                    enabling information transmission from E528 to AD 2026. Currently, she spends
                    her days enjoying nasi goreng while monitoring the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("宇宙連合会合")}`}
                      className="text-edu-accent2 hover:underline"
                    >
                      United Cosmic Assembly
                    </Link>
                    .
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
                    alt={lang === "en" ? "Mina Eureka Ernst" : "ミナ・エウレカ・エルンスト"}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-edu-bg via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xl font-bold text-edu-text">
                      {lang === "en" ? "Mina Eureka Ernst" : "ミナ・エウレカ・エルンスト"}
                    </p>
                    <p className="text-xs text-edu-accent2">Mina Eureka Ernst</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="edu-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-edu-accent2 mb-4 uppercase tracking-wider">
                  {tl("プロフィール", "Profile", lang)}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {(
                    [
                      [tl("生年月日", "Birthday", lang), "E499年8月16日"],
                      [tl("年齢", "Age", lang), "29歳"],
                      [tl("血液型", "Blood Type", lang), "AB型"],
                      [
                        tl("出生地", "Birthplace", lang),
                        <Link
                          key="wl"
                          href={`/wiki/${encodeURIComponent("ノスタルジア・コロニー")}`}
                          className="text-edu-accent2 hover:underline"
                        >
                          {lang === "en" ? "Nostalgia Colony" : "ノスタルジア・コロニー"}
                        </Link>,
                      ],
                      [
                        tl("外見", "Appearance", lang),
                        tl("青い長髪・長身", "Long blue hair, tall stature", lang),
                      ],
                      [
                        tl("性格", "Personality", lang),
                        tl(
                          "マイペース・先進的・承認欲求あり",
                          "Easygoing, progressive, approval-seeking",
                          lang
                        ),
                      ],
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
                    {tl("座右の銘", "Motto", lang)}
                  </h3>
                  <p className="text-edu-text italic text-sm mb-2">
                    &ldquo;Veni, vidi, vici&rdquo;
                  </p>
                  <p className="text-edu-muted text-xs">
                    {tl("人生則主観", "Life is subjective", lang)}
                  </p>
                </div>
                <div className="edu-card rounded-xl p-6">
                  <h3 className="text-sm font-bold text-edu-accent2 mb-3 uppercase tracking-wider">
                    {tl("特技", "Skills", lang)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      lang === "en" ? "Tennis (right-handed)" : "テニス（右利き）",
                      "Hoi4",
                      "Civilization",
                    ].map((skill) => (
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
                  {tl("人生年表", "Life Timeline", lang)}
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
                      <p className="text-xs text-edu-muted mt-1">
                        {lang === "en" && t.eventEn ? t.eventEn : t.event}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-edu-accent2/10 border border-edu-accent2/20 rounded-lg">
                  <p className="text-xs text-edu-accent2">
                    {lang === "en"
                      ? "📡 Currently: Enjoying nasi goreng & monitoring the United Cosmic Assembly"
                      : "📡 現在: ナシゴレンと宇宙連合会合をモニタリング中"}
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
            ← {tl("トップページに戻る", "Back to top page", lang)}
          </Link>
        </div>
      </footer>
    </div>
  )
}
