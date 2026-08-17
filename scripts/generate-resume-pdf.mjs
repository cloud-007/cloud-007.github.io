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
const PORT = 3099;

// The portfolio resume takes its name and role from the same snapshot the site
// builds from, so a SQL edit does not leave the PDF's own metadata behind. The
// fallbacks match src/lib/content.ts, for a clone with no credentials.
const snapshot = JSON.parse(
  readFileSync(join(ROOT, "src/data/snapshot.json"), "utf8")
);
const siteName = snapshot?.profile?.name ?? "Mazharul Islam";
const siteRole = snapshot?.profile?.role ?? "Product Engineer";

// Each entry renders one route to a PDF written into both out/ and public/.
//
// The two names here are deliberately different. /resume is portfolio-facing
// and carries the same name as the site. /resume-professional is the formal CV
// that goes to institutions alongside a passport, degree certificates and
// employment records, so it keeps the full legal name and has to match them.
const TARGETS = [
  {
    route: "/resume",
    file: "resume.pdf",
    meta: {
      title: `${siteName} | ${siteRole}`,
      author: siteName,
      subject: "Resume / CV",
      keywords: [
        "Product Engineer",
        "Software Engineer",
        "Full-Stack AI Engineer",
        "Django",
        "Flutter",
        "Python",
        "AI",
        "Resume",
      ],
    },
  },
  {
    route: "/resume-professional",
    file: "resume-professional.pdf",
    meta: {
      title: "Md Mazharul Islam Emon | Curriculum Vitae",
      author: "Md Mazharul Islam Emon",
      subject: "Academic Curriculum Vitae",
      keywords: [
        "Curriculum Vitae",
        "Academic CV",
        "Software Engineer",
        "Computer Science",
        "Django",
        "Machine Learning",
      ],
    },
  },
];

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
    const { PDFDocument } = await import("pdf-lib");

    console.log("🚀  Launching browser…");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    for (const target of TARGETS) {
      const page = await browser.newPage();

      // Wide viewport so the JS scale() hook never fires (paper is 850px)
      await page.setViewport({ width: 1280, height: 900 });

      await page.goto(`http://localhost:${PORT}${target.route}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Give fonts a moment to render
      await new Promise((r) => setTimeout(r, 1000));

      console.log(`📄  Generating PDF for ${target.route}…`);
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        // Margins are controlled entirely by @page { margin } in the print CSS
        margin: { top: "0", bottom: "0", left: "0", right: "0" },
      });
      await page.close();

      // Inject PDF metadata
      const pdfDoc = await PDFDocument.load(pdf);
      pdfDoc.setTitle(target.meta.title);
      pdfDoc.setAuthor(target.meta.author);
      pdfDoc.setSubject(target.meta.subject);
      pdfDoc.setKeywords(target.meta.keywords);
      pdfDoc.setCreator("cloud-007.github.io");
      pdfDoc.setProducer("pdf-lib (https://github.com/Hopding/pdf-lib)");
      const pdfBytes = await pdfDoc.save();

      const outPath = join(OUT_DIR, target.file);
      const publicPath = join(ROOT, "public", target.file);
      writeFileSync(outPath, pdfBytes);
      writeFileSync(publicPath, pdfBytes);
      console.log(`✅  PDF saved → ${outPath}`);
      console.log(`✅  PDF saved → ${publicPath}`);
    }
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("❌ ", err.message);
  process.exit(1);
});
