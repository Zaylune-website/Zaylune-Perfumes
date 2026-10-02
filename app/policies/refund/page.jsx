import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { RefreshCcw } from "lucide-react";

export const metadata = { title: "Refund Policy", alternates: { canonical: "/policies/refund" } };

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund &amp; Return Policy" updated="October 2026" icon={RefreshCcw}>
      <p>
        At Zaylune, every bottle leaves our hands in perfect condition. If something goes wrong on
        the way to you, we&apos;ll make it right.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">No Returns on Opened Products</h2>
      <p>
        Because our fragrances are personal care products applied directly to skin, we are unable
        to accept returns or exchanges on bottles that have been opened, used, or tampered with —
        for the safety and hygiene of all our customers.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Damaged, Leaking, or Wrong Items</h2>
      <p>
        If your order arrives damaged, leaking, or if you received an incorrect product, please
        contact us <strong>within 48 hours of delivery</strong> with:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Clear photos of the product and packaging.</li>
        <li>Your order ID.</li>
      </ul>
      <p>
        We will arrange a <strong>free replacement</strong> or issue a <strong>full refund</strong>{" "}
        — your choice.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Cancellations</h2>
      <p>
        You may cancel your order at any time <strong>before it is dispatched</strong>, completely
        free of charge. Once the parcel has been handed to our courier, cancellation is no longer
        possible. To cancel, email us or message us on WhatsApp immediately with your order number.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Refund Timeline</h2>
      <p>
        Once your refund is approved, the amount will be credited to your original payment method
        within <strong>5–7 business days</strong>. For UPI and net banking, it may reflect sooner.
        COD orders are refunded via bank transfer; please provide your bank details when you
        contact us.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">How to Reach Us</h2>
      <p>
        Email: {BRAND.email}
        <br />
        WhatsApp: {BRAND.whatsappDisplay}
        <br />
        Please include your order number in all communications so we can help you faster.
      </p>
    </PolicyLayout>
  );
}
