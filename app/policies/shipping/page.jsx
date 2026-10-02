import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { Truck } from "lucide-react";

export const metadata = { title: "Shipping Policy", alternates: { canonical: "/policies/shipping" } };

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy" updated="October 2026" icon={Truck}>
      <p>
        Zaylune ships pan-India. Every order is hand-packed with care to ensure your glass bottles and
        caps arrive safe and intact.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Processing Time</h2>
      <p>
        Orders are processed within <strong>1–2 business days</strong> of payment confirmation.
        You will receive a WhatsApp or email notification as soon as your parcel is handed over to
        our courier partner.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Estimated Delivery</h2>
      <p>
        Standard delivery takes <strong>4–7 business days</strong> for most cities and metro areas.
        Remote or rural pin codes may take up to 10 business days. Delivery estimates begin from the
        day of dispatch, not the day of order.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Shipping Charges</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Free shipping</strong> on all prepaid orders above the threshold shown at checkout.
        </li>
        <li>
          A flat shipping fee applies to prepaid orders below that threshold.
        </li>
        <li>
          Cash on Delivery (COD) orders attract a small handling fee, visible at checkout before
          you confirm.
        </li>
      </ul>

      <h2 className="font-display text-xl font-medium text-gold-200">Order Tracking</h2>
      <p>
        A tracking number is shared via WhatsApp or email once your order ships. You can use it on
        our courier partner&apos;s website to follow your delivery in real time.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Undelivered or Returned Shipments</h2>
      <p>
        If a delivery attempt fails and your parcel is returned to us, we will reach out to
        re-dispatch. Re-shipping charges may apply. Please ensure your address and phone number are
        accurate at checkout.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Contact Us</h2>
      <p>
        For any shipping queries, email us at {BRAND.email} or message us on WhatsApp at{" "}
        {BRAND.whatsappDisplay} with your order number.
      </p>
    </PolicyLayout>
  );
}
