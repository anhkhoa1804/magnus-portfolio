'use client';

export function ContactWidget() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToContact}
      className="flex flex-col h-full w-full text-left cursor-pointer group"
    >
      <p className="text-xs uppercase tracking-wider text-fg-muted">Having questions?</p>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <p className="text-2xl text-fg group-hover:opacity-70 transition-opacity">Contact me</p>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fg/60 group-hover:text-fg group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all">
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </div>
    </button>
  );
}
