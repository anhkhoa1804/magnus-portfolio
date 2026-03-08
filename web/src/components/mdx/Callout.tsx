import { cn } from '@/lib/cn';

export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: 'note' | 'tip' | 'warn' | 'danger';
  title?: string;
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    note: 'border-border bg-bg-subtle/50',
    tip: 'border-emerald-500/30 bg-emerald-500/10',
    warn: 'border-amber-500/30 bg-amber-500/10',
    danger: 'border-rose-500/30 bg-rose-500/10',
  };

  return (
    <div className={cn('my-6 rounded-2xl border p-5', styles[type])}>
      {title && <div className="mb-2 text-sm font-medium">{title}</div>}
      <div className="text-sm text-fg-muted">{children}</div>
    </div>
  );
}
