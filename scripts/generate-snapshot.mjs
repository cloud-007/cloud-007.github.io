/**
 * Build-time snapshot of the PUBLIC views.
 *
 * Runs before `next build`. Reads every `public_*` view with the anon key and
 * writes src/data/snapshot.json, which the app imports directly so the first
 * paint is instant and the site still renders if Supabase is unreachable.
 *
 * Two properties matter and both come from the database, not from this file:
 *
 *   1. It cannot capture a private row. The anon key has no grant on any base
 *      table, and every view filters to visibility = 'public'. This script has
 *      no way to ask for more than it is allowed.
 *
 *   2. It cannot capture a redacted column. `private_note` is not in any view's
 *      select list, and a hidden org arrives as null.
 *
 * That is why committing the output to a public repo is safe.
 *
 * With no credentials configured it exits 0 and leaves the existing snapshot
 * alone, so a fork or a CI run without secrets still builds.
 */

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "../src/data/snapshot.json");

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ordering is pinned, including a tiebreak on every list that can tie. Without
// it the snapshot re-shuffles on each build and every deploy carries a large,
// meaningless diff that hides the real changes.
const VIEWS = [
    ["chapters", "public_chapters", "select=*&order=sort_order"],
    ["domains", "public_domains", "select=*&order=sort_order"],
    ["traits", "public_traits", "select=*&order=sort_order"],
    ["entries", "public_trail_entries", "select=*&order=date.desc,slug.asc"],
    ["profile", "public_profile", "select=*"],
    ["experience", "public_experience", "select=*&order=sort_order"],
    ["projects", "public_projects", "select=*&order=sort_order"],
    ["education", "public_education", "select=*&order=sort_order"],
    ["volunteering", "public_volunteering", "select=*&order=sort_order"],
    ["skills", "public_skills", "select=*&order=context.asc,sort_order.asc"],
    ["judges", "public_judge_profiles", "select=*&order=sort_order"],
    ["stats", "public_stats", "select=*&order=sort_order"],
    ["growthWeights", "public_growth_weights", "select=*"],
];

async function readView(view, params) {
    const res = await fetch(`${URL_}/rest/v1/${view}?${params}`, {
        headers: {
            apikey: KEY,
            Authorization: `Bearer ${KEY}`,
            Accept: "application/json",
        },
    });
    if (!res.ok) {
        throw new Error(`${view}: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

async function main() {
    if (!URL_ || !KEY) {
        console.log(
            "[snapshot] NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY not set. " +
                "Keeping the committed snapshot.",
        );
        return;
    }

    const out = {};
    for (const [key, view, params] of VIEWS) {
        const rows = await readView(view, params);
        if (key === "profile") {
            out.profile = rows[0] ?? null;
        } else if (key === "growthWeights") {
            out.growthWeights = Object.fromEntries(
                rows.map((r) => [r.key, r.value]),
            );
        } else {
            out[key] = rows;
        }
        console.log(
            `[snapshot] ${view}: ${Array.isArray(rows) ? rows.length : 1}`,
        );
    }
    out.generatedAt = new Date().toISOString();

    // A build that reaches Supabase and finds nothing published is far more
    // likely to be a misconfiguration than a real empty trail. Refuse to
    // replace a good snapshot with an empty one.
    if (!out.entries?.length) {
        const existing = JSON.parse(await readFile(OUT, "utf8").catch(() => "{}"));
        if (existing.entries?.length) {
            console.warn(
                "[snapshot] Live query returned 0 entries but the committed " +
                    "snapshot has " + existing.entries.length + ". Keeping it.",
            );
            return;
        }
    }

    await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
    console.log(`[snapshot] wrote ${OUT}`);
}

main().catch((err) => {
    console.error("[snapshot] failed:", err.message);
    console.error("[snapshot] Keeping the committed snapshot; build continues.");
    process.exitCode = 0;
});
