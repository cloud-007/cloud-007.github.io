# Mazharul Islam, Portfolio

A personal portfolio built around the **Living Trail**: a 3D growth tree whose
canopy and roots are driven by a real growth algorithm and live weather. Built
with Next.js 16 (App Router, static export) and deployed to GitHub Pages.

**Live:** [cloud-007.github.io](https://cloud-007.github.io)

## Highlights

- **Living Trail**: a photoreal WebGL tree (three.js + [EZ-Tree](https://github.com/dgreenheck/ez-tree))
  with PBR bark and foliage. The trunk and canopy sit above a soil cross-section;
  a matching root system is hard-clipped at the soil line so it reads as one
  continuous form. The heavy scene is code-split and only mounts as it nears the
  viewport, with the canopy painted first and the roots built in an idle callback.
- **Growth algorithm** ([`src/lib/growth.ts`](src/lib/growth.ts)): every entry
  in the trail is weighted by type and decayed on a 45-day half-life. A
  recency-weighted **growth index (0–100)** and **trend** (growing / steady /
  declining) are computed client-side and drive how lush and green the tree is
  drawn. History builds a floor; recent activity supplies the momentum.
- **Live weather**: the sky over Sylhet is pulled from [Open-Meteo](https://open-meteo.com)
  (no API key), rendering clear / cloudy / rain / storm and day/night states,
  with a calm default sky when offline.
- **Data-driven timeline**: the whole timeline lives in
  [`src/data/trail.json`](src/data/trail.json) and is clustered into chapters.
  Add entries interactively with `pnpm trail:add`.
- **Printable résumé**: an ATS-friendly `/resume` route rendered to a PDF at
  build time via Puppeteer.

## Tech stack

- **Next.js 16**: App Router, `output: "export"` (fully static), React Compiler
- **React 19** / **TypeScript**
- **Tailwind CSS v4**
- **three.js** + **@dgreenheck/ez-tree**: the 3D scene
- **Framer Motion**, **Radix UI**, **lucide-react**: UI + motion
- **Puppeteer** + **pdf-lib**: résumé PDF generation
- **pnpm** (v10), **Node 22**

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Static build to `out/`, then regenerate résumé PDF(s) |
| `pnpm generate-pdf` | Regenerate the résumé PDF(s) (needs Chrome; see below) |
| `pnpm trail:add` | Interactively append an entry to `src/data/trail.json` |
| `pnpm start` | Serve a production build |
| `pnpm lint` | Run ESLint |

> The PDF step uses Puppeteer and needs a Chrome binary. Locally, install one
> with `npx puppeteer browsers install chrome`. CI installs it automatically.

## Deployment

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the static site and publishes `out/` to GitHub Pages.

Pages is configured with **Settings → Pages → Source = GitHub Actions**.

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout + metadata
│   ├── globals.css           # Theme (dark, emerald accent)
│   ├── page.tsx              # Home, the Living Trail
│   ├── about/page.tsx        # Full profile (hero, experience, skills, …)
│   └── resume/page.tsx       # Printable résumé (rendered to PDF at build)
├── components/
│   ├── living-trail.tsx      # Trail section: creed, sky, tree, timeline
│   ├── tree-scene.tsx        # three.js + EZ-Tree WebGL scene
│   ├── header.tsx / footer.tsx
│   ├── hero.tsx · experience.tsx · skills.tsx · projects.tsx
│   └── achievements.tsx · education.tsx · volunteering.tsx
├── lib/
│   ├── growth.ts             # Growth-index + vitality algorithm
│   └── utils.ts
└── data/
    └── trail.json            # The timeline (entries, chapters, creed, config)
scripts/
├── generate-resume-pdf.mjs   # Renders résumé route(s) to PDF via Puppeteer
└── trail-add.mjs             # `pnpm trail:add`
.github/workflows/deploy.yml  # Build + deploy to GitHub Pages
```

## License

All rights reserved. © Md. Mazharul Islam Emon.
