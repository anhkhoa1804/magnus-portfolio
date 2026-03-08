'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SpotifyCallbackContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authCode = searchParams.get('code');
    const authError = searchParams.get('error');

    if (authError) {
      setError(authError);
    } else if (authCode) {
      setCode(authCode);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
        {error ? (
          <div>
            <div className="text-6xl mb-6 text-center">❌</div>
            <h1 className="text-3xl font-bold text-center mb-4">Authorization Failed</h1>
            <p className="text-fg-muted text-center mb-6">
              Error: {error}
            </p>
            <div className="text-center">
              <a
                href="/spotify-auth"
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all inline-block"
              >
                ← Try Again
              </a>
            </div>
          </div>
        ) : code ? (
          <div>
            <div className="text-6xl mb-6 text-center">✅</div>
            <h1 className="text-3xl font-bold text-center mb-4">Authorization Successful!</h1>
            <p className="text-fg-muted text-center mb-6">
              Copy the authorization code below and paste it in the previous window.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Authorization Code:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  readOnly
                  aria-label="Authorization code from Spotify"
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    alert('Copied to clipboard!');
                  }}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">📝 Next Steps:</h3>
              <ol className="text-sm text-fg-muted space-y-1 list-decimal list-inside">
                <li>Copy the code above</li>
                <li>Go back to the authorization page</li>
                <li>Paste the code in Step 2</li>
                <li>Click "Get Refresh Token" in Step 3</li>
              </ol>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-fg-muted mb-3">You can close this window after copying the code</p>
              <button
                onClick={() => window.close()}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-6xl mb-6 text-center">⏳</div>
            <h1 className="text-3xl font-bold text-center mb-4">Processing...</h1>
            <p className="text-fg-muted text-center">
              Please wait while we process your authorization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpotifyCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-fg-muted">Loading...</p>
        </div>
      </div>
    }>
      <SpotifyCallbackContent />
    </Suspense>
  );
}
