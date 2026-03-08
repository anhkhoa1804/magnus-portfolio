'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Project = {
  label: string;
  title: string;
  desc: string;
  href: string;
  image: string;
};

type Post = {
  slug: string;
  frontmatter: Record<string, unknown>;
};



const CARD_CLASS =
  'group bento-card overflow-hidden shrink-0 snap-start w-[292px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1';

function ArrowButton({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'left' ? 'Previous' : 'Next'}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card text-fg-muted hover:text-fg hover:border-fg/30 transition-all duration-200 shrink-0 shadow-sm hover:shadow"
    >
      {dir === 'left' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-[clamp(2rem,4vw,3rem)] font-heading font-bold leading-tight tracking-tight text-fg">
        {title}
      </h2>
      <p className="text-sm text-fg-muted mt-2 font-light">{subtitle}</p>
    </div>
  );
}

/* ── PROJECTS CAROUSEL ─────────────────────────────── */
export function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 304, behavior: 'smooth' });

  return (
    <motion.section
      className="min-h-screen flex flex-col justify-center py-20 px-4 md:px-8"
      initial={{ opacity: 0, y: 100, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <SectionHeader
          title="Featured Projects"
          subtitle="Things I've built — from AI tools to full-stack apps"
        />
        <div className="flex items-center gap-4">
          <ArrowButton dir="left" onClick={() => scroll(-1)} />
          <div
            ref={ref}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none flex-1"
          >
            {projects.map((p) => (
              <Link key={p.href} href={p.href} className={CARD_CLASS}>
                <div className="relative overflow-hidden bg-bg-subtle h-[200px]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 text-[9px] uppercase tracking-widest bg-black/40 text-white/90 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {p.label}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-heading font-semibold text-fg mb-2">{p.title}</h3>
                  <p className="text-sm text-fg-muted leading-relaxed line-clamp-3 flex-1">{p.desc}</p>
                  <span className="mt-4 text-xs text-fg-muted/50 group-hover:text-fg-muted transition-colors">Open →</span>
                </div>
              </Link>
            ))}
          </div>
          <ArrowButton dir="right" onClick={() => scroll(1)} />
        </div>
      </div>
    </motion.section>
  );
}

/* ── GARDEN CAROUSEL ───────────────────────────────── */
export function GardenCarousel({ posts }: { posts: Post[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 304, behavior: 'smooth' });

  return (
    <motion.section
      className="min-h-screen flex flex-col justify-center py-20 px-4 md:px-8"
      initial={{ opacity: 0, y: 100, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <SectionHeader
          title="From the Garden"
          subtitle="Essays, notes, and ideas growing in public"
        />
        <div className="flex items-center gap-4">
          <ArrowButton dir="left" onClick={() => scroll(-1)} />
          <div
            ref={ref}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none flex-1"
          >
            {posts.map((post) => {
              const cover = post.frontmatter.cover as string | undefined;
              const title = post.frontmatter.title as string;
              const summary = post.frontmatter.summary as string | undefined;
              const date = post.frontmatter.date as string;
              return (
                <Link
                  key={post.slug}
                  href={`/garden/${post.slug}`}
                  className={CARD_CLASS}
                >
                  <div className="relative overflow-hidden bg-bg-subtle h-[200px]">
                    {cover ? (
                      <Image
                        src={`${cover.split('?')[0]}?w=320&h=200&fit=crop&auto=format`}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="320px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl font-heading text-fg-muted/10 select-none">
                          {title[0] ?? '·'}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <time className="text-[10px] uppercase tracking-widest text-fg-muted/50 mb-2">
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <h3 className="text-lg font-heading font-semibold text-fg leading-snug mb-2">{title}</h3>
                    {summary && (
                      <p className="text-sm text-fg-muted font-light leading-relaxed line-clamp-3 flex-1">
                        {summary}
                      </p>
                    )}
                    <span className="mt-4 text-xs text-fg-muted/50 group-hover:text-fg-muted transition-colors">Read →</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <ArrowButton dir="right" onClick={() => scroll(1)} />
        </div>
      </div>
    </motion.section>
  );
}

/* ── WANDERLUST SECTION ────────────────────────────── */
export function WanderlustSection() {
  return (
    <motion.section
      className="min-h-screen flex flex-col justify-center py-20 px-4 md:px-8"
      initial={{ opacity: 0, y: 72 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <SectionHeader
          title="Wanderlust"
          subtitle="Places explored — Vietnam and Europe through maps and photographs"
        />
        <Link
          href="/wanderlust"
          className="group relative mx-auto block max-w-3xl rounded-2xl overflow-hidden bento-card hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
        >
          <div className="relative h-[420px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&h=700&fit=crop&auto=format"
              alt="Wanderlust — travel photography"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 900px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Explore</p>
              <h3 className="text-3xl font-heading font-bold text-white leading-tight mb-2">
                Maps, routes & photographs
              </h3>
              <p className="text-sm text-white/70 font-light">
                Vietnam coast to coast · Europe by rail →
              </p>
            </div>
          </div>
        </Link>
      </div>
    </motion.section>
  );
}
