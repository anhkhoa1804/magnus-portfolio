export function ProjectsHeader() {
  return (
    <section className="pt-20 pb-10 border-b border-border/40 mb-8">
      <div className="space-y-5">
        <p className="text-xs uppercase tracking-widest text-fg-muted">Work</p>
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-heading font-semibold leading-[1] tracking-tight text-fg">
          Projects.
        </h1>
        <p className="text-lg text-fg-muted font-light leading-relaxed max-w-lg">
          AI experiments and technical demos — built to learn, ship, and share.
        </p>
      </div>
    </section>
  );
}
