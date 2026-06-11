#!/usr/bin/env node
const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/home/z/my-project/edu/src/domains/wiki';
const FILE = process.argv[2];
const CHUNK = 15;

function extractDesc(fp) {
  const c = fs.readFileSync(fp, 'utf-8');
  const e = [];
  const r = /description:\s*\n?\s*("(?:[^"\\]|\\.)*")/g;
  let m;
  while ((m = r.exec(c)) !== null) e.push({ d: m[1].slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,'\n'), s: m.index, e: m.index+m[0].length });
  return { c, e };
}

async function translateChunk(descs, zai, startIdx) {
  const items = descs.map((d, i) => `${startIdx+i}|||${d}`).join('\n');
  const prompt = `Translate each Japanese text below to English. Each line has format: NUMBER|||Japanese text
Return translations in EXACT same format: NUMBER|||English translation
One line per item. No other text. No markdown.

${items}`;

  for (let r = 0; r < 3; r++) {
    try {
      const c = await zai.chat.completions.create({
        messages: [{ role: 'system', content: 'Translate Japanese to English. Return lines in format: NUMBER|||translation. No other text.' }, { role: 'user', content: prompt }],
        temperature: 0.15,
      });
      let text = (c.choices[0]?.message?.content || '').trim();
      // Strip markdown fences
      text = text.replace(/^```\w*\n?/gm, '').replace(/\n?```$/gm, '').trim();
      
      const result = {};
      for (const line of text.split('\n')) {
        const sep = line.indexOf('|||');
        if (sep === -1) continue;
        const num = parseInt(line.substring(0, sep).trim());
        const trans = line.substring(sep + 3).trim();
        if (!isNaN(num) && trans) result[num] = trans;
      }
      return result;
    } catch (err) {
      if (r < 2) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return {};
}

async function main() {
  if (!FILE) { console.error('Usage: node t.cjs <file>'); process.exit(1); }
  const zai = await ZAI.create();
  const fp = path.join(DATA_DIR, FILE);
  const { c, e: entries } = extractDesc(fp);
  console.error(`${FILE}: ${entries.length} entries`);
  
  const all = new Array(entries.length).fill('');
  for (let i = 0; i < entries.length; i += CHUNK) {
    const chunk = entries.slice(i, i + CHUNK);
    const bn = Math.floor(i/CHUNK) + 1;
    const bt = Math.ceil(entries.length/CHUNK);
    console.error(`  Chunk ${bn}/${bt}...`);
    const t = await translateChunk(chunk.map(x => x.d), zai, i);
    for (const [k, v] of Object.entries(t)) {
      const idx = parseInt(k);
      if (idx >= 0 && idx < entries.length) all[idx] = v;
    }
    console.error(`    Got ${Object.keys(t).length}`);
  }
  
  const sorted = entries.map((e, i) => ({ ...e, oi: i })).sort((a, b) => b.e - a.e);
  let res = c;
  let cnt = 0;
  for (const e of sorted) {
    const t = all[e.oi];
    if (!t) continue;
    const esc = t.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');
    res = res.slice(0, e.e) + `\n    descriptionEn: "${esc}",` + res.slice(e.e);
    cnt++;
  }
  fs.writeFileSync(fp, res, 'utf-8');
  console.error(`DONE: ${cnt}/${entries.length}`);
  console.log(cnt);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
