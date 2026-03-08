'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';



/* ── HERO ───────────────────────────────────────────── */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <motion.section
      ref={sectionRef}
      className="min-h-screen flex items-center px-4 md:px-8 overflow-hidden"
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <motion.div style={{ opacity: fadeOut }} className="max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
          <motion.div style={{ y: textY }} className="space-y-6">
            <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-heading font-bold leading-[0.93] tracking-tight text-fg">
              Magnus.
            </h1>
            <p className="text-xl text-fg-muted font-light leading-relaxed max-w-lg">
              I build AI products, write about ideas, and chase curiosity across code, language, and design.
            </p>
          </motion.div>
          <motion.div style={{ y: imageY }} className="shrink-0">
            <motion.div
              className="w-72 h-72 md:w-[28rem] md:h-[28rem] relative overflow-hidden rounded-2xl"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
            >
              <Image src="/magnus.svg" alt="Magnus" fill className="object-contain" priority />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}

/* ── BENTO ───────────────────────────────────────────── */
type BentoProps = {
  weatherSlot: ReactNode;
  spotifySlot: ReactNode;
  quoteSlot: ReactNode;
  wordSlot: ReactNode;
  codingSlot: ReactNode;
  photoSlot: ReactNode;
  aquariusSlot: ReactNode;
  contactSlot: ReactNode;
  stocksSlot: ReactNode;
};

export function BentoSection({
  weatherSlot,
  spotifySlot,
  quoteSlot,
  wordSlot,
  codingSlot,
  photoSlot,
  aquariusSlot,
  contactSlot,
  stocksSlot,
}: BentoProps) {
  return (
    <div className="relative min-h-[180vh] mt-56">
      {/* Sticky inner suspends the bento grid for ~55vh before releasing */}
      <div className="sticky top-20 px-4 md:px-8 pt-6 pb-10">
        <motion.div
          className="max-w-4xl mx-auto w-full"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.05 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:aspect-[4/3] md:auto-rows-fr">

            {/* Quote — merged 2 cols */}
            <div className="bento-card bento-blue p-4 flex flex-col col-span-2">{quoteSlot}</div>
            {/* Word of the Day */}
            <div className="bento-card bento-orange p-4 flex flex-col">{wordSlot}</div>
            {/* Spotify */}
            <div className="bento-card bento-orange p-4">{spotifySlot}</div>

            {/* Photo — rows 2-3 */}
            <div className="bento-card overflow-hidden col-span-2 md:col-span-1 md:row-span-2">{photoSlot}</div>

            {/* Weather */}
            <div className="bento-card bento-orange p-4">{weatherSlot}</div>
            {/* Coding */}
            <div className="bento-card bento-orange p-4 flex flex-col">{codingSlot}</div>
            {/* Aquarius — rows 2-3 */}
            <div className="bento-card bento-blue p-4 flex flex-col col-span-2 md:col-span-1 md:row-span-2">{aquariusSlot}</div>

            {/* Stocks */}
            <div className="bento-card bento-blue p-4 flex flex-col">{stocksSlot}</div>
            {/* Contact */}
            <div className="bento-card bento-blue p-4">{contactSlot}</div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
