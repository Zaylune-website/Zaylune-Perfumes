import { Users, IndianRupee, Repeat, UserPlus } from "lucide-react";
import { getAllUsers } from "@/actions/admin/users";
import UsersList from "./_components/UsersList";

export const metadata = { title: "Users" };

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
    { label: "Total Users", value: users.length, icon: Users },
    { label: "Total Spend", value: `₹${totalSpend.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Repeat Buyers", value: repeatCount, icon: Repeat },
    { label: "New This Month", value: newThisMonth, icon: UserPlus },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ivory">
          All <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">Users</span>
        </h1>
        <p className="text-sm text-ivory/50 font-light mt-1">
          {users.length} registered user{users.length === 1 ? "" : "s"} — customers and admins.
        </p>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 px-4 py-3.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-lg leading-none text-ivory sm:text-xl">{s.value}</p>
              <p className="truncate text-xs uppercase tracking-wide text-ivory/40">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <UsersList users={users} />
    </div>
  );
}
