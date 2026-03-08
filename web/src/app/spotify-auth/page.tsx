'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SpotifyAuthPage() {
  const [step, setStep] = useState<'start' | 'waiting' | 'exchange'>('start');
  const [authCode, setAuthCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "4855354a718544958a8001b0620164c2";
  const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "http://localhost:3000/spotify-callback";

  // Log for debugging
  useEffect(() => {
    console.log('🔍 Spotify OAuth Debug Info:');
    console.log('CLIENT_ID:', CLIENT_ID);
    console.log('REDIRECT_URI from env:', process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI);
    console.log('REDIRECT_URI being used:', REDIRECT_URI);
  }, []);

  const startAuth = () => {
    const scopes = [
      'user-library-read',
      'user-read-recently-played',
      'user-read-playback-state',
      'user-top-read',
    ].join('%20');

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes}`;
    
    console.log('🔗 Opening Spotify Auth URL:', authUrl);
    console.log('📋 Copy this EXACT redirect URI to Spotify Dashboard:');
    console.log('   ', REDIRECT_URI);
    
    window.open(authUrl, '_blank', 'width=600,height=800');
    setStep('waiting');
  };

  const exchangeCode = async () => {
    if (!authCode) {
      setError('Please paste the authorization code');
      return;
    }

    setStep('exchange');
    setError(null);

    try {
      // Call server-side API to exchange code (keeps CLIENT_SECRET secure)
      const response = await fetch('/api/spotify/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: authCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Token exchange failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
      setStep('waiting');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20 py-16">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-7xl">🎵</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Spotify OAuth
            </h1>
          </div>
          <p className="text-xl text-fg-muted">
            Get your new Spotify refresh token in 3 easy steps
          </p>
        </motion.div>

        {/* Important Setup Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl"
        >
          <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
            <span>⚠️</span> First Time? Configure Redirect URI
          </h3>
          <div className="text-sm text-amber-700/80 dark:text-amber-400/80 space-y-2">
            <p>If you get <strong>"INVALID_CLIENT: Invalid redirect URI"</strong> error:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go to <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener" className="underline font-semibold">Spotify Developer Dashboard</a></li>
              <li>Click your app → <strong>Edit Settings</strong></li>
              <li>Under "Redirect URIs", add: <code className="bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded font-mono text-xs">{REDIRECT_URI}</code></li>
              <li>Click <strong>Save</strong> and wait 30 seconds</li>
            </ol>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Step 1: Authorization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">Start Authorization</h3>
                <p className="text-fg-muted mb-4">
                  Click the button below to open Spotify's authorization page in a new window.
                </p>
                <button
                  onClick={startAuth}
                  disabled={step !== 'start'}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔓 Open Spotify Authorization
                </button>
                {step !== 'start' && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ Authorization window opened
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Step 2: Get Code */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 ${
              step === 'start' ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">Copy Authorization Code</h3>
                <p className="text-fg-muted mb-4">
                  After authorizing, you'll be redirected to a callback page. Copy the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">code</code> parameter from the URL.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm">
                    <strong>Example URL:</strong>
                    <div className="mt-1 font-mono text-xs break-all text-blue-600 dark:text-blue-400">
                      http://localhost:3000/spotify-callback?code=<span className="bg-yellow-200 dark:bg-yellow-900">AQBx1j...</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="Paste authorization code here..."
                    aria-label="Spotify authorization code"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3: Exchange for Token */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 ${
              !authCode ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">Get Refresh Token</h3>
                <p className="text-fg-muted mb-4">
                  Exchange the authorization code for a refresh token.
                </p>
                <button
                  onClick={exchangeCode}
                  disabled={!authCode || step === 'exchange'}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 'exchange' ? '🔄 Exchanging...' : '🔑 Get Refresh Token'}
                </button>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">❌ {error}</p>
                  </div>
                )}

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-3"
                  >
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-green-600 dark:text-green-400 font-semibold mb-2">✅ Success!</p>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs font-semibold block mb-1">Refresh Token:</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={result.refresh_token}
                              readOnly
                              aria-label="Spotify refresh token"
                              className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded font-mono text-xs"
                            />
                            <button
                              onClick={() => copyToClipboard(result.refresh_token)}
                              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                              📋 Copy
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1">Access Token (expires in {result.expires_in}s):</label>
                          <input
                            type="text"
                            value={result.access_token}
                            readOnly
                            aria-label="Spotify access token"
                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <h4 className="font-semibold mb-2 text-sm">📝 Next Steps:</h4>
                      <ol className="text-xs text-fg-muted space-y-1 list-decimal list-inside">
                        <li>Copy the refresh token above</li>
                        <li>Open <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">.env.local</code></li>
                        <li>Update <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">SPOTIFY_REFRESH_TOKEN=...</code></li>
                        <li>Restart your dev server</li>
                      </ol>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
          <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">🔒 Security Note</h3>
          <p className="text-sm text-amber-700/80 dark:text-amber-400/80">
            Your refresh token never expires unless revoked. Keep it secure and never commit it to Git. 
            The access token expires in 1 hour but will be automatically refreshed by your API.
          </p>
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-xl">
          <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
            <span>🔍</span> Debug Information
          </h3>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex flex-col gap-1">
              <span className="text-fg-muted text-xs">Client ID:</span>
              <code className="bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-700 text-xs break-all">
                {CLIENT_ID}
              </code>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-fg-muted text-xs">Redirect URI being used:</span>
              <code className="bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-700 text-xs break-all">
                {REDIRECT_URI}
              </code>
            </div>
            <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-300">
              <strong>⚡ Important:</strong> This EXACT URL must be in your Spotify Dashboard's Redirect URIs list.
              <br />
              Go to: <a href="https://developer.spotify.com/dashboard/4855354a718544958a8001b0620164c2/settings" target="_blank" rel="noopener" className="underline font-semibold">Spotify App Settings</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
