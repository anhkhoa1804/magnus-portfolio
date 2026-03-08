import { getAllEntries } from '@/lib/content';
import Image from 'next/image';
import Link from 'next/link';
import { GardenHeader } from '@/components/site/GardenHeader';

export const metadata = {
  title: 'Garden',
  description: 'A collection of essays, notes, and thoughts growing in public.',
};

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function GardenPage() {
  const entries = await getAllEntries('garden');

  return (
    <div className="container max-w-5xl">
      <GardenHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {entries.map((post) => (
          <Link key={post.slug} href={`/garden/${post.slug}`} className="group block bento-card overflow-hidden hover:shadow-md transition-shadow">
            <article className="flex flex-col h-full">
              <div className="aspect-[4/3] relative overflow-hidden bg-bg-subtle">
                {post.frontmatter.cover ? (
                  <Image
                    src={`${(post.frontmatter.cover as string).split('?')[0]}?w=480&h=360&fit=crop&auto=format`}
                    alt={post.frontmatter.title as string}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-heading text-fg-muted/20 select-none">
                      {(post.frontmatter.title as string)?.[0] ?? '·'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <time className="text-xs text-fg-muted/50 font-light">
                  {new Date(post.frontmatter.date as string).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <h3 className="text-lg font-heading font-semibold text-fg group-hover:opacity-70 transition-opacity leading-snug">
                  {post.frontmatter.title as string}
                </h3>
                {post.frontmatter.summary && (
                  <p className="text-sm text-fg-muted font-light leading-relaxed line-clamp-2">
                    {post.frontmatter.summary as string}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
