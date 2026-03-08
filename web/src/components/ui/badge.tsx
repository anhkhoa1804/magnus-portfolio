import { cn } from '@/lib/cn';

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs text-fg-muted', className)}>
      {children}
    </span>
  );
}
