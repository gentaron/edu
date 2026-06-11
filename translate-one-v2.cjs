#!/usr/bin/env node
const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/home/z/my-project/edu/src/domains/wiki';
const FILE = process.argv[2] || 'terms.data.ts';
const BATCH_SIZE = parseInt(process.argv[3]) || 8;

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
  const numbered = descriptions.map((d, i) => `[${startIdx + i}] ${d}`).join('\n---\n');
  
  const prompt = `Translate these Japanese sci-fi wiki descriptions to English.
Keep proper nouns, era codes (E260), org names (AURALIS, ZAMLT) unchanged.
Return ONLY a JSON object with string keys and values. No markdown.

${numbered}`;

  for (let retry = 0; retry < 3; retry++) {
    try {
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You translate Japanese to English. Return valid JSON only: {"0":"english text","1":"english text"}. No markdown fences.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      });
      let text = (completion.choices[0]?.message?.content || '').trim();
      // Strip markdown fences
      text = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      // Fix common JSON issues
      text = text.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      
      const parsed = JSON.parse(text);
      // Verify it's an object
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Response is not a JSON object');
      }
      return parsed;
    } catch (err) {
      console.log(`    Retry ${retry + 1}: ${err.message?.substring(0, 80)}`);
      if (retry === 2) {
        // Try one more time with simpler prompt
        try {
          const simplePrompt = `Translate each line from Japanese to English. Return a JSON object mapping numbers ${startIdx} to ${startIdx + descriptions.length - 1} to their English translations.\n\n${descriptions.map((d, i) => `${startIdx + i}: ${d}`).join('\n')}`;
          const c2 = await zai.chat.completions.create({
            messages: [{ role: 'user', content: simplePrompt }],
            temperature: 0.2,
          });
          let t2 = (c2.choices[0]?.message?.content || '').trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim().replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          return JSON.parse(t2);
        } catch (e2) {
          console.log(`    Final attempt also failed: ${e2.message?.substring(0, 80)}`);
          return {};
        }
      }
    }
  }
  return {};
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
    console.log(`  Batch ${batchNum}/${total} (${batch.length} items)...`);
    
    const trans = await translateBatch(batch.map(e => e.description), zai, i);
    const keys = Object.keys(trans);
    console.log(`    Got ${keys.length} translations`);
    for (const key of keys) {
      const idx = parseInt(key);
      if (idx >= 0 && idx < entries.length && trans[key]) {
        allTranslations[idx] = trans[key];
      }
    }
  }
  
  // Check how many we got
  const filled = allTranslations.filter(t => t !== '').length;
  console.log(`  Total translations obtained: ${filled}/${entries.length}`);
  
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
  console.log(`\nDone: ${count}/${entries.length} descriptionEn fields written to ${FILE}`);
}

main().catch(console.error);
