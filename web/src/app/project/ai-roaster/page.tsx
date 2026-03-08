export const metadata = {
  title: 'AI Roaster',
};
import { Suspense } from 'react';
import { AIRoaster } from '@/components/project/AIRoaster';

export default function AIRoasterPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-fg-muted/50 mb-1">AI · Vision</p>
        <h1 className="text-2xl font-heading font-semibold">AI Roaster</h1>
      </div>
      <Suspense fallback={<div className="text-xs text-fg-muted/50">Loading…</div>}>
        <AIRoaster />
      </Suspense>
    </div>
  );
}
