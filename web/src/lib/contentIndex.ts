import { cache } from 'react';
import { SECTIONS, type SectionKey } from '@/lib/sections';
import { getAllEntries, type ContentEntry } from '@/lib/content';

export type EntryWithPath = ContentEntry & {
  href: string;
};

export const getAllEntriesAcrossSite = cache(async () => {
  const all: EntryWithPath[] = [];
  for (const section of SECTIONS) {
    const entries = await getAllEntries(section.key);
    for (const entry of entries) {
      all.push({ ...entry, href: `${section.href}/${entry.slug}` });
    }
  }
  return all.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
});

export const getAllTagsAcrossSite = cache(async () => {
  const entries = await getAllEntriesAcrossSite();
  const counts = new Map<string, number>();

  for (const e of entries) {
    for (const tag of e.frontmatter.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  const tags = Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => (a.count === b.count ? a.tag.localeCompare(b.tag) : b.count - a.count));

  return { tags, entries };
});

export function isSectionKey(value: string): value is SectionKey {
  return (SECTIONS as Array<{ key: string }>).some((s) => s.key === value);
}
