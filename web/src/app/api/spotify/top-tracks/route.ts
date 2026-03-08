import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token
    }),
    cache: 'no-store'
  });

  return response.json();
}

async function getTopTracks() {
  const { access_token } = await getAccessToken();

  return fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    cache: 'no-store'
  });
}

export async function GET() {
  try {
    if (!client_id || !client_secret || !refresh_token) {
      return NextResponse.json({ 
        tracks: [],
        error: 'Spotify credentials not configured' 
      });
    }

    const response = await getTopTracks();

    if (response.status > 400) {
      return NextResponse.json({ tracks: [] });
    }

    const data = await response.json();

    if (!data || !data.items || data.items.length === 0) {
      return NextResponse.json({ tracks: [] });
    }

    // Return top 5 favourite tracks
    const tracks = data.items.slice(0, 5).map((track: any) => ({
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '),
      album: track.album.name,
      albumImageUrl: track.album.images[0]?.url,
      songUrl: track.external_urls.spotify,
      duration: track.duration_ms,
      popularity: track.popularity
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Spotify API Error:', error);
    return NextResponse.json({ 
      tracks: [],
      error: 'Failed to fetch top tracks' 
    });
  }
}

export const revalidate = 3600; // Cache for 1 hour
