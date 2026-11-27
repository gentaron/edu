/** Original vector portraits. Only explicit identity metadata affects presentation. */
export type Presentation = "masculine" | "feminine" | "neutral" | "unspecified"
export interface Portrait { src: string; fallback: string; generated: boolean }
export const ASSET_ROOT = "/character-assets/v1"
export function presentationFor(identity: string): Presentation {
  if (/transgender woman|トランスジェンダー女性|^woman$|^女性$/i.test(identity)) return "feminine"
  if (/transgender man|トランスジェンダー男性|^man$|^男性$/i.test(identity)) return "masculine"
  if (/non.binary|ノンバイナリー/i.test(identity)) return "neutral"
  return "unspecified"
}
export const portraitPath = (id: string) => ASSET_ROOT + "/pfp/" + encodeURIComponent(id) + ".svg"
function random(seed: string) {
  let x = 2166136261
  for (const c of seed) x = Math.imul(x ^ c.charCodeAt(0), 16777619) >>> 0
  return () => { x += 0x6d2b79f5; let t = Math.imul(x ^ x >>> 15, x | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296 }
}
export function drawPortrait(id: string, presentation: Presentation): string {
  const r = random("EDU-portrait-v1:" + id), pick = <T,>(a: readonly T[]) => a[Math.floor(r()*a.length)]!
  const range = (a:number,b:number) => Math.round(a+(b-a)*r())
  const hue=range(0,359), bg="hsl("+hue+" 24% 24%)", light="hsl("+hue+" 33% 44%)"
  const skin=pick(["#f5d2b1","#e7bb9b","#d8a17b","#ba805d","#9b674e","#774d3d","#553c36","#e3c7a6"])
  const hair=pick(["#211d28","#3f2b25","#744d38","#ad8150","#c0b7b0","#27364b","#715d7b","#3c404c"])
  const eyes=pick(["#3d5159","#584336","#6b7851","#344b73","#55466c","#26282f"])
  const coat=pick(["#44566b","#384a48","#68607b","#5a4456","#4c5963","#736550","#3f3b51"])
  const face=range(40,48), jaw=range(22,36), eyeGap=range(21,28), brow=range(3,8), nose=range(4,8), mouth=range(13,22)
  const feminine = presentation === "feminine", masculine = presentation === "masculine"
  const style = feminine ? pick([0,1,2,3,4,5,6]) : masculine ? pick([0,1,2,4,5,6]) : pick([0,1,2,3,4,5,6])
  const backs = style===3 || style===6 ? '<path d="M79 123 Q65 32 128 25 Q191 32 177 123 L193 198 Q128 218 63 198Z" fill="'+hair+'"/>' : ''
  const hairs=[
    "M79 104 Q63 39 118 31 Q178 22 178 99 Q154 69 130 66 Q104 88 79 104Z",
    "M79 100 Q67 40 120 33 Q177 30 177 102 L153 69 Q132 94 104 67Z",
    "M79 102 Q71 42 117 38 Q155 13 178 65 L177 105 Q157 80 146 56 Q116 76 79 102Z",
    "M78 113 Q57 25 127 29 Q195 24 179 113 L158 74 Q130 101 102 73Z",
    "M79 97 Q77 38 128 37 Q178 36 177 97 Q164 75 128 73 Q91 75 79 97Z",
    "M80 102 Q64 57 102 44 Q143 8 175 53 L178 102 Q151 86 139 58 Q123 91 80 102Z",
    "M78 110 Q67 35 122 26 Q191 28 178 110 L162 68 Q131 87 101 69Z"
  ]
  const pupil=range(3,5), cheek=range(0,3), accessory=range(0,7)
  const glasses=accessory===1 ? '<g fill="none" stroke="#34333c" stroke-width="3"><rect x="'+(128-eyeGap-15)+'" y="106" width="30" height="23" rx="7"/><rect x="'+(128+eyeGap-15)+'" y="106" width="30" height="23" rx="7"/><path d="M'+(128-eyeGap+15)+' 115 H'+(128+eyeGap-15)+'"/></g>' : ''
  const freckles=cheek===1 ? '<g fill="#875b50" opacity=".6"><circle cx="100" cy="133" r="1.4"/><circle cx="105" cy="136" r="1.3"/><circle cx="110" cy="132" r="1.4"/><circle cx="146" cy="132" r="1.4"/><circle cx="151" cy="136" r="1.3"/><circle cx="156" cy="133" r="1.4"/></g>' : ''
  const beard=masculine && r()<.25 ? '<path d="M92 141 Q128 168 164 141 Q157 175 128 181 Q99 175 92 141Z" fill="'+hair+'" opacity=".38"/>' : ''
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><defs><linearGradient id="b" x2="1" y2="1"><stop stop-color="'+light+'"/><stop offset="1" stop-color="'+bg+'"/></linearGradient></defs><rect width="256" height="256" fill="url(#b)"/><circle cx="128" cy="117" r="95" fill="none" stroke="#fff" opacity=".09" stroke-width="2"/><path d="M17 256 Q21 206 83 191 L106 181 H150 L173 191 Q235 206 239 256Z" fill="'+coat+'"/>'+backs+'<path d="M108 166 H148 V195 Q128 213 108 195Z" fill="'+skin+'"/><ellipse cx="'+(128-face)+'" cy="123" rx="8" ry="13" fill="'+skin+'"/><ellipse cx="'+(128+face)+'" cy="123" rx="8" ry="13" fill="'+skin+'"/><path d="M'+(128-face)+' 94 Q'+(128-face)+' 48 128 47 Q'+(128+face)+' 48 '+(128+face)+' 94 L'+(128+face-4)+' 140 Q'+(128+jaw)+' 177 128 183 Q'+(128-jaw)+' 177 '+(128-face+4)+' 140Z" fill="'+skin+'"/><path d="'+hairs[style]+'" fill="'+hair+'"/><path d="M'+(128-eyeGap-12)+' '+(108-brow)+' Q'+(128-eyeGap)+' '+(98-brow)+' '+(128-eyeGap+11)+' '+(108-brow)+' M'+(128+eyeGap-11)+' '+(108-brow)+' Q'+(128+eyeGap)+' '+(98-brow)+' '+(128+eyeGap+12)+' '+(108-brow)+'" stroke="'+hair+'" stroke-width="4" stroke-linecap="round" fill="none"/>'+[-1,1].map(k=>'<ellipse cx="'+(128+k*eyeGap)+'" cy="117" rx="11" ry="6" fill="#fff6e9"/><circle cx="'+(128+k*eyeGap)+'" cy="117" r="'+pupil+'" fill="'+eyes+'"/><circle cx="'+(126+k*eyeGap)+'" cy="115" r="1.4" fill="#fff"/>').join("")+'<path d="M128 119 L'+(128-nose)+' 139 Q128 143 '+(128+nose)+' 139" fill="none" stroke="#63463e" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round"/>'+beard+'<path d="M'+(128-mouth)+' 153 Q128 '+range(155,162)+' '+(128+mouth)+' 153" fill="none" stroke="#754d4c" stroke-width="3" stroke-linecap="round"/>'+freckles+glasses+'<path d="M83 194 L108 182 L128 207 L148 182 L173 194 L153 229 L128 211 L103 229Z" fill="#d5d8d7" opacity=".3"/></svg>'
}
