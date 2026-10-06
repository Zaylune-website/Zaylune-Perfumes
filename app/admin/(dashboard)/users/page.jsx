import { Users, IndianRupee, Repeat, UserPlus, Sparkles } from "lucide-react";
import { getAllUsers } from "@/actions/admin/users";
import UsersList from "./_components/UsersList";

export const metadata = { title: "Users" };

const cardClass = "rounded-3xl border border-[#a8451a]/20 bg-white/90 backdrop-blur-xl shadow-sm";

const STAT_TONES = {
  copper: "bg-[#fde3cf]/60 text-[#c04a1c] border-[#a8451a]/20",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-500/25",
  violet: "bg-violet-50 text-violet-700 border-violet-500/25",
  rose: "bg-rose-50 text-rose-700 border-rose-500/25",
};

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  const totalSpend = users.reduce((sum, u) => sum + u.totalSpend, 0);
  const repeatCount = users.filter((u) => u.orderCount > 1).length;
  const newThisMonth = users.filter((u) => {
    const created = new Date(u.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, tone: "copper" },
    { label: "Total Spend", value: `₹${totalSpend.toLocaleString("en-IN")}`, icon: IndianRupee, tone: "emerald" },
    { label: "Repeat Buyers", value: repeatCount, icon: Repeat, tone: "violet" },
    { label: "New This Month", value: newThisMonth, icon: UserPlus, tone: "rose" },
  ];

  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#a8451a]/15 bg-gradient-to-br from-white/80 via-[#fffaf5]/80 to-[#fde3cf]/40 px-5 py-6 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
        <div className="relative">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
            Customers
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1c1109]">
            All{" "}
            <span className="bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] bg-clip-text text-transparent">Users</span>
          </h1>
          <p className="mt-1.5 text-sm sm:text-base font-medium text-[#2b1d12]/75">
            {users.length} registered user{users.length === 1 ? "" : "s"} — customers and admins.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`group relative overflow-hidden ${cardClass} flex items-center gap-3 p-3.5 sm:gap-3.5 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border shadow-2xs transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10 ${STAT_TONES[s.tone]}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl sm:text-2xl font-extrabold leading-none text-[#1c1109]">{s.value}</p>
              <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase leading-tight tracking-wide text-[#a8451a]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <UsersList users={users} />
    </div>
  );
}
