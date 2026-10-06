export const PHONE_PATTERN = "[6-9][0-9]{9}";

export function keepDigits(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, 10);
}

// Returns an error message, or "" when valid. Pass required: false for optional fields.
export function phoneError(value, { required = false } = {}) {
  const val = String(value ?? "").trim();
  if (!val) return required ? "Phone number is required." : "";
  if (!/^\d{10}$/.test(val)) return "Phone number must be exactly 10 digits (numbers only).";
  if (!/^[6-9]/.test(val)) return "Enter a valid 10-digit mobile number starting with 6-9.";
  return "";
}
