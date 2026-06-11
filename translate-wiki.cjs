#!/usr/bin/env node
/**
 * Wiki Description Translator
 * Reads edu wiki data files, translates Japanese descriptions to English,
 * and writes back updated files with descriptionEn field.
 */
const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/home/z/my-project/edu/src/domains/wiki';

const FILES = [
  'characters.data.ts',
  'characters-new.data.ts',
  'organizations.data.ts',
  'geography.data.ts',
  'technology.data.ts',
  'terms.data.ts',
  'history.data.ts',
];

/**
 * Extract all description texts from a data file.
 */
function extractDescriptions(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const entries = [];

  // Match description: "..." patterns (potentially multi-line with \n)
  const regex = /description:\s*\n?\s*("(?:[^"\\]|\\.)*")/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawStr = match[1];
    // Handle escaped quotes and newlines
    const text = rawStr.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n');
    entries.push({
      description: text,
      matchStart: match.index,
      matchEnd: match.index + match[0].length,
      fullMatch: match[0],
    });
  }
  return { content, entries };
}

/**
 * Translate descriptions in batches using the LLM.
 */
async function translateDescriptions(descriptions, zai, fileLabel) {
  const BATCH_SIZE = 12;
  const results = [];
  
  for (let i = 0; i < descriptions.length; i += BATCH_SIZE) {
    const batch = descriptions.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(descriptions.length / BATCH_SIZE);
    
    console.log(`  [${fileLabel}] Batch ${batchNum}/${totalBatches} (${batch.length} entries)...`);
    
    const numberedTexts = batch.map((d, idx) => `[${i + idx}] ${d}`).join('\n---\n');
    
    const prompt = `You are a professional Japanese-to-English translator for a sci-fi fantasy wiki called "Eternal Dominion Universe" (EDU).

Translate the following Japanese wiki descriptions into natural, engaging English prose.

Rules:
- Preserve the epic, dramatic sci-fi fantasy tone
- Keep proper nouns (character names, place names, organization names, era codes like E260) exactly as they appear
- Keep technical terms (AURALIS, ZAMLT, IRIS Ranking, etc.) unchanged
- Translate philosophical/cultural references naturally
- Return ONLY a valid JSON object mapping index numbers to English translations
- No markdown, no code fences, no commentary

Descriptions:
${numberedTexts}`;

    for (let retry = 0; retry < 3; retry++) {
      try {
        const completion = await zai.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are a professional translator. Return only valid JSON objects. No markdown formatting, no code fences.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
        });
        
        let responseText = completion.choices[0]?.message?.content || '';
        // Strip markdown code fences
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const translations = JSON.parse(responseText);
        
        for (let j = 0; j < batch.length; j++) {
          const idx = i + j;
          results[idx] = translations[String(idx)] || '';
        }
        break;
      } catch (err) {
        console.error(`  [${fileLabel}] Batch ${batchNum} error (retry ${retry + 1}):`, err.message?.substring(0, 100));
        if (retry === 2) {
          // Final fallback: leave empty (will skip insertion)
          for (let j = 0; j < batch.length; j++) {
            results[i + j] = '';
          }
        }
      }
    }
  }
  
  return results;
}

/**
 * Insert descriptionEn field after each description in the file content.
 * Process in reverse order to preserve character indices.
 */
function insertTranslations(content, entries, translations) {
  const indexed = entries.map((e, i) => ({ ...e, origIdx: i }));
  // Sort by matchEnd descending to process from end to start
  const sorted = [...indexed].sort((a, b) => b.matchEnd - a.matchEnd);
  
  let result = content;
  let inserted = 0;
  
  for (const entry of sorted) {
    const translated = translations[entry.origIdx];
    if (!translated || translated === entry.description) continue;
    
    // Escape for TypeScript string literal
    const escaped = translated
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
    
    const insertion = `\n    descriptionEn: "${escaped}",`;
    result = result.slice(0, entry.matchEnd) + insertion + result.slice(entry.matchEnd);
    inserted++;
  }
  
  return { result, inserted };
}

async function main() {
  console.log('Initializing ZAI SDK...');
  const zai = await ZAI.create();
  console.log('SDK ready.\n');
  
  let totalInserted = 0;
  
  for (const file of FILES) {
    const filePath = path.join(DATA_DIR, file);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing: ${file}`);
    console.log('='.repeat(60));
    
    const { content, entries } = extractDescriptions(filePath);
    console.log(`  Found ${entries.length} descriptions`);
    
    if (entries.length === 0) {
      console.log('  No descriptions found, skipping.');
      continue;
    }
    
    const descriptions = entries.map(e => e.description);
    const translations = await translateDescriptions(descriptions, zai, file);
    
    const { result, inserted } = insertTranslations(content, entries, translations);
    
    if (inserted > 0) {
      fs.writeFileSync(filePath, result, 'utf-8');
      console.log(`  ✓ Updated ${file}: ${inserted}/${entries.length} descriptionEn fields added`);
      totalInserted += inserted;
    } else {
      console.log(`  ✗ No translations inserted for ${file}`);
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`DONE: ${totalInserted} total descriptionEn fields added across ${FILES.length} files`);
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
