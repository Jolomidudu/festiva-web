import { CheckCircle2, Clock3, XCircle, type LucideIcon } from "lucide-react";

export default function RSVPsPage() {
  const stats: [string, string, LucideIcon][] = [
    ["98", "Attending", CheckCircle2],
    ["12", "Maybe", Clock3],
    ["10", "Not attending", XCircle],
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-[#c99a6b]">Guest responses</p>
      <h1 className="serif mt-1 text-4xl text-[#193c32]">RSVPs</h1>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {stats.map(([value, label, Icon]) => {
          const I = Icon;
          return (
            <div key={String(label)} className="rounded-3xl border border-[#ebe8e1] bg-white p-6">
              <I size={20} className="text-[#193c32]" />
              <p className="mt-5 text-3xl font-semibold text-[#193c32]">{value}</p>
              <p className="mt-1 text-sm text-[#777c78]">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}