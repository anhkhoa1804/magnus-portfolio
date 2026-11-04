# Magnus

Personal portfolio — AI experiments, writing, and travel.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://vercel.com/)

---

## Structure

```
magnus/
├── web/                 # Next.js 15 frontend (Vercel), npm workspace "web"
│   ├── src/
│   │   ├── app/         # App Router pages & API routes
│   │   ├── components/  # UI components
│   │   ├── lib/         # Utilities, cache, metadata
│   │   └── data/        # Static data (knowledge base, coding problems)
│   ├── content/
│   │   ├── garden/      # MDX essays
│   │   ├── german/      # German content
│   │   └── wanderlust/  # Travel entries
│   └── public/          # Static assets
├── hf-space/            # Flask AI backend (Hugging Face Spaces, Docker)
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
└── package.json         # npm workspace root (workspaces: ["web"])
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero + live bento dashboard |
| `/garden` | MDX essays and notes |
| `/project` | AI lab: AI roaster, chat, code sandbox, doodle classifier, IELTS, stock price predictions |
| `/german` | German news feed (Tagesschau) |
| `/wanderlust` | Travel maps (Mapbox) + photo gallery |
| `/search` | Full-text search |

---

## Tech Stack

**Frontend:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · MDX (next-mdx-remote)

**AI Backend:** Flask (Python) · Groq (Llama-3.3-70B) · YOLOv8 · Prophet · HuggingFace Transformers

**Deployment:** Vercel (sin1 region, 30s function timeout) · HuggingFace Spaces (Docker)

**Caching:** In-memory `Map` via `lib/cache.ts` — no Redis. Vercel serverless resets cache per cold start; hot instances share the in-process store for the duration of their lifecycle.

**APIs used:**
- WeatherAPI · Finnhub (stocks) · Spotify OAuth · WakaTime · NASA APOD · Unsplash
- LeetCode GraphQL · Piston (code execution) · Groq (IELTS/chat)
- Tagesschau (German news) · freehoroscopeapi (horoscope)

---

## Local Development

```bash
# Install dependencies
npm install

# Frontend dev server (http://localhost:3000)
npm run dev:web

# Local Flask AI backend (Windows PowerShell; see hf-space/)
npm run dev:hf
```

Create `web/.env.local`:

```bash
# AI backend
AI_BACKEND_URL=https://your-hf-space.hf.space
HUGGINGFACE_API_TOKEN=hf_...

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN=pk...

# APIs
WEATHERAPI_KEY=
FINNHUB_API_KEY=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
GITHUB_ACCESS_TOKEN=
WAKATIME_API_KEY=
NASA_API_KEY=
UNSPLASH_ACCESS_KEY=
GROQ_API_KEY=
RESEND_API_KEY=
```

---

## Deployment

**Frontend → Vercel:**
```bash
git push origin main   # auto-deploys via GitHub integration
```

**AI Backend → HuggingFace Spaces (Docker):**
```bash
npm run hf:deploy   # pushes hf-space/ as a subtree to the "hf-space" remote (scripts/deploy-hf.ps1)
```
