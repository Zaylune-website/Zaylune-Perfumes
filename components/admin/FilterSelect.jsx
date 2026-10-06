"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

// Custom listbox so the open menu matches the admin theme. Calls onChange with
// an event-like object ({ target: { value } }) to stay compatible with existing callers.
export default function FilterSelect({ value, onChange, options, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (val) => {
    onChange({ target: { value: val } });
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-full border border-[#a8451a]/25 bg-white py-2.5 pl-4 pr-3 text-left text-sm font-semibold text-[#1c1109] shadow-2xs transition-all duration-300 hover:border-[#a8451a]/50 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15"
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#a8451a] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-auto rounded-2xl border border-[#a8451a]/20 bg-white p-1.5 shadow-xl animate-fadeIn"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => pick(opt.value)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#c04a1c] font-bold text-white"
                      : "font-medium text-[#2b1d12] hover:bg-[#fde3cf]/60 hover:text-[#a8451a]"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
