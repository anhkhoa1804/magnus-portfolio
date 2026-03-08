'use client';

import * as React from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Place = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  note?: string;
};

const PLACES: Place[] = [
  { id: 'hanoi', name: 'Hanoi', lat: 21.0278, lng: 105.8342, note: 'Home base.' },
  { id: 'hcmc', name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, note: 'Fast-paced energy.' },
  { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lng: 139.6503, note: 'Craft + detail.' },
];

export function FootprintsMap() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<import('mapbox-gl').Map | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [active, setActive] = React.useState<Place>(PLACES[0]);

  React.useEffect(() => {
    if (!token) return;
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const accessToken = token;

    let cancelled = false;

    async function init() {
      type MapboxGL = {
        accessToken: string;
        Map: typeof import('mapbox-gl').Map;
        Marker: typeof import('mapbox-gl').Marker;
        NavigationControl: typeof import('mapbox-gl').NavigationControl;
      };

      const mapboxgl = (await import('mapbox-gl')).default as unknown as MapboxGL;
      if (cancelled) return;

      const initial = PLACES[0];

      mapboxgl.accessToken = accessToken;
      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [initial.lng, initial.lat],
        zoom: 3,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      for (const p of PLACES) {
        const el = document.createElement('div');
        el.className = 'magnus-map-pin';
        el.title = p.name;
        el.addEventListener('click', () => {
          setActive(p);
          map.flyTo({ center: [p.lng, p.lat], zoom: 6, essential: true });
        });
        new mapboxgl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
      }

      mapRef.current = map;
    }

    void init();

    return () => {
      cancelled = true;
      try {
        mapRef.current?.remove?.();
      } catch {
        // ignore
      }
      mapRef.current = null;
    };
  }, [token]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2 overflow-hidden">
        <CardBody className="p-0">
          {!token ? (
            <div className="p-6">
              <div className="text-sm text-fg-muted">Mapbox not configured</div>
              <div className="mt-2 text-lg font-medium">Set NEXT_PUBLIC_MAPBOX_TOKEN</div>
              <p className="mt-2 text-sm text-fg-muted">
                This module uses Mapbox GL JS. Add a public token in `apps/web/.env.local`.
              </p>
            </div>
          ) : (
            <div ref={containerRef} className="h-[520px] w-full" />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-sm text-fg-muted">Footprints</div>
          <div className="mt-2 text-lg font-medium">Places</div>
          <div className="mt-4 grid gap-2">
            {PLACES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setActive(p);
                  mapRef.current?.flyTo?.({ center: [p.lng, p.lat], zoom: 6, essential: true });
                }}
                className={`rounded-xl border border-border px-3 py-2 text-left text-sm transition-colors ${
                  active.id === p.id ? 'bg-bg-subtle text-fg' : 'bg-card text-fg-muted hover:text-fg'
                }`}
              >
                <div className="font-medium text-fg">{p.name}</div>
                {p.note ? <div className="text-xs text-fg-muted">{p.note}</div> : null}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                mapRef.current?.flyTo?.({ center: [active.lng, active.lat], zoom: 6, essential: true });
              }}
            >
              Fly to active →
            </Button>
          </div>

          <div className="mt-4 text-xs text-fg-muted">
            Pins are clickable. This is a minimal scaffold — you can load real data later.
          </div>
        </CardBody>
      </Card>

      <style jsx global>{`
        .magnus-map-pin {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.08);
          cursor: pointer;
        }
        .magnus-map-pin:hover {
          background: rgba(255, 255, 255, 0.35);
        }
      `}</style>
    </div>
  );
}
