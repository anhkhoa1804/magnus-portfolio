'use client';

import * as React from 'react';
import { Card, CardBody } from '@/components/ui/card';
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

type TldrResponse = {
  success: boolean;
  data?: {
    configured: boolean;
    output: string;
  };
  message?: string;
};

async function postJson<T>(url: string, body: unknown): Promise<{ ok: boolean; json: T | null }>{
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => null)) as T | null;
  return { ok: res.ok, json };
}

export function AiToolsPanel() {
  const [question, setQuestion] = React.useState('');
  const [askStatus, setAskStatus] = React.useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [ask, setAsk] = React.useState<AskResponse['data'] | null>(null);

  const [text, setText] = React.useState('Paste an article or meeting notes here.');
  const [tldrStatus, setTldrStatus] = React.useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [tldr, setTldr] = React.useState<TldrResponse['data'] | null>(null);

  async function runAsk() {
    const q = question.trim();
    if (!q) return;
    setAskStatus('loading');
    setAsk(null);
    const { ok, json } = await postJson<AskResponse>('/api/brain/ask', { question: q });
    if (!ok || !json?.success) {
      setAskStatus('error');
      setAsk({ configured: false, answer: json?.message ?? 'Request failed' });
      return;
    }
    setAskStatus('done');
    setAsk(json.data ?? null);
  }

  async function runTldr() {
    setTldrStatus('loading');
    setTldr(null);
    const { ok, json } = await postJson<TldrResponse>('/api/brain/tldr', { text });
    if (!ok || !json?.success) {
      setTldrStatus('error');
      setTldr({ configured: false, output: json?.message ?? 'Request failed' });
      return;
    }
    setTldrStatus('done');
    setTldr(json.data ?? null);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardBody>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.18em] text-fg-muted">Brain</div>
              <div className="mt-2 text-lg font-semibold tracking-tight">Ask Magnus</div>
              <p className="mt-2 text-sm text-fg-muted">Site-aware Q&A with sources. Feels like a tool, not a form.</p>
            </div>

            <div className="rounded-xl border border-border bg-bg-subtle px-3 py-2 text-xs font-mono text-fg-muted">
              /api/brain/ask
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-bg-subtle p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-mono text-fg-muted">&gt; prompt</div>
              <div className="text-xs text-fg-muted">{askStatus === 'loading' ? 'thinking…' : 'ready'}</div>
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
                className="min-h-[96px] w-full resize-none rounded-xl border border-border bg-bg px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-border/70"
                aria-label="Ask a question"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                'What is this site about?',
                'Explain the BFF pattern for API keys.',
                'What projects are you working on?',
                'What are your views on AI and fintech?',
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuestion(s)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-fg-muted hover:text-fg"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <Button variant="primary" onClick={runAsk} disabled={askStatus === 'loading' || question.trim().length === 0}>
                {askStatus === 'loading' ? 'Thinking…' : 'Ask'}
              </Button>
              <div className="text-xs text-fg-muted">Uses `OPENAI_API_KEY` if set; otherwise returns sources only.</div>
            </div>
          </div>

          {ask && (
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-mono uppercase tracking-[0.18em] text-fg-muted">Answer</div>
                  <div className="text-xs text-fg-muted">{ask.configured ? 'AI' : 'Sources only'}</div>
                </div>
                <div className="mt-3 whitespace-pre-wrap rounded-xl border border-border bg-bg-subtle p-3 font-mono text-sm leading-relaxed text-fg">
                  {ask.answer}
                </div>
              </div>

              {ask.sources?.length ? (
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-xs text-fg-muted">Sources</div>
                  <div className="mt-3 grid gap-2">
                    {ask.sources.map((s) => (
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
                </div>
              ) : null}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-sm text-fg-muted">TL;DR</div>
          <div className="mt-2 text-lg font-medium">Summarize text</div>
          <p className="mt-2 text-sm text-fg-muted">Produces a TL;DR plus bullet takeaways.</p>

          <div className="mt-4 grid gap-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[140px] rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-border/70"
              placeholder="Paste text to summarize…"
              aria-label="Text to summarize"
            />
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={runTldr} disabled={tldrStatus === 'loading'}>
                {tldrStatus === 'loading' ? 'Summarizing…' : 'Generate'}
              </Button>
              <div className="text-xs text-fg-muted">Requires `OPENAI_API_KEY` for real output.</div>
            </div>
          </div>

          {tldr && (
            <div className="mt-5 rounded-2xl border border-border bg-card p-4">
              <div className="text-xs text-fg-muted">Output</div>
              <div className="mt-2 whitespace-pre-wrap text-sm">{tldr.output}</div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
