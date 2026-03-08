import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import type { ContentEntry } from '@/lib/content';

export function PostCard({ entry }: { entry: ContentEntry }) {
  return (
    <Card className="hover:shadow-[0_14px_40px_rgba(0,0,0,0.10)] transition-shadow">
      <CardBody>
        <div className="flex items-center justify-between gap-3 text-sm text-fg-muted">
          <div className="flex items-center gap-3">
            <div>{new Date(entry.frontmatter.date).toLocaleDateString('en-US')}</div>
            <div className="hidden sm:block">• {entry.reading.text}</div>
          </div>
          <div className="font-mono text-xs">/{entry.section}</div>
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-tight">
          <Link href={`/${entry.section}/${entry.slug}`} className="hover:underline">
            {entry.frontmatter.title}
          </Link>
        </h2>

        <p className="mt-2 text-sm text-fg-muted">{entry.frontmatter.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {entry.frontmatter.tags.slice(0, 5).map((tag) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
