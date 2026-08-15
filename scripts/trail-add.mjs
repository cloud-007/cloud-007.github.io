#!/usr/bin/env node
/**
 * Add an entry to the Living Trail (src/data/trail.json).
 * Usage: pnpm trail:add
 */
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const TRAIL_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "trail.json"
);

const TYPES = ["milestone", "win", "obstacle", "learning"];

const rl = createInterface({ input: stdin, output: stdout });

async function ask(question, { required = false, fallback = "" } = {}) {
  while (true) {
    const suffix = fallback ? ` (${fallback})` : "";
    const answer = (await rl.question(`${question}${suffix}: `)).trim();
    if (answer) return answer;
    if (fallback) return fallback;
    if (!required) return "";
    console.log("  This one is required.");
  }
}

const today = new Date().toISOString().slice(0, 10);

console.log("\n🌱 Living Trail: new entry\n");

const date = await ask("Date [YYYY-MM-DD]", { fallback: today });
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`\n✖ "${date}" is not a valid YYYY-MM-DD date.`);
  process.exit(1);
}

let type = (
  await ask(`Type [${TYPES.join("/")}]`, { fallback: "win" })
).toLowerCase();
if (!TYPES.includes(type)) {
  console.error(`\n✖ Type must be one of: ${TYPES.join(", ")}.`);
  process.exit(1);
}

const trail = JSON.parse(await readFile(TRAIL_PATH, "utf8"));
const chapterIds = trail.config.chapters.map((c) => c.id);
const latestChapter = chapterIds[chapterIds.length - 1];

const chapter = (
  await ask(`Chapter [${chapterIds.join("/")}]`, { fallback: latestChapter })
).toLowerCase();
if (!chapterIds.includes(chapter)) {
  console.error(`\n✖ Chapter must be one of: ${chapterIds.join(", ")}.`);
  console.error("  (Add new chapters in src/data/trail.json under config.chapters.)");
  process.exit(1);
}

const title = await ask("Title (what happened)", { required: true });
const note = await ask("Note, a little more detail (optional)");
const obstacle = await ask("Obstacle, what stood in the way (optional)");
const learning = await ask("Learning, what it taught you (optional)");

rl.close();

const entry = { date, type, chapter, title, precision: "day" };
if (note) entry.note = note;
if (obstacle) entry.obstacle = obstacle;
if (learning) entry.learning = learning;

trail.entries.push(entry);
trail.entries.sort((a, b) => a.date.localeCompare(b.date));

await writeFile(TRAIL_PATH, JSON.stringify(trail, null, 2) + "\n");

console.log(
  `\n✔ Added "${title}" (${type}, ${date}). The tree now has ${trail.entries.length} leaves.`
);
console.log("  Commit and push to let it grow:\n");
console.log(`    git add src/data/trail.json`);
console.log(`    git commit -m "trail: ${title}"`);
console.log(`    git push\n`);
