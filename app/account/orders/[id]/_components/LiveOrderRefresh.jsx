"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getOrderTrackingSnapshot } from "@/actions/orderStatus";

const POLL_MS = 20000;

// Quietly checks whether the order changed (admin status, courier scan, webhook)
// and refreshes the page when it did. Pauses while the tab is hidden.
export default function LiveOrderRefresh({ orderId, initialSnapshot }) {
  const router = useRouter();
  const lastSnapshot = useRef(initialSnapshot);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (document.hidden || cancelled) return;
      try {
        const next = await getOrderTrackingSnapshot(orderId);
        if (!cancelled && next && next !== lastSnapshot.current) {
          lastSnapshot.current = next;
          router.refresh();
        }
      } catch {
        // Network blip: try again on the next tick.
      }
    }

    const timer = setInterval(check, POLL_MS);
    const onVisible = () => {
      if (!document.hidden) check();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [orderId, router]);

  return null;
}
