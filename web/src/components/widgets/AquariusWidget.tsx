'use client';

import { useEffect, useState } from 'react';

const FALLBACK = 'Your mind races with original ideas. Channel this creative surge into tangible work — an unexpected conversation sparks a breakthrough today.';

export function AquariusWidget() {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  useEffect(() => {
    fetch('/api/horoscope')
      .then((r) => r.json())
      .then((data) => { if (data.text) setText(data.text); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <p className="text-xs uppercase tracking-wider text-fg-muted mb-4">Aquarius · {dateLabel}</p>
      {loading ? (
        <div className="flex-1 space-y-3 animate-pulse">
          {[90, 80, 95, 70, 85, 75, 88].map((w, i) => (
            <div key={i} className="h-3 bg-fg/10 rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : (
        <p className="text-[13px] leading-relaxed text-fg flex-1">{text || FALLBACK}</p>
      )}
    </div>
  );
}
