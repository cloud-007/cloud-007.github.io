# Mazharul Islam — Portfolio

Personal portfolio site built with Next.js, TypeScript, and Tailwind CSS. Deployed to GitHub Pages via GitHub Actions.

Live: [cloud-007.github.io](https://cloud-007.github.io)

## Tech Stack

- Next.js 16 (App Router, static export)
- React 19 / TypeScript
- Tailwind CSS v4
- Framer Motion
- Radix UI
- pnpm

## Development

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000`

## Build

```bash
pnpm build   # outputs to out/
```

## Deployment

Pushes to `main` automatically trigger a GitHub Actions workflow that builds the app and deploys the `out/` folder to GitHub Pages.

Requires **Settings → Pages → Source** set to **GitHub Actions** in the repository.

## Project Structure

```
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css       # Theme (dark, emerald accent)
│   ├── layout.tsx        # Root layout + metadata
│   └── page.tsx          # Page composition
└── components/
    ├── ui/               # Radix-based UI primitives
    ├── header.tsx        # Fixed nav with active section tracking
    ├── hero.tsx          # Bento grid intro
    ├── experience.tsx    # Work history timeline
    ├── skills.tsx        # Tech skills grid
    ├── projects.tsx      # Project showcase
    ├── achievements.tsx  # Competitive programming
    ├── education.tsx     # Academic background
    └── volunteering.tsx  # Volunteer roles
public/
├── images/profile.jpg
└── resume.pdf
.github/workflows/
└── deploy.yml            # Build + deploy to GitHub Pages
```

## License

All rights reserved — Md Mazharul Islam Emon
