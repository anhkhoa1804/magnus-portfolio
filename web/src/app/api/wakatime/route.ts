import { NextResponse } from 'next/server';

export const revalidate = 3600; // 1 hour cache

interface WakaTimeStats {
  hours: number;
  languages: Array<{ name: string; percent: number }>;
  daily_average_seconds: number;
}

export async function GET() {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'WakaTime key not configured' }, { status: 500 });
  }

  try {
    const encoded = Buffer.from(apiKey).toString('base64');
    const res = await fetch('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
      headers: { Authorization: `Basic ${encoded}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`WakaTime API ${res.status}`);

    const json = await res.json();
    const data = json.data;

    const stats: WakaTimeStats = {
      hours: Math.round((data.total_seconds ?? 0) / 3600),
      daily_average_seconds: Math.round(data.daily_average ?? 0),
      languages: (data.languages ?? [])
        .slice(0, 5)
        .map((l: { name: string; percent: number }) => ({
          name: l.name,
          percent: Math.round(l.percent),
        })),
    };

    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
