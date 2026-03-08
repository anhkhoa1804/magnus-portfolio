import { NextResponse } from 'next/server';
import { cacheWrap } from '@/lib/cache';

export const runtime = 'nodejs';

const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days - "lịch sử thành phố ít khi thay đổi"

type WikipediaResponse = {
  query?: {
    pages?: Record<string, {
      pageid: number;
      title: string;
      extract?: string;
      thumbnail?: {
        source: string;
        width: number;
        height: number;
      };
    }>;
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json(
      { success: false, error: 'City parameter required' },
      { status: 400 }
    );
  }

  try {
    const { value, cached } = await cacheWrap(`wikipedia:${city}`, TTL_MS, async () => {
      // Use Wikipedia API with MediaWiki format
      // https://www.mediawiki.org/wiki/API:Main_page
      const url = new URL('https://en.wikipedia.org/w/api.php');
      url.searchParams.set('action', 'query');
      url.searchParams.set('format', 'json');
      url.searchParams.set('prop', 'extracts|pageimages');
      url.searchParams.set('exintro', 'true'); // Only intro section
      url.searchParams.set('explaintext', 'true'); // Plain text, no HTML
      url.searchParams.set('exsentences', '3'); // First 3 sentences
      url.searchParams.set('piprop', 'thumbnail');
      url.searchParams.set('pithumbsize', '400');
      url.searchParams.set('titles', city);
      url.searchParams.set('redirects', '1'); // Follow redirects
      url.searchParams.set('origin', '*'); // CORS

      const res = await fetch(url.toString(), {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Magnus Portfolio (contact@magnus.com)',
        },
      });

      if (!res.ok) throw new Error(`Wikipedia API failed (${res.status})`);
      
      const data = (await res.json()) as WikipediaResponse;
      return data;
    });

    // Extract page data
    const pages = value.query?.pages;
    if (!pages) {
      return NextResponse.json({
        success: false,
        error: 'No results found',
      });
    }

    const page = Object.values(pages)[0];
    
    // Check if page exists (pageid -1 means page not found)
    if (!page || page.pageid === -1 || !page.extract) {
      return NextResponse.json({
        success: false,
        error: 'City not found in Wikipedia',
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        title: page.title,
        extract: page.extract,
        thumbnail: page.thumbnail?.source || null,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
      },
      cached,
      source: 'wikipedia',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 200 });
  }
}
