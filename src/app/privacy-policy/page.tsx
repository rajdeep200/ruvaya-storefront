import type { Metadata } from "next";
import { PolicyLayout } from "@/components/common/PolicyLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="1 July 2026">
      <p>
        This policy explains what information Ruvaya collects when you shop with us, how we use it, and the choices
        you have.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Contact and shipping details you provide at checkout (name, phone, email, address).</li>
        <li>Order and payment status information (we never see or store your card/UPI credentials — Cashfree handles payment directly).</li>
        <li>Browsing behaviour such as pages viewed, products viewed, searches and cart activity, tied to an anonymous visitor ID unless you provide contact details.</li>
        <li>Reviews and photos you choose to submit.</li>
      </ul>

      <h2>How We Use It</h2>
      <ul>
        <li>To process, ship and support your orders.</li>
        <li>To respond to support requests and review submissions.</li>
        <li>To understand which products and pages customers find useful, so we can improve the store.</li>
        <li>To send order updates, and — only with your consent — occasional marketing communication.</li>
      </ul>

      <h2>Cookies &amp; Analytics</h2>
      <p>
        We use essential cookies to run the site (cart, wishlist, checkout) and, with your consent, optional
        analytics cookies (such as Google Analytics and Meta Pixel) to understand overall shopping behaviour. You can
        change your analytics preference any time from the cookie banner.
      </p>

      <h2>Sharing</h2>
      <p>
        We share the minimum necessary information with our payment partner (Cashfree) to process payments, and with
        our shipping partners to deliver your order. We do not sell your personal information to third parties.
      </p>

      <h2>Your Rights</h2>
      <p>
        You can request a copy of the personal data we hold about you, ask us to correct it, or request deletion, by
        contacting us via the{" "}
        <a href="/help" className="font-medium text-primary hover:underline">
          Help
        </a>{" "}
        page.
      </p>
    </PolicyLayout>
  );
}
