type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={`text-center ${className ?? ""}`}>
      <h2 className="font-serif text-2xl tracking-[0.08em] text-text-primary uppercase sm:text-3xl">
        {title}
      </h2>
      <svg width="72" height="14" viewBox="0 0 72 14" className="mx-auto mt-3 text-primary" aria-hidden="true">
        <line x1="0" y1="7" x2="28" y2="7" stroke="currentColor" strokeWidth="1" />
        <path d="M36 2 L40 7 L36 12 L32 7 Z" fill="currentColor" />
        <line x1="44" y1="7" x2="72" y2="7" stroke="currentColor" strokeWidth="1" />
      </svg>
      {subtitle && <p className="mt-3 text-sm text-text-secondary">{subtitle}</p>}
    </div>
  );
}
