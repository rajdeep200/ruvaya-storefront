import { TrackViewEvent } from "./TrackViewEvent";

type PolicyLayoutProps = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

/** Shared frame for all policy pages — each keeps its own route so URLs stay stable, but the layout is identical. */
export function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <TrackViewEvent name="policy_viewed" metadata={{ policy: title }} />
      <h1 className="font-serif text-3xl text-text-primary uppercase">{title}</h1>
      <p className="mt-2 text-xs text-text-muted">Last updated: {lastUpdated}</p>
      <div className="policy-content mt-8 flex flex-col gap-5 text-sm leading-relaxed text-text-secondary [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-text-primary [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-text-primary">
        {children}
      </div>
    </div>
  );
}
