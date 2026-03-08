'use client';

import { TravelMap } from './TravelMap';

export function MapSection({ region }: { region: 'vietnam' | 'europe' | 'world' }) {
  return <TravelMap region={region} />;
}
