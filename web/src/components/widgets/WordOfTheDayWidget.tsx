'use client';

import { useEffect, useState } from 'react';

interface WordData {
  word: string;
  definition: string;
  pronunciation: string;
  example?: string;
}

export function WordOfTheDayWidget() {
  const [word, setWord] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/word-of-the-day')
      .then((r) => r.json())
      .then((data) => { if (data.success && data.word) setWord(data.word); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="text-xs uppercase tracking-wider text-fg-muted mb-4">Word of the Day</div>
        <div className="space-y-3 animate-pulse flex-1">
          <div className="h-7 bg-bg-subtle rounded w-2/3" />
          <div className="h-4 bg-bg-subtle rounded w-full" />
          <div className="h-4 bg-bg-subtle rounded w-4/5" />
        </div>
      </div>
    );
  }

  if (!word) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="text-xs uppercase tracking-wider text-fg-muted mb-3">Word of the Day</div>
      <div className="mb-2">
        <span className="text-xl font-bold text-fg tracking-tight">{word.word}</span>
        {word.pronunciation && (
          <span className="text-[10px] text-fg-muted ml-2">{word.pronunciation}</span>
        )}
      </div>
      <p className="text-xs text-fg-muted leading-relaxed line-clamp-3">{word.definition}</p>
      {word.example && (
        <p className="text-[11px] text-fg-muted/70 italic mt-2 leading-relaxed border-l-2 border-fg/15 pl-2 flex-1 line-clamp-none">
          &ldquo;{word.example}&rdquo;
        </p>
      )}
    </div>
  );
}

