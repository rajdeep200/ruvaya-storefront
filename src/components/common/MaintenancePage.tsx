import { RuvayaLogo } from "./RuvayaLogo";

export function MaintenancePage({ whatsappNumber }: { whatsappNumber: string }) {
  const digits = whatsappNumber.replace(/[^\d]/g, "");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <RuvayaLogo size={72} />
      <h1 className="mt-6 font-serif text-2xl text-text-primary">We&apos;ll be right back</h1>
      <p className="mt-3 max-w-sm text-sm text-text-secondary">
        Ruvaya is undergoing some brief maintenance to make your shopping experience even better. Please check back
        shortly.
      </p>
      <a
        href={`https://wa.me/${digits}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Message Us on WhatsApp
      </a>
    </div>
  );
}
