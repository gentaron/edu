import { readFileSync } from 'fs';

const base = '/home/z/my-project/edu/src/domains/wiki';
const files = {
  'organizations.data.ts': [
    'Lily Steiner', 'Kate Patton', 'Lillie Ardent',
    'ラファエル・ドレイク', 'カルロス・ヴァンダム', 'アーサー・グリム',
    'エリザベス・リンドバーグ', 'アイリス・ノヴァ', 'レオン',
    'カスチーナ・テンペスト', 'アイク・ロペス', 'レイド・カキザキ',
    'ヨニック', 'ヴァイロン・デアクス'
  ],
  'geography.data.ts': ['シルヴィア・クロウ', 'カーラ・ヴェルム'],
  'terms.data.ts': [
    'アルゼン・カーリーン', 'マスター・クインシアス', 'グレイモンド・ハウザー',
    '女王リアナ・ソリス', 'マドリス・カーネル', 'ネイサン・コリンド',
    'ロナン・アーサ', 'セリア・ドミニクス'
  ],
};

for (const [file, ids] of Object.entries(files)) {
  const content = readFileSync(`${base}/${file}`, 'utf-8');
  console.log(`\n=== ${file} ===`);
  for (const id of ids) {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `\\{[\\s\\S]*?id:\\s*["']${escaped}["'][\\s\\S]*?description:\\s*"([\\s\\S]*?)"`,
    );
    const m = content.match(regex);
    if (m) {
      console.log(`\nID: ${id}`);
      console.log(`DESC: ${m[1].substring(0, 400)}`);
      console.log('---');
    } else {
      console.log(`\nID: ${id} - NOT FOUND`);
    }
  }
}
