'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

export function MobileNav({
  items,
}: {
  items: Array<{ href: string; label: string }>;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-fg-muted hover:text-fg md:hidden"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <span className="text-lg">☰</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[82vw] max-w-sm bg-bg border-l border-border shadow-2xl">
            <div className="flex items-center justify-between p-5">
              <div className="font-semibold tracking-tight">Menu</div>
              <button
                type="button"
                className="h-9 w-9 rounded-xl border border-border bg-card text-fg-muted hover:text-fg"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            <nav className="px-5 pb-6">
              <div className="grid gap-1">
                {items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'rounded-xl px-3 py-2 text-sm transition-colors',
                        active ? 'bg-bg-subtle text-fg' : 'text-fg-muted hover:text-fg hover:bg-bg-subtle'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
