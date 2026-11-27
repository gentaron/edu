import { describe, expect, it } from "vitest"
import { simulate, couplingEffects, vertex, observables, transitionResidual, logitStep, hillEstimator, gini, irreversibility, relaxation, MOBILITY } from "./living-model.mjs"
import registry from "./registry.json"
const people=registry.people.filter(p=>p.status==="current").slice(0,40)
describe("living state",()=>{
  it("cubic term factors and vanishes on neutral planes",()=>{
    expect(vertex(.5,3,.8).cubic).toBe(0)
    expect(vertex(.8,0,.8).cubic).toBe(0)
    expect(vertex(.8,3,.5).cubic).toBe(0)
    expect(vertex(.8,3,.8).cubic).toBeGreaterThan(0)
  })
  it("information contracts under dropping the authority bit",()=>{
    const o=observables(simulate(people,14).current)
    expect(o.klFine+1e-12).toBeGreaterThanOrEqual(o.klCoarse)
    expect(o.counts.reduce((a,b)=>a+b,0)).toBe(people.length)
    expect(o.totalCorrelation).toBeGreaterThanOrEqual(0)
  })
  it("detects exact deterministic Markov closure",()=>{
    const identity=Array.from({length:8},(_,i)=>Array.from({length:8},(_,j)=>i===j?10:0))
    expect(transitionResidual(identity,identity).residual).toBe(0)
  })
  it("shared predictor and diagnostics stay finite",()=>{
    const a=simulate(people,28)
    expect(a.learned?.every(Number.isFinite)).toBe(true)
    expect(a.history.every(h=>Number.isFinite(h.predictionLoss))).toBe(true)
    expect(a.transition?.residual).not.toBeNull()
  })
  it("is repeatable and bounded",()=>{const a=simulate(people,28);expect(a).toEqual(simulate(people,28));expect(a.current.length).toBe(people.length);for(const s of a.current){expect(s.h).toBeGreaterThanOrEqual(0);expect(s.h).toBeLessThanOrEqual(1);expect(s.a).toBeGreaterThanOrEqual(0);expect(s.a).toBeLessThanOrEqual(1);expect(s.assets-s.debt).toBeCloseTo(s.w,8)}})
  it("shows a trajectory even on day zero",()=>{expect(simulate(people,0).history.length).toBeGreaterThan(1)})
  it("changes with time and environment",()=>{expect(simulate(people,7).summary).not.toEqual(simulate(people,28).summary);expect(simulate(people,28,"crisis").summary).not.toEqual(simulate(people,28).summary)})
  it("does not use names or identity",()=>{const p=people.map(x=>({...x,name:"X",nameEn:"Y",identity:"test",identityEn:"test"}));expect(simulate(p,7).summary).toEqual(simulate(people,7).summary)})
  it("reports finite signed direct effects and neutral zero",()=>{
    const a=simulate(people,7).current[0]!
    expect(Object.values(couplingEffects(a)).every(Number.isFinite)).toBe(true)
    for(const v of Object.values(couplingEffects({...a,h:.5,a:.5,w:0}))){expect(v).toBeCloseTo(0,10)}
    expect(couplingEffects({...a,w:-2}).wealthToHealth).toBeLessThan(0)
    expect(couplingEffects({...a,w:2}).wealthToHealth).toBeGreaterThan(0)
  })
  it("keeps ancestry and pre-scenario history common",()=>{
    const a=simulate(people,14),b=simulate(people,14,"crisis")
    expect(a.ancestry).toEqual(b.ancestry)
    expect(a.history.filter(s=>s.day<0)).toEqual(b.history.filter(s=>s.day<0))
  })
  it("keeps inherited haplotypes stable within an individual lifetime",()=>{expect(simulate(people,0).current.map(s=>s.alleles)).toEqual(simulate(people,28).current.map(s=>s.alleles))})
})

