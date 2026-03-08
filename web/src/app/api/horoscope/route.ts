import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(
      'https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=aquarius',
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const text =
      data?.horoscope ??
      data?.data?.horoscope ??
      data?.data?.horoscope_data ??
      data?.description ??
      data?.data?.description ??
      null;
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ text: null }, { status: 200 });
  }
}
