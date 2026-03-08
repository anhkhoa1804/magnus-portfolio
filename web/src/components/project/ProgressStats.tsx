'use client';

import { useEffect, useState } from 'react';
import { getSolvedCount, getDailyStreak, getRecentSubmissions } from '@/lib/progress';

export default function ProgressStats() {
  const [solvedCount, setSolvedCount] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSolvedCount(getSolvedCount());
    setDailyStreak(getDailyStreak());
    setRecentSubmissions(getRecentSubmissions(5));
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
          <div className="h-16 bg-accent rounded"></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
          <div className="h-16 bg-accent rounded"></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
          <div className="h-16 bg-accent rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Solved Problems */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">✅</div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {solvedCount}
            </div>
            <div className="text-sm text-fg-muted">Problems Solved</div>
          </div>
        </div>
      </div>

      {/* Daily Streak */}
      <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🔥</div>
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {dailyStreak}
            </div>
            <div className="text-sm text-fg-muted">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📊</div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {recentSubmissions.length > 0
                ? Math.round(
                    (recentSubmissions.filter((s) => s.status === 'Accepted').length /
                      recentSubmissions.length) *
                      100
                  )
                : 0}
              %
            </div>
            <div className="text-sm text-fg-muted">Recent Success</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentSubmissions.length > 0 && (
        <div className="col-span-full bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>📜</span>
            Recent Submissions
          </h3>
          <div className="space-y-2">
            {recentSubmissions.map((submission, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm py-2 px-3 bg-accent rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      submission.status === 'Accepted'
                        ? 'bg-green-500'
                        : submission.status === 'Wrong Answer'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  ></span>
                  <span className="font-medium">Problem #{submission.problemId}</span>
                  <span className="text-xs text-fg-muted">{submission.language}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold ${
                      submission.status === 'Accepted'
                        ? 'text-green-600 dark:text-green-400'
                        : submission.status === 'Wrong Answer'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {submission.status}
                  </span>
                  {submission.runtime && (
                    <span className="text-xs text-fg-muted">{submission.runtime}ms</span>
                  )}
                  <span className="text-xs text-fg-muted">
                    {new Date(submission.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
