import type { Metadata } from "next";
import { PolicyLayout } from "@/components/common/PolicyLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="1 July 2026">
      <p>
        By using the Ruvaya website and placing an order, you agree to the following terms. Please also review our{" "}
        <a href="/shipping-policy" className="font-medium text-primary hover:underline">
          Shipping
        </a>
        ,{" "}
        <a href="/return-refund-policy" className="font-medium text-primary hover:underline">
          Return &amp; Refund
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="font-medium text-primary hover:underline">
          Privacy
        </a>{" "}
        policies, which form part of these terms.
      </p>

      <h2>Orders &amp; Pricing</h2>
      <p>
        All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.
        We reserve the right to correct pricing or availability errors, and will notify you before charging you if a
        correction affects your order.
      </p>

      <h2>Product Information</h2>
      <p>
        We describe fabric, fit and measurements as accurately as possible. Colours may vary slightly from photos
        due to screen settings and lighting during photography.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed securely through Cashfree. Ruvaya does not store your card, UPI or netbanking
        credentials at any point.
      </p>

      <h2>Reviews &amp; User Content</h2>
      <p>
        By submitting a review or photo, you confirm it&apos;s your own genuine experience and grant Ruvaya
        permission to display it on our website and marketing channels. We may edit reviews for length or remove
        content that violates these terms.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        Ruvaya is not liable for indirect or consequential loss arising from use of this website, to the maximum
        extent permitted by applicable Indian law.
      </p>

      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of India, with courts in Bangalore, Karnataka having jurisdiction.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Reach us via the{" "}
        <a href="/help" className="font-medium text-primary hover:underline">
          Help
        </a>{" "}
        page.
      </p>
    </PolicyLayout>
  );
}
