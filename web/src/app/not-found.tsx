import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container max-w-5xl flex flex-col items-center justify-center min-h-[60vh] text-center py-24 gap-6">
      {/* Hand-drawn style circle */}
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-brand/40">
        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round"/>
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="26" fill="currentColor" fontFamily="monospace" fontWeight="600">404</text>
      </svg>
      <div className="space-y-3">
        <h1 className="text-5xl font-heading font-bold text-fg">Page not found</h1>
        <p className="text-fg-muted max-w-sm">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      </div>
      <div className="flex gap-3">
        <Link href="/" className="inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-85 transition-opacity">
          Go home
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
        </Link>
        <Link href="/project" className="inline-flex items-center gap-2 border border-border/60 text-fg-muted px-5 py-2.5 rounded-full text-sm hover:text-fg transition-colors">
          View projects
        </Link>
      </div>
    </div>
  );
}
