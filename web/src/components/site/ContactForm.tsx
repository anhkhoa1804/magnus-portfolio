'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

export function ContactForm() {
  const [state, setState] = React.useState<State>({ status: 'idle' });
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: 'loading' });

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    }).catch(() => null);

    if (!res) {
      setState({ status: 'error', message: 'Network error. Try again.' });
      return;
    }

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setState({ status: 'error', message: json?.message ?? 'Something went wrong.' });
      return;
    }

    setState({ status: 'success', message: json?.message ?? 'Message received.' });
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <Card className="overflow-hidden">
      <CardBody>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <input
              className="h-10 rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:ring-2 focus:ring-border/70"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <input
              className="h-10 rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:ring-2 focus:ring-border/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              className="min-h-[140px] rounded-xl border border-border bg-bg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-border/70"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What do you want to build / ask / share?"
              required
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="md">
              {state.status === 'loading' ? 'Sending…' : 'Send'}
            </Button>
            {state.status === 'success' && <div className="text-sm text-emerald-600 dark:text-emerald-400">{state.message}</div>}
            {state.status === 'error' && <div className="text-sm text-rose-600 dark:text-rose-400">{state.message}</div>}
          </div>

          <div className="text-xs text-fg-muted">
            By default, messages are logged on the server. If SMTP is configured, an email will be sent automatically.
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
