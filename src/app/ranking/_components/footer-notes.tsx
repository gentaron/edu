import React from "react"
import { Info } from "lucide-react"

export function FooterNotes() {
  return (
    <div className="edu-card rounded-xl border border-edu-border p-6 mt-12">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-4 h-4 text-edu-accent2" />
        <h3 className="text-sm font-bold text-edu-text">脚注</h3>
      </div>
      <ul className="space-y-2.5 text-xs text-edu-muted leading-relaxed">
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-edu-accent2 mt-1.5 shrink-0" />
          <span>本ランキングはEDU世界観（Wiki・ストーリー）に基づく推定資産額です</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-edu-accent2 mt-1.5 shrink-0" />
          <span>nトークン: E16連星系の基軸通貨。ZAMLTオムニバス・エンジンで95%の取引を処理</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-edu-accent mt-1.5 shrink-0" />
          <span>ギガポリス第四繁栄期のGDPは年間14京nトークンに達した歴史がある</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
          <span>
            上位に宇宙5大文明圏の指導者（グランベル・ティエリア・ディオクレニス・ファルージャ・エレシオン）がランクイン。Alzen
            Carlinは150兆nで全宇宙最高額
          </span>
        </li>
      </ul>
    </div>
  )
}
