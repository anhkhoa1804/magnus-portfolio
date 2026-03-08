'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/card';

type Result = {
  section: string;
  slug: string;
  title: string;
  summary: string;
  date: string;
};

export function SearchClient() {
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState<Result[]>([]);
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function runSearch(query: string) {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`).catch(() => null);
    if (!res) {
      setStatus('error');
      return;
    }

    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) {
      setStatus('error');
      return;
    }

    setResults(json.data.results as Result[]);
    setStatus('done');
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Query</label>
        <input
          className="h-11 rounded-xl border border-border bg-bg px-4 text-sm outline-none focus:ring-2 focus:ring-border/70"
          placeholder="Search title/summary/content…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') runSearch(q);
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => runSearch(q)}
          className="h-10 rounded-xl border border-border bg-card px-4 text-sm text-fg-muted hover:text-fg"
        >
          Search
        </button>
        {status === 'loading' && <div className="text-sm text-fg-muted">Searching…</div>}
        {status === 'error' && <div className="text-sm text-rose-600 dark:text-rose-400">Search failed.</div>}
      </div>

      {results.length > 0 && (
        <div className="grid gap-3">
          {results.map((r) => (
            <Card key={`${r.section}:${r.slug}`}>
              <CardBody>
                <div className="flex items-center justify-between gap-3 text-sm text-fg-muted">
                  <div>{new Date(r.date).toLocaleDateString('en-US')}</div>
                  <div className="font-mono text-xs">/{r.section}</div>
                </div>
                <div className="mt-2 text-base font-medium">
                  <Link href={`/${r.section}/${r.slug}`} className="hover:underline">
                    {r.title}
                  </Link>
                </div>
                <p className="mt-2 text-sm text-fg-muted">{r.summary}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {status === 'done' && results.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-fg-muted shadow-soft">
          No results.
        </div>
      )}

      <div className="text-xs text-fg-muted">
        Search runs on filesystem MDX (no DB). You can upgrade to PostgreSQL full-text later.
      </div>
    </div>
  );
}
