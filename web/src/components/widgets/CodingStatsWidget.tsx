'use client';

import { useEffect, useState } from 'react';

interface WakaStats {
  hours: number;
  languages: Array<{ name: string; percent: number }>;
}

export function CodingStatsWidget() {
  const [stats, setStats] = useState<WakaStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wakatime')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.stats) setStats(json.stats);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-5 bg-bg-subtle rounded w-2/3" />
        <div className="h-4 bg-bg-subtle rounded w-1/2" />
        <div className="h-4 bg-bg-subtle rounded w-3/4" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col justify-between h-full">
        <div className="text-xs uppercase tracking-wider text-fg-muted mb-4">Coding</div>
        <p className="text-sm text-fg-muted">Stats unavailable</p>
      </div>
    );
  }

  const topLangs = stats.languages.slice(0, 3);

  return (
    <div className="flex flex-col h-full">
      <p className="text-xs uppercase tracking-wider text-fg-muted mb-2">Last 7 days</p>
      <div className="flex items-baseline gap-2 mb-auto">
        <span className="text-4xl font-light tracking-tighter text-fg tabular-nums leading-none">{stats.hours}h</span>
        <span className="text-xs text-fg-muted">coded</span>
      </div>
      <div className="mt-auto space-y-2.5">
        {topLangs.map((lang) => (
          <div key={lang.name}>
            <div className="flex justify-between mb-1">
              <p className="text-[10px] uppercase tracking-wider text-fg-muted/70">{lang.name}</p>
              <p className="text-[10px] text-fg-muted/70 tabular-nums">{lang.percent}%</p>
            </div>
            <div className="h-1 rounded-full bg-fg/15">
              <div className="h-1 rounded-full bg-fg/50" style={{ width: `${lang.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
