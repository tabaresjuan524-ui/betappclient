This is a [Next.js](https://nextjs.org/) project bootstrapped with pre-installed Shadcn components.

## 🎉 SofaScore Widget Integration

This project includes a comprehensive SofaScore widget integration with live match data, statistics, lineups, standings, and more.

### 📚 Documentation

- **[Quick Start Guide](./SOFASCORE_QUICK_START.md)** - Get started in 5 minutes
- **[Widget Overview](./SOFASCORE_WIDGETS_COMPLETE.md)** - Complete feature list and data availability
- **[Integration Summary](./SOFASCORE_INTEGRATION_SUMMARY.md)** - Technical implementation details
- **[Testing Guide](./SOFASCORE_INTEGRATION_TESTING.md)** - Step-by-step testing procedures
- **[Visual Reference](./SOFASCORE_WIDGETS_VISUAL_REFERENCE.md)** - What each widget looks like

### ✨ Features

- 📊 **Statistics Widget** - Match stats with comparison bars (possession, shots, passes, etc.)
- ⚽ **Lineups Widget** - Team formations, player ratings, and statistics
- 📈 **Momentum Widget** - Interactive graph showing match flow minute-by-minute
- 🏆 **Standings Widget** - Full league table with highlighted teams
- 📊 **Form Widget** - Team comparison with last 5 matches
- 🔄 **H2H Widget** - Head-to-head history and statistics
- 🎯 **Overview** - Odds, incidents, and predictions

### 🚀 Quick Start

1. **Configure environment** (see `.env.local` example below)
2. **Start backend server** (`cd luckiaServer && npm run dev`)
3. **Start frontend** (`npm run dev`)
4. **Open browser** to http://localhost:3000
5. **Click on a match** with "SofaScore" badge

For detailed setup instructions, see [SOFASCORE_QUICK_START.md](./SOFASCORE_QUICK_START.md)

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Running on Docker

**Build the Dockerfile**

`docker build . -t webdev-arena-template`

**Run the Docker container**

`docker run -p 3000:3000 -it -v .:/app webdev-arena-template`
