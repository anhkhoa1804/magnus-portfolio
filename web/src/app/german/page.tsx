'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Article {
  title_de?: string;
  title_en?: string;
  title?: string;
  teaser_de?: string;
  teaser_en?: string;
  teaser?: string;
  url?: string;
  source_url?: string;
  date?: string;
  topline?: string;
  imageUrl?: string;
  image?: string;
}

interface TranslationTooltip {
  text: string;
  translation: string | null;
  loading: boolean;
  x: number;
  y: number;
}

function useTranslationTooltip() {
  const [tooltip, setTooltip] = useState<TranslationTooltip | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTooltip(null);
  }, []);

  const handleMouseUp = useCallback(async (e: MouseEvent) => {
    const sel = window.getSelection();
    const selected = sel?.toString().trim() ?? '';
    if (!selected || selected.length < 2 || selected.length > 120) {
      dismiss();
      return;
    }
    // Only translate if it looks like German (or is short enough to try)
    const x = (e as MouseEvent).clientX;
    const y = (e as MouseEvent).clientY + window.scrollY;
    setTooltip({ text: selected, translation: null, loading: true, x, y });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Translate this German text to English (respond with ONLY the translation, no explanation): "${selected}"` }),
      });
      const data = await res.json();
      const translation = data.answer || data.result || data.text || null;
      setTooltip((prev) => prev ? { ...prev, translation, loading: false } : null);
    } catch {
      setTooltip((prev) => prev ? { ...prev, translation: 'Translation unavailable', loading: false } : null);
    }
    timeoutRef.current = setTimeout(dismiss, 6000);
  }, [dismiss]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleMouseUp]);

  return { tooltip, dismiss };
}

export default function GermanPage() {
  const [news, setNews] = useState<Article[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const { tooltip, dismiss } = useTranslationTooltip();

  useEffect(() => {
    fetch('/api/german-news')
      .then((r) => r.json())
      .then((data) => {
        const raw: Article[] = data.news || data.articles || data.data || [];
        const seenTitles = new Set<string>();
        const seenUrls = new Set<string>();
        const filtered = raw.filter((a) => {
          const title = a.title_de || a.title || a.title_en || '';
          const url = a.source_url || a.url || '';
          if (!title || seenTitles.has(title)) return false;
          if (url && seenUrls.has(url)) return false;
          seenTitles.add(title);
          if (url) seenUrls.add(url);
          const topline = (a.topline || '').toLowerCase();
          if (topline.includes('werbung') || topline.includes('anzeige') || topline.includes('advertisement')) return false;
          return !!(a.imageUrl || a.image);
        });
        setNews(filtered);
      })
      .catch(() => null)
      .finally(() => setNewsLoading(false));
  }, []);

  const getTitle = (item: Article) => item.title_de || item.title || item.title_en || '';
  const getTeaser = (item: Article) => item.teaser_de || item.teaser || item.teaser_en || '';
  const getImage = (item: Article) => item.imageUrl || item.image || null;
  const sourceUrl = (item: Article) => item.source_url || item.url || 'https://www.tagesschau.de';

  return (
    <div className="container max-w-5xl">
      {/* Floating translation tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 max-w-xs pointer-events-auto"
          style={{ left: Math.min(tooltip.x, window.innerWidth - 240), top: tooltip.y - 80 }}
        >
          <div className="bg-fg text-bg text-xs rounded-xl px-3 py-2.5 shadow-xl">
            <div className="font-medium text-bg/60 mb-0.5 truncate">&ldquo;{tooltip.text}&rdquo;</div>
            {tooltip.loading
              ? <div className="text-bg/80">Translating…</div>
              : <div className="text-bg leading-snug">{tooltip.translation}</div>
            }
          </div>
          <button
            onClick={dismiss}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-fg-muted text-bg text-[10px] flex items-center justify-center hover:opacity-80"
          >×</button>
        </div>
      )}

      {/* Header */}
      <section className="pt-20 pb-10 mb-8">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-widest text-fg-muted">Language</p>
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-heading font-semibold leading-[1] tracking-tight text-fg">
            German.
          </h1>
          <p className="text-lg text-fg-muted font-light leading-relaxed max-w-lg">
            Aktuelle Nachrichten von der Tagesschau. Markiere einen Satz für eine sofortige Übersetzung.
          </p>
        </div>
      </section>

      {/* News feed — full width */}
      <div>
        {newsLoading && (
          <div className="divide-y divide-border/40">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex gap-5 py-5 animate-pulse">
                <div className="w-40 h-28 shrink-0 rounded-lg bg-bg-subtle" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-bg-subtle rounded w-2/3" />
                  <div className="h-3 bg-bg-subtle rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!newsLoading && news.length === 0 && (
          <p className="text-sm text-fg-muted py-8">News unavailable right now.</p>
        )}

        {!newsLoading && news.length > 0 && (
          <div className="divide-y divide-border/40">
            {news.map((item, i) => {
              const img = getImage(item);
              return (
                <a
                  key={i}
                  href={sourceUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-5 py-5 -mx-2 px-2 rounded-xl hover:bg-bg-subtle/50 transition-colors"
                >
                  {img && (
                    <div className="w-40 h-28 shrink-0 rounded-lg overflow-hidden bg-bg-subtle">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={getTitle(item)} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    {item.topline && (
                      <span className="text-[10px] uppercase tracking-widest text-fg-muted/50">{item.topline}</span>
                    )}
                    <h3 className="text-base font-medium text-fg leading-snug line-clamp-2 group-hover:opacity-70 transition-opacity">
                      {getTitle(item)}
                    </h3>
                    {getTeaser(item) && (
                      <p className="text-sm text-fg-muted font-light leading-relaxed line-clamp-2">
                        {getTeaser(item)}
                      </p>
                    )}
                  </div>
                  {item.date && (
                    <time className="text-[10px] font-mono text-fg-muted/40 shrink-0 pt-0.5 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
