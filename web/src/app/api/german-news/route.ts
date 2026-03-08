import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CachedData<T> {
  data: T;
  timestamp: number;
}

async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create cache directory:', error);
  }
}

async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const cached: CachedData<T> = JSON.parse(fileContent);
    
    const now = Date.now();
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    await fs.unlink(filePath).catch(() => {});
    return null;
  } catch (error) {
    return null;
  }
}

async function setCachedData<T>(key: string, data: T): Promise<void> {
  try {
    await ensureCacheDir();
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    await fs.writeFile(filePath, JSON.stringify(cached, null, 2));
  } catch (error) {
    console.error('Failed to cache data:', error);
  }
}

// German news endpoint
export async function GET() {
  const cacheKey = 'german_news';
  
  // Try cache first
  const cached = await getCachedData<any>(cacheKey);
  if (cached) {
    return NextResponse.json({ success: true, news: cached, cached: true });
  }

  try {
    // 1. Fetch live German news from NewsAPI
    const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
    if (!NEWSAPI_KEY) throw new Error('NEWSAPI_KEY not configured');

    const newsRes = await fetch(
      `https://newsapi.org/v2/everything?q=Deutschland+OR+Bundesregierung+OR+Nachrichten+OR+Bundeswehr&language=de&sortBy=publishedAt&pageSize=20&apiKey=${NEWSAPI_KEY}`,
      { next: { revalidate: 0 } }
    );

    if (!newsRes.ok) throw new Error(`NewsAPI error: ${newsRes.status}`);

    const newsData = await newsRes.json();
    if (newsData.status !== 'ok') throw new Error(newsData.message || 'NewsAPI failed');

    const rawArticles = (newsData.articles || []).slice(0, 20);
    if (rawArticles.length === 0) throw new Error('No German articles returned');

    const articles = rawArticles.map((a: any) => ({
      title_de: a.title || '',
      teaser_de: a.description || '',
      topline: a.source?.name || '',
      date: a.publishedAt || new Date().toISOString(),
      source_url: a.url || '',
      imageUrl: a.urlToImage || '',
    }));

    // 2. Batch translate with Groq
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    let translated = articles.map((a: any) => ({ ...a, title_en: a.title_de, teaser_en: a.teaser_de }));

    if (GROQ_API_KEY && articles.length > 0) {
      const pairs = articles.map((a: any, i: number) =>
        `${i + 1}. TITLE: ${a.title_de}\n   TEASER: ${a.teaser_de}`
      ).join('\n');

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a German-to-English translator. Translate each TITLE and TEASER accurately and naturally. Respond ONLY with a JSON array, no markdown.',
            },
            {
              role: 'user',
              content: `Translate these German news items to English:\n${pairs}\n\nRespond as JSON array: [{"title_en":"...","teaser_en":"..."},...]`,
            },
          ],
          temperature: 0.2,
          max_tokens: 4000,
        }),
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const text = groqData.choices?.[0]?.message?.content?.trim() ?? '';
        try {
          const match = text.match(/\[[\s\S]*\]/);
          const translations: any[] = JSON.parse(match ? match[0] : text);
          translated = articles.map((a: any, i: number) => ({
            ...a,
            title_en: translations[i]?.title_en || a.title_de,
            teaser_en: translations[i]?.teaser_en || a.teaser_de,
          }));
        } catch { /* use German as fallback */ }
      }
    }

    await setCachedData(cacheKey, translated);
    return NextResponse.json({ success: true, news: translated, cached: false });
  } catch (error: any) {
    console.error('German news API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
