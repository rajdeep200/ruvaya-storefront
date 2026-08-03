import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "How to measure yourself for the perfect Ruvaya kurti fit, with our general size chart.",
  alternates: { canonical: "/size-guide" },
};

const GENERAL_SIZES = [
  { size: "S", bust: "36", waist: "34", hip: "38" },
  { size: "M", bust: "38", waist: "36", hip: "40" },
  { size: "L", bust: "40", waist: "38", hip: "42" },
  { size: "XL", bust: "42", waist: "40", hip: "44" },
  { size: "XXL", bust: "44", waist: "42", hip: "46" },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-serif text-3xl text-text-primary uppercase">Size &amp; Measurement Guide</h1>
      <p className="mt-3 text-sm text-text-secondary">
        Every Ruvaya kurti has its own measurement table on its product page — fabrics and cuts vary, so always check
        the specific product first. This page is a general starting point and a guide to measuring yourself
        correctly.
      </p>

      <h2 className="mt-10 font-serif text-xl text-text-primary">How to Measure Yourself</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border p-4">
          <p className="text-sm font-medium text-text-primary">Bust</p>
          <p className="mt-1 text-sm text-text-secondary">
            Measure around the fullest part of your bust, keeping the tape parallel to the floor.
          </p>
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-sm font-medium text-text-primary">Waist</p>
          <p className="mt-1 text-sm text-text-secondary">
            Measure around the narrowest part of your natural waistline, just above the navel.
          </p>
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-sm font-medium text-text-primary">Hip</p>
          <p className="mt-1 text-sm text-text-secondary">
            Measure around the fullest part of your hips, roughly 20cm below your waist.
          </p>
        </div>
      </div>

      <h2 className="mt-10 font-serif text-xl text-text-primary">General Size Chart</h2>
      <p className="mt-2 text-sm text-text-secondary">Measurements in inches, body measurements (not garment).</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th className="py-2 pr-4 font-medium">Size</th>
              <th className="py-2 pr-4 font-medium">Bust</th>
              <th className="py-2 pr-4 font-medium">Waist</th>
              <th className="py-2 pr-4 font-medium">Hip</th>
            </tr>
          </thead>
          <tbody>
            {GENERAL_SIZES.map((row) => (
              <tr key={row.size} className="border-b border-border last:border-0">
                <td className="py-2 pr-4 font-medium text-text-primary">{row.size}</td>
                <td className="py-2 pr-4 text-text-secondary">{row.bust}&quot;</td>
                <td className="py-2 pr-4 text-text-secondary">{row.waist}&quot;</td>
                <td className="py-2 pr-4 text-text-secondary">{row.hip}&quot;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 font-serif text-xl text-text-primary">Still Unsure?</h2>
      <p className="mt-2 text-sm text-text-secondary">
        Message us on WhatsApp with your measurements from any product page — we&apos;re always happy to help you
        pick the right size before you order.
      </p>
    </div>
  );
}
