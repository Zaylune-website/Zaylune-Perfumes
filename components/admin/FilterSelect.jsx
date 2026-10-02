"use client";

import { ChevronDown } from "lucide-react";

// A themed wrapper around a native <select> — appearance-none plus a custom
// chevron, since the browser's own dropdown arrow doesn't match the dark/gold
// admin theme. The popup list itself still renders with OS/browser styling
// (not stylable via CSS), only the closed control is themed.
export default function FilterSelect({ value, onChange, options, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-xl border border-gold-400/10 bg-ink-soft/40 py-2 pl-3 pr-8 text-sm text-ivory transition-colors duration-300 hover:border-gold-400/20 focus:border-gold-400/30 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-ink-soft text-ivory">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ivory/35" />
    </div>
  );
}
