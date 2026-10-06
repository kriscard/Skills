import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sharedReferenceMirrors } from "./shared-reference-mirrors.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let copied = 0;

for (const mirror of sharedReferenceMirrors) {
  const source = join(repo, mirror.source);

  for (const targetPath of mirror.targets) {
    const target = join(repo, targetPath);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(source, target);
    copied += 1;
  }
}

console.log(`Synchronized ${copied} bundled reference mirrors.`);
