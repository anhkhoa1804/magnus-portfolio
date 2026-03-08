'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', textAlign:'center', padding:'4rem 1rem', gap:'1.5rem', fontFamily:'system-ui' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round"/>
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fill="#3b82f6" fontFamily="monospace" fontWeight="600">500</text>
          </svg>
          <h1 style={{ fontSize:'2.5rem', fontWeight:700, margin:0 }}>Something went wrong</h1>
          <p style={{ color:'#888', maxWidth:'24rem', margin:0 }}>An unexpected error occurred on the server. Please try again.</p>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            <button onClick={reset} style={{ background:'#3b82f6', color:'#fff', border:'none', borderRadius:'9999px', padding:'0.625rem 1.25rem', fontSize:'0.875rem', cursor:'pointer', fontWeight:500 }}>
              Try again
            </button>
            <a href="/" style={{ border:'1px solid #ddd', borderRadius:'9999px', padding:'0.625rem 1.25rem', fontSize:'0.875rem', color:'#555', textDecoration:'none' }}>
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
