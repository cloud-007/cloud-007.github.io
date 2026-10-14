# Mazharul Islam, Portfolio

A portfolio for Mazharul Islam, a software and product engineer based in Paderborn.
The homepage introduces selected work; `/about` holds the full professional profile,
`/work/[slug]` contains case studies, and `/trail` keeps the personal growth story.
Built with Next.js 16 (App Router, static export) and deployed to GitHub Pages.

**Live:** [cloud-007.github.io](https://cloud-007.github.io)

## Highlights

- **Living Trail**: a photoreal WebGL tree (three.js + [EZ-Tree](https://github.com/dgreenheck/ez-tree))
  with PBR bark and foliage. The trunk and canopy sit above a soil cross-section;
  a matching root system is hard-clipped at the soil line so it reads as one
  continuous form. The heavy scene is code-split and only mounts as it nears the
  viewport, with the canopy painted first and the roots built in an idle callback.
- **Living oak**: a balanced canopy, visible root hierarchy, automatic camera
  fitting, restrained wind, an illustrated fallback for unavailable WebGL, and
  readable branch controls for products, work, learning, community and teaching.
  The labels report documented milestones, not a score of personal worth.
  Accumulated work keeps the canopy healthy through quiet posting periods.
- **Live weather**: the sky over Paderborn is pulled from [Open-Meteo](https://open-meteo.com)
  (no API key), rendering clear / cloudy / rain / storm and day/night states,
  with a calm default sky when offline.
- **Public data with reviewed editorial copy**: Supabase `public_*` views and
  `src/data/snapshot.json` supply public records. `src/data/editorial.json` holds
  reviewed profile copy, corrections and new public projects. The same composition
  runs over the snapshot and live response, so stale data cannot undo a correction.
  Existing teaser rows remain redacted. One provider shares the refresh across
  sections. See [`supabase/SETUP.md`](supabase/SETUP.md).
- **System, light and dark themes**: semantic colors, remembered selection and
  an early theme script to avoid a wrong-theme flash. Keyboard focus and reduced
  motion are supported.
- **Selected work**: three case studies identify responsibility, context and
  technical decisions. SushiLab uses a screenshot of its public website; the
  other visuals are labeled workflow overviews, not simulated product screenshots.
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
| `pnpm test:content` | Check editorial composition, deduplication and teaser redaction |
| `pnpm test:links` | Check the URL scheme allowlist |
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
│   ├── globals.css           # Semantic light/dark theme and responsive styles
│   ├── page.tsx              # Professional introduction and selected work
│   ├── about/page.tsx        # Full profile (hero, experience, skills, …)
│   ├── trail/page.tsx        # Personal journey and living tree
│   ├── work/[slug]/page.tsx  # Static case-study pages
│   └── resume/page.tsx       # Printable résumé (rendered to PDF at build)
├── components/
│   ├── living-trail.tsx      # Trail section: creed, sky, tree, filters, timeline
│   ├── tree-scene.tsx        # three.js + EZ-Tree WebGL scene
│   ├── header.tsx / footer.tsx
│   ├── hero.tsx · experience.tsx · skills.tsx · projects.tsx
│   └── achievements.tsx · education.tsx · volunteering.tsx
├── lib/
│   ├── content.ts            # Types + PostgREST reads of the public_* views
│   ├── use-content.tsx       # Shared snapshot-first provider with reviewed copy
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

## Editing reviewed copy

Edit `src/data/editorial.json` for the current professional profile, reviewed
project/experience corrections, selected explainers and public additions. Existing
records are patched by their public IDs; project additions are deduplicated by ID
or name. Teaser rows are never expanded by an editorial patch. Add only material
intended for this public portfolio. Do not copy private seeds, account screenshots
or application records into these files.

`src/data/case-studies.ts` contains the three project narratives and workflow
labels. Keep responsibility and project status explicit. The screenshot in
`public/images/work/` comes from the public SushiLab homepage, captured October 2026.

The raw Supabase snapshot generator remains unchanged. The editorial layer applies
after both snapshot import and live refresh, including the web resume and build-time
metadata. The formal `/resume-professional` document remains a separate academic CV.
