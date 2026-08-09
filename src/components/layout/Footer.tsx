import Link from "next/link";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  ChevronRight,
  Shield,
  PackageCheck,
  Truck,
  Ruler,
  HelpCircle,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RuvayaLogo } from "@/components/common/RuvayaLogo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { StorefrontConfig } from "@/types";

type FooterProps = {
  config: StorefrontConfig;
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  pinterest: "Pinterest",
  whatsapp: "WhatsApp",
};

/** Best-effort icon for a backend-driven footer link, matched by keyword — falls back to a generic tag icon. */
function getFooterLinkIcon(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (l.includes("privacy")) return Shield;
  if (l.includes("return") || l.includes("exchange") || l.includes("cancellation"))
    return PackageCheck;
  if (l.includes("shipping")) return Truck;
  if (l.includes("size")) return Ruler;
  if (l.includes("faq") || l.includes("help") || l.includes("contact") || l.includes("track"))
    return HelpCircle;
  return Tag;
}

export function Footer({ config }: FooterProps) {
  const whatsappDigits = config.whatsappNumber.replace(/[^\d]/g, "");
  const socialLinks = config.socialLinks.filter((s) => s.platform !== "whatsapp");

  return (
    <footer className="border-border bg-background border-t">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
            <div>
              <RuvayaLogo size={64} />
              <p className="text-text-secondary mt-4 max-w-[220px] text-sm">
                Timeless ethnic wear for the modern Indian woman.
              </p>
              <div className="mt-4 flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[social.platform] ?? social.platform}
                    className="border-border text-text-secondary hover:border-primary hover:text-primary flex h-9 w-9 items-center justify-center rounded-full border"
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
              </div>
            </div>

            {config.footerColumns.map((column) => (
              <div key={column.heading}>
                <h3 className="text-text-primary text-xs font-semibold tracking-[0.15em] uppercase">
                  {column.heading}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-text-secondary hover:text-primary text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="text-text-primary text-xs font-semibold tracking-[0.15em] uppercase">
                Contact
              </h3>
              <ul className="text-text-secondary mt-4 flex flex-col gap-2.5 text-sm">
                <li>
                  <a href={`mailto:${config.supportEmail}`} className="hover:text-primary">
                    {config.supportEmail}
                  </a>
                </li>
                {config.supportPhone && (
                  <li>
                    <a
                      href={`tel:${config.supportPhone.replace(/\s+/g, "")}`}
                      className="hover:text-primary"
                    >
                      {config.supportPhone}
                    </a>
                  </li>
                )}
                <li>{config.supportHours}</li>
                <li>{config.addressLine}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="px-6 py-10 text-center lg:hidden">
        <Link href="/" aria-label="Ruvaya home" className="inline-block">
          <RuvayaLogo size={80} />
        </Link>
        <p className="text-text-secondary mx-auto mt-4 max-w-[260px] text-sm">
          Timeless ethnic wear for the modern Indian woman.
        </p>

        <Accordion
          type="multiple"
          defaultValue={[...config.footerColumns.map((_, i) => `col-${i}`), "contact"]}
          className="mt-6 text-left"
        >
          {config.footerColumns.map((column, i) => (
            <AccordionItem key={column.heading} value={`col-${i}`}>
              <AccordionTrigger className="text-primary text-xs font-semibold tracking-[0.15em] uppercase hover:no-underline">
                {column.heading}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-1">
                  {column.links.map((link) => {
                    const Icon = getFooterLinkIcon(link.label);
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-text-secondary hover:text-primary flex items-center gap-3 py-2 text-sm"
                        >
                          <Icon size={16} strokeWidth={1.8} className="text-text-muted shrink-0" />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}

          <AccordionItem value="contact">
            <AccordionTrigger className="text-primary text-xs font-semibold tracking-[0.15em] uppercase hover:no-underline">
              Contact
            </AccordionTrigger>
            <AccordionContent>
              <div className="border-border rounded-md border">
                <ContactRow icon={Mail}>
                  <a href={`mailto:${config.supportEmail}`} className="hover:text-primary">
                    {config.supportEmail}
                  </a>
                </ContactRow>
                {config.supportPhone && (
                  <ContactRow icon={Phone}>
                    <a
                      href={`tel:${config.supportPhone.replace(/\s+/g, "")}`}
                      className="hover:text-primary"
                    >
                      {config.supportPhone}
                    </a>
                  </ContactRow>
                )}
                <ContactRow icon={Clock}>{config.supportHours}</ContactRow>
                <ContactRow icon={MapPin}>{config.addressLine}</ContactRow>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {socialLinks.length > 0 && (
          <div className="mt-8">
            <div className="text-text-muted flex items-center gap-3 text-xs font-semibold tracking-[0.15em] uppercase">
              <span className="bg-border h-px flex-1" aria-hidden="true" />
              Follow Us
              <span className="bg-border h-px flex-1" aria-hidden="true" />
            </div>
            <div className="mt-4 flex justify-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={SOCIAL_LABELS[social.platform] ?? social.platform}
                  className="border-border text-text-secondary hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center rounded-full border"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>
        )}

        <a
          href={`https://wa.me/${whatsappDigits}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border bg-surface-muted/50 mt-6 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left"
        >
          <span className="flex items-center gap-3">
            <span className="bg-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.94.56 3.75 1.53 5.28L2 22l4.94-1.6a9.86 9.86 0 0 0 5.1 1.4c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.1c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.32-.29.49-.14.17-.3.38-.43.51-.14.14-.29.29-.13.57.16.28.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.19 1.34.29.14.46.12.63-.07.17-.19.72-.83.91-1.12.19-.29.38-.24.63-.14.25.09 1.6.75 1.87.89.27.14.46.21.53.32.07.11.07.65-.17 1.33z" />
              </svg>
            </span>
            <span>
              <span className="text-text-primary block font-serif text-sm">Need help?</span>
              <span className="text-text-secondary block text-xs">Chat with us on WhatsApp</span>
            </span>
          </span>
          <ChevronRight
            size={18}
            strokeWidth={1.8}
            className="text-text-muted shrink-0"
            aria-hidden="true"
          />
        </a>
      </div>

      <div className="bg-primary py-4 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 text-xs sm:flex-row sm:justify-between">
          <p>{config.legalText}</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactRow({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="border-border text-text-secondary flex items-center gap-3 border-b px-3 py-3 text-sm last:border-0">
      <span className="bg-surface-muted text-text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
        <Icon size={15} strokeWidth={1.8} />
      </span>
      {children}
    </div>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
  } as const;
  switch (platform) {
    case "instagram":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M14 9h2V6h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2l1-3h-3V9c0-.6.4-1 1-1z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M9 18c1-3 1.5-5 1.5-5m0 0C10 11 10.5 8 13 8c2 0 3 1.4 3 3.2 0 2.3-1.3 4.3-3.2 4.3-.9 0-1.6-.5-1.9-1.2" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
