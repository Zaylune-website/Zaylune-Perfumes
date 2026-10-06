import { CheckCircle2, Package, PackageCheck, Truck, XCircle } from "lucide-react";

// Same layout as the storefront order tracker: "Live Tracking Progress" header,
// a status pill, four steps with a time under each reached step, and a current
// step ring. Steps follow order_status, and the times come from the order row.

const STEPS = [
  { key: "pending", title: "Order Placed", desc: "Received & logged", icon: Package },
  { key: "processing", title: "Processing", desc: "Packing your order", icon: PackageCheck },
  { key: "shipped", title: "Shipped", desc: "In transit with courier", icon: Truck },
  { key: "delivered", title: "Delivered", desc: "Package delivered", icon: CheckCircle2 },
];

const STATUS_INDEX = { pending: 0, processing: 1, shipped: 2, delivered: 3 };

// Two short lines (date, then time) so each step stays narrow on phones.
function formatStepTime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    time: d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

export default function OrderTimeline({ status, placedAt, processingAt, shippedAt, deliveredAt }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-3xl border border-rose-500/30 bg-rose-50/80 p-5 sm:p-6 shadow-sm">
        <XCircle className="h-6 w-6 shrink-0 text-rose-600" />
        <div>
          <p className="font-display text-lg font-extrabold text-rose-900">This order was cancelled</p>
          <p className="text-sm font-medium text-rose-900/70">If you have questions, reach out to us on WhatsApp.</p>
        </div>
      </div>
    );
  }

  const current = STATUS_INDEX[status] ?? 0;
  const progress = (current / (STEPS.length - 1)) * 100;
  const times = {
    pending: formatStepTime(placedAt),
    processing: formatStepTime(processingAt),
    shipped: formatStepTime(shippedAt),
    delivered: formatStepTime(deliveredAt),
  };
  const isLive = current < STEPS.length - 1;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 sm:p-6 md:p-10 shadow-sm backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#d4a359]/[0.08] blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#c04a1c]/[0.07] blur-[90px]" />

      <div className="relative mb-6 flex items-center justify-between gap-3 sm:mb-8">
        <span className="flex min-w-0 items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#2b1d12]/55">
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c04a1c]/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c04a1c]" />
            </span>
          )}
          Live Tracking Progress
        </span>
        <span className="shrink-0 whitespace-nowrap rounded-full border border-[#a8451a]/20 bg-[#fde3cf]/50 px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#a8451a]">
          {STEPS[current].title}
        </span>
      </div>

      <div className="relative my-2">
        <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-[#a8451a]/15 sm:top-6" />
        <div
          className="absolute left-0 top-5 h-1 rounded-full bg-gradient-to-r from-[#8e3510] to-[#e69854] transition-all duration-700 sm:top-6"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />

        <div className="relative flex justify-between">
          {STEPS.map((step, idx) => {
            const isDone = current > idx;
            const isCurrent = current === idx;
            const Icon = step.icon;
            const time = times[step.key];

            return (
              <div key={step.key} className="flex min-w-0 flex-1 flex-col items-center">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-all duration-500 sm:h-12 sm:w-12 ${
                    isDone || isCurrent
                      ? "bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-[0_4px_14px_rgba(142,53,16,0.35)]"
                      : "border-2 border-[#a8451a]/20 bg-[#fffaf5] text-[#a8451a]/35"
                  } ${isCurrent ? "scale-105 ring-4 ring-[#d4a359]/30" : ""}`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="mt-3 w-full px-0.5 text-center">
                  <p className={`text-[11px] leading-tight sm:text-sm md:text-base font-bold ${isDone || isCurrent ? "text-[#1c1109]" : "text-[#2b1d12]/40"}`}>
                    {step.title}
                  </p>
                  <p className="mt-0.5 hidden leading-snug text-xs md:block md:text-sm text-[#2b1d12]/60">{step.desc}</p>
                  {time && (isDone || isCurrent) ? (
                    <div className="mt-1 text-[10px] sm:text-xs md:text-sm font-bold leading-snug text-[#a8451a]">
                      <p className="whitespace-nowrap">{time.date}</p>
                      <p className="whitespace-nowrap">{time.time}</p>
                    </div>
                  ) : isDone ? null : (
                    <p className="mt-1 hidden text-xs md:block md:text-sm italic text-[#2b1d12]/40">Pending</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
