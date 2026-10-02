import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Privacy Policy", alternates: { canonical: "/policies/privacy" } };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" updated="October 2026" icon={ShieldCheck}>
      <p>
        Zaylune (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your
        personal information. This policy explains what data we collect, why we collect it, and how
        we keep it safe.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Information We Collect</h2>
      <p>We may collect the following information when you use our website:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Account &amp; order data:</strong> name, email address, phone number, and
          shipping address when you register or place an order.
        </li>
        <li>
          <strong>Payment information:</strong> we do <em>not</em> store your card, UPI, or
          net-banking details. All payments are processed securely by Razorpay on their
          PCI-DSS compliant infrastructure.
        </li>
        <li>
          <strong>Usage data:</strong> pages visited, time spent, and device/browser type,
          collected via standard server logs to help us improve the site.
        </li>
      </ul>

      <h2 className="font-display text-xl font-medium text-gold-200">How We Use Your Information</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>To process, fulfil, and communicate updates about your orders.</li>
        <li>To send order and delivery notifications via WhatsApp or email.</li>
        <li>To respond to your queries and support requests.</li>
        <li>To improve our products, website experience, and customer service.</li>
        <li>To send promotional messages — only if you have opted in, and you can opt out at any time.</li>
      </ul>
      <p>
        We do <strong>not</strong> sell, rent, or trade your personal data to any third party for
        marketing purposes.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Third-Party Services</h2>
      <p>
        We share minimal necessary data with trusted service providers to operate our business:
        Razorpay for payment processing, Delhivery for order delivery, and Supabase for secure
        data storage. Each of these partners maintains their own privacy and security standards.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Cookies</h2>
      <p>
        We use essential cookies to keep you logged in, remember items in your bag, and maintain
        your session. We do <strong>not</strong> use third-party advertising or cross-site tracking
        cookies.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Data Retention</h2>
      <p>
        We retain your account and order data for as long as your account is active or as needed
        to provide services and comply with legal obligations.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Your Rights</h2>
      <p>You have the right to:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Access the personal data we hold about you.</li>
        <li>Request correction of inaccurate data.</li>
        <li>Request deletion of your account and associated data.</li>
        <li>Opt out of marketing communications at any time.</li>
      </ul>
      <p>
        To exercise any of these rights, email us at {BRAND.email}.
      </p>

      <h2 className="font-display text-xl font-medium text-gold-200">Policy Updates</h2>
      <p>
        We may update this policy from time to time. The &quot;last updated&quot; date at the top
        of this page will reflect any changes. Continued use of our website after an update
        constitutes your acceptance of the revised policy.
      </p>
    </PolicyLayout>
  );
}
