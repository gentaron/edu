"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useLang } from "@/lib/use-lang"
import { simulate, couplingEffects, vertex, MODEL_VERSION, type Person, type State, type Result } from "./living-model.mjs"
import registry from "./registry.json"

const roster: Person[] = registry.people
const active = roster.filter(p => p.status === "current")
const anchor = Date.UTC(2026, 10, 27)
const money = (n: number) => Math.round(n * 10_000_000).toLocaleString()
const pct = (n: number) => (n * 100).toFixed(1) + "%"
const index = (n: number) => (n * 100).toFixed(1)
const wealthIndex = (n: number) => 0.5 + Math.atan(n / 5) / Math.PI
const colors = ["#38bdf8", "#f59e0b", "#a78bfa"]

function Trend({ series, labels, title, times }: { series: number[][]; labels: string[]; title: string; times?: number[] }) {
  const length = Math.max(2, ...series.map(s => s.length))
  const first = times?.[0] ?? 0
  const last = times?.at(-1) ?? (length-1)
  const x = (j: number) => 30+320*((times?.[j]??j)-first)/Math.max(1,last-first)
  return <figure className="edu-card p-4">
    <figcaption className="text-sm font-semibold mb-2">{title}</figcaption>
    <svg viewBox="0 0 360 150" role="img" aria-label={title} className="w-full">
      {[0, .25, .5, .75, 1].map(v => <g key={v}><line x1="30" x2="350" y1={130-v*120} y2={130-v*120} stroke="currentColor" opacity=".12"/><text x="3" y={134-v*120} fontSize="8" fill="currentColor">{Math.round(v*100)}</text></g>)}
      {series.map((s,i)=><polyline key={i} fill="none" stroke={colors[i % colors.length]} strokeWidth="2" points={s.map((v,j)=>x(j).toFixed(2)+","+(130-120*Math.max(0,Math.min(1,v))).toFixed(2)).join(" ")}/>)}
      <text x="30" y="144" fontSize="8" fill="currentColor">{first}</text><text x="350" y="144" textAnchor="end" fontSize="8" fill="currentColor">{last}</text>
    </svg>
    <div className="flex flex-wrap gap-4 text-xs">{labels.map((l,i)=><span key={l} style={{color:colors[i%colors.length]}}>● {l}</span>)}</div>
  </figure>
}

function Effects({ state, en }: { state: State; en: boolean }) {
  const c=couplingEffects(state)
  const vtx=vertex(state.h,state.w,state.a)
  const names=en?["Wealth → health","Authority → health","Health → wealth","Authority → wealth","Health → authority","Wealth → authority"]:["資産 → 健康","権威名声 → 健康","健康 → 資産","権威名声 → 資産","健康 → 権威名声","資産 → 権威名声"]
  const values=[c.wealthToHealth,c.authorityToHealth,c.healthToWealth,c.authorityToWealth,c.healthToAuthority,c.wealthToAuthority]
  const max=Math.max(.1,...values.map(Math.abs))
  return <section className="edu-card p-4 space-y-3">
    <h3 className="text-sm font-semibold">{en?"Direct coupling effects":"三相相互作用の寄与量"}</h3>
    <p className="text-xs text-edu-muted">{en?"One-day index-point difference from neutral references (health / authority 50, wealth 0 n). Environment, peers and expression are held fixed; not a total causal estimate.":"中立基準（健康・権威名声50、純資産0 n）との差による1日分の指数ポイント。環境・近隣・発現を固定した直接寄与であり、総因果効果ではない。"}</p>
    <div className="grid grid-cols-2 gap-2 text-xs"><span>{en?"Cubic vertex gxyz":"三次頂点 gxyz"}</span><strong className="tabular-nums">{vtx.cubic.toFixed(6)}</strong><span>{en?"Cubic drift H / W / A":"三次結合ドリフト H / W / A"}</span><span className="tabular-nums">{[vtx.dh,vtx.dw,vtx.da].map(x=>x.toFixed(4)).join(" / ")}</span><span>{en?"Vertex dissipation dV/dt = −ΣΓ(∂V)²":"頂点散逸 dV/dt = −ΣΓ(∂V)²"}</span><span className="tabular-nums">{vtx.dissipation.toExponential(3)}</span></div>
    {values.map((v,i)=><div key={names[i]}><div className="flex justify-between gap-2 text-xs"><span>{names[i]}</span><span className="tabular-nums">{v>=0?"+":""}{v.toFixed(3)} pt</span></div><div className="relative h-2 rounded bg-edu-surface mt-1 overflow-hidden"><div className="absolute h-full w-px bg-edu-muted left-1/2"/><div className="absolute h-full rounded" style={{background:v>=0?"#38bdf8":"#f59e0b",left:v>=0?"50%":(50-50*Math.abs(v)/max)+"%",width:(50*Math.abs(v)/max)+"%"}}/></div></div>)}
  </section>
}


