'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

export function Pre(props: React.HTMLAttributes<HTMLPreElement>) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  async function onCopy() {
    const code = ref.current?.querySelector('code')?.textContent ?? '';
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onCopy}
        className="absolute right-2 top-2 z-10 rounded-lg border border-border bg-bg/80 px-2 py-1 text-xs text-fg-muted backdrop-blur hover:text-fg opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre ref={ref} {...props} className={cn('rounded-xl border border-border bg-bg-subtle/50 px-4 py-3', props.className)} />
    </div>
  );
}
