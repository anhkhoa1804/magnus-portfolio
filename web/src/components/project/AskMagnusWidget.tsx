'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

type AskResponse = {
  success: boolean;
  data?: {
    configured: boolean;
    answer: string;
    sources?: Array<{ title: string; href: string; summary: string }>;
  };
  message?: string;
};

const SUGGESTIONS = [
  'What is this site about?',
  'What are your views on AI safety?',
  'Explain BFF patterns for API keys.',
  'What projects are you working on?',
];

async function postJson<T>(url: string, body: unknown): Promise<{ ok: boolean; json: T | null }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => null)) as T | null;
  return { ok: res.ok, json };
}

export function AskMagnusWidget({ initialQuestion }: { initialQuestion?: string }) {
  const [question, setQuestion] = React.useState(initialQuestion ?? '');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [answer, setAnswer] = React.useState<AskResponse['data'] | null>(null);

  async function runAsk(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;

    setStatus('loading');
    setAnswer(null);

    const { ok, json } = await postJson<AskResponse>('/api/brain/ask', { question: trimmed });
    if (!ok || !json?.success) {
      setStatus('error');
      setAnswer({ configured: false, answer: json?.message ?? 'Request failed' });
      return;
    }

    setStatus('done');
    setAnswer(json.data ?? null);
  }

  const disabled = status === 'loading';

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-border bg-bg-subtle p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-fg-muted">Ask Magnus</div>
          <div className="text-xs text-fg-muted">RAG-lite • sources</div>
        </div>

        <div className="relative mt-3">
          {question.length === 0 ? (
            <div className="pointer-events-none absolute left-3 top-3 text-sm text-fg-muted">
              <span className="magnus-caret">Ask a question</span>
            </div>
          ) : null}
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[76px] w-full resize-none rounded-xl border border-border bg-bg px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-border/70"
            aria-label="Ask Magnus"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQuestion(s);
                void runAsk(s);
              }}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-fg-muted hover:text-fg"
              disabled={disabled}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Button variant="primary" onClick={() => runAsk(question)} disabled={disabled || question.trim().length === 0}>
            {status === 'loading' ? 'Thinking…' : 'Ask'}
          </Button>
          <div className="text-xs text-fg-muted">Uses server-side OpenAI if configured.</div>
        </div>
      </div>

      {answer ? (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-fg-muted">Output</div>
            <div className="text-xs text-fg-muted">{answer.configured ? 'AI' : 'Sources only'}</div>
          </div>
          <div className="mt-3 whitespace-pre-wrap rounded-xl border border-border bg-bg-subtle p-3 font-mono text-sm leading-relaxed text-fg">
            {answer.answer}
          </div>

          {answer.sources?.length ? (
            <div className="mt-3 grid gap-2">
              {answer.sources.slice(0, 3).map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-fg-muted hover:text-fg"
                >
                  <div className="font-medium text-fg">{s.title}</div>
                  <div className="text-xs text-fg-muted">{s.summary}</div>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
