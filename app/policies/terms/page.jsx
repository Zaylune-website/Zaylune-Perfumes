import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { FileText } from "lucide-react";

export const metadata = { title: "Terms of Service", alternates: { canonical: "/policies/terms" } };

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service" updated="October 2026" icon={FileText}>
      <p>
        Please read these terms carefully before using <strong>zaylunefragrances.com</strong> or placing an
        order. By accessing the website or completing a purchase, you agree to be bound by these
        terms.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">1. About Zaylune</h2>
      <p>
        Zaylune is an Indian fragrance brand selling perfumes and related products directly to
        customers across India through zaylunefragrances.com.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">2. Eligibility</h2>
      <p>
        You must be at least 18 years old to create an account or place an order. By using this
        website, you confirm that you meet this requirement.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">3. Orders &amp; Pricing</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
        <li>
          We reserve the right to correct pricing errors before an order is confirmed, and to
          cancel or limit order quantities at our discretion.
        </li>
        <li>
          An order confirmation email or WhatsApp message does not constitute final acceptance;
          acceptance is complete when the order is dispatched.
        </li>
      </ul>

      <h2 className="font-display text-xl font-medium text-gold-200">4. Product Descriptions</h2>
      <p>
        We describe fragrance notes, longevity, and sillage to the best of our knowledge.
        Scent perception and performance vary by individual skin chemistry, body heat, and
        environment. We cannot guarantee an identical experience for every wearer, and this does
        not constitute a basis for return.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">5. Payments</h2>
      <p>
        We accept UPI, credit/debit cards, net banking, and Cash on Delivery (COD) where available.
        Payments are processed securely by Razorpay. We do not store your payment credentials.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">6. Shipping &amp; Delivery</h2>
      <p>
        Shipping timelines and charges are governed by our{" "}
        <a href="/policies/shipping" className="text-gold-400 underline underline-offset-2">
          Shipping Policy
        </a>
        . Zaylune is not liable for delays caused by courier partners, natural events, or
        circumstances beyond our control.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">7. Returns &amp; Refunds</h2>
      <p>
        Returns and refunds are governed by our{" "}
        <a href="/policies/refund" className="text-gold-400 underline underline-offset-2">
          Refund &amp; Return Policy
        </a>
        .
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">8. User Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials and
        for all activity that occurs under your account. Notify us immediately at {BRAND.email} if
        you suspect unauthorized access.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">9. Intellectual Property</h2>
      <p>
        All content on zaylunefragrances.com — including logos, product imagery, copy, and design — is the
        exclusive property of Zaylune. You may not reproduce, distribute, or use any content
        without prior written permission.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">10. Limitation of Liability</h2>
      <p>
        Zaylune&apos;s liability in connection with any order is limited to the value of that order.
        We are not liable for indirect, incidental, or consequential damages arising from the use
        of our products or website.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">11. Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes shall be subject to the
        exclusive jurisdiction of the courts in the city where Zaylune is registered.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">12. Changes to These Terms</h2>
      <p>
        We may revise these terms at any time. The updated version will be posted on this page
        with a revised date. Continued use of the website after changes are posted constitutes
        your acceptance.
      </p>

      <p>
        Questions? Write to us at {BRAND.email} or message us on WhatsApp at{" "}
        {BRAND.whatsappDisplay}.
      </p>
    </PolicyLayout>
  );
}
