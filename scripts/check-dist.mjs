/**
 * Runs after `astro build`. Fails the build when something that must never be
 * published ends up in dist/: draft notes for Ting, drafting remarks, or a
 * phone number. Pages CMS commits straight to main, so this is the last check
 * before the site goes live.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';
const TEXT = new Set(['.html', '.xml', '.txt', '.json', '.webmanifest', '.js', '.css']);
const RULES = [
  { name: 'TODO note', re: /TODO\(Vincent\)/ },
  { name: 'drafting remark', re: /Claude drafted|DRAFT written by/i },
  { name: 'phone number', re: /\+31[\s-]?\(?0?\)?[\s-]?6[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}|\b06[\s-]?\d{8}\b/ },
];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (TEXT.has(extname(name))) files.push(path);
  }
};
walk(DIST);

const problems = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const rule of RULES) {
    const m = text.match(rule.re);
    if (m) problems.push(`${file}: ${rule.name} → "${text.slice(Math.max(0, m.index - 30), m.index + 50).replace(/\s+/g, ' ')}"`);
  }
}

if (problems.length) {
  console.error(`\n[check-dist] ${problems.length} problem(s) in the built site:\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`[check-dist] ${files.length} files checked: no draft notes or phone numbers.`);