const bits = (j: number) => j.toString(2).padStart(3,"0")
const fmt = (v: number | null | undefined, d = 4) => v === null || v === undefined || !Number.isFinite(v) ? "—" : v.toFixed(d)

function Rigor({ model, en }: { model: Result; en: boolean }) {
  const t = (jp: string, english: string) => en ? english : jp
  const l = model.ledger, ne = model.nonequilibrium, d = model.diagnostics, g = model.genetics ?? []
  if (!l || !ne || !d) return null
  const flows: [string, number][] = [[t("賃金","Wages"),l.wage],[t("生活費","Essential costs"),l.expense],[t("資産収益（乗法的）","Multiplicative returns"),l.returns],[t("好機ジャンプ","Upside jumps"),l.upside],[t("損失ジャンプ","Adverse jumps"),l.downside],[t("近隣交換","Peer exchange"),l.exchange],[t("債務返済","Debt service"),l.debtService],[t("三次頂点","Cubic vertex"),l.vertex],[t("境界処理","Boundary clip"),l.clip]]
  const max = Math.max(1e-9, ...flows.map(([,v]) => Math.abs(v)))
  const ci = model.bootstrap?.connected3
  const signal = ci ? (ci[0] > 0 || ci[1] < 0) : false
  return <section className="edu-card p-4 space-y-4">
    <h2 className="font-semibold">{t("v4 厳密性パネル：収支恒等式・非平衡・裾・集団遺伝","v4 rigor panel: accounting identity, nonequilibrium, tails, population genetics")}</h2>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-semibold mb-1">{t("資金循環台帳（一人当たり累積・必需年バスケット）","Flow-of-funds ledger (per capita, cumulative, annual baskets)")}</h3>
        {flows.map(([k,v]) => <div key={k} className="text-xs"><div className="flex justify-between"><span>{k}</span><span className="tabular-nums">{v>=0?"+":""}{v.toFixed(3)}</span></div><div className="relative h-1.5 bg-edu-surface rounded overflow-hidden"><div className="absolute h-full w-px bg-edu-muted left-1/2"/><div className="absolute h-full" style={{background:v>=0?"#38bdf8":"#f59e0b",left:v>=0?"50%":(50-50*Math.abs(v)/max).toFixed(2)+"%",width:(50*Math.abs(v)/max).toFixed(2)+"%"}}/></div></div>)}
        <p className="text-xs mt-2 tabular-nums">{t("純資産平均の変化","Δ mean net wealth")} {l.change.toFixed(4)} · {t("恒等式残差","identity residual")} <strong>{Math.abs(l.closure)<1e-9?"|r| < 1e-9 ✓":l.closure.toExponential(1)}</strong></p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs content-start">
        {[[t("時間反転非対称性 (nat/日)","Time-irreversibility (nat/day)"),fmt(ne.irreversibility.rate,5)],[t("緩和時間 τ（日）","Relaxation time τ (days)"),fmt(ne.tau,1)],[t("第二固有値 |λ₂|","Second eigenvalue |λ₂|"),fmt(ne.rho,4)],[t("定常分布とのTV距離","TV distance to stationarity"),fmt(ne.stationaryGap,3)],[t("総資産Gini","Gross-asset Gini"),fmt(d.gini,3)],[t("Hill裾指数 α ± SE","Hill tail index α ± SE"),d.hill===null?"—":fmt(d.hill,2)+" ± "+fmt(d.hillSE,2)],[t("Miller–Madow補正エントロピー","Miller–Madow entropy"),fmt(d.entropyMM,4)],[t("κ₃ 95% ブートストラップ区間","κ₃ 95% bootstrap interval"),ci?"["+ci[0].toFixed(4)+", "+ci[1].toFixed(4)+"]":"—"],[t("G_ST（最終世代）","G_ST (final generation)"),fmt(g.at(-1)?.gst,4)],[t("隣接座位 r²","Adjacent-locus r²"),fmt(g.at(-1)?.ld,4)]].map(([k,v]) => <div key={k}><p className="text-edu-muted">{k}</p><strong className="text-sm tabular-nums">{v}</strong></div>)}
      </div>
    </div>
    <div className="text-xs">
      <p className="text-edu-muted mb-1">{t("最大の正味確率流（8区分 H·W·A ビット）","Largest net probability currents (8 bins, H·W·A bits)")}</p>
      <div className="flex flex-wrap gap-3 tabular-nums">{ne.irreversibility.currents.map(c => <span key={c.from+"-"+c.to}>{c.net>=0?bits(c.from)+" → "+bits(c.to):bits(c.to)+" → "+bits(c.from)} {Math.abs(c.net).toExponential(2)}</span>)}</div>
    </div>
    <p className="text-xs text-edu-muted">{t(
      "健康と名声は伊藤補正つきロジット座標のtamed Euler–Maruyama法で更新され、境界でのクリップはない。三次頂点は移動度Γの厳密な勾配流。台帳の残差は収支恒等式の数値誤差。非対称性は定常性を仮定した場合のエントロピー生成率の下界、τは経験遷移核のGelfandスペクトル半径から算出。τがバーンイン期間（180日）より長い場合、初期条件の影響がまだ残っている。κ₃区間が0を含まなければ、有限集団の標本揺らぎだけでは説明しにくい三次相関がある（因果の証明ではない）。",
      "Health and authority use a tamed, Itô-consistent Euler–Maruyama step in logit coordinates (no boundary clipping). The cubic vertex is an exact gradient flow with mobility Γ. The ledger residual is the numerical error of the accounting identity. Irreversibility lower-bounds entropy production under stationarity; τ comes from the Gelfand spectral radius of the empirical kernel. If τ exceeds the 180-day burn-in, initial-condition memory remains. A κ₃ interval excluding zero indicates third-order correlation beyond finite-population resampling noise (not proof of causation).")}
      {signal ? t(" 現在：0を含まない。"," Currently: excludes zero.") : t(" 現在：0を含む。"," Currently: includes zero.")}</p>
  </section>
}

