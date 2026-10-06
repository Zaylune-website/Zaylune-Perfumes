import { Sparkles } from "lucide-react";
import { getAllAnnouncements } from "@/actions/admin/announcements";
import { getActiveAnnouncements } from "@/actions/site";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import AnnouncementForm from "./_components/AnnouncementForm";

export const metadata = { title: "Announcements" };

export default async function AdminAnnouncementsPage() {
  const [announcements, liveMessages] = await Promise.all([getAllAnnouncements(), getActiveAnnouncements()]);

  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#a8451a]/15 bg-gradient-to-br from-white/80 via-[#fffaf5]/80 to-[#fde3cf]/40 px-5 py-6 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
        <div className="relative">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
            Top Bar
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1c1109]">
            Site{" "}
            <span className="bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] bg-clip-text text-transparent">Announcements</span>
          </h1>
          <p className="mt-1.5 text-sm sm:text-base font-medium text-[#2b1d12]/75">Shown as a scrolling bar at the top of the storefront.</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#a8451a]">Live Preview</p>
          <p className="text-xs text-[#2b1d12]/65">
            {liveMessages.length ? `${liveMessages.length} live · swipe or auto-scrolls on storefront` : "Nothing live right now"}
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#a8451a]/20 bg-white shadow-sm">
          {liveMessages.length ? (
            <AnnouncementTicker messages={liveMessages} />
          ) : (
            <p className="px-5 py-4 text-center text-sm text-[#2b1d12]/70">
              No active announcement. Mark one as Active below to show it at the top of the storefront.
            </p>
          )}
        </div>
      </div>

      <AnnouncementForm announcements={announcements} />
    </div>
  );
}
