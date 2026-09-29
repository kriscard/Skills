import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = join(repo, "skills");
const failures = [];
const names = new Map();
const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function filesNamed(directory, filename) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...filesNamed(path, filename));
    else if (entry.isFile() && entry.name === filename) files.push(path);
  }

  return files;
}

function markdownFiles(directory) {
  if (!existsSync(directory)) return [];

  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
  }
  return files;
}

function frontmatter(markdown, file) {
  const lines = markdown.split(/\r?\n/);
  if (lines[0] !== "---") {
    failures.push(`${file}: missing opening frontmatter delimiter`);
    return undefined;
  }

  const end = lines.indexOf("---", 1);
  if (end === -1) {
    failures.push(`${file}: missing closing frontmatter delimiter`);
    return undefined;
  }

  return lines.slice(1, end).join("\n");
}

function field(source, key) {
  const lines = source.split("\n");
  const index = lines.findIndex((line) => line.startsWith(`${key}:`));
  if (index === -1) return undefined;

  const inline = lines[index].slice(key.length + 1).trim();
  if (inline && !/^[>|][+-]?$/.test(inline)) {
    return inline.replace(/^(?:"(.*)"|'(.*)')$/, "$1$2").trim();
  }

  const continuation = [];
  for (const line of lines.slice(index + 1)) {
    if (line.length > 0 && !/^\s/.test(line)) break;
    if (line.trim()) continuation.push(line.trim());
  }

  return continuation.join(" ").trim() || undefined;
}

const skillFiles = filesNamed(skillsRoot, "SKILL.md").sort();

for (const absoluteFile of skillFiles) {
  const file = relative(repo, absoluteFile);
  const pathParts = relative(skillsRoot, absoluteFile).split(sep);
  const markdown = readFileSync(absoluteFile, "utf8");

  if (pathParts.length !== 3) {
    failures.push(`${file}: expected skills/<category>/<name>/SKILL.md`);
    continue;
  }

  const [category, directoryName] = pathParts;
  if (!kebabCase.test(category))
    failures.push(`${file}: category must be kebab-case`);
  if (!kebabCase.test(directoryName))
    failures.push(`${file}: skill directory must be kebab-case`);

  const metadata = frontmatter(markdown, file);
  if (!metadata) continue;

  const name = field(metadata, "name");
  const description = field(metadata, "description");
  const whenToUse = field(metadata, "when_to_use") ?? "";

  if (!name) failures.push(`${file}: missing name`);
  else {
    if (name !== directoryName) {
      failures.push(
        `${file}: name "${name}" must match directory "${directoryName}"`,
      );
    }

    const duplicate = names.get(name);
    if (duplicate)
      failures.push(
        `${file}: duplicate name "${name}" also used by ${duplicate}`,
      );
    else names.set(name, file);
  }

  if (!description) failures.push(`${file}: missing description`);
  else if (description.length + whenToUse.length > 1_536) {
    failures.push(
      `${file}: description and when_to_use exceed 1,536 characters`,
    );
  }

  const lineCount = markdown.split(/\r?\n/).length;
  if (lineCount > 500)
    failures.push(`${file}: ${lineCount} lines exceeds the 500-line limit`);

  const skillDirectory = resolve(absoluteFile, "..");
  const referenced = new Set(
    [
      ...markdown.matchAll(
        /(?:\.\.\/[A-Za-z0-9._/-]*)?references\/[A-Za-z0-9._/-]+\.md\b/g,
      ),
    ].map((match) => match[0]),
  );

  for (const reference of referenced) {
    if (!existsSync(join(skillDirectory, reference))) {
      failures.push(`${file}: missing ${reference}`);
    }
  }

  for (const absoluteReference of markdownFiles(
    join(skillDirectory, "references"),
  )) {
    const reference = relative(skillDirectory, absoluteReference)
      .split(sep)
      .join("/");
    const content = readFileSync(absoluteReference, "utf8");
    const firstNonemptyLine = content
      .split(/\r?\n/)
      .find((line) => line.trim());

    if (!referenced.has(reference))
      failures.push(`${file}: does not route to ${reference}`);
    if (!firstNonemptyLine?.startsWith("> **Read this when:**")) {
      failures.push(
        `${relative(repo, absoluteReference)}: missing Read this when marker`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${skillFiles.length} skills with unique names, bounded frontmatter, and routed references.`,
);
