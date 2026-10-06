"use server";

import { createClient } from "@/lib/supabase/server";
import { phoneError } from "@/lib/phone";

export async function submitInquiry(_prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const message = formData.get("message");

  if (!name || !message) {
    return { error: "Please share your name and a short message." };
  }
  const phoneErr = phoneError(phone);
  if (phoneErr) return { error: phoneErr };

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    email: email || null,
    phone: phone || null,
    message,
  });

  if (error) return { error: "Something went wrong. Please try WhatsApp instead." };

  return { success: true };
}
