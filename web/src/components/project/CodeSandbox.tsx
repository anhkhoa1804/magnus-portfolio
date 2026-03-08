'use client';

import { useState, useEffect } from 'react';
import { Problem } from '@/data/codingProblems';
import { recordSubmission, isProblemSolved } from '@/lib/progress';

interface Props {
  problem: Problem;
}

interface ExecutionResult {
  success: boolean;
  output?: string;
  stderr?: string;
  compile_output?: string;
  status?: string;
  time?: string;
  memory?: number;
  error?: string;
}

export default function CodeSandbox({ problem }: Props) {
  const [language, setLanguage] = useState<'python' | 'javascript' | 'cpp' | 'java'>('python');
  const [code, setCode] = useState(problem.starterCode[language]);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    setIsSolved(isProblemSolved(problem.id));
  }, [problem.id]);

  const handleLanguageChange = (newLang: typeof language) => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang]);
    setResult(null);
  };

  const handleRunCode = async () => {
    setExecuting(true);
    setResult(null);

    try {
      const response = await fetch('/api/code-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          stdin: '', // Could add custom input later
        }),
      });

      const data = await response.json();
      setResult(data);
      
      // Record submission for progress tracking
      if (data.success && data.status) {
        recordSubmission({
          problemId: problem.id,
          timestamp: Date.now(),
          language,
          status: data.status,
          runtime: data.time,
          memory: data.memory,
        });
        
        // Update solved status if accepted
        if (data.status === 'Accepted') {
          setIsSolved(true);
        }
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Execution failed',
      });
    } finally {
      setExecuting(false);
    }
  };

  const languageConfig = {
    python: { name: 'Python', icon: '', color: 'blue' },
    javascript: { name: 'JS', icon: '', color: 'yellow' },
    cpp: { name: 'C++', icon: '', color: 'purple' },
    java: { name: 'Java', icon: '', color: 'red' },
  };

  return (
    <div className="space-y-4">
      {/* Problem Description */}
      <div className="border border-border rounded-xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-lg font-semibold">{problem.title}</h2>
          {isSolved && (
            <span className="text-xs text-fg-muted border border-border px-2 py-0.5 rounded">
              Solved
            </span>
          )}
          <span className="text-xs text-fg-muted border border-border px-2 py-0.5 rounded">
            {problem.difficulty}
          </span>
          <span className="text-xs text-fg-muted">{problem.category}</span>
        </div>

        <p className="text-sm text-fg leading-relaxed whitespace-pre-line">
          {problem.description}
        </p>

        <div className="space-y-3">
          {problem.examples.map((example, idx) => (
            <div key={idx} className="p-3 bg-bg-subtle rounded-lg border border-border text-sm font-mono">
              <div>Input: <span className="text-fg">{example.input}</span></div>
              <div>Output: <span className="text-fg">{example.output}</span></div>
              {example.explanation && (
                <div className="mt-1 text-fg-muted text-xs">{example.explanation}</div>
              )}
            </div>
          ))}
        </div>

        <ul className="text-xs text-fg-muted space-y-0.5">
          {problem.constraints.map((c, idx) => (
            <li key={idx}>• {c}</li>
          ))}
        </ul>
      </div>

      {/* Code Editor */}
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="bg-bg-subtle border-b border-border px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex gap-1">
            {Object.entries(languageConfig).map(([lang, config]) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang as typeof language)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  language === lang
                    ? 'bg-fg text-bg'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {config.name}
              </button>
            ))}
          </div>
          <button
            onClick={handleRunCode}
            disabled={executing}
            className="px-4 py-1.5 bg-fg text-bg disabled:opacity-40 text-xs font-medium rounded transition-colors"
          >
            {executing ? 'Running...' : 'Run'}
          </button>
        </div>

        {/* Editor */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-72 p-4 bg-bg-subtle text-fg font-mono text-sm leading-relaxed resize-none focus:outline-none"
          spellCheck={false}
          placeholder="Write your code here..."
        />
      </div>

      {/* Result */}
      {result !== null && (
        <div className="border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${result.status === 'Accepted' ? 'text-fg' : 'text-fg-muted'}`}>
              {result.success ? result.status : 'Execution Failed'}
            </span>
            {result.time && (
              <span className="text-xs text-fg-muted">{result.time}s</span>
            )}
          </div>

          {result.output && (
            <pre className="p-3 bg-bg-subtle rounded border border-border text-xs font-mono overflow-auto">
              {result.output}
            </pre>
          )}

          {(result.stderr || result.compile_output) && (
            <pre className="p-3 bg-bg-subtle rounded border border-border text-xs font-mono overflow-auto text-fg-muted">
              {result.stderr || result.compile_output}
            </pre>
          )}

          {!result.success && result.error && (
            <p className="text-sm text-fg-muted">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

