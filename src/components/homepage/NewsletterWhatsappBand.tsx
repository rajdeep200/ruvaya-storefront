import { NewsletterForm } from "./NewsletterForm";

type NewsletterWhatsappBandProps = {
  newsletterHeading: string;
  newsletterSubtext: string;
  whatsappHeading: string;
  whatsappSubtext: string;
  whatsappNumber: string;
};

export function NewsletterWhatsappBand({
  newsletterHeading,
  newsletterSubtext,
  whatsappHeading,
  whatsappSubtext,
  whatsappNumber,
}: NewsletterWhatsappBandProps) {
  const digits = whatsappNumber.replace(/[^\d]/g, "");

  return (
    <section className="bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-serif text-xl text-text-primary uppercase sm:text-2xl">{newsletterHeading}</h2>
          <p className="mt-1 text-sm text-text-secondary">{newsletterSubtext}</p>
        </div>

        <NewsletterForm source="homepage" />

        <a
          href={`https://wa.me/${digits}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-3 text-text-primary hover:text-primary"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="text-success" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.94.56 3.75 1.53 5.28L2 22l4.94-1.6a9.86 9.86 0 0 0 5.1 1.4c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z" />
          </svg>
          <span>
            <span className="block text-sm font-semibold tracking-wide uppercase">{whatsappHeading}</span>
            <span className="block text-xs text-text-secondary">{whatsappSubtext}</span>
          </span>
        </a>
      </div>
    </section>
  );
}
