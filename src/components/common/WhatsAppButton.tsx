"use client";

import { track } from "@/lib/analytics/track";

type WhatsAppButtonProps = {
  whatsappNumber: string;
  message?: string;
};

export function WhatsAppButton({ whatsappNumber, message = "Hi Ruvaya! I have a question about" }: WhatsAppButtonProps) {
  const digits = whatsappNumber.replace(/[^\d]/g, "");
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_clicked", {})}
      aria-label="Chat with Ruvaya on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.94.56 3.75 1.53 5.28L2 22l4.94-1.6a9.86 9.86 0 0 0 5.1 1.4c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.1c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.32-.29.49-.14.17-.3.38-.43.51-.14.14-.29.29-.13.57.16.28.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.19 1.34.29.14.46.12.63-.07.17-.19.72-.83.91-1.12.19-.29.38-.24.63-.14.25.09 1.6.75 1.87.89.27.14.46.21.53.32.07.11.07.65-.17 1.33z" />
      </svg>
    </a>
  );
}
