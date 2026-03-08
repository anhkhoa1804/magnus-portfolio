import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

export function TagFilter({
  baseHref,
  tags,
  activeTag,
}: {
  baseHref: string;
  tags: string[];
  activeTag?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={baseHref} className={cn(activeTag ? 'opacity-70 hover:opacity-100' : '')}>
        <Badge>All</Badge>
      </Link>
      {tags.map((tag) => {
        const href = `${baseHref}?tag=${encodeURIComponent(tag)}`;
        const active = activeTag === tag;
        return (
          <Link key={tag} href={href} className={cn(active ? '' : 'opacity-70 hover:opacity-100')}>
            <Badge>#{tag}</Badge>
          </Link>
        );
      })}
    </div>
  );
}
