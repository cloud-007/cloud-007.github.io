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
- **Database-driven, end to end**: every word on the site comes from Supabase.
  The browser can only reach `public_*` views filtered to `visibility = 'public'`,
  so a private entry, a redacted company name or an unlaunched project never
  leaves the database. A build-time snapshot is committed as a fallback, so the
  site renders instantly and survives an outage. See [`supabase/SETUP.md`](supabase/SETUP.md).
- **Two-axis filtering**: every timeline entry carries a life chapter, a domain
  (education, contests, community, work, built, content, interviews, network,
  writing) and one or more CV competency traits (built, shipped, founded, led,
  organized, mentored, competed, won, learned, researched, taught, interviewed,
  assessed). The narrative arc survives filtering; it just gets shorter.
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
| `pnpm snapshot` | Regenerate the committed public snapshot from Supabase |
| `pnpm typecheck` | Run `tsc --noEmit` |
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
│   ├── living-trail.tsx      # Trail section: creed, sky, tree, filters, timeline
│   ├── tree-scene.tsx        # three.js + EZ-Tree WebGL scene
│   ├── header.tsx / footer.tsx
│   ├── hero.tsx · experience.tsx · skills.tsx · projects.tsx
│   └── achievements.tsx · education.tsx · volunteering.tsx
├── lib/
│   ├── content.ts            # Types + PostgREST reads of the public_* views
│   ├── use-content.ts        # Snapshot first, live data second
│   ├── growth.ts             # Growth-index + vitality algorithm
│   └── utils.ts
└── data/
    └── snapshot.json         # Build-time snapshot of the PUBLIC views (committed)
supabase/
├── 01-schema.sql             # Tables, RLS, and the public_* views
├── 02-seed.sql               # Timeline, traits, profile, growth weights
├── 03-seed-content.sql       # Experience, projects, education, skills
├── SETUP.md                  # One-time setup, and day-to-day editing
└── REVIEW.md                 # Rows held back as private, and why
scripts/
├── generate-resume-pdf.mjs   # Renders résumé route(s) to PDF via Puppeteer
└── generate-snapshot.mjs     # Writes src/data/snapshot.json before each build
.github/workflows/deploy.yml  # Build + deploy to GitHub Pages
.github/workflows/keepalive.yml # Weekly ping so a free Supabase project stays warm
```

## License

All rights reserved. © Md. Mazharul Islam Emon.
