import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/order/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Look up your Ruvaya order status using your order number and phone number or email.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl text-text-primary uppercase">Track Your Order</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Enter your order number and the phone number or email used at checkout.
        </p>
      </div>
      <TrackOrderForm />
    </div>
  );
}
