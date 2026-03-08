'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
  temp: number;
  feelsLike?: number;
  humidity?: number;
  windKph?: number;
  condition: string;
  city: string;
  isDay?: boolean;
  icon?: string;
}
function WeatherIcon({ icon }: { icon: string }) {
  const cls = 'w-full h-full stroke-current fill-none stroke-[1.5]';
  if (icon === '☀️') return (
    <svg viewBox="0 0 24 24" className={cls}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
  );
  if (icon === '🌙') return (
    <svg viewBox="0 0 24 24" className={cls}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
  );
  if (icon === '☁️' || icon === '🌤️') return (
    <svg viewBox="0 0 24 24" className={cls}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>
  );
  if (icon === '🌧️' || icon === '🌦️') return (
    <svg viewBox="0 0 24 24" className={cls}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /><path d="M8 19v3M12 19v3M16 19v3" /></svg>
  );
  if (icon === '⛈️') return (
    <svg viewBox="0 0 24 24" className={cls}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /><polyline points="13 17 10 22 13 21 10 26" /></svg>
  );
  if (icon === '❄️') return (
    <svg viewBox="0 0 24 24" className={cls}><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 7l-5 5-5-5" /><path d="M17 17l-5-5-5 5" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M7 7l5 5 5-5" /><path d="M7 17l5-5 5 5" /></svg>
  );
  if (icon === '🌫️') return (
    <svg viewBox="0 0 24 24" className={cls}><line x1="3" y1="8" x2="21" y2="8" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="16" x2="21" y2="16" /></svg>
  );
  return null;
}

export function WeatherWidget({ simple }: { simple?: boolean }) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.weather) setData(json.weather);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    if (simple) return <span className="animate-pulse text-fg-muted">--°C</span>;
    return <div className="h-full bg-bg-subtle animate-pulse rounded" />;
  }

  if (!data) return null;

  if (simple) {
    return (
      <span className="text-sm tracking-widest text-fg-muted hover:text-fg transition-colors">
        {data.temp}°C
      </span>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <p className="text-xs uppercase tracking-wider text-fg-muted mb-2">{data.city}</p>
      <div className="flex items-end justify-between mb-auto">
        <div>
          <span className="text-4xl font-light tracking-tighter text-fg tabular-nums leading-none">{data.temp}°</span>
          <span className="block text-xs text-fg-muted mt-1">{data.condition}</span>
        </div>
        {data.icon && (
          <div className="w-10 h-10 text-fg/70 mb-0.5 mr-10">
            <WeatherIcon icon={data.icon} />
          </div>
        )}
      </div>
      <div className="mt-auto pt-3 flex gap-3 flex-wrap">
        {data.feelsLike != null && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-fg-muted/60 mb-0.5">Feels</p>
            <p className="text-xs text-fg-muted tabular-nums">{data.feelsLike}°</p>
          </div>
        )}
        {data.humidity != null && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-fg-muted/60 mb-0.5">Humid</p>
            <p className="text-xs text-fg-muted tabular-nums">{data.humidity}%</p>
          </div>
        )}
        {data.windKph != null && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-fg-muted/60 mb-0.5">Wind</p>
            <p className="text-xs text-fg-muted tabular-nums">{data.windKph} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
}
