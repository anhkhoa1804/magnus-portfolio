'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

// 66 photos — 17L (landscape col-span-2 row-span-1) + 49P (portrait col-span-1 row-span-2)
// Layout: alternating  A(PP·LL)  ↔  C(PPPP)  ↔  B(LL·PP)  ↔  C(PPPP)  …
// Every mixed block breaks up portrait-only sections. No all-P stretch > 1 block.
const photos = [
  // ── Block 1: PP·LL ──
  { src: '/wanderlust/IMG_4597.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4627.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4313.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_4518.jpg', span: 'col-span-2 row-span-1' },
  // ── Block 2: PPPP ──
  { src: '/wanderlust/IMG_2892.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_2999.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_3004.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_3326.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 3: LL·PP ──
  { src: '/wanderlust/IMG_1333.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_2049.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_3330.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_3335.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 4: PPPP ──
  { src: '/wanderlust/IMG_3361.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_3401.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_3436.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_3560.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 5: PP·LL ──
  { src: '/wanderlust/IMG_3643.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_3712.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4874.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_5027.jpg', span: 'col-span-2 row-span-1' },
  // ── Block 6: PPPP ──
  { src: '/wanderlust/IMG_3750.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_3757.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_3806.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_3861.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 7: LL·PP ──
  { src: '/wanderlust/IMG_5461.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_5491.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_3908.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4273.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 8: PPPP ──
  { src: '/wanderlust/IMG_4287.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4438.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4454.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4493.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 9: PP·LL ──
  { src: '/wanderlust/IMG_4496.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4516.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_1397.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_3865.jpg', span: 'col-span-2 row-span-1' },
  // ── Block 10: PPPP ──
  { src: '/wanderlust/IMG_4526.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4543.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4643.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4693.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 11: LL·PP ──
  { src: '/wanderlust/IMG_6807.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_5159.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_4921.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4946.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 12: PPPP ──
  { src: '/wanderlust/IMG_4966.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4974.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_4976.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_5005.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 13: PP·LL ──
  { src: '/wanderlust/IMG_5493.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_5772.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_5751.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_6155.jpg', span: 'col-span-2 row-span-1' },
  // ── Block 14: PPPP ──
  { src: '/wanderlust/IMG_5864.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_5885.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_6006.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_6426.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 15: LL·PP ──
  { src: '/wanderlust/IMG_6675.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_6733.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_6498.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_6767.jpg', span: 'col-span-1 row-span-2' },
  // ── Block 16: PPPP ──
  { src: '/wanderlust/IMG_6448.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_6870.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_6921.jpg', span: 'col-span-1 row-span-2' },
  { src: '/wanderlust/IMG_7044.jpg', span: 'col-span-1 row-span-2' },
  // ── Trailing: L + P (last 2 filling remaining grid space) ──
  { src: '/wanderlust/IMG_2995.jpg', span: 'col-span-2 row-span-1' },
  { src: '/wanderlust/IMG_8470.jpg', span: 'col-span-1 row-span-2' },
];

export function PhotoGallery() {
  return (
    <div className="grid gap-2 grid-cols-2 md:grid-cols-4 auto-rows-[185px] grid-flow-dense">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.src}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: Math.min(i * 0.03, 0.8) }}
          className={`group relative overflow-hidden rounded-xl ${photo.span}`}
        >
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={i < 4}
            className="transition-transform duration-500 group-hover:scale-[1.05]"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 rounded-xl" />
        </motion.div>
      ))}
    </div>
  );
}