export default function LivingWiki() {
  const { lang } = useLang()
  const en = lang === "en"
  const t = (jp: string, english: string) => en ? english : jp
  const [day,setDay] = useState(0)
  const [now,setNow] = useState(0)
  const [follow,setFollow] = useState(true)
  const [selected,setSelected] = useState("C002")
  const [query,setQuery] = useState("")
  const [scenario,setScenario] = useState("baseline")
  const [page,setPage] = useState(0)
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search)
    const id=params.get("person"),q=params.get("q")
    if(id && roster.some(p=>p.id===id)){setSelected(id)}
    else if(q){setQuery(q);const matches=roster.filter(p=>[p.name,p.nameEn,p.formal,p.formalEn].some(v=>v.toLowerCase()===q.toLowerCase()));if(matches.length===1){setSelected(matches[0]!.id)}}
  },[])
  useEffect(()=>{
    const update=()=>{const d=Math.max(0,Math.min(365,Math.floor((Date.now()-anchor)/86400000)));setNow(d);if(follow){setDay(d)}}
    update()
    const timer=window.setInterval(update,60000)
    return ()=>window.clearInterval(timer)
  },[follow])
  const model=useMemo(()=>simulate(active,day,scenario),[day,scenario])
  const p=roster.find(r=>r.id===selected)
  const i=active.findIndex(r=>r.id===selected)
  const state=i<0?undefined:model.current[i]
  const series=i<0?[]:model.snapshots.map(s=>s.current[i]).filter(s=>s!==undefined)
  const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return roster.filter(r=>[r.id,r.name,r.nameEn,r.formal,r.formalEn,r.region,r.regionEn].some(v=>v.toLowerCase().includes(q)))},[query])
  const sorted=useMemo(()=>active.map((r,j)=>({p:r,s:model.current[j]})).filter(x=>x.s!==undefined).sort((a,b)=>(b.s?.w??0)-(a.s?.w??0)),[model])
  const name=(r:Person)=>en?r.formalEn:r.formal
  return <main className="min-h-screen bg-edu-bg text-edu-text pt-16 pb-20 px-4">
    <div className="max-w-5xl mx-auto space-y-5">
      <Link href="/wiki" className="text-xs text-edu-accent">← {t("百科事典","Encyclopedia")}</Link>
      <header><p className="text-xs text-edu-muted tracking-widest">E16 / LIVING STATE OBSERVATORY</p><h1 className="text-2xl sm:text-4xl font-bold mt-2">{t("三相動態観測所","Triadic State Observatory")}</h1><p className="text-sm text-edu-muted mt-2">{t("E528の再現可能な合成シミュレーション。実測・既存の固定能力値・原典の資産額ではありません。","Reproducible synthetic E528 simulation, not measurements, legacy ability scores or historical wealth.")}</p></header>
      <section className="edu-card p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-center"><strong>E{528+Math.floor(day/366)} / {t("標準日","standard day")} {day+1}</strong><span className="text-xs text-edu-muted">{day===now&&scenario==="baseline"?t("現在モデル状態","Current model state"):t("比較シナリオ","Scenario / historical comparison")}</span><button className="rounded border border-edu-border px-3 py-1 text-sm" onClick={()=>{setDay(now);setFollow(true);setScenario("baseline")}}>{t("現在に戻る","Return to current")}</button></div>
        <label className="block text-xs">{t("時間軸（E528・行政暦）","Timeline (E528 administrative calendar)")}: {day+1}<input type="range" min="0" max="365" value={day} onChange={e=>{setFollow(false);setDay(Number(e.target.value))}} className="w-full"/></label>
        <label className="text-xs">{t("外部環境","External environment")} <select value={scenario} onChange={e=>setScenario(e.target.value)} className="bg-edu-surface border border-edu-border rounded p-2"><option value="baseline">{t("基準","Baseline")}</option><option value="reform">{t("医療・機会改善","Access reform")}</option><option value="crisis">{t("資源危機","Resource crisis")}</option></select></label>
        <p className="text-xs text-edu-muted">{t("2026-11-27 UTCをE528第1日に対応。現実の経過日を反映し、E528末で停止。シナリオは反事実の再計算です。","2026-11-27 UTC maps to E528 day 1; elapsed days advance the model, capped at year-end. Scenarios are counterfactual recalculations.")}</p>
      </section>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[[t("参照人物","Registry"),roster.length.toLocaleString()],[t("現代モデル対象","Current cohort"),active.length.toLocaleString()],[t("純資産中央値 n","Median net wealth n"),money(model.summary.median)],[t("上位1% 正資産比","Top 1% positive wealth share"),pct(model.summary.topShare)],[t("健康平均","Mean health"),index(model.summary.meanH)],[t("権威・名声平均","Mean authority"),index(model.summary.meanA)],[t("債務超過率","Negative net worth"),pct(model.summary.negative)]].map(([l,v])=><div key={l} className="edu-card p-3"><p className="text-xs text-edu-muted">{l}</p><p className="text-lg font-semibold tabular-nums">{v}</p></div>)}</div>
      <p className="text-xs text-edu-muted">{t("時系列の起点はE528初日の28日前（初期化期間）。週次サンプルと選択日の値。","Time series starts 28 days before E528 day 1 (burn-in). Weekly samples plus the selected day.")}</p>
      <Trend times={model.history.map(x=>x.day)} title={t("集団の状態推移","Population trajectories")} series={[model.history.map(x=>x.meanH),model.history.map(x=>wealthIndex(x.median)),model.history.map(x=>x.meanA)]} labels={[t("健康","Health"),t("資産指数","Wealth index"),t("権威・名声","Authority / reputation")]}/>
      <Trend times={model.history.map(x=>x.day)} title={t("格差の推移","Inequality over time")} series={[model.history.map(x=>x.topShare),model.history.map(x=>x.negative)]} labels={[t("上位1%","Top 1%"),t("債務超過","Negative wealth")]}/>
      {model.diagnostics&&<section className="edu-card p-4 space-y-3">
        <h2 className="font-semibold">{t("三次相関・情報幾何・粗視化診断","Third-order correlations and coarse-graining")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">{[[t("連結三点累積量","Connected third cumulant"),model.diagnostics.connected3.toFixed(6)],[t("Shannon情報エントロピー (nat)","Shannon entropy (nat)"),model.diagnostics.entropy.toFixed(4)],[t("総相関 (nat)","Total correlation (nat)"),model.diagnostics.totalCorrelation.toFixed(4)],[t("粗視化前KL","Fine KL"),model.diagnostics.klFine.toFixed(4)],[t("粗視化後KL","Coarse KL"),model.diagnostics.klCoarse.toFixed(4)],[t("情報損失 (nat)","Information loss (nat)"),model.diagnostics.informationLoss.toFixed(4)],[t("Markov閉包残差 (TV)","Markov closure residual (TV)"),model.transition?.residual?.toFixed(4)??"—"],[t("遷移サンプル","Transition samples"),String(model.transition?.samples??0)],[t("補助予測MSE（訓練内）","Auxiliary prediction MSE (training)"),(model.history.at(-1)?.predictionLoss??0).toFixed(6)]].map(([l,v])=><div key={l}><p className="text-edu-muted">{l}</p><strong className="text-base tabular-nums">{v}</strong></div>)}</div>
        <div className="grid grid-cols-4 gap-2">{model.diagnostics.counts.map((n,j)=><div key={j} className="text-xs"><div className="h-14 bg-edu-surface flex items-end"><div className="bg-sky-500 w-full" style={{height:(100*n/Math.max(1,...model.diagnostics!.counts))+"%"}}/></div><p className="tabular-nums">{j.toString(2).padStart(3,"0")}: {n}</p></div>)}</div>
        <p className="text-xs text-edu-muted">{t("8区分はH≧0.5、W≧0、A≧0.5の有無。KLは一様参照との比較。名声ビットを捨てる粗視化。残差は履歴依存・非定常性・サンプル誤差を含み、因果・熱力学・量子重力の測定ではない。","Eight bins encode H≥0.5, W≥0, A≥0.5. KL uses uniform reference; coarse graining drops authority. Residual includes memory, nonstationarity and sampling error; not a causal, thermodynamic or quantum-gravity measurement.")}</p>
      </section>}
      <Rigor model={model} en={en}/>
      <section className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4">
        <div className="edu-card p-4"><h2 className="font-semibold">{t("人物台帳","Character registry")}</h2><input aria-label={t("人物検索","Search people")} value={query} onChange={e=>{setQuery(e.target.value);setPage(0)}} placeholder={t("姓名・ID・居住地域","Name, ID or region")} className="w-full rounded border border-edu-border bg-edu-surface p-2 my-3 text-sm"/>
          <p className="text-xs text-edu-muted">{filtered.length} {t("件","results")}</p><div className="divide-y divide-edu-border">{filtered.slice(page*20,page*20+20).map(r=><button key={r.id} type="button" onClick={()=>setSelected(r.id)} aria-pressed={r.id===selected} className={"block w-full text-left py-2 text-sm "+(r.id===selected?"text-edu-accent":"")}><span className="text-xs text-edu-muted mr-2">{r.id}</span>{name(r)}</button>)}</div><div className="flex justify-between text-xs mt-3"><button disabled={page===0} onClick={()=>setPage(v=>v-1)}>{t("前へ","Previous")}</button><span>{page+1} / {Math.max(1,Math.ceil(filtered.length/20))}</span><button disabled={(page+1)*20>=filtered.length} onClick={()=>setPage(v=>v+1)}>{t("次へ","Next")}</button></div>
        </div>
        <div className="space-y-3">
          {p&&<div className="edu-card p-4"><p className="text-xs text-edu-muted">{p.id}</p><h2 className="text-xl font-semibold">{name(p)}</h2><p className="text-sm text-edu-muted">{en?p.regionEn:p.region} · {en?p.roleEn:p.role}</p>{p.identity&&<p className="text-xs mt-2">{en?p.identityEn:p.identity}</p>}
          {state?<><div className="grid grid-cols-3 gap-2 my-4">{[[t("健康・バイオ","Health / bio"),index(state.h)],[t("資産指数","Wealth index"),index(wealthIndex(state.w))],[t("権威・名声","Authority / reputation"),index(state.a)]].map(([l,v])=><div key={l} className="bg-edu-surface p-2 rounded"><p className="text-xs text-edu-muted">{l}</p><strong className="text-lg tabular-nums">{v}</strong></div>)}</div>
          <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto" role="img" aria-label={t("三相相互作用図","Three-way interaction diagram")}><polygon points="150,18 25,156 275,156" fill="none" stroke="currentColor" opacity=".35"/><polygon points={[[150,110-(92*state.h)],[150-125*wealthIndex(state.w),110+46*wealthIndex(state.w)],[150+125*state.a,110+46*state.a]].map(v=>v.join(",")).join(" ")} fill="#38bdf8" fillOpacity=".24" stroke="#38bdf8"/><text x="150" y="12" textAnchor="middle" fontSize="10" fill="currentColor">{t("健康","Health")}</text><text x="25" y="174" textAnchor="middle" fontSize="10" fill="currentColor">{t("資産","Wealth")}</text><text x="275" y="174" textAnchor="middle" fontSize="10" fill="currentColor">{t("名声","Reputation")}</text></svg>
          <dl className="grid grid-cols-2 gap-2 text-sm">{[[t("総資産 n","Assets n"),money(state.assets)],[t("負債 n","Debt n"),money(state.debt)],[t("純資産 n","Net wealth n"),money(state.w)],[t("形質発現（環境依存）","Trait expression"),pct(state.expression)],[t("医療アクセス","Care access"),pct(state.care)],[t("環境負荷","Environmental pressure"),pct(state.pressure)],[t("経済機会","Economic opportunity"),pct(state.opportunity)]].map(([l,v])=><div key={l}><dt className="text-xs text-edu-muted">{l}</dt><dd className="tabular-nums">{v}</dd></div>)}</dl>
          <p className="text-xs text-edu-muted mt-3">{t("匿名祖先集団から生成した仮想ハプロタイプ（原典のDNAではない）","Simulated haplotypes from anonymous ancestral cohorts (not canonical DNA)")}: <span className="font-mono">{state.alleles}</span></p></>:<p className="text-sm text-edu-muted my-4">{t("E528時点の存命・個体同一性が未確認。現在値は推定しません。","E528 survival or identity is unresolved; no current value is invented.")}</p>}</div>}
          {state&&<Effects state={state} en={en}/>}
          {state&&<Trend times={model.history.map(x=>x.day)} title={t("個人の三指標推移","Individual trajectories")} series={[series.map(s=>s.h),series.map(s=>wealthIndex(s.w)),series.map(s=>s.a)]} labels={[t("健康","Health"),t("資産指数","Wealth index"),t("名声","Reputation")]}/>}
        </div>
      </section>
      <Trend title={t("匿名祖先集団：6座位の世代変化（先頭3座位）","Ancestral cohort: generational allele frequency (first 3 of 6 loci)")} series={[0,1,2].map(k=>(model.ancestry??[]).map(v=>v[k]??0))} labels={["L1","L2","L3"]}/>
      <Trend title={t("匿名祖先集団：残り3座位の世代変化","Ancestral cohort: remaining three loci")} series={[3,4,5].map(k=>(model.ancestry??[]).map(v=>v[k]??0))} labels={["L4","L5","L6"]}/>
      <Trend title={t("匿名祖先集団：分化 G_ST×10・期待ヘテロ接合度・連鎖不平衡 r²×10","Ancestral cohort: differentiation G_ST×10, heterozygosity, linkage r²×10")} series={[(model.genetics??[]).map(v=>10*v.gst),(model.genetics??[]).map(v=>v.heterozygosity),(model.genetics??[]).map(v=>10*v.ld)]} labels={["G_ST×10","Hₑ","r²×10"]}/>
      <section className="edu-card p-4"><h2 className="font-semibold mb-3">{t("現在モデルの資産上位","Modeled wealth leaders")}</h2>{sorted.slice(0,15).map(({p:r,s},j)=><button key={r.id} onClick={()=>setSelected(r.id)} className="w-full text-left flex justify-between gap-2 py-2 border-b border-edu-border text-sm"><span>{j+1}. {name(r)}</span><span className="tabular-nums">{money(s?.w??0)} n</span></button>)}</section>
      <section className="edu-card p-4 text-xs text-edu-muted space-y-2"><h2 className="text-sm font-semibold text-edu-text">{t("モデルと限界","Model & limitations")}</h2><p>{t("共通初期状態・180日バーンイン、確率的非平衡ダイナミクス、双方向の三指標結合、社会ネットワークの勾配学習型の共有注意重み、三次結合・四次正則化、16世代の遺伝・組換え・突然変異・集団間遺伝子流動・環境依存の弱い選択。地域の健康・資産・名声が公共サービスと経済機会に還流する。資産指数は arctan による表示変換。","Shared initial state, 180-day burn-in, stochastic nonequilibrium dynamics, reciprocal coupling, gradient-trained shared attention, cubic coupling and quartic regularization, 16 generations of inheritance, recombination, mutation, gene flow and weak habitat-dependent selection. Regional health, wealth and authority feed back into public services and opportunity. Wealth index is an arctan display transform.")}</p><p>{t("宇宙環境の197日・29年周期は正典に基づく。物理学の社会への適用は比喩的なモデルであり量子重力の予測ではない。資産は年必需生活費1,000万nの仮定。性自認・性的指向・姓名は数値の入力に使わない。","Orbital periods of 197 days and 29 years follow canon. Physics-inspired social dynamics are analogical, not quantum-gravity predictions. Annual essentials are assumed to cost 10M n. Names and LGBT+ identity never drive scores.")}</p><p>{t("Edutext由来の非数値参照スナップショット：","Non-numeric Edutext reference snapshot: ")} {registry.source.slice(0,7)} · {t("モデル版","Model version")} {MODEL_VERSION}</p><Link href="/wiki" className="text-edu-accent">{t("Wikiへ戻る","Back to Wiki")}</Link></section>
    </div>
  </main>
}
