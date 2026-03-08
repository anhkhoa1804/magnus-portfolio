import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SECTIONS } from '@/lib/sections';
import { getAllEntries } from '@/lib/content';

const QuerySchema = z.object({
  q: z.string().min(1).max(80),
  section: z.string().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    q: url.searchParams.get('q') ?? '',
    section: url.searchParams.get('section') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid query' }, { status: 400 });
  }

  const q = parsed.data.q.toLowerCase();
  const sectionFilter = parsed.data.section;

  const sections = sectionFilter ? SECTIONS.filter((s) => s.key === sectionFilter) : SECTIONS;

  const results: Array<{
    section: string;
    slug: string;
    title: string;
    summary: string;
    date: string;
  }> = [];

  for (const s of sections) {
    const entries = await getAllEntries(s.key);
    for (const entry of entries) {
      const haystack = `${entry.frontmatter.title}\n${entry.frontmatter.summary}\n${entry.body}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          section: entry.section,
          slug: entry.slug,
          title: entry.frontmatter.title,
          summary: entry.frontmatter.summary,
          date: entry.frontmatter.date,
        });
      }
    }
  }

  results.sort((a, b) => (a.date < b.date ? 1 : -1));

  return NextResponse.json({ success: true, data: { results } });
}
