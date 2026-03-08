'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';



export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [focused, setFocused] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(r.ok ? 'ok' : 'err');
      if (r.ok) setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('err');
    }
  };

  return (
    <motion.section
      id="contact"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center px-4 md:px-8 py-20"
      initial={{ opacity: 0, y: 100, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-heading font-bold leading-tight tracking-tight text-fg">
            Contact Me
          </h2>
          <p className="text-base text-fg-muted mt-3 font-light">
            Got an idea, a question, or just want to say hi?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left — about / links */}
          <div className="space-y-8 pt-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-fg-muted/50 mb-4">What I&apos;m open to</p>
              <p className="text-sm text-fg-muted leading-relaxed">
                I&apos;m happy to collaborate on AI, full-stack, or creative projects — whether that&apos;s a quick side-project or something larger. Always interested in internships, freelance work, and interesting side-quests. I check my messages regularly and will always write back.
              </p>
            </div>
            <div className="pt-6 border-t border-border/40 space-y-3">
              <p className="text-xs text-fg-muted/50 mb-4 uppercase tracking-widest">Find me at</p>
              {[
                {
                  label: 'GitHub',
                  href: 'https://github.com/anhkhoa1804',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  ),
                },
                {
                  label: 'LinkedIn',
                  href: 'https://www.linkedin.com/in/anhkhoa2204',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  label: 'Facebook',
                  href: 'https://www.facebook.com/anhkhoaa.2204',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  label: 'X',
                  href: 'https://x.com/anhkhoa_2204',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.856L1.999 2.25H8.256l4.261 5.634 5.727-5.634zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: 'leanhkhoa150204@gmail.com',
                  href: 'mailto:leanhkhoa150204@gmail.com',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  label: '+84 867 430 045',
                  href: 'tel:+84867430045',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 text-sm text-fg-muted hover:text-fg transition-colors group"
                >
                  <span className="text-fg-muted/40 group-hover:text-fg-muted transition-colors shrink-0">{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <AnimatePresence mode="wait">
            {status === 'ok' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bento-card p-10 flex flex-col items-center justify-center text-center min-h-[360px]"
              >
                <div className="text-5xl mb-5">🎉</div>
                <p className="text-xl font-heading font-semibold text-fg mb-2">Message sent!</p>
                <p className="text-sm text-fg-muted">I&apos;ll get back to you soon.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-xs text-fg-muted/60 hover:text-fg transition-colors underline underline-offset-4"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={send}
                className="bento-card p-8 space-y-6"
              >
                {/* Name */}
                <div className="relative">
                  <input
                    id="cf-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    placeholder=" "
                    className="peer w-full bg-transparent border-0 border-b border-border pb-2 pt-5 text-sm text-fg focus:outline-none focus:border-fg/60 transition-colors"
                  />
                  <label
                    htmlFor="cf-name"
                    className={`absolute left-0 text-fg-muted/60 transition-all duration-200 pointer-events-none
                      ${focused === 'name' || form.name ? 'top-0 text-[10px] tracking-widest uppercase' : 'top-5 text-sm'}`}
                  >
                    Name
                  </label>
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    id="cf-email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder=" "
                    className="peer w-full bg-transparent border-0 border-b border-border pb-2 pt-5 text-sm text-fg focus:outline-none focus:border-fg/60 transition-colors"
                  />
                  <label
                    htmlFor="cf-email"
                    className={`absolute left-0 text-fg-muted/60 transition-all duration-200 pointer-events-none
                      ${focused === 'email' || form.email ? 'top-0 text-[10px] tracking-widest uppercase' : 'top-5 text-sm'}`}
                  >
                    Email
                  </label>
                </div>

                {/* Message */}
                <div className="relative">
                  <textarea
                    id="cf-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    placeholder=" "
                    className="peer w-full bg-transparent border-0 border-b border-border pb-2 pt-5 text-sm text-fg focus:outline-none focus:border-fg/60 transition-colors resize-none"
                  />
                  <label
                    htmlFor="cf-message"
                    className={`absolute left-0 text-fg-muted/60 transition-all duration-200 pointer-events-none
                      ${focused === 'message' || form.message ? 'top-0 text-[10px] tracking-widest uppercase' : 'top-5 text-sm'}`}
                  >
                    Message
                  </label>
                  <span className="absolute bottom-2 right-0 text-[10px] text-fg-muted/40 tabular-nums">
                    {form.message.length}
                  </span>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-2">
                  {status === 'err' && (
                    <p className="text-xs text-red-500">Failed — try again.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-fg text-bg text-sm font-medium rounded-xl hover:opacity-80 transition-all duration-200 disabled:opacity-40 group"
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-bg/40 border-t-bg animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        Send it
                        <svg
                          className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
