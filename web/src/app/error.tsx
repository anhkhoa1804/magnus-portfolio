'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container max-w-5xl flex flex-col items-center justify-center min-h-[60vh] text-center py-24 gap-6">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-brand/40">
        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round"/>
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fill="currentColor" fontFamily="monospace" fontWeight="600">500</text>
      </svg>
      <div className="space-y-3">
        <h1 className="text-5xl font-heading font-bold text-fg">Something went wrong</h1>
        <p className="text-fg-muted max-w-sm">An unexpected error occurred. You can try again or head back home.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-85 transition-opacity">
          Try again
        </button>
        <Link href="/" className="inline-flex items-center gap-2 border border-border/60 text-fg-muted px-5 py-2.5 rounded-full text-sm hover:text-fg transition-colors">
          Go home
        </Link>
      </div>
    </div>
  );
}
