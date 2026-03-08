'use client';

import * as React from 'react';

interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlesResponse {
  success: boolean;
  data?: { candles: Candle[] };
  message?: string;
}

interface QuoteResponse {
  success: boolean;
  data?: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    asOf: string;
    cached: boolean;
  };
  message?: string;
}

function formatNum(n: number) { return Number.isFinite(n) ? n.toFixed(2) : '—'; }
function formatPct(n: number) { return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`; }

function CandlestickChart({ candles }: { candles: Candle[] }) {
  if (candles.length < 2) return (
    <div className="h-52 flex items-center justify-center text-xs text-fg-muted/50">No data</div>
  );

  const W = 640, H = 200;
  const PAD = { top: 8, right: 8, bottom: 24, left: 52 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const minP = Math.min(...lows);
  const maxP = Math.max(...highs);
  const range = maxP - minP || 1;

  const toY = (v: number) => PAD.top + innerH - ((v - minP) / range) * innerH;

  const n = candles.length;
  const candleW = Math.max(2, Math.floor(innerW / n) - 2);
  const step = innerW / n;

  // y-axis ticks
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => minP + (range / tickCount) * i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-52 font-mono" preserveAspectRatio="xMidYMid meet">
      {/* grid lines */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={PAD.left} y1={toY(t)}
          x2={W - PAD.right} y2={toY(t)}
          stroke="currentColor" strokeOpacity="0.08" strokeWidth="1"
        />
      ))}
      {/* y-axis labels */}
      {ticks.map((t, i) => (
        <text key={i} x={PAD.left - 4} y={toY(t) + 4} textAnchor="end" fontSize="9" fill="currentColor" opacity="0.4">
          {t.toFixed(0)}
        </text>
      ))}
      {/* candles */}
      {candles.map((c, i) => {
        const bull = c.close >= c.open;
        const color = bull ? 'hsl(142 60% 50%)' : 'hsl(0 70% 58%)';
        const x = PAD.left + i * step + step / 2;
        const bodyTop = toY(Math.max(c.open, c.close));
        const bodyBot = toY(Math.min(c.open, c.close));
        const bodyH = Math.max(1, bodyBot - bodyTop);
        return (
          <g key={i}>
            {/* wick */}
            <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)} stroke={color} strokeWidth="1" />
            {/* body */}
            <rect
              x={x - candleW / 2}
              y={bodyTop}
              width={candleW}
              height={bodyH}
              fill={bull ? color : color}
              fillOpacity={bull ? 0.85 : 0.85}
              rx="1"
            />
          </g>
        );
      })}
      {/* x-axis date labels (every ~7 candles) */}
      {candles.map((c, i) => {
        if (i % Math.max(1, Math.floor(n / 6)) !== 0) return null;
        const x = PAD.left + i * step + step / 2;
        const label = c.date.slice(5); // MM-DD
        return (
          <text key={i} x={x} y={H - 4} textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.4">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function StocksDashboard() {
  const [symbol, setSymbol] = React.useState('AAPL');
  const [inputVal, setInputVal] = React.useState('AAPL');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [quote, setQuote] = React.useState<QuoteResponse['data'] | null>(null);
  const [candles, setCandles] = React.useState<Candle[]>([]);
  const [days, setDays] = React.useState(30);
  const [error, setError] = React.useState<string | null>(null);

  const PERIODS = [
    { label: '7D', days: 7 },
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: '6M', days: 180 },
  ];
  const WATCHLIST = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL'];

  async function fetchData(sym: string, d = days) {
    setStatus('loading');
    setError(null);
    setQuote(null);
    setCandles([]);
    try {
      const [qRes, cRes] = await Promise.all([
        fetch(`/api/stocks/quote?symbol=${encodeURIComponent(sym)}`),
        fetch(`/api/stocks/candles?symbol=${encodeURIComponent(sym)}&days=${d}`),
      ]);
      const qJson = (await qRes.json()) as QuoteResponse;
      const cJson = (await cRes.json()) as CandlesResponse;
      if (!qJson.success || !qJson.data) {
        setError(qJson.message ?? 'Failed to load');
        setStatus('error');
        return;
      }
      setQuote(qJson.data);
      setCandles(cJson.success ? (cJson.data?.candles ?? []) : []);
      setStatus('done');
    } catch {
      setError('Network error');
      setStatus('error');
    }
  }

  React.useEffect(() => { void fetchData('AAPL'); }, []);

  const bull = (quote?.changePercent ?? 0) >= 0;

  return (
    <div className="space-y-4">

      {/* Search row */}
      <div className="flex gap-2">
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value.toUpperCase())}
          onKeyDown={e => { if (e.key === 'Enter') { setSymbol(inputVal); void fetchData(inputVal); } }}
          placeholder="Symbol"
          className="flex-1 h-9 rounded-xl border border-border bg-bg px-3 text-sm font-mono outline-none focus:ring-2 focus:ring-brand/30 min-w-0"
        />
        <button
          onClick={() => { setSymbol(inputVal); void fetchData(inputVal); }}
          disabled={status === 'loading'}
          className="h-9 px-4 rounded-xl bg-brand text-white text-xs font-medium hover:opacity-85 disabled:opacity-40 transition-opacity"
        >
          {status === 'loading' ? '…' : 'Go'}
        </button>
      </div>

      {/* Watchlist chips */}
      <div className="flex flex-wrap gap-1.5">
        {WATCHLIST.map(s => (
          <button
            key={s}
            onClick={() => { setInputVal(s); setSymbol(s); void fetchData(s); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
              symbol === s ? 'bg-brand/10 border-brand/30 text-brand' : 'border-border/50 text-fg-muted hover:text-fg'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Error */}
      {status === 'error' && <p className="text-xs text-neg">{error}</p>}

      {/* Quote stats */}
      {quote && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bento-card p-4">
            <p className="text-[10px] font-mono text-fg-muted/50 uppercase mb-1.5">Price</p>
            <p className="text-xl font-semibold font-mono">${formatNum(quote.price)}</p>
          </div>
          <div className="bento-card p-4">
            <p className="text-[10px] font-mono text-fg-muted/50 uppercase mb-1.5">Change</p>
            <p className={`text-xl font-semibold font-mono ${bull ? 'text-pos' : 'text-neg'}`}>{formatNum(quote.change)}</p>
          </div>
          <div className="bento-card p-4">
            <p className="text-[10px] font-mono text-fg-muted/50 uppercase mb-1.5">Change %</p>
            <p className={`text-xl font-semibold font-mono ${bull ? 'text-pos' : 'text-neg'}`}>{formatPct(quote.changePercent)}</p>
          </div>
        </div>
      )}

      {/* Candlestick chart */}
      {(status === 'done' || candles.length > 0) && (
        <div className="bento-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono text-fg-muted/60">{symbol} · candlestick</p>
            <div className="flex gap-1">
              {PERIODS.map(p => (
                <button
                  key={p.label}
                  onClick={() => { setDays(p.days); void fetchData(symbol, p.days); }}
                  className={`px-2.5 py-1 text-[10px] rounded-lg font-mono transition-colors ${
                    days === p.days ? 'bg-fg text-bg' : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <CandlestickChart candles={candles} />
          {quote?.asOf && (
            <p className="text-[10px] text-fg-muted/40 font-mono mt-2">
              as of {new Date(quote.asOf).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              {quote.cached ? ' · cached' : ' · live'}
            </p>
          )}
        </div>
      )}

    </div>
  );
}
