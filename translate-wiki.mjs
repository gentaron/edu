#!/usr/bin/env node
/**
 * Wiki Description Translator
 * Reads edu wiki data files, translates Japanese descriptions to English,
 * and writes back updated files with descriptionEn field.
 */
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

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
 * Returns array of { id, name, description, startIdx, endIdx }
 * where startIdx/endIdx are the character indices of the description string content.
 */
function extractDescriptions(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const entries = [];

  // Match description: "..." patterns (potentially multi-line)
  // The description value is a string literal after "description:"
  const regex = /description:\s*\n?\s*(`[^`]+`|"(?:[^"\\]|\\.)*")/gs;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawStr = match[1];
    let text;
    if (rawStr.startsWith('`')) {
      text = rawStr.slice(1, -1);
    } else {
      // Handle escaped quotes
      text = rawStr.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n');
    }
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
async function translateDescriptions(descriptions, zai) {
  const BATCH_SIZE = 15;
  const results = [];
  
  for (let i = 0; i < descriptions.length; i += BATCH_SIZE) {
    const batch = descriptions.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(descriptions.length / BATCH_SIZE);
    
    console.log(`  Translating batch ${batchNum}/${totalBatches} (${batch.length} entries)...`);
    
    const prompt = `You are a professional Japanese-to-English translator for a sci-fi fantasy wiki.
Translate the following Japanese wiki descriptions into natural, engaging English prose.
Preserve the tone, style, and nuance of the original.
Keep proper nouns (character names, place names, organization names) in their original form or established English equivalents.
Do NOT add any commentary, explanations, or formatting - return ONLY the translations as a JSON object
where keys are the index numbers (0-based) and values are the English translations.

IMPORTANT: Return a valid JSON object only. No markdown, no code fences, just the JSON.

Descriptions to translate:
${batch.map((d, idx) => `[${i + idx}] ${d}`).join('\n---\n')}`;

    try {
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a professional translator. Return only valid JSON. No markdown formatting.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      });
      
      let responseText = completion.choices[0]?.message?.content || '';
      // Strip any markdown code fences
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const translations = JSON.parse(responseText);
      
      for (let j = 0; j < batch.length; j++) {
        const idx = i + j;
        results[idx] = translations[String(idx)] || batch[j]; // fallback to original if missing
      }
    } catch (err) {
      console.error(`  Error in batch ${batchNum}:`, err.message);
      // Fallback: use original text
      for (let j = 0; j < batch.length; j++) {
        results[i + j] = batch[j];
      }
    }
  }
  
  return results;
}

/**
 * Insert descriptionEn field after each description in the file content.
 */
function insertTranslations(content, entries, translations) {
  // Process entries in reverse order to preserve indices
  const sortedEntries = [...entries].sort((a, b) => b.matchEnd - a.matchEnd);
  
  let result = content;
  for (let i = 0; i < sortedEntries.length; i++) {
    const entry = sortedEntries[i];
    const transIdx = entries.indexOf(entry);
    const translatedText = translations[transIdx];
    
    if (!translatedText || translatedText === entry.description) continue;
    
    // Escape the translated text for a TypeScript string
    const escaped = translatedText
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');
    
    const insertion = `\n    descriptionEn: "${escaped}",`;
    result = result.slice(0, entry.matchEnd) + insertion + result.slice(entry.matchEnd);
  }
  
  return result;
}

async function main() {
  console.log('Initializing ZAI...');
  const zai = await ZAI.create();
  
  for (const file of FILES) {
    const filePath = path.join(DATA_DIR, file);
    console.log(`\nProcessing ${file}...`);
    
    const { content, entries } = extractDescriptions(filePath);
    console.log(`  Found ${entries.length} descriptions`);
    
    if (entries.length === 0) {
      console.log(`  No descriptions found, skipping.`);
      continue;
    }
    
    const descriptions = entries.map(e => e.description);
    const translations = await translateDescriptions(descriptions, zai);
    
    const updatedContent = insertTranslations(content, entries, translations);
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`  Updated ${file} with ${entries.length} descriptionEn fields`);
  }
  
  console.log('\nAll files processed!');
}

main().catch(console.error);
