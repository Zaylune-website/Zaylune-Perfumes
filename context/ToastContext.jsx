"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertCircle, Sparkles, X } from "lucide-react";

const ToastContext = createContext(undefined);

function ToastItem({ toast, onDismiss }) {
  const isError = toast.type === "error";
  const isInfo = toast.type === "info";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -24, scale: 0.92, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -16, scale: 0.92, filter: "blur(2px)", transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      role="alert"
      className="pointer-events-auto relative overflow-hidden rounded-2xl sm:rounded-full border border-[#a8451a]/25 bg-white/95 px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_16px_40px_rgba(43,29,18,0.18),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-xl ring-1 ring-white/70 transition-all w-full sm:w-auto"
    >
      <div className="flex items-center gap-3">
        {/* Glowing luxury icon pill */}
        <div
          className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-white shadow-md ${
            isError
              ? "bg-gradient-to-tr from-rose-600 to-red-500 shadow-rose-500/30"
              : isInfo
              ? "bg-gradient-to-tr from-[#8e3510] to-[#c04a1c] shadow-[#a8451a]/30"
              : "bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/30"
          }`}
        >
          {isError ? (
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
          ) : isInfo ? (
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
          ) : (
            <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
          )}
        </div>

        {/* Message */}
        <p className="flex-1 font-body text-sm sm:text-base font-semibold text-[#1c1109] leading-snug">
          {toast.message}
        </p>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="group flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#2b1d12]/40 hover:bg-[#a8451a]/10 hover:text-[#1c1109] transition-colors"
        >
          <X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
        </button>
      </div>

      {/* Auto-dismiss countdown bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 3.5, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-[2.5px] ${
          isError
            ? "bg-gradient-to-r from-rose-500 to-red-600"
            : isInfo
            ? "bg-gradient-to-r from-[#c04a1c] to-[#a8451a]"
            : "bg-gradient-to-r from-emerald-500 to-teal-600"
        }`}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 inset-x-4 z-[9999] pointer-events-none flex flex-col items-center gap-2.5 sm:inset-x-auto sm:right-6 sm:top-6 sm:items-end sm:max-w-md">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
