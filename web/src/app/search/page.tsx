import { SearchClient } from '@/components/site/SearchClient';

export default function SearchPage() {
  return (
    <div className="container py-12 magnus-fade-in">
      <div className="mx-auto grid max-w-3xl gap-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
          <p className="mt-3 text-fg-muted">Search across title/summary/content of MDX posts.</p>
        </div>

        <SearchClient />
      </div>
    </div>
  );
}
