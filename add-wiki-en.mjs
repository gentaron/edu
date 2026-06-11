#!/usr/bin/env node
/**
 * add-wiki-en.mjs
 * Adds descriptionEn to wiki-prefixed data files using translations from
 * the Auralis repository's wikiEntries.ts
 *
 * Strategy:
 * 1. Parse Auralis wikiEntries.ts character-by-character to extract id->descriptionEn
 * 2. For each wiki file, parse entry boundaries, check for missing descriptionEn,
 *    and insert after the description field using string-aware position tracking
 */

import fs from 'fs';
import path from 'path';

const AURALIS_PATH = '/home/z/my-project/auralis-eternal-light/src/data/wikiEntries.ts';
const WIKI_DIR = '/home/z/my-project/edu/src/domains/wiki';
const WIKI_FILES = [
  'wiki-characters.data.ts',
  'wiki-characters-new.data.ts',
  'wiki-organizations.data.ts',
  'wiki-geography.data.ts',
  'wiki-history.data.ts',
  'wiki-technology.data.ts',
  'wiki-terms.data.ts',
];

// ============================================================
// Utility: Parse a string value from position (handles escaped quotes)
// pos should point to the opening "
// Returns { value, endPos } where endPos is after the closing "
// ============================================================
function parseStringValue(text, pos) {
  if (text[pos] !== '"') return null;
  pos++; // skip opening "
  let value = '';
  while (pos < text.length) {
    const ch = text[pos];
    if (ch === '\\' && pos + 1 < text.length) {
      value += ch + text[pos + 1];
      pos += 2;
    } else if (ch === '"') {
      return { value, endPos: pos + 1 }; // pos+1 is after closing "
    } else {
      value += ch;
      pos++;
    }
  }
  return null; // unclosed string
}

// ============================================================
// Utility: Skip whitespace and comments, return new position
// ============================================================
function skipWhitespaceAndComments(text, pos) {
  while (pos < text.length) {
    // Skip whitespace
    if (/\s/.test(text[pos])) {
      pos++;
      continue;
    }
    // Skip single-line comment
    if (text[pos] === '/' && text[pos + 1] === '/') {
      while (pos < text.length && text[pos] !== '\n') pos++;
      continue;
    }
    // Skip multi-line comment
    if (text[pos] === '/' && text[pos + 1] === '*') {
      pos += 2;
      while (pos < text.length - 1 && !(text[pos] === '*' && text[pos + 1] === '/')) pos++;
      pos += 2;
      continue;
    }
    break;
  }
  return pos;
}

// ============================================================
// Parse Auralis file to build id -> descriptionEn map
// ============================================================
function buildIdToDescriptionEnMap(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const map = new Map();

  // Find the wikiEntries array - look for "= [" after the const declaration
  const arrayMarker = 'wikiEntries: WikiEntry[]';
  const arrStart = content.indexOf(arrayMarker);
  if (arrStart === -1) {
    console.error('Could not find wikiEntries in Auralis file');
    process.exit(1);
  }

  // Find "= [" after the type annotation
  const assignPos = content.indexOf('= [', arrStart);
  if (assignPos === -1) {
    console.error('Could not find array assignment in Auralis file');
    process.exit(1);
  }

  let pos = assignPos + 3; // skip "= ["
  let depth = 0;

  while (pos < content.length) {
    pos = skipWhitespaceAndComments(content, pos);

    if (pos >= content.length) break;

    const ch = content[pos];

    if (ch === ']') break; // End of array

    if (ch === '{') {
      // Start of an entry - find matching closing brace
      let entryStart = pos;
      let entryDepth = 0;
      let entryId = null;
      let entryDescEn = null;

      while (pos < content.length) {
        const ech = content[pos];

        if (ech === '"') {
          // String - could be a key or value
          const sv = parseStringValue(content, pos);
          if (sv) {
            // Check if this string is preceded by "id:" or "descriptionEn:"
            // Look backwards for the key
            const before = content.slice(Math.max(0, pos - 20), pos).trimEnd();
            if (before.endsWith('id:')) {
              entryId = sv.value;
            } else if (before.endsWith('descriptionEn:')) {
              entryDescEn = sv.value;
            }
            pos = sv.endPos;
            continue;
          }
        }

        if (ech === '/' && content[pos + 1] === '/') {
          while (pos < content.length && content[pos] !== '\n') pos++;
          pos++;
          continue;
        }

        if (ech === '/' && content[pos + 1] === '*') {
          pos += 2;
          while (pos < content.length - 1 && !(content[pos] === '*' && content[pos + 1] === '/')) pos++;
          pos += 2;
          continue;
        }

        if (ech === '{') entryDepth++;
        if (ech === '}') {
          entryDepth--;
          if (entryDepth === 0) {
            pos++; // skip closing brace
            break;
          }
        }
        pos++;
      }

      if (entryId && entryDescEn !== null) {
        map.set(entryId, entryDescEn);
      }
      continue;
    }

    // Skip commas between entries
    if (ch === ',') {
      pos++;
      continue;
    }

    pos++;
  }

  return map;
}

