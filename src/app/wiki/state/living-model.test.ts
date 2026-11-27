import { describe, expect, it } from "vitest"
import { simulate } from "./living-model.mjs"
import registry from "./registry.json"
const people=registry.people.filter(p=>p.status==="current").slice(0,40)
describe("living state",()=>{
  it("is repeatable and bounded",()=>{const a=simulate(people,28);expect(a).toEqual(simulate(people,28));expect(a.current.length).toBe(people.length);for(const s of a.current){expect(s.h).toBeGreaterThanOrEqual(0);expect(s.h).toBeLessThanOrEqual(1);expect(s.a).toBeGreaterThanOrEqual(0);expect(s.a).toBeLessThanOrEqual(1);expect(s.assets-s.debt).toBeCloseTo(s.w,8)}})
  it("changes with time and environment",()=>{expect(simulate(people,7).summary).not.toEqual(simulate(people,28).summary);expect(simulate(people,28,"crisis").summary).not.toEqual(simulate(people,28).summary)})
  it("does not use names or identity",()=>{const p=people.map(x=>({...x,name:"X",nameEn:"Y",identity:"test",identityEn:"test"}));expect(simulate(p,7).summary).toEqual(simulate(people,7).summary)})
  it("keeps inherited haplotypes stable within an individual lifetime",()=>{expect(simulate(people,0).current.map(s=>s.alleles)).toEqual(simulate(people,28).current.map(s=>s.alleles))})
})
