'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

// 43 photos. Spans from actual pixel dimensions:
// L (16:9 / 3:2) → col-span-2 row-span-1
// P (9:16)       → col-span-1 row-span-2
// S (4:3)        → col-span-1 row-span-1
//
// Tiling (4-col, gap-free):
// Block A (rows 1-2)  : PP·LL  — portraits flanking landscapes
// Block B (rows 3-4)  : LL·SSSS — wide pair, then 4-square row
// Block C (rows 5-6)  : PPPP
// Block D (rows 7-8)  : PP·LL
// Block E (rows 9-10) : PP·L·SS — mixed: portrait pair, landscape top+squares below
// Blocks F-J (rows 11-20): 5× PPPP
const photos = [
  // ── Block A ──
  { id: 1,  src: '/wanderlust/IMG_4597.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 2,  src: '/wanderlust/IMG_4627.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 3,  src: '/wanderlust/IMG_4313.jpg', span: 'col-span-2 row-span-1' }, // L
  { id: 4,  src: '/wanderlust/IMG_4518.jpg', span: 'col-span-2 row-span-1' }, // L
  // ── Block B ──
  { id: 5,  src: '/wanderlust/IMG_1333.jpg', span: 'col-span-2 row-span-1' }, // L
  { id: 6,  src: '/wanderlust/IMG_2049.jpg', span: 'col-span-2 row-span-1' }, // L
  { id: 7,  src: '/wanderlust/IMG_3865.jpg', span: 'col-span-1 row-span-1' }, // S
  { id: 8,  src: '/wanderlust/IMG_4874.jpg', span: 'col-span-1 row-span-1' }, // S
  { id: 9,  src: '/wanderlust/IMG_5027.jpg', span: 'col-span-1 row-span-1' }, // S
  { id: 10, src: '/wanderlust/IMG_6155.jpg', span: 'col-span-1 row-span-1' }, // S
  // ── Block C ──
  { id: 11, src: '/wanderlust/IMG_3326.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 12, src: '/wanderlust/IMG_3330.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 13, src: '/wanderlust/IMG_3643.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 14, src: '/wanderlust/IMG_3712.jpg', span: 'col-span-1 row-span-2' }, // P
  // ── Block D ──
  { id: 15, src: '/wanderlust/IMG_3560.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 16, src: '/wanderlust/IMG_3750.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 17, src: '/wanderlust/IMG_5461.jpg', span: 'col-span-2 row-span-1' }, // L
  { id: 18, src: '/wanderlust/IMG_5491.jpg', span: 'col-span-2 row-span-1' }, // L
  // ── Block E ── PP left + L top-right + SS bottom-right
  { id: 19, src: '/wanderlust/IMG_4438.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 20, src: '/wanderlust/IMG_4454.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 21, src: '/wanderlust/IMG_1397.jpg', span: 'col-span-2 row-span-1' }, // L
  { id: 22, src: '/wanderlust/IMG_6362.jpg', span: 'col-span-1 row-span-1' }, // S
  { id: 23, src: '/wanderlust/IMG_6733.jpg', span: 'col-span-1 row-span-1' }, // S
  // ── Block F ──
  { id: 24, src: '/wanderlust/IMG_3335.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 25, src: '/wanderlust/IMG_3361.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 26, src: '/wanderlust/IMG_3401.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 27, src: '/wanderlust/IMG_3436.jpg', span: 'col-span-1 row-span-2' }, // P
  // ── Block G ──
  { id: 28, src: '/wanderlust/IMG_3806.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 29, src: '/wanderlust/IMG_3861.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 30, src: '/wanderlust/IMG_3908.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 31, src: '/wanderlust/IMG_4273.jpg', span: 'col-span-1 row-span-2' }, // P
  // ── Block H ──
  { id: 32, src: '/wanderlust/IMG_4287.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 33, src: '/wanderlust/IMG_4493.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 34, src: '/wanderlust/IMG_4496.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 35, src: '/wanderlust/IMG_4516.jpg', span: 'col-span-1 row-span-2' }, // P
  // ── Block I ──
  { id: 36, src: '/wanderlust/IMG_4543.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 37, src: '/wanderlust/IMG_4921.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 38, src: '/wanderlust/IMG_4946.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 39, src: '/wanderlust/IMG_4966.jpg', span: 'col-span-1 row-span-2' }, // P
  // ── Block J ──
  { id: 40, src: '/wanderlust/IMG_4974.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 41, src: '/wanderlust/IMG_5005.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 42, src: '/wanderlust/IMG_7044.jpg', span: 'col-span-1 row-span-2' }, // P
  { id: 43, src: '/wanderlust/IMG_3757.jpg', span: 'col-span-1 row-span-2' }, // P
];

export function PhotoGallery() {
  return (
    <div className="grid gap-2 grid-cols-2 md:grid-cols-4 auto-rows-[185px] grid-flow-dense">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: (i % 6) * 0.05 }}
          className={`group relative overflow-hidden rounded-xl ${photo.span}`}
        >
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="transition-transform duration-500 group-hover:scale-[1.05]"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 rounded-xl" />
        </motion.div>
      ))}
    </div>
  );
}
