import type { Metadata } from "next";
import { PolicyLayout } from "@/components/common/PolicyLayout";

export const metadata: Metadata = {
  title: "Shipping Policy",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated="1 July 2026">
      <p>
        We dispatch every order within 24-48 hours of your availability being confirmed. Delivery timelines below are
        estimates from the date of dispatch, not the date of order.
      </p>

      <h2>Delivery Timelines</h2>
      <ul>
        <li>Metro cities: 2-4 business days</li>
        <li>Rest of India: 4-7 business days</li>
        <li>Remote or low-connectivity pincodes: up to 10 business days</li>
      </ul>

      <h2>Shipping Charges</h2>
      <p>
        Shipping is <strong>free on all prepaid and COD orders above ₹999</strong>. Orders below this amount carry a
        flat shipping fee, shown at checkout before payment — never as a surprise afterward.
      </p>

      <h2>Cash on Delivery</h2>
      <p>
        COD is available across most serviceable pincodes in India. You can check whether your pincode is
        COD-eligible on the product page or at checkout.
      </p>

      <h2>Order Tracking</h2>
      <p>
        Once your order ships, you can track it any time from{" "}
        <a href="/track-order" className="font-medium text-primary hover:underline">
          Track Order
        </a>{" "}
        using your order number and phone number or email.
      </p>

      <h2>Delays</h2>
      <p>
        Occasionally, weather, courier network disruptions or address issues can delay delivery beyond our estimate.
        If your order is significantly delayed, please reach out to us on WhatsApp or via the{" "}
        <a href="/help" className="font-medium text-primary hover:underline">
          Help
        </a>{" "}
        page and we&apos;ll look into it right away.
      </p>
    </PolicyLayout>
  );
}
