import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
// Likes/comments are intentionally disabled for the MDX-first demo.

export function ArticleLayout({
  section,
  slug,
  title,
  summary,
  date,
  tags,
  readingText,
  cover,
  children,
}: {
  section: string;
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  readingText?: string;
  cover?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container py-12 magnus-fade-in">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-fg-muted">
          <div className="flex items-center gap-3">
            <div>{new Date(date).toLocaleDateString('en-US')}</div>
            {readingText && <div className="hidden sm:block">&bull; {readingText}</div>}
          </div>
          <div className="font-mono text-xs">/{section}/{slug}</div>
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-fg-muted">{summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge key={t}>#{t}</Badge>
          ))}
        </div>

        {cover && (
          <div className="mt-8 relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-border/40">
            <Image
              src={cover}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <Card className="mt-8">
          <CardBody>
            <article className="prose prose-neutral max-w-none dark:prose-invert">{children}</article>
          </CardBody>
        </Card>

        <div className="mt-10 text-sm text-fg-muted">
          <Link href={`/${section}`} className="hover:underline">
            ← Back to /{section}
          </Link>
        </div>
      </div>
    </div>
  );
}
