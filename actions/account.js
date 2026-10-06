"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { phoneError } from "@/lib/phone";

export async function updateProfile(_prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const fullName = (formData.get("full_name") || "").trim();
  const phone = (formData.get("phone") || "").trim();

  if (!fullName || !/^[a-zA-Z\s]+$/.test(fullName)) {
    return { error: "Name must only contain letters and spaces." };
  }
  const phoneErr = phoneError(phone);
  if (phoneErr) return { error: phoneErr };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/account");
  return { success: true };
}
