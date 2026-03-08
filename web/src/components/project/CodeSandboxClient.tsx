'use client';

import { useState, useEffect } from 'react';
import CodeSandbox from '@/components/project/CodeSandbox';
import { CODING_PROBLEMS, Problem } from '@/data/codingProblems';

export default function CodeSandboxClient() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDailyChallenge() {
      try {
        const res = await fetch('/api/daily-challenge');
        const data = await res.json();
        if (data.success && data.challenge) {
          // Map the API response to the Problem type
          const challenge = data.challenge;
          const matched = CODING_PROBLEMS.find(
            (p) => p.slug === challenge.slug || p.id === String(challenge.id)
          );
          if (matched) {
            setProblem(matched);
          } else {
            // Build a minimal Problem from the API data
            setProblem({
              id: String(challenge.id || 'daily'),
              title: challenge.title || 'Daily Challenge',
              slug: challenge.slug || 'daily',
              difficulty: challenge.difficulty || 'Medium',
              category: challenge.category || 'Algorithms',
              description: challenge.description || 'Solve the daily challenge.',
              examples: [],
              constraints: [],
              starterCode: challenge.starterCode || {
                python: '# Write your solution here\n',
                javascript: '// Write your solution here\n',
                cpp: '// Write your solution here\n',
                java: '// Write your solution here\n',
              },
              testCases: [],
            });
          }
        } else {
          // Fallback to first problem in local list
          setProblem(CODING_PROBLEMS[0]);
        }
      } catch {
        setProblem(CODING_PROBLEMS[0]);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDailyChallenge();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-fg-muted text-lg">Loading daily challenge...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center text-red-500 py-12">
        Failed to load problem. Please refresh.
      </div>
    );
  }

  return <CodeSandbox problem={problem} />;
}
