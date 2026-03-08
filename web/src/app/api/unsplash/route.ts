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
      // Return placeholder images if no API key
      return NextResponse.json({
        success: true,
        photos: Array.from({ length: count }, (_, i) => ({
          id: `placeholder-${i}`,
          urls: {
            regular: `https://images.unsplash.com/photo-${1600000000000 + i * 1000}?w=1080&q=80`,
            small: `https://images.unsplash.com/photo-${1600000000000 + i * 1000}?w=400&q=80`,
            thumb: `https://images.unsplash.com/photo-${1600000000000 + i * 1000}?w=200&q=80`,
          },
          alt_description: `${query} image ${i + 1}`,
          description: null,
          user: {
            name: 'Unsplash',
            username: 'unsplash',
          },
          links: {
            html: 'https://unsplash.com',
          },
        })),
      });
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
    
    // Fallback to placeholder images
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'technology';
    const count = Math.min(parseInt(searchParams.get('count') || '10'), 30);
    
    return NextResponse.json({
      success: true,
      photos: Array.from({ length: count }, (_, i) => ({
        id: `placeholder-${i}`,
        urls: {
          regular: `https://images.unsplash.com/photo-${1600000000000 + i * 1000}?w=1080&q=80`,
          small: `https://images.unsplash.com/photo-${1600000000000 + i * 1000}?w=400&q=80`,
          thumb: `https://images.unsplash.com/photo-${1600000000000 + i * 1000}?w=200&q=80`,
        },
        alt_description: `${query} image ${i + 1}`,
        description: null,
        user: {
          name: 'Unsplash',
          username: 'unsplash',
        },
        links: {
          html: 'https://unsplash.com',
        },
      })),
    });
  }
}
