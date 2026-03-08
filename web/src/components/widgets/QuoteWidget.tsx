'use client';

import { useEffect, useState } from 'react';

type Quote = {
  text: string;
  author: string;
};

function quoteSize(text: string) {
  const len = text.length;
  if (len < 80) return 'text-2xl md:text-3xl';
  if (len < 140) return 'text-xl md:text-2xl';
  return 'text-base md:text-lg';
}

export function QuoteWidget({ compact }: { compact?: boolean }) {
  const [quote, setQuote] = useState<Quote>({ 
    text: "Build tools that make you smarter, not busier.", 
    author: "Magnus" 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await fetch('/api/quote');
        const data = await response.json();
        
        if (data.success && data.data) {
          setQuote({
            text: data.data.text,
            author: data.data.author
          });
        }
      } catch (error) {
        console.error('Failed to fetch quote:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuote();
  }, []);

  if (loading) {
    return (
       <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-bg-subtle rounded w-3/4"></div>
        <div className="h-6 bg-bg-subtle rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <blockquote className={`flex-1 font-medium leading-snug text-fg text-balance ${quoteSize(quote.text)}`}>
        {quote.text}
      </blockquote>
      <div className="flex items-center gap-3 pt-5">
        <div className="h-px w-8 bg-fg/30" />
        <cite className="text-xs uppercase tracking-widest text-fg-muted not-italic">
          {quote.author}
        </cite>
      </div>
    </div>
  );
}
