#!/usr/bin/env node
const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/home/z/my-project/edu/src/domains/wiki';
const FILE = process.argv[2];

function extractDescriptions(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const entries = [];
  const regex = /description:\s*\n?\s*("(?:[^"\\]|\\.)*")/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawStr = match[1];
    const text = rawStr.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n');
    entries.push({ description: text, matchStart: match.index, matchEnd: match.index + match[0].length });
  }
  return { content, entries };
}

async function translateAll(entries, zai) {
  // Split into 2 large chunks max
  const CHUNK = 25;
  const allT = new Array(entries.length).fill('');
  
  for (let start = 0; start < entries.length; start += CHUNK) {
    const chunk = entries.slice(start, start + CHUNK);
    const end = start + chunk.length - 1;
    
    const lines = chunk.map((e, i) => `[${start + i}] ${e.description}`).join('\n');
    const prompt = `Translate each Japanese wiki entry below to English.
Format: return ONLY a JSON object mapping the number in brackets to the English translation.
Example: {"0":"English here","1":"English here"}
Keep proper nouns (AURALIS, ZAMLT, E260, etc.) unchanged. No markdown.

${lines}`;

    console.error(`Chunk ${Math.floor(start/CHUNK)+1}: items ${start}-${end} (${chunk.length})...`);
    
    try {
      const c = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You translate Japanese to English. Return ONLY valid JSON. No markdown fences.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.15,
      });
      
      let text = (c.choices[0]?.message?.content || '').trim();
      text = text.replace(/^```json\s*/im, '').replace(/\s*```$/m, '').trim();
      text = text.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      
      const parsed = JSON.parse(text);
      for (const [k, v] of Object.entries(parsed)) {
        const idx = parseInt(k);
        if (idx >= 0 && idx < entries.length && v && typeof v === 'string') {
          allT[idx] = v;
        }
      }
      
      const got = Object.keys(parsed).length;
      console.error(`  OK: ${got}/${chunk.length}`);
    } catch (err) {
      console.error(`  ERROR: ${err.message?.substring(0, 100)}`);
    }
  }
  return allT;
}

async function main() {
  if (!FILE) { console.error('Usage: node tr.cjs <file>'); process.exit(1); }
  const zai = await ZAI.create();
  const filePath = path.join(DATA_DIR, FILE);
  const { content, entries } = extractDescriptions(filePath);
  console.error(`${FILE}: ${entries.length} descriptions`);
  
  const allT = await translateAll(entries, zai);
  
  const indexed = entries.map((e, i) => ({ ...e, oi: i }));
  indexed.sort((a, b) => b.matchEnd - a.matchEnd);
  let result = content;
  let count = 0;
  for (const entry of indexed) {
    const t = allT[entry.oi];
    if (!t) continue;
    const esc = t.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');
    result = result.slice(0, entry.matchEnd) + `\n    descriptionEn: "${esc}",` + result.slice(entry.matchEnd);
    count++;
  }
  
  fs.writeFileSync(filePath, result, 'utf-8');
  console.error(`DONE: ${count}/${entries.length}`);
  console.log(`${count}`);
}

main().catch(console.error);
