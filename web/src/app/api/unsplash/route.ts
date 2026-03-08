import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

type UnsplashPhoto = {
  id: string;
  color: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'technology';
    const count = Math.min(parseInt(searchParams.get('count') || '10'), 30);
    const orientation = searchParams.get('orientation') || 'landscape';
    
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      return NextResponse.json({ success: false, photos: [], error: 'Unsplash API key not configured' });
    }

    // Fetch from Unsplash API
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=${count}&orientation=${orientation}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const photos: UnsplashPhoto[] = await response.json();

    return NextResponse.json({
      success: true,
      photos: photos.map(photo => ({
        id: photo.id,
        color: photo.color ?? null,
        urls: photo.urls,
        alt_description: photo.alt_description || photo.description || query,
        description: photo.description,
        user: photo.user,
        links: photo.links,
      })),
    });
  } catch (error) {
    console.error('Unsplash fetch error:', error);
    return NextResponse.json({ success: false, photos: [], error: 'Failed to fetch photos' });
  }
}
