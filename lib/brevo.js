const BRAND = {
  ink: "#fff8f0",
  ivory: "#1c1109",
  gold: "#a8451a",
  goldDark: "#d9a98a",
  cardBg: "#fdf3ea",
  border: "#ecd3bd",
};

export async function sendBrevoEmail({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@zaylune.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Zaylune Fragrances";

  if (!apiKey) {
    console.log(`[DEV MODE EMAIL] To: ${to}, Subject: ${subject}\n${html}`);
    return { success: true };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Brevo API Error:", errText);
      return { error: "Failed to send email. Please try again." };
    }

    return { success: true };
  } catch (e) {
    console.error("Brevo send error:", e);
    return { error: "Failed to send email: " + e.message };
  }
}

function emailShell(heading, bodyHtml) {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid ${BRAND.border}; border-radius: 24px; background-color: ${BRAND.ink}; color: ${BRAND.ivory}; text-align: center;">
      <h1 style="color: ${BRAND.gold}; font-size: 22px; font-weight: bold; letter-spacing: 2px; margin: 0 0 24px; font-family: Georgia, serif;">ZAYLUNE FRAGRANCES</h1>
      <hr style="border: 0; border-top: 1px solid ${BRAND.border}; margin: 0 0 24px;" />
      <h2 style="color: ${BRAND.ivory}; font-size: 19px; font-weight: 600; margin: 0 0 8px;">${heading}</h2>
      ${bodyHtml}
      <hr style="border: 0; border-top: 1px solid ${BRAND.border}; margin: 28px 0 20px;" />
      <p style="color: ${BRAND.gold}; opacity: 0.7; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} Zaylune Fragrances. All rights reserved.</p>
    </div>
  `;
}

export function otpEmailHtml(otp) {
  return emailShell(
    "Verify your email",
    `
      <p style="color: ${BRAND.ivory}; opacity: 0.75; font-size: 14px; line-height: 1.6; margin: 0 0 28px; max-width: 360px; margin-left: auto; margin-right: auto;">
        Enter the 6-digit code below to confirm your email and finish creating your account.
      </p>
      <div style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: ${BRAND.gold}; padding: 14px 28px; border: 1.5px solid ${BRAND.goldDark}; border-radius: 16px; background-color: ${BRAND.cardBg};">
        ${otp}
      </div>
      <p style="color: ${BRAND.ivory}; opacity: 0.5; font-size: 12px; line-height: 1.5; margin: 24px 0 0;">
        This code is valid for 10 minutes.<br />If you did not request this, please ignore this email.
      </p>
    `
  );
}

export function resetPasswordEmailHtml(link) {
  return emailShell(
    "Reset your password",
    `
      <p style="color: ${BRAND.ivory}; opacity: 0.75; font-size: 14px; line-height: 1.6; margin: 0 0 28px; max-width: 360px; margin-left: auto; margin-right: auto;">
        We received a request to reset your Zaylune Fragrances account password. Click the button below to choose a new one.
      </p>
      <a href="${link}" style="display: inline-block; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${BRAND.ink}; padding: 14px 32px; border-radius: 999px; background: linear-gradient(135deg, #8e3510 0%, #c04a1c 60%, #d4651f 100%); text-decoration: none;">
        Reset Password
      </a>
      <p style="color: ${BRAND.ivory}; opacity: 0.5; font-size: 12px; line-height: 1.5; margin: 24px 0 0;">
        This link is valid for 30 minutes.<br />If you did not request this, please ignore this email — your password will not change.
      </p>
    `
  );
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

export function orderConfirmationEmailHtml(order) {
  const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  const cell = `padding: 10px 0; border-bottom: 1px solid ${BRAND.border};`;

  const itemRows = (order.order_items || [])
    .map(
      (item) => `
        <tr>
          <td style="${cell} color: ${BRAND.ivory}; text-align: left;">
            ${escapeHtml(item.product_name)}
            ${item.variant_name && item.variant_name !== "Default" ? `<br /><span style="opacity: 0.6; font-size: 12px;">${escapeHtml(item.variant_name)}</span>` : ""}
          </td>
          <td style="${cell} color: ${BRAND.ivory}; text-align: center;">&times; ${Number(item.quantity)}</td>
          <td style="${cell} color: ${BRAND.gold}; text-align: right;">${rupee(item.line_total)}</td>
        </tr>`
    )
    .join("");

  const totalLine = (label, value, color = BRAND.ivory) => `
    <tr>
      <td style="padding: 6px 0; color: ${color}; opacity: 0.8; font-size: 14px; text-align: left;">${label}</td>
      <td style="padding: 6px 0; color: ${color}; font-size: 14px; text-align: right;">${value}</td>
    </tr>`;

  const discount = Number(order.coupon_discount || 0) + Number(order.quantity_discount || 0) + Number(order.bundle_discount || 0);
  const discountRow = discount > 0 ? totalLine("Discount", `-${rupee(discount)}`, "#7fd1a3") : "";

  const address = order.addresses;
  const addressBlock = address
    ? `
      <p style="color: ${BRAND.ivory}; font-size: 14px; font-weight: 600; margin: 0 0 6px;">${escapeHtml(address.full_name)} &middot; ${escapeHtml(address.phone)}</p>
      <p style="color: ${BRAND.ivory}; opacity: 0.75; font-size: 13px; line-height: 1.6; margin: 0;">
        ${escapeHtml(address.address_line_1)}${address.address_line_2 ? `, ${escapeHtml(address.address_line_2)}` : ""}<br />
        ${escapeHtml(address.city)}, ${escapeHtml(address.state)} &mdash; ${escapeHtml(address.postal_code)}
      </p>`
    : "";

  const trackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${order.id}`;
  const paymentLabel = order.payment_method === "COD" ? "Cash on Delivery" : "Paid online";

  return emailShell(
    "Thank you, your order is confirmed",
    `
      <p style="color: ${BRAND.ivory}; opacity: 0.75; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
        We have received your order <strong style="color: ${BRAND.gold};">#${escapeHtml(order.order_number)}</strong>. We will email you again when it ships.
      </p>

      <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr>
            <th style="padding-bottom: 8px; border-bottom: 1px solid ${BRAND.goldDark}; color: ${BRAND.gold}; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; text-align: left;">Item</th>
            <th style="padding-bottom: 8px; border-bottom: 1px solid ${BRAND.goldDark}; color: ${BRAND.gold}; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; text-align: center;">Qty</th>
            <th style="padding-bottom: 8px; border-bottom: 1px solid ${BRAND.goldDark}; color: ${BRAND.gold}; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        ${totalLine("Subtotal", rupee(order.subtotal))}
        ${discountRow}
        ${totalLine("Shipping", Number(order.shipping_cost) === 0 ? "FREE" : rupee(order.shipping_cost))}
        <tr>
          <td style="padding: 12px 0 0; border-top: 1px solid ${BRAND.border}; color: ${BRAND.gold}; font-size: 16px; font-weight: bold; text-align: left;">Total</td>
          <td style="padding: 12px 0 0; border-top: 1px solid ${BRAND.border}; color: ${BRAND.gold}; font-size: 16px; font-weight: bold; text-align: right;">${rupee(order.total_amount)}</td>
        </tr>
      </table>

      <p style="color: ${BRAND.ivory}; opacity: 0.6; font-size: 12px; margin: 16px 0 0; text-align: left;">Payment: ${paymentLabel}</p>

      ${addressBlock ? `<div style="margin-top: 22px; padding: 16px; border: 1px solid ${BRAND.border}; border-radius: 16px; background-color: ${BRAND.cardBg}; text-align: left;"><p style="color: ${BRAND.gold}; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 8px;">Shipping to</p>${addressBlock}</div>` : ""}

      <a href="${trackUrl}" style="display: inline-block; margin-top: 26px; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${BRAND.ink}; padding: 14px 32px; border-radius: 999px; background: linear-gradient(135deg, #8e3510 0%, #c04a1c 60%, #d4651f 100%); text-decoration: none;">
        View Order
      </a>
    `
  );
}
