#!/usr/bin/env node
/**
 * Translate a wiki data file's descriptions from Japanese to English.
 * Usage: node translate-wiki-file.cjs <filename> [startIdx]
 * 
 * If startIdx is provided, only translates entries from that index onward.
 * This allows resuming partial translations.
 */
const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/home/z/my-project/edu/src/domains/wiki';

function extractDesc(fp) {
  const c = fs.readFileSync(fp, 'utf-8');
  const e = [];
  const r = /description:\s*\n?\s*("(?:[^"\\]|\\.)*")/g;
  let m;
  while ((m = r.exec(c)) !== null) e.push({ d: m[1].slice(1,-1).replace(/\\"/g,'"').replace(/\\n/g,'\n'), s: m.index, e: m.index+m[0].length });
  return { c, e };
}

function checkAlreadyHasDescEn(content) {
  // Count how many descriptionEn fields already exist
  return (content.match(/descriptionEn:/g) || []).length;
}

async function translateChunk(descs, zai, startIdx) {
  const items = descs.map((d, i) => `${startIdx+i}|||${d}`).join('\n');
  const prompt = `Translate each Japanese text below to English.
Format: NUMBER|||English translation (one per line, no other text).
Keep proper nouns, era codes, org names unchanged.
Keep the epic sci-fi fantasy tone.

${items}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const c = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: 'Return translations as NUMBER|||English, one per line. No markdown.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.15,
      });
      let text = (c.choices[0]?.message?.content || '').trim();
      text = text.replace(/^```\w*\n?/gm, '').replace(/\n?```$/gm, '').trim();
      
      const result = {};
      for (const line of text.split('\n')) {
        const sep = line.indexOf('|||');
        if (sep === -1) continue;
        const num = parseInt(line.substring(0, sep).trim());
        const trans = line.substring(sep + 3).trim();
        if (!isNaN(num) && trans) result[num] = trans;
      }
      if (Object.keys(result).length > 0) return result;
    } catch (err) {
      console.error(`    Attempt ${attempt+1} failed: ${err.message?.substring(0,80)}`);
    }
  }
  return {};
}

async function main() {
  const FILE = process.argv[2];
  if (!FILE) { console.error('Usage: node translate-wiki-file.cjs <file> [startIdx]'); process.exit(1); }
  
  const SKIP = parseInt(process.argv[3]) || 0;
  const CHUNK = 8;
  
  const zai = await ZAI.create();
  const fp = path.join(DATA_DIR, FILE);
  
  // Check if already has some translations
  const existingCount = checkAlreadyHasDescEn(fs.readFileSync(fp, 'utf-8'));
  if (existingCount > 0) {
    console.error(`WARNING: ${FILE} already has ${existingCount} descriptionEn fields.`);
    console.error('Please reset the file first: git checkout -- <file>');
    process.exit(1);
  }
  
  const { c, e: entries } = extractDesc(fp);
  const total = entries.length;
  console.error(`${FILE}: ${total} entries, starting from index ${SKIP}`);
  
  const all = new Array(total).fill('');
  let successCount = 0;
  let failCount = 0;
  
  for (let i = Math.max(0, SKIP); i < total; i += CHUNK) {
    const chunk = entries.slice(i, Math.min(i + CHUNK, total));
    const bn = Math.floor(i/CHUNK) + 1;
    const bt = Math.ceil(total/CHUNK);
    console.error(`  Chunk ${bn}/${bt} [${i}-${i+chunk.length-1}]...`);
    
    const t = await translateChunk(chunk.map(x => x.d), zai, i);
    const got = Object.keys(t).length;
    
    if (got > 0) {
      for (const [k, v] of Object.entries(t)) {
        const idx = parseInt(k);
        if (idx >= 0 && idx < total) all[idx] = v;
      }
      successCount += got;
      console.error(`    OK: ${got}/${chunk.length}`);
    } else {
      failCount += chunk.length;
      console.error(`    FAILED: ${chunk.length} items`);
    }
  }
  
  // Insert in reverse order
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
  console.error(`DONE: ${cnt}/${total} inserted (${failCount} failed)`);
  console.log(JSON.stringify({file: FILE, total, inserted: cnt, failed: failCount}));
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
