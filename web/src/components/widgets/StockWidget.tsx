'use client';

import { useEffect, useState } from 'react';

const TICKERS = ['BTC-USD', 'ETH-USD', 'AAPL', 'TSLA', 'NVDA'];

interface Stock {
  symbol: string;
  price: number;
  changePercent: number;
}

function Arrow({ up }: { up: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="inline-block">
      <path
        d={up ? 'M5 8V2M5 2L2 5M5 2L8 5' : 'M5 2v6M5 8L2 5M5 8L8 5'}
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export function StockWidget() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      TICKERS.map((s) =>
        fetch(`/api/stocks/quote?symbol=${encodeURIComponent(s)}`)
          .then((r) => r.json())
          .then((d) => d.success ? d.data as Stock : null)
          .catch(() => null)
      )
    )
      .then((res) => setStocks(res.filter(Boolean) as Stock[]))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (s: Stock) =>
    s.symbol.includes('-USD')
      ? `$${s.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
      : `$${s.price.toFixed(2)}`;

  return (
    <div className="flex flex-col h-full">
      <p className="text-xs uppercase tracking-wider text-fg-muted mb-3">Markets</p>
      {loading ? (
        <div className="flex-1 space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-7 bg-fg/10 rounded" />)}
        </div>
      ) : (
        <div className="flex flex-col flex-1 justify-around divide-y divide-fg/10">
          {stocks.map((s) => {
            const up = s.changePercent >= 0;
            const label = s.symbol.replace('-USD', '');
            return (
              <div key={s.symbol} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0">
                <span className="text-sm font-semibold text-fg uppercase tracking-tight leading-none">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium font-mono tabular-nums text-fg leading-none">{fmt(s)}</span>
                  <span className={`text-[10px] font-medium tabular-nums flex items-center gap-0.5 leading-none ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    <Arrow up={up} />
                    {Math.abs(s.changePercent).toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
