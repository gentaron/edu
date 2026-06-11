#!/usr/bin/env node
/**
 * Fix duplicate descriptionEn fields in wiki data files.
 * For each entry, keeps only the LAST descriptionEn (most recent translation)
 * and removes any others. Also fixes trailing ",," syntax errors.
 */
const fs = require('fs');
const path = require('path');

const DIR = '/home/z/my-project/edu/src/domains/wiki';
const FILE = process.argv[2] || 'organizations.data.ts';

const filePath = path.join(DIR, FILE);
let content = fs.readFileSync(filePath, 'utf-8');

// Split into lines
const lines = content.split('\n');
const result = [];
let i = 0;
let descEnCount = 0;
let removedCount = 0;

while (i < lines.length) {
  const line = lines[i];
  
  // Check if this line has a trailing ",," issue
  if (line.match(/",\s*,\s*$/)) {
    result.push(line.replace(/,\s*,\s*$/, ','));
    i++;
    continue;
  }
  
  // Check if this is a descriptionEn line
  if (line.trim().startsWith('descriptionEn:')) {
    descEnCount++;
    // Look ahead: if next line is also descriptionEn, skip this one (keep the last)
    if (i + 1 < lines.length && lines[i + 1].trim().startsWith('descriptionEn:')) {
      removedCount++;
      i++;
      continue;
    }
  }
  
  result.push(line);
  i++;
}

// Write back
fs.writeFileSync(filePath, result.join('\n'), 'utf-8');

// Verify
const newDescEn = (result.join('\n').match(/descriptionEn:/g) || []).length;
const newDesc = (result.join('\n').match(/(?<!\w)description:/g) || []).length;

console.log(`descriptionEn: ${newDescEn} (removed ${removedCount} duplicates)`);
console.log(`description: ${newDesc}`);
console.log(`Fixed trailing ",," issues`);
