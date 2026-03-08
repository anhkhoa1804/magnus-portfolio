export const metadata = {
  title: 'Price Predictions',
};
import { Suspense } from 'react';
import { StocksDashboard } from '@/components/project/StocksDashboard';

export default function StocksPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-fg-muted/50 mb-1">Data · Finance</p>
        <h1 className="text-2xl font-heading font-semibold">Price Predictions</h1>
      </div>
      <Suspense fallback={<div className="text-xs text-fg-muted/50">Loading…</div>}>
        <StocksDashboard />
      </Suspense>
    </div>
  );
}