describe("v4 numerics and estimators",()=>{
  // Deterministic Gauss–Hermite-free quadrature: fine grid against the standard normal density.
  const gauss=(fn:(z:number)=>number)=>{let s=0,w=0;for(let z=-8;z<=8;z+=.001){const d=Math.exp(-z*z/2);s+=d*fn(z);w+=d}return s/w}
  it("logit step is Itô-consistent in mean and variance to first order",()=>{
    for(const [p,mu,sig] of [[.4,.005,.02],[.7,-.004,.025],[.2,.003,.018]] as const){
      const m=gauss(z=>logitStep(p,mu,sig,z)-p)
      expect(Math.abs(m-mu)).toBeLessThan(.12*Math.abs(mu)+2e-5)
      const v=gauss(z=>(logitStep(p,mu,sig,z)-p-m)**2)
      const target=(4*sig*p*(1-p))**2
      expect(Math.abs(v-target)/target).toBeLessThan(.08)
    }
  })
  it("logit step never leaves (0,1) even under extreme drift and noise",()=>{
    for(const p of [1e-9,.01,.5,.99,1-1e-9])for(const mu of [-5,0,5])for(const z of [-9,0,9]){const q=logitStep(p,mu,.05,z);expect(q).toBeGreaterThan(0);expect(q).toBeLessThan(1)}
  })
  it("vertex drift is the exact gradient flow with mobility Γ",()=>{
    const pt=[.73,2.4,.31] as const,eps=1e-6,V=(h:number,w:number,a:number)=>vertex(h,w,a).potential
    const fd=[(V(pt[0]+eps,pt[1],pt[2])-V(pt[0]-eps,pt[1],pt[2]))/(2*eps),(V(pt[0],pt[1]+eps,pt[2])-V(pt[0],pt[1]-eps,pt[2]))/(2*eps),(V(pt[0],pt[1],pt[2]+eps)-V(pt[0],pt[1],pt[2]-eps))/(2*eps)]
    const v=vertex(...pt),drift=[v.dh+v.dampH,v.dw+v.dampW,v.da+v.dampA]
    for(let k=0;k<3;k++)expect(drift[k]!).toBeCloseTo(-MOBILITY[k]!*fd[k]!,9)
    expect(v.dissipation).toBeLessThanOrEqual(0)
    let s:[number,number,number]=[.9,8,.85],last=V(...s)
    for(let i=0;i<200;i++){const u=vertex(...s);s=[s[0]+u.dh+u.dampH,s[1]+u.dw+u.dampW,s[2]+u.da+u.dampA];const now=V(...s);expect(now).toBeLessThanOrEqual(last+1e-15);last=now}
  })
  it("flow-of-funds ledger closes the aggregate wealth identity",()=>{
    const l=simulate(people,21).ledger!
    expect(Math.abs(l.closure)).toBeLessThan(1e-9)
    expect(l.wage).toBeGreaterThan(0);expect(l.expense).toBeLessThan(0)
  })
  it("irreversibility vanishes under detailed balance and detects cycles",()=>{
    const sym=[[5,3,2],[3,5,1],[2,1,5]],cyc=[[0,30,0],[0,0,30],[30,0,0]]
    expect(irreversibility(sym).rate).toBeCloseTo(0,12)
    expect(irreversibility(cyc).rate).toBeGreaterThan(1)
  })
  it("Gelfand relaxation recovers the second eigenvalue of a known chain",()=>{
    const r=relaxation([[900,100],[200,800]])
    expect(r.rho!).toBeCloseTo(.7,3);expect(r.tau!).toBeCloseTo(-1/Math.log(.7),2)
    expect(r.stationary[0]!).toBeCloseTo(2/3,6)
  })
  it("Hill estimator recovers a Pareto tail and Gini matches closed forms",()=>{
    const n=40000,alpha=1.5,x=Array.from({length:n},(_,i)=>((i+1)/(n+1))**(-1/alpha))
    const h=hillEstimator(x);expect(Math.abs(h.alpha!-alpha)).toBeLessThan(3*h.se!)
    expect(gini([1,1,1,1])).toBeCloseTo(0,12)
    expect(gini([0,0,0,1])).toBeCloseTo(.75,12)
  })
  it("population-genetic summaries and bootstrap interval are well-formed",()=>{
    const r=simulate(people,7)
    for(const g of r.genetics!){expect(g.gst).toBeGreaterThanOrEqual(0);expect(g.gst).toBeLessThanOrEqual(1);expect(g.ld).toBeGreaterThanOrEqual(0);expect(g.ld).toBeLessThanOrEqual(1)}
    const [lo,hi]=r.bootstrap!.connected3;expect(lo).toBeLessThanOrEqual(hi)
    expect(r.nonequilibrium!.stationary.reduce((a,b)=>a+b,0)).toBeCloseTo(1,8)
  })
})
