'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { travelLocations, GeoJSONFeature } from '@/data/travel-locations';

export function TravelMap({ region = 'vietnam' }: { region?: 'vietnam' | 'europe' | 'world' }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<GeoJSONFeature[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Filter locations based on region
  useEffect(() => {
    let selectedLocations: GeoJSONFeature[] = [];
    
    if (region === 'vietnam') {
      selectedLocations = travelLocations.filter(loc =>
        loc.properties.description?.startsWith('Vietnam')
      );
    } else if (region === 'europe') {
      selectedLocations = travelLocations.filter(loc =>
        !loc.properties.description?.startsWith('Vietnam') &&
        !loc.properties.description?.startsWith('Transit')
      );
    } else if (region === 'world') {
      selectedLocations = travelLocations.filter(loc =>
        !loc.properties.description?.startsWith('Transit')
      );
    }
    
    console.log('TravelMap: Loaded', selectedLocations.length, region, 'locations');
    setLocations(selectedLocations);
    setLoading(false);
  }, [region]);

  useEffect(() => {
    // Wait for component to mount
    if (!isMounted) {
      console.log('TravelMap: Not mounted yet');
      return;
    }

    // Wait for all prerequisites
    if (!mapContainer.current || map.current || locations.length === 0) {
      // Don't log waiting if we just have 0 locations (e.g. wrong filter)
      if (locations.length === 0) {
          // If loaded but 0 locations, maybe just return
      }
      return;
    }

    // Check for Mapbox token (client-side)
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    
    if (!token) {
      console.error('TravelMap: No token found');
      setError('Mapbox token not configured. Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local');
      return;
    }

    try {
      console.log('TravelMap: Setting access token...');
      mapboxgl.accessToken = token;

      const mapCenter: [number, number] =
        region === 'europe' ? [10.4515, 51.1657] :
        region === 'world' ? [30, 20] :
        [106.5, 16.5];
      const mapZoom = region === 'europe' ? 3.2 : region === 'world' ? 1.5 : 4.0;

      // Detect theme from next-themes (adds 'dark' class to <html>)
      const getMapStyle = () =>
        document.documentElement.classList.contains('dark')
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/light-v11';

      if (!map.current) {
          console.log('TravelMap: Creating map instance...');
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: getMapStyle(),
            center: mapCenter,
            zoom: mapZoom,
            attributionControl: false,
          });

          // Add compact attribution only
          map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');

          // Catch style/tile auth errors (e.g. Mapbox token domain restrictions)
          map.current.on('error', (e) => {
            const status = (e.error as any)?.status;
            if (status === 401 || status === 403) {
              setError('Map tiles blocked – check Mapbox token domain restrictions at account.mapbox.com → Tokens.');
            }
          });

          // Watch for theme changes and update map style
          const themeObserver = new MutationObserver(() => {
            if (map.current) {
              map.current.setStyle(getMapStyle());
            }
          });
          themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (map.current as any)._themeObserver = themeObserver;
      }

      // Add markers for each location
      // Remove existing markers first if any? Mapbox GL doesn't automatically clear them unless we keep track.
      // Since we re-mount map on region change or just update locations...
      // For simplicity, let's assume we are re-creating map if we leave the page, but here we might switch props.
      // But actually, we are creating map only if !map.current.
      // If locations change, we should probably clear markers.
      // But creating the map instance inside this effect which depends on `locations` means we might recreate map too often?
      // No, `locations` is in dep array.
      // To properly handle updates, we should clear markers.
      // However, iterating to remove markers requires storing them.
      // A simpler approach for this component: recreate map if region changes.
      // We can do that by adding `region` to the key of the component in the parent, or by cleaning up map in useEffect.

      // Actually, the useEffect return function cleans up the map: map.current.remove().
      // So anytime `locations` or `region` changes, we destroy and recreate. 
      // That is fine for this use case, ensures clean state.

      locations.forEach((feature) => {
        if (!map.current) return;

        const { name, trips, description, emoji } = feature.properties;
        const coords = feature.geometry.coordinates;
        
        // Extract city name from parentheses for Wikipedia lookup
        // e.g., "Quang Ninh (Ha Long, Yen Tu)" -> "Ha Long"
        // e.g., "Hai Phong (Cat Ba)" -> "Cat Ba"
        let wikiCityName = name;
        const parenthesesMatch = name.match(/\(([^)]+)\)/);
        if (parenthesesMatch) {
          // If multiple cities in parentheses (e.g., "Ha Long, Yen Tu"), take the first one
          const citiesInParentheses = parenthesesMatch[1].split(',')[0].trim();
          wikiCityName = citiesInParentheses;
        }

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'travel-marker';
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = 'hsl(217, 91%, 60%)';
        el.style.border = '3px solid hsl(0, 0%, 100%)';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 0 16px rgba(59, 130, 246, 0.7), 0 2px 8px rgba(0,0,0,0.3)';
        el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Hover effect using box-shadow instead of transform to avoid conflict with Mapbox positioning
        el.onmouseenter = () => {
          el.style.boxShadow = '0 0 24px rgba(59, 130, 246, 1), 0 4px 16px rgba(0,0,0,0.5)';
          el.style.width = '18px';
          el.style.height = '18px';
          el.style.zIndex = '1000';
        };
        el.onmouseleave = () => {
          el.style.boxShadow = '0 0 16px rgba(59, 130, 246, 0.7), 0 2px 8px rgba(0,0,0,0.3)';
          el.style.width = '14px';
          el.style.height = '14px';
          el.style.zIndex = '';
        };

        // Create popup with Wikipedia content (loads on marker creation)
        const popup = new mapboxgl.Popup({
          offset: 20,
          closeButton: true,
          className: 'travel-popup wiki-popup',
          maxWidth: '360px',
        }).setHTML(
          `<div style="
            padding: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            background: rgba(17, 24, 39, 0.98);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            color: white;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          ">
            <div style="
              padding: 12px;
              background: rgba(30, 41, 59, 0.5);
              border-radius: 8px;
              font-size: 12px;
              line-height: 1.7;
              color: rgb(203, 213, 225);
            ">
              <div style="text-align: center; padding: 16px; color: rgb(148, 163, 184);">
                📖 Loading info...
              </div>
            </div>
          </div>`
        );

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(coords)
          .setPopup(popup)
          .addTo(map.current);
        
        // Fetch Wikipedia data when popup opens
        popup.on('open', async () => {
          try {
            const res = await fetch(`/api/wikipedia?city=${encodeURIComponent(wikiCityName)}`);
            const data = await res.json();
            
            if (data.success && data.data) {
              popup.setHTML(
                `<div style="
                  padding: 14px;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  font-size: 13px;
                  background: rgba(17, 24, 39, 0.98);
                  backdrop-filter: blur(8px);
                  border-radius: 12px;
                  color: white;
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                ">
                  <div style="
                    padding: 12px;
                    background: rgba(30, 41, 59, 0.5);
                    border-radius: 8px;
                    font-size: 12px;
                    line-height: 1.7;
                    color: rgb(203, 213, 225);
                  ">
                    ${data.data.extract}
                  </div>
                  
                  <div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <a 
                      href="${data.data.url}" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style="
                        display: inline-flex;
                        align-items: center;
                        gap: 4px;
                        color: rgb(96, 165, 250);
                        text-decoration: none;
                        font-size: 11px;
                        font-weight: 500;
                        transition: color 0.2s;
                      "
                      onmouseover="this.style.color='rgb(147, 197, 253)'"
                      onmouseout="this.style.color='rgb(96, 165, 250)'"
                    >
                      Read more →
                    </a>
                  </div>
                </div>`
              );
            } else {
              popup.setHTML(
                `<div style="
                  padding: 14px;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  font-size: 13px;
                  background: rgba(17, 24, 39, 0.98);
                  backdrop-filter: blur(8px);
                  border-radius: 12px;
                  color: white;
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                ">
                  <div style="
                    padding: 12px;
                    background: rgba(30, 41, 59, 0.5);
                    border-radius: 8px;
                    font-size: 12px;
                    color: rgb(248, 113, 113);
                    text-align: center;
                  ">
                    No Wikipedia info available
                  </div>
                </div>`
              );
            }
          } catch (error) {
            popup.setHTML(
              `<div style="
                padding: 14px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                background: rgba(17, 24, 39, 0.98);
                backdrop-filter: blur(8px);
                border-radius: 12px;
                color: white;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
              ">
                <div style="
                  padding: 12px;
                  background: rgba(30, 41, 59, 0.5);
                  border-radius: 8px;
                  font-size: 12px;
                  color: rgb(248, 113, 113);
                  text-align: center;
                ">
                  Failed to load info
                </div>
              </div>`
            );
          }
        });
      });

    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map');
    }

    return () => {
      if (map.current) {
        console.log('TravelMap: Cleanup - removing map');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obs = (map.current as any)._themeObserver as MutationObserver | undefined;
        if (obs) obs.disconnect();
        map.current.remove();
        map.current = null;
      }
    };
  }, [isMounted, (JSON.stringify(locations)), region]); // Using stringified locations to avoid loop if object ref changes

  if (error) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center bg-bg-subtle border border-border">
        <div className="text-center p-8 max-w-md">
          <p className="text-base font-medium mb-2 text-fg">Map unavailable</p>
          <p className="text-sm text-fg-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full min-h-[300px] w-full bg-bg-subtle animate-pulse flex items-center justify-center">
        <div className="text-fg-muted text-sm">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full"
      />

    </div>
  );
}
