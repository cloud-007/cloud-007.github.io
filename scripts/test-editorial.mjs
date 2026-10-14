/** Exercise the public-data boundary against stale, refreshed and redacted input. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const editorial = JSON.parse(readFileSync("src/data/editorial.json", "utf8"));
const raw = JSON.parse(readFileSync("src/data/snapshot.json", "utf8"));
const source = readFileSync("src/lib/editorial.ts", "utf8");
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true}}).outputText;
const moduleExports = {};
new Function("require", "exports", compiled)((name) => {
  assert.equal(name, "@/data/editorial.json");
  return editorial;
}, moduleExports);
const { applyEditorial } = moduleExports;
const before = structuredClone(raw);
const reviewed = applyEditorial(raw);
assert.deepEqual(raw, before, "Composition must not mutate the source snapshot");
assert.equal(reviewed.profile.role, "Software & Product Engineer");
assert.equal(reviewed.entries[0].slug, "sushilab-pickup-offer");
assert.match(reviewed.projects.find((p) => p.name === "OnePTE").highlights.join(" "), /Contributed to 93\+ production releases across the full/);
assert.deepEqual(applyEditorial(reviewed), reviewed, "Refreshing reviewed data must not duplicate records");

// A database record for a repo-managed project must not create a second copy.
const refreshed = structuredClone(raw);
refreshed.projects.push({...editorial.newProjects[0], id: "database-id"});
const once = applyEditorial(refreshed);
assert.equal(once.projects.filter((p) => p.name === "Grounded Legal Drafting").length, 1);
assert.equal(once.projects.find((p) => p.name === "Grounded Legal Drafting").id, "database-id");

// A teaser from a public view must remain redacted, even if a reviewed patch exists.
const redacted = structuredClone(raw);
redacted.projects[0] = {...redacted.projects[0], teaser: true, description: null, highlights: [], technologies: []};
const entryIndex = redacted.entries.findIndex((e) => e.slug === "graduated");
redacted.entries[entryIndex] = {...redacted.entries[entryIndex], teaser: true, note: null, obstacle: null, learning: null, links: []};
redacted.projects.push({...editorial.newProjects[0], id: "redacted-database-id", teaser: true, description: null, highlights: [], technologies: [], repo_url: null});
const safe = applyEditorial(redacted);
assert.deepEqual(safe.projects.find((p) => p.id === redacted.projects[0].id), redacted.projects[0]);
assert.deepEqual(safe.entries.find((e) => e.id === redacted.entries[entryIndex].id), redacted.entries[entryIndex]);
assert.deepEqual(safe.projects.find((p) => p.id === "redacted-database-id"), redacted.projects.at(-1));
assert.equal(safe.projects.filter((p) => p.name === "Grounded Legal Drafting").length, 1);
console.log("Editorial checks passed: stale refresh, immutable sources, deduplication and teaser redaction.");
