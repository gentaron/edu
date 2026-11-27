import { describe, expect, it } from "vitest"
import { simulate, couplingEffects } from "./living-model.mjs"
import registry from "./registry.json"
const people=registry.people.filter(p=>p.status==="current").slice(0,40)
describe("living state",()=>{
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
