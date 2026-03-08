import { NextResponse } from 'next/server';
import { SECTIONS } from '@/lib/sections';
import { getAllEntries } from '@/lib/content';
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';
import { isSectionKey } from '@/lib/contentIndex';

function escapeXml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET(req: Request) {
  const siteUrl = getSiteUrl();
  const items: Array<{ title: string; link: string; description: string; pubDate: string }> = [];

  const url = new URL(req.url);
  const sectionParam = url.searchParams.get('section');
  const sections = (() => {
    if (!sectionParam) return SECTIONS.filter((s) => s.key === 'garden');
    if (sectionParam === 'all') return SECTIONS;
    if (isSectionKey(sectionParam)) return SECTIONS.filter((s) => s.key === sectionParam);
    return SECTIONS.filter((s) => s.key === 'garden');
  })();

  for (const section of sections) {
    const entries = await getAllEntries(section.key);
    for (const entry of entries) {
      items.push({
        title: entry.frontmatter.title,
        link: `${siteUrl}${section.href}/${entry.slug}`,
        description: entry.frontmatter.summary,
        pubDate: new Date(entry.frontmatter.date).toUTCString(),
      });
    }
  }

  items.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>vi</language>
    ${items
      .slice(0, 50)
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid>${escapeXml(item.link)}</guid>
      <pubDate>${escapeXml(item.pubDate)}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
