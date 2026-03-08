"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ApiStatus {
  name: string;
  endpoint: string;
  status: "idle" | "loading" | "success" | "error";
  responseTime?: number;
  message?: string;
  data?: any;
}

export default function ApiCheckPage() {
  const [apis, setApis] = useState<ApiStatus[]>([
    // Next.js APIs (actual routes that exist)
    { name: "Spotify Now Playing", endpoint: "/api/spotify/now-playing", status: "idle" },
    { name: "GitHub Activity", endpoint: "/api/github/activity", status: "idle" },
    { name: "Discord Presence", endpoint: "/api/discord/presence", status: "idle" },
    { name: "News Headlines", endpoint: "/api/news/top-headlines", status: "idle" },
    { name: "WakaTime Stats", endpoint: "/api/wakatime/stats", status: "idle" },
    { name: "Weather", endpoint: "/api/weather", status: "idle" },
    { name: "Unsplash Photos", endpoint: "/api/media/unsplash", status: "idle" },
    { name: "Quote", endpoint: "/api/quote", status: "idle" },
    { name: "Stocks Quote", endpoint: "/api/stocks/quote", status: "idle" },
    { name: "Crypto Prices", endpoint: "/api/fintech/crypto", status: "idle" },
    { name: "Fear & Greed Index", endpoint: "/api/fintech/fear-greed", status: "idle" },
    { name: "Contact Form", endpoint: "/api/contact", status: "idle" },
    
    // AI APIs (proxied through Next.js to HuggingFace Space)
    { name: "German News AI", endpoint: "/api/german-news", status: "idle" },
    { name: "Price Prediction AI", endpoint: "/api/predict-price", status: "idle" },
    { name: "Object Detection AI", endpoint: "/api/detect-objects", status: "idle" },
    { name: "Chat AI", endpoint: "/api/chat", status: "idle" },
  ]);

  const [testing, setTesting] = useState(false);

  const testApi = async (api: ApiStatus) => {
    const startTime = Date.now();
    
    try {
      // Special handling for different API types
      let response;
      
      // AI APIs (POST requests)
      if (api.name === "German News AI") {
        response = await fetch(api.endpoint, {
          method: "GET", // German News uses GET
        });
      } else if (api.name === "Price Prediction AI") {
        response = await fetch(api.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticker: "BTC-USD", days: 7, historical_period: "1mo" }),
        });
      } else if (api.name === "Chat AI") {
        response = await fetch(api.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "What is Magnus?" }),
        });
      } else if (api.name === "Object Detection AI") {
        // Object Detection requires file upload, skip for now
        return {
          ...api,
          status: "idle" as const,
          message: "Requires image upload (test manually)",
        };
      } else if (api.name === "Contact Form") {
        // Contact form needs POST with min 10 char message
        response = await fetch(api.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Test User", email: "test@example.com", message: "This is a test message for API check." }),
        });
      } else if (api.name === "Stocks Quote") {
        // Stocks needs symbol parameter (not ticker)
        response = await fetch(`${api.endpoint}?symbol=AAPL`);
      } else if (api.name === "Unsplash Photos") {
        // Unsplash needs query
        response = await fetch(`${api.endpoint}?query=nature&count=1`);
      } else {
        // Standard GET requests
        response = await fetch(api.endpoint);
      }

      const responseTime = Date.now() - startTime;
      const data = await response.json();

      if (response.ok) {
        return {
          ...api,
          status: "success" as const,
          responseTime,
          message: "OK",
          data,
        };
      } else {
        return {
          ...api,
          status: "error" as const,
          responseTime,
          message: data.message || data.detail || "Request failed",
        };
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        ...api,
        status: "error" as const,
        responseTime,
        message: error.message || "Network error",
      };
    }
  };

  const testAllApis = async () => {
    setTesting(true);
    
    // Reset all statuses
    setApis((prev) =>
      prev.map((api) => ({ ...api, status: "loading" as const }))
    );

    // Test all APIs in parallel (batches of 4 to avoid overwhelming)
    const batchSize = 4;
    for (let i = 0; i < apis.length; i += batchSize) {
      const batch = apis.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(testApi));
      
      setApis((prev) => {
        const updated = [...prev];
        results.forEach((result) => {
          const index = updated.findIndex((a) => a.endpoint === result.endpoint);
          if (index !== -1) {
            updated[index] = result;
          }
        });
        return updated;
      });
      
      // Small delay between batches
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setTesting(false);
  };

  const getStatusIcon = (status: ApiStatus["status"]) => {
    switch (status) {
      case "idle":
        return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
      case "loading":
        return (
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
        );
      case "success":
        return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
      case "error":
        return <div className="w-3 h-3 rounded-full bg-red-500"></div>;
    }
  };

  const getStatusText = (status: ApiStatus["status"]) => {
    switch (status) {
      case "idle":
        return "Not tested";
      case "loading":
        return "Testing...";
      case "success":
        return "✓ Working";
      case "error":
        return "✗ Failed";
    }
  };

  const successCount = apis.filter((a) => a.status === "success").length;
  const errorCount = apis.filter((a) => a.status === "error").length;
  const avgResponseTime =
    apis.filter((a) => a.responseTime).reduce((sum, a) => sum + (a.responseTime || 0), 0) /
    apis.filter((a) => a.responseTime).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            API Status Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Check the health of all Magnus APIs - {apis.length} endpoints monitored
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">{successCount}</div>
            <div className="text-slate-400 text-sm mt-1">Success</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-red-400">{errorCount}</div>
            <div className="text-slate-400 text-sm mt-1">Errors</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400">
              {avgResponseTime > 0 ? `${avgResponseTime.toFixed(0)}ms` : "-"}
            </div>
            <div className="text-slate-400 text-sm mt-1">Avg Response</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400">{apis.length}</div>
            <div className="text-slate-400 text-sm mt-1">Total APIs</div>
          </div>
        </div>

        {/* Test All Button */}
        <div className="mb-8">
          <button
            onClick={testAllApis}
            disabled={testing}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? "Testing..." : "Test All APIs"}
          </button>
        </div>

        {/* API List */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold mb-4 text-slate-300">
            All APIs ({apis.length})
          </h2>
          {apis.map((api) => (
              <motion.div
                key={api.endpoint}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(api.status)}
                    <div>
                      <div className="font-semibold text-lg">{api.name}</div>
                      <div className="text-sm text-slate-400 font-mono">
                        {api.endpoint}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{getStatusText(api.status)}</div>
                    {api.responseTime && (
                      <div className="text-sm text-slate-400">
                        {api.responseTime}ms
                      </div>
                    )}
                  </div>
                </div>
                {api.message && (
                  <div className="mt-3 text-sm text-slate-400 border-t border-slate-700 pt-3">
                    {api.message}
                  </div>
                )}
              </motion.div>
            ))}
        </div>

        {/* Note */}
        <div className="mt-12 p-6 bg-blue-950/20 border border-blue-800/30 rounded-xl">
          <h3 className="font-semibold text-blue-400 mb-2">📝 Note</h3>
          <p className="text-slate-400 text-sm">
            All APIs are proxied through Next.js API routes. AI endpoints communicate with HuggingFace Space backend.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Backend URL: <code className="bg-slate-800 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_SITE_URL}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
