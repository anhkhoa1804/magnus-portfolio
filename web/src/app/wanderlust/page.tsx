import { MapSection } from '@/components/travel/MapSection';
import { PhotoGallery } from '@/components/travel/PhotoGallery';
import { WanderlustReveal } from '@/components/travel/WanderlustReveal';

export const metadata = {
  title: 'Wanderlust',
  description: 'Places explored — Vietnam and Europe through maps and photographs.',
};

export default function WanderlustPage() {
  return (
    <main className="container max-w-5xl pb-24 space-y-20">
      {/* Header */}
      <WanderlustReveal className="pt-20 pb-10">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-widest text-fg-muted">Travel</p>
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-heading font-semibold leading-[1] tracking-tight text-fg">
            Wanderlust.
          </h1>
          <p className="text-base text-fg-muted font-light leading-relaxed max-w-lg">
            Places explored, photographs taken — across Vietnam and Europe.
          </p>
        </div>
      </WanderlustReveal>

      {/* Two maps side by side */}
      <WanderlustReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Vietnam */}
          <div>
            <div className="h-[500px] rounded-xl overflow-hidden border border-border/40">
              <MapSection region="vietnam" />
            </div>
          </div>

          {/* Europe */}
          <div className="md:col-span-2">
            <div className="h-[500px] rounded-xl overflow-hidden border border-border/40">
              <MapSection region="europe" />
            </div>
          </div>
        </div>
      </WanderlustReveal>

      {/* Photo gallery bento */}
      <WanderlustReveal>
        <div className="space-y-4">
          <div className="text-center mb-10">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-heading font-bold leading-tight tracking-tight text-fg">
              Photographs
            </h2>
            <p className="text-sm text-fg-muted mt-2 font-light">Moments captured along the way</p>
          </div>
          <PhotoGallery />
        </div>
      </WanderlustReveal>
    </main>
  );
}
