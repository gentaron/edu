#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const DIR = '/home/z/my-project/edu/src/domains/wiki';

const files = [
  'characters.data.ts',
  'characters-new.data.ts',
  'geography.data.ts',
  'technology.data.ts',
  'terms.data.ts',
  'organizations.data.ts',
  'history.data.ts',
];

let totalFixed = 0;
for (const f of files) {
  const fp = path.join(DIR, f);
  let content = fs.readFileSync(fp, 'utf-8');
  const before = content.length;
  
  // Fix trailing ",, at end of descriptionEn lines
  content = content.replace(/^(    descriptionEn:.*?",),,$/gm, '$1');
  
  // Also fix any other trailing ",, patterns (not just descriptionEn)
  // but be careful not to break valid ",," in string content
  content = content.replace(/(^(\s+\w+:).*?"),\s*,$/gm, '$1');
  
  const fixed = before !== content.length;
  if (fixed) {
    fs.writeFileSync(fp, content, 'utf-8');
    const remaining = (content.match(/",\s*$/gm) || []).length;
    const bad = (content.match(/",\s*,\s*$/gm) || []).length;
    console.log(`${f}: fixed (remaining trailing ',': ${remaining}, bad ',,': ${bad})`);
    totalFixed++;
  } else {
    console.log(`${f}: OK`);
  }
}
console.log(`\nTotal files modified: ${totalFixed}`);
