export const metadata = {
  title: 'IELTS Examiner',
};
import { Suspense } from 'react';
import { IeltsExaminer } from '@/components/project/IeltsExaminer';

export default function IeltsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-fg-muted/50 mb-1">AI · NLP</p>
        <h1 className="text-2xl font-heading font-semibold">IELTS Examiner</h1>
      </div>
      <Suspense fallback={<div className="text-xs text-fg-muted/50">Loading…</div>}>
        <IeltsExaminer />
      </Suspense>
    </div>
  );
}
