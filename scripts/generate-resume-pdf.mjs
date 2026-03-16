/**
 * Generates resume.pdf from the built static export.
 * Run after `next build`: node scripts/generate-resume-pdf.mjs
 */

import { createServer } from "http";
import { readFileSync, writeFileSync, existsSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "out");
const PDF_OUT = join(OUT_DIR, "resume.pdf");
const PDF_PUBLIC = join(ROOT, "public", "resume.pdf");
const PORT = 3099;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
};

function resolveFilePath(urlPath) {
  const candidates = [
    join(OUT_DIR, urlPath),
    join(OUT_DIR, urlPath, "index.html"),
    join(OUT_DIR, urlPath.replace(/\/$/, "") + ".html"),
  ];
  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split("?")[0]) || "/";
      const filePath = resolveFilePath(urlPath === "/" ? "/index.html" : urlPath);

      if (!filePath) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
      }

      const mime = MIME[extname(filePath)] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime });
      res.end(readFileSync(filePath));
    });

    server.listen(PORT, () => resolve(server));
    server.on("error", reject);
  });
}

async function main() {
  if (!existsSync(OUT_DIR)) {
    console.error("❌  'out/' directory not found. Run `next build` first.");
    process.exit(1);
  }

  console.log("🌐  Starting static server…");
  const server = await startServer();

  let browser;
  try {
    const puppeteer = (await import("puppeteer")).default;

    console.log("🚀  Launching browser…");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Wide viewport so the JS scale() hook never fires (paper is 850px)
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto(`http://localhost:${PORT}/resume`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Give fonts a moment to render
    await new Promise((r) => setTimeout(r, 1000));

    console.log("📄  Generating PDF…");
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      // Margins are controlled entirely by @page { margin } in the print CSS
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });

    writeFileSync(PDF_OUT, pdf);
    writeFileSync(PDF_PUBLIC, pdf);
    console.log(`✅  PDF saved → ${PDF_OUT}`);
    console.log(`✅  PDF saved → ${PDF_PUBLIC}`);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("❌ ", err.message);
  process.exit(1);
});
