import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Candle {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');
    const days = parseInt(searchParams.get('days') || '30', 10);

    if (!symbol) {
      return NextResponse.json(
        { success: false, message: 'Symbol parameter required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.FINNHUB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'FINNHUB_API_KEY not configured' },
        { status: 503 }
      );
    }

    // Calculate date range
    const to = Math.floor(Date.now() / 1000);
    const from = to - (days * 86400);

    // Fetch candlestick data from Finnhub
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${apiKey}`,
      { next: { revalidate: 300 } }
    );

    let finnhubOk = false;
    let candles: Candle[] = [];

    if (response.ok) {
      const data = await response.json();
      if (data.s === 'ok' && data.c) {
        candles = data.t.map((timestamp: number, idx: number) => ({
          timestamp,
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          open: data.o[idx],
          high: data.h[idx],
          low: data.l[idx],
          close: data.c[idx],
          volume: data.v[idx],
        }));
        finnhubOk = true;
      }
    }

    // Fallback: use AlphaVantage (free tier) when Finnhub candles are unavailable
    if (!finnhubOk) {
      const avKey = process.env.ALPHAVANTAGE_API_KEY;
      if (!avKey) {
        return NextResponse.json({
          success: false,
          message: 'Historical chart data unavailable (no API key configured)',
          candles: [],
        });
      }

      const avRes = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol!)}&outputsize=compact&apikey=${avKey}`,
        { next: { revalidate: 1800 } }
      );

      if (!avRes.ok) {
        return NextResponse.json({
          success: false,
          message: 'Failed to fetch chart data',
          candles: [],
        });
      }

      const avData = await avRes.json();

      if (avData['Note'] || avData['Information']) {
        return NextResponse.json({
          success: false,
          message: 'Chart API rate limit reached. Please try again later.',
          candles: [],
        });
      }

      const timeSeries = avData['Time Series (Daily)'];
      if (!timeSeries || Object.keys(timeSeries).length === 0) {
        return NextResponse.json({
          success: false,
          message: `No data available for ${symbol}`,
          candles: [],
        });
      }

      const cutoff = Date.now() / 1000 - days * 86400;
      candles = Object.entries(timeSeries)
        .map(([date, vals]: [string, any]) => {
          const ts = new Date(date).getTime() / 1000;
          return {
            timestamp: ts,
            date,
            open: parseFloat(vals['1. open']),
            high: parseFloat(vals['2. high']),
            low: parseFloat(vals['3. low']),
            close: parseFloat(vals['4. close']),
            volume: parseInt(vals['5. volume'], 10),
          } as Candle;
        })
        .filter(c => c.timestamp >= cutoff)
        .sort((a, b) => a.timestamp - b.timestamp);
    }

    return NextResponse.json({
      success: true,
      symbol: symbol!.toUpperCase(),
      candles,
      count: candles.length,
    });
  } catch (error: any) {
    console.error('Candlestick data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch candlestick data' 
      },
      { status: 500 }
    );
  }
}
