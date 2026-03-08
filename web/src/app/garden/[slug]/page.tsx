import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/site/ArticleLayout';
import { getAllEntries, getEntry } from '@/lib/content';
import { renderMdx } from '@/lib/mdx';
import { entryMetadata } from '@/lib/metadata';

export async function generateStaticParams() {
  const entries = await getAllEntries('garden');
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const entry = await getEntry('garden', slug);
    return entryMetadata({
      section: 'garden',
      slug: entry.slug,
      title: entry.frontmatter.title,
      description: entry.frontmatter.summary,
      publishedTime: entry.frontmatter.date,
    });
  } catch {
    return {};
  }
}

export default async function GardenDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let entry;
  try {
    entry = await getEntry('garden', slug);
  } catch {
    notFound();
  }

  const mdx = await renderMdx(entry.body);

  return (
    <ArticleLayout
      section="garden"
      slug={entry.slug}
      title={entry.frontmatter.title}
      summary={entry.frontmatter.summary}
      date={entry.frontmatter.date}
      tags={entry.frontmatter.tags}
      readingText={entry.reading.text}
      cover={entry.frontmatter.cover}
    >
      {mdx}
    </ArticleLayout>
  );
}