// ============================================================
// Process a wiki file: add missing descriptionEn entries
// ============================================================
function processWikiFile(filePath, descriptionEnMap) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find the export array
  // Pattern: export const XXX = [ ... ]
  const arrayMatch = content.match(/export\s+const\s+\w+\s*=\s*\[/);
  if (!arrayMatch) {
    return { content, added: 0 };
  }

  const arrayStartPos = content.indexOf('[', arrayMatch.index);
  let pos = arrayStartPos + 1;
  let depth = 0;
  let added = 0;

  // We'll build the output by collecting pieces
  const pieces = [];
  pieces.push(content.slice(0, pos)); // everything before first entry

  while (pos < content.length) {
    pos = skipWhitespaceAndComments(content, pos);
    if (pos >= content.length) break;

    const ch = content[pos];

    if (ch === ']') {
      // End of array
      pieces.push(content.slice(pos));
      break;
    }

    if (ch === '{') {
      // Start of entry - find its end and analyze
      let entryStart = pos;
      let entryDepth = 0;
      let entryId = null;
      let hasDescriptionEn = false;
      let hasDescription = false;
      let descriptionValueEndPos = -1; // position after closing " of description

      // Also need to find the indentation of the entry for proper formatting
      // Look backwards from entryStart to find the line's indentation
      let lineStart = content.lastIndexOf('\n', entryStart) + 1;
      let entryIndent = content.slice(lineStart, entryStart);

      // Parse through the entry
      while (pos < content.length) {
        const ech = content[pos];

        if (ech === '"') {
          const sv = parseStringValue(content, pos);
          if (sv) {
            // Check what key this value belongs to
            const before = content.slice(Math.max(0, pos - 25), pos).trimEnd();
            if (before.endsWith('id:') || before.endsWith('id:')) {
              // Extract just the id value (before " as WikiId")
              let rawId = sv.value;
              // In wiki files, id is like "Diana" and there's no " as WikiId" inside the string
              // The " as WikiId" comes after the string
              entryId = rawId;
            } else if (before.endsWith('description:')) {
              hasDescription = true;
              descriptionValueEndPos = sv.endPos;
            } else if (before.endsWith('descriptionEn:')) {
              hasDescriptionEn = true;
            }
            pos = sv.endPos;
            continue;
          }
        }

        if (ech === '/' && content[pos + 1] === '/') {
          while (pos < content.length && content[pos] !== '\n') pos++;
          pos++;
          continue;
        }

        if (ech === '/' && content[pos + 1] === '*') {
          pos += 2;
          while (pos < content.length - 1 && !(content[pos] === '*' && content[pos + 1] === '/')) pos++;
          pos += 2;
          continue;
        }

        if (ech === '{') entryDepth++;
        if (ech === '}') {
          entryDepth--;
          if (entryDepth === 0) {
            pos++; // skip closing brace
            break;
          }
        }
        pos++;
      }

      // Now we have the entry text from entryStart to pos
      const entryText = content.slice(entryStart, pos);

      // Check if we need to add descriptionEn
      const needsDescriptionEn = entryId && !hasDescriptionEn && hasDescription && descriptionEnMap.has(entryId);

      if (needsDescriptionEn) {
        const descEnValue = descriptionEnMap.get(entryId);

        // Find the position relative to entryStart where description ends
        // relDescEnd points to right after the closing " of the description string
        const relDescEnd = descriptionValueEndPos - entryStart;

        // Determine what follows the description string
        let afterCommaPos = relDescEnd;
        const hasComma = afterCommaPos < entryText.length && entryText[afterCommaPos] === ',';
        if (hasComma) afterCommaPos++; // skip past comma

        // Build the descriptionEn insertion
        // Determine indentation: use the field indent (4 spaces in wiki files)
        const fieldIndent = entryIndent + '  '; // e.g., "    "
        const descEnLine = `${fieldIndent}descriptionEn:\n${fieldIndent}  "${descEnValue}",`;

        // Insert: description closing " + comma + newline + descriptionEn + rest
        // beforeInsert ends at the closing " (relDescEnd), NOT including any comma
        const beforeInsert = entryText.slice(0, relDescEnd);
        const afterInsert = entryText.slice(afterCommaPos);

        const newEntryText = beforeInsert + ',\n' + descEnLine + afterInsert;
        pieces.push(newEntryText);
        added++;
      } else {
        pieces.push(entryText);
      }

      // Add comma/separator between entries if there is one
      if (pos < content.length) {
        pos = skipWhitespaceAndComments(content, pos);
        if (pos < content.length && content[pos] === ',') {
          pieces.push(',');
          pos++;
        }
      }

      continue;
    }

    if (ch === ',') {
      pieces.push(',');
      pos++;
      continue;
    }

    // Other characters (shouldn't happen much between entries)
    pieces.push(content[pos]);
    pos++;
  }

  return { content: pieces.join(''), added };
}

// ============================================================
// Main
// ============================================================

console.log('=== Building id -> descriptionEn map from Auralis ===');
const descriptionEnMap = buildIdToDescriptionEnMap(AURALIS_PATH);
console.log(`Found ${descriptionEnMap.size} entries with descriptionEn in Auralis source\n`);

// Print some samples
let sampleCount = 0;
for (const [id, desc] of descriptionEnMap) {
  if (sampleCount < 5) {
    console.log(`  ${id} => "${desc.slice(0, 80)}..."`);
    sampleCount++;
  }
}
console.log('');

const results = {};

for (const file of WIKI_FILES) {
  const filePath = path.join(WIKI_DIR, file);
  console.log(`Processing ${file}...`);

  const { content, added } = processWikiFile(filePath, descriptionEnMap);
  results[file] = added;

  if (added > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ Added ${added} descriptionEn entries`);
  } else {
    console.log(`  - No entries added`);
  }
}

console.log('\n=== Summary ===');
let totalAdded = 0;
for (const [file, count] of Object.entries(results)) {
  console.log(`  ${file}: ${count} added`);
  totalAdded += count;
}
console.log(`  TOTAL: ${totalAdded} descriptionEn entries added`);
