'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Photo {
  color?: string | null;
  urls: { regular: string; small: string };
  alt_description: string | null;
  user: { name: string };
  links: { html: string };
}

const QUERIES = ['landscape nature', 'travel architecture', 'minimal city', 'forest light', 'ocean'];

export function UnsplashPhotoWidget() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = QUERIES[Math.floor(Math.random() * QUERIES.length)];
    fetch(`/api/unsplash?query=${encodeURIComponent(q)}&count=1&orientation=portrait`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.photos?.[0]) setPhoto(data.photos[0]);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="w-full h-full min-h-[240px] bg-bg-subtle animate-pulse rounded-xl" />;
  }

  if (!photo) {
    return (
      <div className="w-full h-full min-h-[240px] flex items-center justify-center">
        <span className="text-xs text-fg-muted/40">Photo unavailable</span>
      </div>
    );
  }

  return (
    <a
      href={photo.links.html}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-full min-h-[240px] relative overflow-hidden group"
    >
      <Image
        src={photo.urls.regular}
        alt={photo.alt_description || 'Photo'}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-[10px] text-white/60">Photo · {photo.user.name}</p>
      </div>
    </a>
  );
}
