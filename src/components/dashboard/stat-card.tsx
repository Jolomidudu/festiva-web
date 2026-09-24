import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-[#ebe8e1] bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7eee8] text-[#193c32]">
          <Icon size={19} />
        </div>
        <span className="text-xs text-[#888d89]">{helper}</span>
      </div>
      <p className="mt-5 text-2xl font-semibold text-[#193c32]">{value}</p>
      <p className="mt-1 text-sm text-[#777c78]">{label}</p>
    </div>
  );
}