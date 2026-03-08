import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { cache } from 'react';
import type { SectionKey } from '@/lib/sections';
import { getReadingMeta, getToc, type ReadingMeta, type TocItem } from '@/lib/toc';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

const FrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  date: z.string().min(4),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().optional().default(false),
  cover: z.string().optional(),
});

export type ContentFrontmatter = z.infer<typeof FrontmatterSchema>;

export type ContentEntry = {
  section: SectionKey;
  slug: string;
  frontmatter: ContentFrontmatter;
  body: string;
  reading: ReadingMeta;
};

export type ContentEntryDetail = ContentEntry & {
  toc: TocItem[];
};

async function listMdxFiles(section: SectionKey) {
  const dir = path.join(CONTENT_ROOT, section);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.mdx'))
    .map((e) => e.name);
}

export const getAllEntries = cache(async (section: SectionKey) => {
  const files = await listMdxFiles(section);

  const items = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, '');
      const fullPath = path.join(CONTENT_ROOT, section, file);
      const raw = await fs.readFile(fullPath, 'utf8');
      const parsed = matter(raw);
      const frontmatter = FrontmatterSchema.parse({
        ...parsed.data,
        tags: Array.isArray(parsed.data?.tags) ? parsed.data.tags : [],
      });

      return {
        section,
        slug,
        frontmatter,
        body: parsed.content,
        reading: getReadingMeta(parsed.content),
      } satisfies ContentEntry;
    })
  );

  return items
    .filter((x) => !x.frontmatter.draft)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
});

export const getEntry = cache(async (section: SectionKey, slug: string) => {
  const fullPath = path.join(CONTENT_ROOT, section, `${slug}.mdx`);
  const raw = await fs.readFile(fullPath, 'utf8');
  const parsed = matter(raw);
  const frontmatter = FrontmatterSchema.parse({
    ...parsed.data,
    tags: Array.isArray(parsed.data?.tags) ? parsed.data.tags : [],
  });

  const body = parsed.content;

  return {
    section,
    slug,
    frontmatter,
    body,
    reading: getReadingMeta(body),
    toc: getToc(body),
  } satisfies ContentEntryDetail;
});
