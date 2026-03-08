# Magnus

Personal portfolio — AI experiments, writing, and travel.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://vercel.com/)

---

## Structure

```
d:\pi\
├── web/            # Next.js 15 frontend → Vercel
│   ├── src/
│   │   ├── app/          # App Router pages & API routes
│   │   ├── components/   # UI components
│   │   ├── lib/          # Utilities, cache, metadata
│   │   └── data/         # Static data (knowledge base, coding problems)
│   ├── content/
│   │   ├── garden/       # MDX essays
│   │   ├── german/       # German content
│   │   └── wanderlust/   # Travel entries
│   └── public/           # Static assets
└── hf-space/       # Flask AI backend → HuggingFace Spaces
    ├── app.py
    ├── Dockerfile
    └── requirements.txt
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero + live bento dashboard |
| `/garden` | MDX essays and notes |
| `/project` | AI lab (code sandbox, IELTS, chat, doodle classifier, price prediction) |
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

# Node.js API server
npm run dev:api
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

**AI Backend → HuggingFace Spaces:**
```bash
# Push hf-space/ contents to your HF Space repo
cd hf-space
git push hf main
```
