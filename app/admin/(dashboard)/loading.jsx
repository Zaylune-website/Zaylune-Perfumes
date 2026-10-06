export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#a8451a]/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-md bg-[#1c1109]/10" />
          <div className="h-3 w-32 rounded-md bg-[#1c1109]/5" />
        </div>
        <div className="h-11 w-36 rounded-full bg-[#1c1109]/10" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-2xl border border-[#a8451a]/10 bg-white/90"
          />
        ))}
      </div>

      <div className="rounded-3xl border border-[#a8451a]/10 bg-white/90 p-6 md:p-8">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-[#1c1109]/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
