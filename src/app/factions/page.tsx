"use client"
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
        {!isLast && <div className={`w-0.5 flex-1 min-h-[24px] ${color} opacity-30`} />}
      </div>
      <div className="pb-4">
        <span className="text-xs text-cosmic-muted">{node.year}</span>
        <p className={`text-sm font-medium ${color.replace("border-", "text-")}`}>{node.name}</p>
        {node.children && (
          <div className="flex flex-wrap gap-2 mt-2">
            {node.children.map((child) => (
              <span key={child} className="text-xs bg-cosmic-surface px-2 py-0.5 rounded text-cosmic-muted">{child}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FactionsPage() {
  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Swords className="w-6 h-6 text-red-400" />}
          title="勢力系譜"
          subtitle="E16連星系の主要勢力の系統図"
          wikiHref="/wiki#テクロサス"
        />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FACTION_TREES.map((tree) => (
                <div key={tree.name} className="glass-card glass-card-hover rounded-xl p-4 sm:p-6 transition-all duration-300">
                  <h3 className={`text-sm sm:text-base font-bold ${tree.textColor} mb-4 flex items-center gap-2`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${tree.dotColor}`} />
                    {tree.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-cosmic-muted leading-relaxed mb-4">{tree.description}</p>
                  <div className="mb-4">
                    <p className="text-[10px] sm:text-[11px] font-bold text-cosmic-text mb-2 flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-nebula-purple" /> 主要メンバー
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tree.keyMembers.map((m) => (
                        <span key={m} className="text-[10px] px-2 py-0.5 rounded bg-cosmic-surface/50 border border-cosmic-border/30 text-cosmic-text">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <p className="text-[10px] sm:text-[11px] font-bold text-cosmic-text mb-1.5 flex items-center gap-1.5">
                      <Globe2 className="w-3 h-3 text-electric-blue" /> 同盟・関係
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-cosmic-muted leading-relaxed">{tree.alliances}</p>
                  </div>
                  <div className="border-t border-cosmic-border/30 pt-4">
                    {tree.nodes.map((node, idx) => (
                      <FactionNode key={idx} node={node} color={tree.color} dotColor={tree.dotColor} isLast={idx === tree.nodes.length - 1} />
                    ))}
                  </div>
                </div>
              ))}
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
