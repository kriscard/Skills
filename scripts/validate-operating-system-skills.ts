import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures: string[] = [];

const affected: Record<string, string> = {
  daily: 'skills/obsidian/daily/SKILL.md',
  'close-day': 'skills/obsidian/close-day/SKILL.md',
  weekly: 'skills/obsidian/weekly/SKILL.md',
  'capture-receipt': 'skills/obsidian/capture-receipt/SKILL.md',
  'tweet-today': 'skills/writing/tweet-today/SKILL.md',
  blog: 'skills/writing/blog/SKILL.md',
};

function read(file: string): string {
  return readFileSync(join(repo, file), 'utf8');
}

function skillName(markdown: string): string | undefined {
  return markdown.match(/^name:\s*([^\n]+)$/m)?.[1]?.trim();
}

function markdownFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(file));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(file);
  }
  return files;
}

const names = new Set<string>();
for (const [expected, file] of Object.entries(affected)) {
  const name = skillName(read(file));
  if (name !== expected)
    failures.push(`${file}: expected name ${expected}, found ${name ?? 'missing'}`);
  if (name && names.has(name)) failures.push(`${file}: duplicate affected skill name ${name}`);
  if (name) names.add(name);
}

const manifest = JSON.parse(read('.claude-plugin/plugin.json')) as { skills: string[] };
const capturePath = './skills/obsidian/capture-receipt';
if (manifest.skills.filter((skill) => skill === capturePath).length !== 1) {
  failures.push(`${capturePath} must appear exactly once in .claude-plugin/plugin.json`);
}

const obsolete = [
  'Daily Ops/Weekly',
  'template="Weekly"',
  'MOCs/Active Projects.base',
  'Templates/Weekly.md',
];

for (const file of markdownFiles(join(repo, 'skills/obsidian'))) {
  const markdown = readFileSync(file, 'utf8');
  for (const term of obsolete) {
    if (markdown.includes(term)) failures.push(`${relative(repo, file)}: obsolete term ${term}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(
  `Validated ${Object.keys(affected).length} operating-system skills and Obsidian path consistency.`
);
