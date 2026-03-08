'use client';

import { useEffect } from 'react';

/**
 * PrefetchData component - Loads and caches API data on page load
 * This ensures data is ready when users navigate to respective pages
 */
export function PrefetchData() {
  useEffect(() => {
    // Prefetch all API endpoints on page load
    const prefetchEndpoints = async () => {
      const endpoints = [
        '/api/fintech/crypto',   // Crypto prices (BTC, ETH)
        '/api/spotify/recently-added', // Spotify tracks
        '/api/german-news',      // German news
        '/api/weather',          // Weather data
        '/api/quote',            // Daily quote
      ];

      // Use Promise.allSettled to continue even if some fail
      const results = await Promise.allSettled(
        endpoints.map(endpoint => 
          fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }).then(res => {
            if (!res.ok) throw new Error(`${endpoint} failed: ${res.status}`);
            return res.json();
          })
        )
      );

      // Log results in development
      if (process.env.NODE_ENV === 'development') {
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            console.log(`✅ Prefetched: ${endpoints[index]}`);
          } else {
            console.warn(`⚠️ Failed to prefetch: ${endpoints[index]}`, result.reason);
          }
        });
      }
    };

    // Start prefetching after a small delay to not block initial render
    const timer = setTimeout(() => {
      prefetchEndpoints();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything
  return null;
}
