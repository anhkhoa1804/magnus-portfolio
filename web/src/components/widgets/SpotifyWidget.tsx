'use client';

import { useEffect, useState } from 'react';

interface Track {
  title: string;
  artist: string;
  albumImageUrl?: string;
  songUrl?: string;
  isPlaying?: boolean;
}

export function SpotifyWidget() {
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/spotify/now-playing').then((r) => r.json()).catch(() => null),
      fetch('/api/spotify/top-tracks').then((r) => r.json()).catch(() => ({ tracks: [] })),
    ]).then(([np, tt]) => {
      if (np?.isPlaying && np?.title) {
        setNowPlaying({ title: np.title, artist: np.artist, albumImageUrl: np.albumImageUrl, songUrl: np.songUrl, isPlaying: true });
      }
      if (tt?.tracks?.length) {
        setTopTracks(tt.tracks.slice(0, 5));
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-3 bg-bg-subtle rounded w-1/3 mb-4" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-2.5 items-center">
            <div className="w-8 h-8 bg-bg-subtle rounded shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-2.5 bg-bg-subtle rounded w-4/5" />
              <div className="h-2 bg-bg-subtle rounded w-3/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const tracksToShow = nowPlaying
    ? [nowPlaying, ...topTracks.filter((t) => t.title !== nowPlaying.title)].slice(0, 4)
    : topTracks.slice(0, 4);

  if (!tracksToShow.length) {
    return (
      <div className="flex flex-col h-full">
        <div className="text-xs uppercase tracking-wider text-fg-muted mb-3">Listening</div>
        <p className="text-sm text-fg-muted">Nothing playing</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Label */}
      <div className="text-xs uppercase tracking-wider text-fg-muted mb-3">
        {nowPlaying ? 'Now playing' : 'Recent tracks'}
      </div>
      {/* Track list */}
      <div className="flex flex-col flex-1 justify-around">
        {tracksToShow.map((track, i) => (
          <a
            key={i}
            href={track.songUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            {track.albumImageUrl && (
              <img src={track.albumImageUrl} alt="" className="w-6 h-6 rounded shrink-0 opacity-80" />
            )}
            <div className="min-w-0 flex-1">
              <p className={`text-[11px] font-medium leading-tight truncate ${track.isPlaying ? 'text-fg' : 'text-fg-muted'}`}>{track.title}</p>
              <p className="text-[10px] leading-tight text-fg-muted/70 truncate">{track.artist}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
