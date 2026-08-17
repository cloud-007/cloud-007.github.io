/**
 * Regression test for the href scheme allowlist.
 *
 * Every link on this site is data from Supabase, and `javascript:` in an href
 * executes on click. The allowlist is enforced twice, in the SQL view and
 * again here at render time; this pins the client half so a refactor cannot
 * quietly widen it.
 */
import { readFileSync } from "node:fs";
const src = readFileSync("src/lib/content.ts", "utf8");
const body = src.slice(src.indexOf("export function safeHref"));
const fn = body.slice(0, body.indexOf("\n}") + 2)
  .replace("export function safeHref(url?: string | null): string | undefined {", "function safeHref(url) {");
const safeHref = new Function(fn + "; return safeHref;")();

const cases = [
  ["javascript:alert(1)", undefined],
  ["JaVaScRiPt:alert(1)", undefined],
  ["  javascript:alert(1)", undefined],
  ["data:text/html,<script>alert(1)</script>", undefined],
  ["vbscript:msgbox(1)", undefined],
  ["file:///etc/passwd", undefined],
  ["https://example.com", "https://example.com"],
  ["http://example.com", "http://example.com"],
  ["mailto:a@b.com", "mailto:a@b.com"],
  ["", undefined],
  [null, undefined],
  [undefined, undefined],
];
let fail = 0;
for (const [input, want] of cases) {
  const got = safeHref(input);
  const ok = got === want;
  if (!ok) fail++;
  console.log(`${ok ? "pass" : "FAIL"}  ${JSON.stringify(input)} -> ${JSON.stringify(got)}`);
}
console.log(fail === 0 ? "\nall safeHref cases pass" : `\n${fail} FAILURES`);
process.exit(fail ? 1 : 0);
