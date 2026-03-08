import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
}

async function getCryptoQuote(symbol: string): Promise<Response> {
  try {
    // Convert symbol format: BTC-USD -> BTCUSDT
    const binanceSymbol = symbol.replace('-USD', 'USDT');
    
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();

    const price = parseFloat(data.lastPrice);
    const change = parseFloat(data.priceChange);
    const changePercent = parseFloat(data.priceChangePercent);

    const quoteData: QuoteData = {
      symbol: symbol.toUpperCase(),
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high: parseFloat(data.highPrice),
      low: parseFloat(data.lowPrice),
      open: parseFloat(data.openPrice),
      previousClose: parseFloat(data.prevClosePrice),
      volume: parseFloat(data.volume),
    };

    return NextResponse.json({
      success: true,
      data: quoteData,
    });
  } catch (error: any) {
    console.error('Crypto quote error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch crypto quote' },
      { status: 500 }
    );
  }
}

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

    // Handle crypto symbols differently (use Binance)
    if (symbol.includes('-USD') || symbol === 'BTC' || symbol === 'ETH') {
      return await getCryptoQuote(symbol);
    }

    // Use Finnhub API (free tier: 60 calls/minute)
    const apiKey = process.env.FINNHUB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'Stock API not configured. Add FINNHUB_API_KEY to .env.local' },
        { status: 503 }
      );
    }
    
    // Get quote data
    const [quoteRes, prevCloseRes] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`),
      fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${Math.floor(Date.now() / 1000) - 86400 * 2}&to=${Math.floor(Date.now() / 1000)}&token=${apiKey}`)
    ]);

    if (!quoteRes.ok) {
      throw new Error(`Finnhub API error: ${quoteRes.status}`);
    }

    const quote = await quoteRes.json();
    const prevData = await prevCloseRes.json();

    if (!quote.c || quote.c === 0) {
      return NextResponse.json(
        { success: false, message: `Invalid symbol: ${symbol}` },
        { status: 404 }
      );
    }

    const price = quote.c; // Current price
    const previousClose = quote.pc; // Previous close
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;

    const quoteData: QuoteData = {
      symbol: symbol.toUpperCase(),
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high: parseFloat(quote.h.toFixed(2)),
      low: parseFloat(quote.l.toFixed(2)),
      open: parseFloat(quote.o.toFixed(2)),
      previousClose: parseFloat(previousClose.toFixed(2)),
      volume: prevData.v?.[prevData.v.length - 1] || 0,
    };

    return NextResponse.json({
      success: true,
      data: quoteData,
    });
  } catch (error: any) {
    console.error('Stock quote error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch stock quote' },
      { status: 500 }
    );
  }
}
