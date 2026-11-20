// gta6-meme-x-01 entry program.
//
// The entry is the X post itself. This program has one job: copy the committed
// POST.json into the output directory the grader mounts, byte for byte. The
// post's picture and text live on X; the gate reads them from the address in
// POST.json, so nothing here writes anything about the post.
//
// Constraints: Node 22 standard library only, no network, no wall clock, no
// files outside the repository and the output directory. Two runs must write
// the same bytes.
//
// Outside the grader's container the two mounts are replaced with local paths:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const repoDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(repoDir, 'POST.json');
const target = join(outputDir, 'POST.json');

// /output is a bind mount in the grader, so it normally already exists. A
// recursive mkdir is a no-op there; it never removes or re-permissions the
// mount point and only creates the directory on the local development run.
mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(source, target);
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`could not copy ${source} to ${target}: ${reason}`);
  process.exitCode = 1;
}
