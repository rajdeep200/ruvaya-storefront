import type { Metadata } from "next";
import { PolicyLayout } from "@/components/common/PolicyLayout";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  alternates: { canonical: "/return-refund-policy" },
};

export default function ReturnRefundPolicyPage() {
  return (
    <PolicyLayout title="Return & Refund Policy" lastUpdated="1 July 2026">
      <p>
        We want you to feel completely at ease ordering from us. If a kurti doesn&apos;t work out, most items are
        eligible for return within <strong>7 days of delivery</strong>, subject to the conditions below. Exact
        eligibility for a specific item is always shown on its product page.
      </p>

      <h2>Return Conditions</h2>
      <ul>
        <li>Item must be unworn, unwashed, unaltered and with all original tags attached.</li>
        <li>Item must be returned in its original packaging where possible.</li>
        <li>Festive and kurti-set items may have adjusted return windows — check the product page.</li>
        <li>Sale and clearance items may be marked non-returnable at the time of purchase.</li>
      </ul>

      <h2>How to Start a Return</h2>
      <p>
        Go to{" "}
        <a href="/track-order" className="font-medium text-primary hover:underline">
          Track Order
        </a>
        , open your order, and request a return from there — or message us on WhatsApp with your order number and
        we&apos;ll guide you through pickup.
      </p>

      <h2>Refunds</h2>
      <p>
        Once we receive and inspect your returned item, refunds are processed to your original payment method within
        5-7 business days. For COD orders, refunds are issued via bank transfer or store credit, whichever you
        prefer.
      </p>

      <h2>Exchanges</h2>
      <p>
        Need a different size or colour? Let us know when you request your return and we&apos;ll prioritise
        dispatching the exchange as soon as the original item is received.
      </p>

      <h2>Damaged or Incorrect Items</h2>
      <p>
        If you receive a damaged, defective or incorrect item, please contact us within 48 hours of delivery with
        photos — we&apos;ll arrange a free replacement or full refund, no questions asked.
      </p>
    </PolicyLayout>
  );
}
