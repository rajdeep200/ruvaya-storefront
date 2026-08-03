import type { Metadata } from "next";
import { getStorefrontConfig } from "@/lib/api/storefront";
import { FaqAccordion } from "@/components/support/FaqAccordion";
import { SupportContactForm } from "@/components/support/SupportContactForm";
import type { FaqItem } from "@/types";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Frequently asked questions, contact details and WhatsApp support for Ruvaya orders.",
  alternates: { canonical: "/help" },
};

const FAQS: FaqItem[] = [
  {
    question: "How do I know what size to order?",
    answer:
      "Every product page has an exact garment measurement table, plus the model's height and the size she's wearing. Our general Size Guide also explains how to measure yourself at home.",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer: "Yes, COD is available on most serviceable pincodes across India — check availability at checkout.",
  },
  {
    question: "How long does delivery take?",
    answer: "Most orders arrive in 3-7 business days after dispatch, depending on your location. See our Shipping Policy for details.",
  },
  {
    question: "Can I return or exchange an item?",
    answer: "Most items can be returned within 7 days of delivery, unworn and with tags attached. See our Return & Refund Policy for full details.",
  },
  {
    question: "My payment was deducted but I didn't get an order confirmation. What now?",
    answer:
      "Please don't place a second order. Contact us with your payment reference or approximate time of payment, and we'll verify it — this is almost always a delayed confirmation, not a lost payment.",
  },
  {
    question: "How can I track my order?",
    answer: "Use Track Order with your order number and the phone number or email used at checkout.",
  },
];

export default async function HelpPage() {
  const config = await getStorefrontConfig();

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-serif text-3xl text-text-primary uppercase">Help &amp; Support</h1>
      <p className="mt-2 text-sm text-text-secondary">
        We&apos;re here {config.supportHours.toLowerCase()}. WhatsApp is usually fastest.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <a
          href={`https://wa.me/${config.whatsappNumber.replace(/[^\d]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-border p-4 text-center hover:border-primary"
        >
          <p className="text-sm font-medium text-text-primary">WhatsApp</p>
          <p className="mt-1 text-xs text-text-secondary">{config.whatsappNumber}</p>
        </a>
        <a href={`mailto:${config.supportEmail}`} className="rounded-md border border-border p-4 text-center hover:border-primary">
          <p className="text-sm font-medium text-text-primary">Email</p>
          <p className="mt-1 text-xs text-text-secondary">{config.supportEmail}</p>
        </a>
        <a href={`tel:${config.supportPhone.replace(/\s+/g, "")}`} className="rounded-md border border-border p-4 text-center hover:border-primary">
          <p className="text-sm font-medium text-text-primary">Call</p>
          <p className="mt-1 text-xs text-text-secondary">{config.supportPhone}</p>
        </a>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 font-serif text-xl text-text-primary">Frequently Asked Questions</h2>
          <FaqAccordion items={FAQS} />
        </div>
        <div>
          <h2 className="mb-4 font-serif text-xl text-text-primary">Send Us a Message</h2>
          <SupportContactForm />
        </div>
      </div>
    </div>
  );
}
