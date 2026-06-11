#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const DIR = '/home/z/my-project/edu/src/domains/wiki';

const files = [
  'characters.data.ts',
  'characters-new.data.ts',
  'organizations.data.ts',
  'geography.data.ts',
  'technology.data.ts',
  'terms.data.ts',
  'history.data.ts',
];

let totalFixed = 0;

for (const f of files) {
  const fp = path.join(DIR, f);
  let content = fs.readFileSync(fp, 'utf-8');
  const lines = content.split('\n');
  const result = [];
  let fileFixed = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimEnd();

    // Check if this is a property value line (starts with whitespace + quote)
    // that is NOT followed by a comma, and the NEXT line is another property (starts with whitespace + word + colon)
    if (/^\s+"/.test(trimmed) && !trimmed.endsWith(',') && !trimmed.endsWith(',') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && !trimmed.endsWith('[') && !trimmed.endsWith(']')) {
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      // If next line is a property (word followed by colon), we need a comma
      if (/^\w/.test(nextLine) || /^\s+\w/.test(lines[i + 1] || '')) {
        // Check if next line looks like a property (has colon)
        if (/:\s*["{\[\d]/.test(lines[i + 1] || '')) {
          result.push(line + ',');
          fileFixed++;
          continue;
        }
      }
    }

    // Also check descriptionEn lines missing trailing comma
    if (/^\s+descriptionEn:/.test(trimmed) && !trimmed.endsWith(',') && !trimmed.endsWith('{')) {
      const nextLine = lines[i + 1] || '';
      if (/^\s+\w/.test(nextLine) && /:/.test(nextLine)) {
        result.push(line + ',');
        fileFixed++;
        continue;
      }
    }

    result.push(line);
  }

  if (fileFixed > 0) {
    fs.writeFileSync(fp, result.join('\n'), 'utf-8');
    console.log(`${f}: Added ${fileFixed} missing commas`);
    totalFixed += fileFixed;
  } else {
    console.log(`${f}: OK`);
  }
}

console.log(`\nTotal commas added: ${totalFixed}`);
