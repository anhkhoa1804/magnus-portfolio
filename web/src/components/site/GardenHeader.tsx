export function GardenHeader() {
  return (
    <section className="pt-20 pb-10 border-b border-border/40 mb-8">
      <div className="space-y-5">
        <p className="text-xs uppercase tracking-widest text-fg-muted">Writing</p>
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-heading font-semibold leading-[1] tracking-tight text-fg">
          Garden.
        </h1>
        <p className="text-lg text-fg-muted font-light leading-relaxed max-w-lg">
          Essays, notes, and thoughts growing in public.
        </p>
      </div>
    </section>
  );
}
