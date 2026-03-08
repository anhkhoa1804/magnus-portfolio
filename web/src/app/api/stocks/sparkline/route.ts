import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { success: false, message: 'Symbol parameter required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ALPHAVANTAGE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'ALPHAVANTAGE_API_KEY not configured' },
        { status: 503 }
      );
    }

    const res = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${apiKey}`,
      { next: { revalidate: 1800 } }
    );

    if (!res.ok) {
      throw new Error(`AlphaVantage API error: ${res.status}`);
    }

    const data = await res.json();

    if (data['Note'] || data['Information']) {
      throw new Error('AlphaVantage rate limit reached');
    }

    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries || Object.keys(timeSeries).length === 0) {
      return NextResponse.json(
        { success: false, message: `No data available for ${symbol}` },
        { status: 404 }
      );
    }

    const points = Object.entries(timeSeries)
      .slice(0, 10)
      .map(([date, vals]: [string, any]) => ({
        date,
        close: parseFloat(vals['4. close']),
      }))
      .reverse();

    return NextResponse.json({
      success: true,
      data: {
        symbol: symbol.toUpperCase(),
        points,
        source: 'alphavantage',
        asOf: new Date().toISOString(),
        cached: false,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
