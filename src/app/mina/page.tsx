"use client"
import Link from "next/link"
import React from "react"
import { Users } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"
import { MINA_TIMELINE } from "@/lib/mina-data"

export default function MinaPage() {
  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Users className="w-6 h-6 text-blue-400" />}
          title="ミナ・エウレカ・エルンスト"
          subtitle={
            <>
              Mina Eureka Ernst —{" "}
              <Link href="/wiki#AURALIS" className="text-electric-blue hover:underline">AURALIS</Link>
              第二世代、{" "}
              <Link href="/wiki#リミナル・フォージ" className="text-electric-blue hover:underline">リミナル・フォージ</Link>
              創設者
            </>
          }
          wikiHref="/wiki#ミナ・エウレカ・エルンスト"
        />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Character Portrait */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-xl overflow-hidden transition-all duration-300">
                  <div className="relative">
                    <img
                      src="https://raw.githubusercontent.com/gentaron/image/main/MinaEurekaErnst.png"
                      alt="ミナ・エウレカ・エルンスト"
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xl font-bold text-cosmic-text">ミナ・エウレカ・エルンスト</p>
                      <p className="text-xs text-electric-blue">Mina Eureka Ernst</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-sm font-bold text-electric-blue mb-4 uppercase tracking-wider">プロフィール</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    {(
                      [
                        ["生年月日", "E499年8月16日"],
                        ["年齢", "29歳"],
                        ["血液型", "AB型"],
                        ["出生地", <Link key="wl" href="/wiki#ノスタルジア・コロニー" className="text-electric-blue hover:underline">ノスタルジア・コロニー</Link>],
                        ["外見", "青い長髪・長身"],
                        ["性格", "マイペース・先進的・承認欲求あり"],
                      ] as [string, React.ReactNode][]
                    ).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-cosmic-muted text-xs mb-0.5">{k}</p>
                        <p className="text-cosmic-text font-medium">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-sm font-bold text-gold-accent mb-3 uppercase tracking-wider">座右の銘</h3>
                    <p className="text-cosmic-text italic text-sm mb-2">&ldquo;Veni, vidi, vici&rdquo;</p>
                    <p className="text-cosmic-muted text-xs">人生則主観</p>
                  </div>
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-sm font-bold text-nebula-purple mb-3 uppercase tracking-wider">特技</h3>
                    <div className="flex flex-wrap gap-2">
                      {["テニス（右利き）", "Hoi4", "Civilization"].map((skill) => (
                        <span key={skill} className="text-xs bg-nebula-purple/15 text-nebula-purple px-2.5 py-1 rounded-full border border-nebula-purple/20">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-sm font-bold text-green-400 mb-4 uppercase tracking-wider">人生年表</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {MINA_TIMELINE.map((t) => (
                      <div key={t.year} className="bg-cosmic-dark/50 rounded-lg p-3 border border-cosmic-border/50 hover:border-electric-blue/30 transition-colors">
                        <p className="text-xs text-electric-blue font-medium">{t.age} ({t.year})</p>
                        <p className="text-xs text-cosmic-muted mt-1">{t.event}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-electric-blue/10 border border-electric-blue/20 rounded-lg">
                    <p className="text-xs text-electric-blue">📡 現在: ナシゴレンと宇宙連合会合をモニタリング中</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        <footer className="relative border-t border-cosmic-border/50 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/" className="text-xs text-cosmic-muted hover:text-gold-accent transition-colors">← トップページに戻る</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
