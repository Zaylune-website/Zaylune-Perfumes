"use server";

import { checkServiceability } from "@/lib/shiprocket";

// Public: used by the pincode checker on the product page. Only returns
// whether the pincode is serviceable (and COD), never any server data.
export async function checkPincodeServiceability(pincode) {
  if (!/^\d{6}$/.test(String(pincode || ""))) {
    return { success: false, error: "Please enter a valid 6-digit PIN code." };
  }

  try {
    const { serviceable, codAvailable } = await checkServiceability({ deliveryPincode: pincode });

    // Shiprocket's serviceability reply has no district/state, so look those up
    // from the postal directory. Best effort: a timeout just hides the place name.
    let district = null;
    let state = null;
    if (serviceable) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
          signal: controller.signal,
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          const office = data?.[0]?.Status === "Success" ? data[0].PostOffice?.[0] : null;
          if (office) {
            district = office.District;
            state = office.State;
          }
        }
      } catch {
        // Keep serviceable result without a place name.
      }
    }

    return { success: true, serviceable, cod: codAvailable, district, state };
  } catch (err) {
    console.error("[Shiprocket] Serviceability check failed:", err?.message);
    return { success: false, error: "Could not check delivery for this PIN code right now. Please try again." };
  }
}
