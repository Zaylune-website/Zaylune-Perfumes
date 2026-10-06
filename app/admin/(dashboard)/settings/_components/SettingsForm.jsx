"use client";

import { useState, useTransition } from "react";
import { updateSiteSetting } from "@/actions/settings";
import { Check, AlertCircle, Building2, Phone, Share2, Wallet } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-[#a8451a]/20 bg-white px-4 py-2.5 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/50 transition-colors duration-300 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20 hover:border-[#a8451a]/35";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-[#2b1d12]/70";
const panelClass =
  "rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-xl sm:p-6 md:p-8";

const CATEGORIES = {
  brand: { label: "Brand Information", icon: Building2 },
  contact: { label: "Contact Details", icon: Phone },
  social: { label: "Social Media", icon: Share2 },
  payment: { label: "Payment Methods", icon: Wallet },
};

const TOGGLE_LABELS = {
  cod_enabled: "Cash on Delivery",
  online_payment_enabled: "Online Payment (Razorpay)",
};

export default function SettingsForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [pending, startTransition] = useTransition();
  const [savingCategory, setSavingCategory] = useState(null);
  const [saved, setSaved] = useState(null);

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleSaveSection = (category, items) => {
    setSaved(null);
    setSavingCategory(category);
    startTransition(async () => {
      const results = await Promise.all(items.map((item) => updateSiteSetting(item.key, settings[item.key].value)));
      const failed = results.find((r) => !r.success);
      setSavingCategory(null);
      if (failed) {
        setSaved({ category, success: false, error: failed.error });
      } else {
        setSaved({ category, success: true });
        setTimeout(() => setSaved(null), 2000);
      }
    });
  };

  const groupedSettings = {};
  Object.entries(settings).forEach(([key, data]) => {
    const cat = data.category || "general";
    // Home Customization (hero/marquee/choose/journey/limited/testimonials/faq)
    // has its own dedicated page — don't dump those settings here too.
    if (!CATEGORIES[cat]) return;
    if (!groupedSettings[cat]) groupedSettings[cat] = [];
    groupedSettings[cat].push({ key, ...data });
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedSettings).map(([category, items]) => {
        const meta = CATEGORIES[category] || { label: category, icon: Building2 };
        const isSaving = pending && savingCategory === category;
        return (
          <div key={category} className={panelClass}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#a8451a]/20 bg-[#fde3cf]/60 text-[#c04a1c]">
                  <meta.icon className="h-4 w-4" />
                </div>
                <h2 className="font-display text-lg font-bold text-[#1c1109]">{meta.label}</h2>
              </div>
              <button
                onClick={() => handleSaveSection(category, items)}
                disabled={isSaving}
                className="btn-gold w-full px-6 py-2.5 text-xs font-semibold disabled:opacity-60 sm:w-auto"
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {items.map((item) => {
                const isToggle = item.key in TOGGLE_LABELS;
                const isOn = item.value !== "false";

                if (isToggle) {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleChange(item.key, isOn ? "false" : "true")}
                      className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${
                        isOn ? "border-green-400/35 bg-green-50 text-green-900" : "border-[#a8451a]/20 bg-white text-[#2b1d12]/75"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium leading-snug">{TOGGLE_LABELS[item.key]}</span>
                        {item.description && (
                          <span className="mt-0.5 block text-sm leading-snug text-current opacity-70">{item.description}</span>
                        )}
                      </span>
                      <span
                        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${
                          isOn ? "bg-green-400/80" : "bg-[#1c1109]/15"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                            isOn ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                    </button>
                  );
                }

                return (
                  <div key={item.key} className="sm:col-span-2">
                    <label className={labelClass}>{item.description || item.key}</label>
                    <textarea
                      value={item.value}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      rows={item.value.length > 80 ? 3 : 1}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                );
              })}
            </div>

            {saved?.category === category && (
              <div className={`mt-4 flex items-center gap-2 text-sm ${saved.success ? "text-emerald-700" : "text-red-600"}`}>
                {saved.success ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Saved successfully
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5" /> {saved.error}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
