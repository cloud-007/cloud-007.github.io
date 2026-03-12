# Professional Portfolio - Quick Start

## 🚀 Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Visit **http://localhost:3000**

## 📦 Production Build

```bash
# Build for production
pnpm run build

# Start production server
pnpm run start
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Static Export (GitHub Pages)

1. Add to `next.config.js`:

```js
module.exports = {
    output: "export",
};
```

2. Run `pnpm run build`
3. Deploy `out/` folder

## 🎨 Tech Stack

-   Next.js 14 (App Router)
-   TypeScript
-   Tailwind CSS v4
-   ShadCN UI
-   Framer Motion
-   pnpm

## 📝 Customization

### Update Content

Edit components in `src/components/`:

-   `sidebar.tsx` - Profile and navigation
-   `hero.tsx` - Professional summary
-   `experience.tsx` - Work history
-   `skills.tsx` - Technical skills
-   `achievements.tsx` - CP achievements
-   `education.tsx` - Academic background

### Modify Theme

Edit `src/app/globals.css` for colors and styling

## 🔧 Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page
│   └── globals.css     # Theme
├── components/
│   ├── ui/             # ShadCN components
│   └── *.tsx           # Custom components
└── lib/
    └── utils.ts        # Utilities
```

## 📄 License

All rights reserved - Md Mazharul Islam Emon
