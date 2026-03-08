import { NextResponse } from 'next/server';
import { z } from 'zod';
import { cacheWrap } from '@/lib/cache';

const QuerySchema = z.object({
  tag: z.string().max(40).optional(),
});

const QUOTES: Array<{ text: string; author: string; tags: string[] }> = [
  {
    text: 'Make it work. Make it right. Make it fast.',
    author: 'Kent Beck',
    tags: ['engineering', 'craft'],
  },
  {
    text: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra',
    tags: ['engineering', 'reliability'],
  },
  {
    text: 'What you do every day matters more than what you do once in a while.',
    author: 'Gretchen Rubin',
    tags: ['habits', 'growth'],
  },
  {
    text: 'Security is a process, not a product.',
    author: 'Bruce Schneier',
    tags: ['security'],
  },
  {
    text: 'If you can’t explain it simply, you don’t understand it well enough.',
    author: 'Albert Einstein',
    tags: ['learning'],
  },
];

const TTL_MS = 6 * 60 * 60_000;

type ZenQuote = { q: string; a: string };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    tag: url.searchParams.get('tag') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid query' }, { status: 400 });
  }

  const tag = parsed.data.tag?.toLowerCase();
  const pool = tag ? QUOTES.filter((q) => q.tags.some((t) => t.toLowerCase() === tag)) : QUOTES;
  const list = pool.length ? pool : QUOTES;

  const index = Math.floor(Math.random() * list.length);
  const pick = list[index];

  // Prefer a free external quote when possible (cached), fallback to curated list.
  try {
    const { value } = await cacheWrap<ZenQuote | null>('zenquotes:random', TTL_MS, async () => {
      const res = await fetch('https://zenquotes.io/api/random', { cache: 'no-store' });
      if (!res.ok) return null;
      const json = (await res.json()) as Array<ZenQuote>;
      const first = json?.[0];
      if (!first?.q || !first?.a) return null;
      return { q: String(first.q), a: String(first.a) };
    });

    if (value?.q && value?.a) {
      return NextResponse.json({
        success: true,
        data: {
          text: value.q,
          author: value.a,
          tags: tag ? [tag] : ['quote'],
          source: 'zenquotes',
        },
      });
    }
  } catch {
    // Ignore and fallback.
  }

  return NextResponse.json({
    success: true,
    data: {
      text: pick.text,
      author: pick.author,
      tags: pick.tags,
      source: 'local',
    },
  });
}
