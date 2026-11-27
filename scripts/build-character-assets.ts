/** Batch generation: no image API, no per-person inference request. */
import { mkdir, writeFile, rm } from "node:fs/promises"
import { join } from "node:path"
import { roster, pages, pageOf, portraitFor, portraitPresentation } from "../src/app/api/characters/graph"
import { characterResponse } from "../src/app/api/characters/responses"
import { drawPortrait, ASSET_ROOT } from "../src/app/wiki/_components/portrait-design"
import { characterKey } from "../src/app/wiki/_components/character-search"
async function main() {
  const root = join(process.cwd(), "public", ASSET_ROOT)
  await rm(root, { recursive: true, force: true })
  for (const sub of ["pfp", "data", "data/detail"]) await mkdir(join(root,sub), {recursive:true})
  const seen = new Set<string>()
  let generated = 0
  for (const p of roster) {
    const svg = drawPortrait(p.id, portraitPresentation(p.id))
    if (seen.has(svg)) throw Error("Duplicate SVG face: " + p.id)
    seen.add(svg)
    if (portraitFor(p.id).generated) generated++
    await writeFile(join(root,"pfp",p.id+".svg"), svg)
  }
  const save = async (file: string, view: string | null, id: string | null) => {
    const data = await characterResponse(view,id).json()
    if (data.schema !== 3) throw Error("Invalid schema")
    if (!id && (data.rows.length !== roster.length || !data.rows.every((r: {state?: {h:number;wi:number;a:number}; h?:number;w?:number;a?:number}) => view === "population" ? [r.h,r.w,r.a].every(Number.isFinite) : !!r.state && [r.state.h,r.state.wi,r.state.a].every(Number.isFinite)))) throw Error("Incomplete roster: "+file)
    if (id && !data.redirect && (data.people.length !== 1 || !data.people[0].state)) throw Error("Missing detail: "+id)
    await writeFile(join(root,"data",file+".json"),JSON.stringify(data))
  }
  await save("directory",null,null)
  await save("population","population",null)
  for (const p of pages) await save("detail/"+characterKey(p.id),null,p.id)
  for (const p of roster) if (pageOf(p.id)!==p.id) await save("detail/"+characterKey(p.id),null,p.id)
  await save("detail/"+characterKey("Tina/Gue"),null,"Tina/Gue")
  const report={total:roster.length, generated, existing:roster.length-generated, fallbackPortraits:seen.size, pages:pages.length, computed:roster.length}
  await writeFile(join(root,"manifest.json"),JSON.stringify(report))
  console.log("Character assets:",JSON.stringify(report))
}
main().catch(e=>{console.error(e);process.exitCode=1})
