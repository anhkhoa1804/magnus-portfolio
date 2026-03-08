import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
// Use recently-played instead of me/tracks for better compatibility
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=10';

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token refresh failed: ${error.error || response.status}`);
  }

  return response.json();
}

async function getRecentlyPlayed() {
  const tokenData = await getAccessToken();
  
  if (!tokenData.access_token) {
    throw new Error('No access token received');
  }

  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}

export async function GET() {
  try {
    // Check if Spotify credentials are configured
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return NextResponse.json({
        tracks: [],
        success: false,
        message: 'Spotify not configured',
      }, { status: 200 });
    }

    const response = await getRecentlyPlayed();

    // recently-played returns different structure than me/tracks
    const tracks = response.items?.slice(0, 5).map((item: any) => ({
      title: item.track.name,
      artist: item.track.artists.map((artist: any) => artist.name).join(', '),
      album: item.track.album.name,
      albumImageUrl: item.track.album.images[0]?.url || '',
      songUrl: item.track.external_urls.spotify,
      addedAt: item.played_at, // recently-played uses played_at instead of added_at
      duration: item.track.duration_ms,
    })) || [];

    return NextResponse.json({
      tracks,
      success: true,
      isSample: false,
    });
  } catch (error: any) {
    console.error('Spotify API error:', error.message);
    return NextResponse.json({
      tracks: [],
      success: false,
      message: error.message,
    }, { status: 200 });
  }
}

export const revalidate = 1800; // Cache for 30 minutes
