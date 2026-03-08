'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container max-w-4xl flex flex-col items-center justify-center min-h-[60vh] text-center py-24 gap-6">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-neg/40">
        <circle cx="36" cy="36" r="32" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fill="currentColor" fontFamily="monospace" fontWeight="600">500</text>
      </svg>
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-semibold">This project failed to load</h1>
        <p className="text-fg-muted text-sm max-w-xs">
          {error.message || 'An unexpected error occurred while rendering this page.'}
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-fg-muted/40">digest: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-85 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/project"
          className="inline-flex items-center gap-2 border border-border/60 text-fg-muted px-5 py-2.5 rounded-full text-sm hover:text-fg transition-colors"
        >
          All projects
        </Link>
      </div>
    </div>
  );
}
