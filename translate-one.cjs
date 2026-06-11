#!/usr/bin/env node
const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/home/z/my-project/edu/src/domains/wiki';
const FILE = process.argv[2] || 'terms.data.ts';
const BATCH_SIZE = parseInt(process.argv[3]) || 10;

function extractDescriptions(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const entries = [];
  const regex = /description:\s*\n?\s*("(?:[^"\\]|\\.)*")/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawStr = match[1];
    const text = rawStr.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n');
    entries.push({
      description: text,
      matchStart: match.index,
      matchEnd: match.index + match[0].length,
    });
  }
  return { content, entries };
}

async function translateBatch(descriptions, zai, startIdx) {
  const prompt = `You are a professional Japanese-to-English translator for a sci-fi fantasy wiki (EDU universe).
Translate these Japanese descriptions into natural English prose.
Keep proper nouns, era codes (E260 etc), org names (AURALIS, ZAMLT etc) unchanged.
Return ONLY valid JSON: {"0":"translation of desc 0","1":"translation of desc 1",...}
No markdown, no code fences.

${descriptions.map((d, i) => `[${startIdx + i}] ${d}`).join('\n---\n')}`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Return only valid JSON. No markdown.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
  });
  let text = completion.choices[0]?.message?.content || '';
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(text);
}

async function main() {
  const zai = await ZAI.create();
  const filePath = path.join(DATA_DIR, FILE);
  console.log(`Processing: ${FILE}`);
  
  const { content, entries } = extractDescriptions(filePath);
  console.log(`Found ${entries.length} descriptions`);
  
  const allTranslations = new Array(entries.length).fill('');
  
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const total = Math.ceil(entries.length / BATCH_SIZE);
    console.log(`  Batch ${batchNum}/${total}...`);
    
    try {
      const trans = await translateBatch(batch.map(e => e.description), zai, i);
      for (let j = 0; j < batch.length; j++) {
        allTranslations[i + j] = trans[String(i + j)] || '';
      }
    } catch (err) {
      console.error(`  Error in batch ${batchNum}:`, err.message?.substring(0, 120));
    }
  }
  
  // Insert translations in reverse order
  const indexed = entries.map((e, i) => ({ ...e, origIdx: i }));
  indexed.sort((a, b) => b.matchEnd - a.matchEnd);
  
  let result = content;
  let count = 0;
  for (const entry of indexed) {
    const translated = allTranslations[entry.origIdx];
    if (!translated) continue;
    const escaped = translated.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');
    result = result.slice(0, entry.matchEnd) + `\n    descriptionEn: "${escaped}",` + result.slice(entry.matchEnd);
    count++;
  }
  
  fs.writeFileSync(filePath, result, 'utf-8');
  console.log(`Done: ${count}/${entries.length} descriptionEn fields added`);
}

main().catch(console.error);
