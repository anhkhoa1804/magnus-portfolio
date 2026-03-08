import { NextResponse } from 'next/server';
import { cacheWrap } from '@/lib/cache';

export const runtime = 'nodejs';

const TTL_MS = 10 * 60_000;

type FngResponse = {
  data?: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update?: string;
  }>;
};

export async function GET() {
  try {
    const { value, cached } = await cacheWrap('fng:latest', TTL_MS, async () => {
      const url = 'https://api.alternative.me/fng/?limit=1&format=json';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Fear & Greed failed (${res.status})`);
      return (await res.json()) as FngResponse;
    });

    const item = value.data?.[0];
    const v = item ? Number(item.value) : NaN;

    return NextResponse.json({
      success: true,
      data: {
        value: Number.isFinite(v) ? v : null,
        classification: item?.value_classification ?? null,
        asOf: item?.timestamp ? new Date(Number(item.timestamp) * 1000).toISOString() : new Date().toISOString(),
        cached,
        source: 'alternative.me',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error.';
    return NextResponse.json({ success: false, error: message }, { status: 200 });
  }
}
