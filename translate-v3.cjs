#!/usr/bin/env node
const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/home/z/my-project/edu/src/domains/wiki';
const FILE = process.argv[2];
const BATCH_SIZE = 6;

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

async function translateBatch(descriptions, zai, startIdx) {
  const lines = descriptions.map((d, i) => `ITEM ${startIdx + i}:\n${d}`).join('\n\n');
  
  const prompt = `Translate the following Japanese text items to English.
Each item starts with "ITEM N:" where N is a number.
Return your response as a JSON object where keys are the item numbers as strings and values are the English translations.
Example format: {"40": "English translation here", "41": "Another translation"}
Return ONLY the JSON object. No other text, no markdown.

ITEMS TO TRANSLATE:

${lines}`;

  for (let retry = 0; retry < 3; retry++) {
    try {
      const c = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a translator. Return valid JSON objects only. No markdown, no commentary.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.15,
      });
      let text = (c.choices[0]?.message?.content || '').trim();
      // Clean up
      text = text.replace(/^```json\s*/im, '').replace(/\s*```$/m, '').trim();
      text = text.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      
      const parsed = JSON.parse(text);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('Not an object');
      return parsed;
    } catch (err) {
      if (retry < 2) {
        await new Promise(r => setTimeout(r, 1000)); // wait before retry
      }
    }
  }
  return {};
}

async function main() {
  if (!FILE) { console.error('Usage: node translate.cjs <file>'); process.exit(1); }
  const zai = await ZAI.create();
  const filePath = path.join(DATA_DIR, FILE);
  
  const { content, entries } = extractDescriptions(filePath);
  console.log(`${FILE}: ${entries.length} descriptions`);
  
  const allT = new Array(entries.length).fill('');
  
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const bn = Math.floor(i / BATCH_SIZE) + 1;
    const bt = Math.ceil(entries.length / BATCH_SIZE);
    process.stdout.write(`  Batch ${bn}/${bt}...`);
    
    const trans = await translateBatch(batch.map(e => e.description), zai, i);
    let got = 0;
    for (const [k, v] of Object.entries(trans)) {
      const idx = parseInt(k);
      if (idx >= 0 && idx < entries.length && v && typeof v === 'string') {
        allT[idx] = v;
        got++;
      }
    }
    console.log(` ${got}/${batch.length} OK`);
  }
  
  // Insert in reverse
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
  console.log(`Result: ${count}/${entries.length} inserted`);
}

main().catch(console.error);
