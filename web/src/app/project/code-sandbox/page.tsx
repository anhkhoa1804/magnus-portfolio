import { Suspense } from 'react';
import CodeSandboxClient from '@/components/project/CodeSandboxClient';

export const metadata = {
  title: 'Code Sandbox — Magnus',
  description: 'Execute code in a secure environment. Daily LeetCode challenges and practice mode.',
};

export default function CodeSandboxPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-fg-muted/50 mb-1">Full-stack · Daily</p>
        <h1 className="text-2xl font-heading font-semibold">Code Sandbox</h1>
      </div>
      <Suspense fallback={<div className="text-xs text-fg-muted/50">Loading…</div>}>
        <CodeSandboxClient />
      </Suspense>
    </div>
  );
}
