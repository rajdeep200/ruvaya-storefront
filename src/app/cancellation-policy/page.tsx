import type { Metadata } from "next";
import { PolicyLayout } from "@/components/common/PolicyLayout";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  alternates: { canonical: "/cancellation-policy" },
};

export default function CancellationPolicyPage() {
  return (
    <PolicyLayout title="Cancellation Policy" lastUpdated="1 July 2026">
      <p>
        Plans change, and that&apos;s okay. Here&apos;s how cancellations work depending on where your order is in
        its journey.
      </p>

      <h2>Before Dispatch</h2>
      <p>
        You can cancel your order for a full refund any time before it&apos;s dispatched. Message us on WhatsApp or
        contact support with your order number as soon as possible — once packed for shipping, we may not be able to
        stop it in time.
      </p>

      <h2>After Dispatch</h2>
      <p>
        Once an order has shipped, it can no longer be cancelled — but you&apos;re welcome to refuse delivery or
        initiate a return once it arrives, following our{" "}
        <a href="/return-refund-policy" className="font-medium text-primary hover:underline">
          Return &amp; Refund Policy
        </a>
        .
      </p>

      <h2>Refund Timeline for Cancellations</h2>
      <p>
        Prepaid orders cancelled before dispatch are refunded to the original payment method within 5-7 business
        days. Refunds are never partial for a full cancellation made before dispatch.
      </p>

      <h2>Payment Deducted but Order Not Visible</h2>
      <p>
        If an amount was deducted but you don&apos;t see a confirmed order, please don&apos;t place a second order.
        Contact us with your payment reference and we&apos;ll verify and resolve it — most such cases are simply a
        delayed confirmation from the bank, not a lost payment.
      </p>
    </PolicyLayout>
  );
}
