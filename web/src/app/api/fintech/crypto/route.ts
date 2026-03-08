import { NextResponse } from 'next/server';
import { cacheWrap } from '@/lib/cache';

export const runtime = 'nodejs';

const TTL_MS = 60_000;

type CoinGeckoResponse = {
  bitcoin?: { usd?: number; usd_24h_change?: number };
  ethereum?: { usd?: number; usd_24h_change?: number };
};

export async function GET() {
  try {
    const { value, cached } = await cacheWrap('coingecko:simple:btc-eth', TTL_MS, async () => {
      // Try CoinGecko first
      try {
        const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
        
        const url = new URL('https://api.coingecko.com/api/v3/simple/price');
        url.searchParams.set('ids', 'bitcoin,ethereum');
        url.searchParams.set('vs_currencies', 'usd');
        url.searchParams.set('include_24hr_change', 'true');
        
        if (COINGECKO_API_KEY) {
          url.searchParams.set('x_cg_demo_api_key', COINGECKO_API_KEY);
        }

        const res = await fetch(url.toString(), {
          cache: 'no-store',
          headers: {
            'user-agent': 'magnus-platform/1.0',
            ...(COINGECKO_API_KEY && { 'x-cg-demo-api-key': COINGECKO_API_KEY }),
          },
        });

        if (!res.ok) throw new Error(`CoinGecko failed (${res.status})`);
        return (await res.json()) as CoinGeckoResponse;
      } catch (cgError) {
        console.warn('CoinGecko unavailable, trying Binance fallback:', cgError);
        
        // Fallback: Use Binance API (free, no key required)
        const [btcRes, ethRes] = await Promise.all([
          fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT')
        ]);
        
        if (!btcRes.ok || !ethRes.ok) {
          throw new Error('Both CoinGecko and Binance failed');
        }
        
        const btcData = await btcRes.json();
        const ethData = await ethRes.json();
        
        // Convert Binance format to CoinGecko format
        return {
          bitcoin: {
            usd: parseFloat(btcData.lastPrice),
            usd_24h_change: parseFloat(btcData.priceChangePercent)
          },
          ethereum: {
            usd: parseFloat(ethData.lastPrice),
            usd_24h_change: parseFloat(ethData.priceChangePercent)
          }
        } as CoinGeckoResponse;
      }
    });

    const btc = value.bitcoin?.usd ?? null;
    const eth = value.ethereum?.usd ?? null;

    return NextResponse.json({
      success: true,
      data: {
        btcUsd: typeof btc === 'number' ? btc : null,
        ethUsd: typeof eth === 'number' ? eth : null,
        btcChange24hPct: typeof value.bitcoin?.usd_24h_change === 'number' ? value.bitcoin?.usd_24h_change : null,
        ethChange24hPct: typeof value.ethereum?.usd_24h_change === 'number' ? value.ethereum?.usd_24h_change : null,
        cached,
        asOf: new Date().toISOString(),
        source: 'coingecko',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error.';
    return NextResponse.json({ success: false, error: message }, { status: 200 });
  }
}
