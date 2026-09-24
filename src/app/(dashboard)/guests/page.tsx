import { Search, UserPlus } from "lucide-react";

const guests = [
  ["Adebayo Adeyemi", "Attending"],
  ["Chioma Okafor", "Attending"],
  ["Daniel Martins", "Attending"],
  ["Esther Wilson", "Maybe"],
  ["Femi Akinola", "Attending"],
  ["Grace Eze", "Not attending"],
  ["Ibrahim Yusuf", "Attending"],
];

export default function GuestsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#c99a6b]">Guest management</p>
          <h1 className="serif mt-1 text-4xl text-[#193c32]">Guests</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white">
          <UserPlus size={17} /> Add guest
        </button>
      </div>

      <div className="mt-7 rounded-3xl border border-[#ebe8e1] bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-[#f7f5ef] px-4">
            <Search size={17} className="text-[#999d99]" />
            <input className="w-full bg-transparent py-3 text-sm outline-none" placeholder="Search guests..." />
          </div>
          <div className="flex rounded-2xl bg-[#f7f5ef] p-1 text-sm">
            <button className="rounded-xl bg-white px-4 py-2 font-medium text-[#193c32] shadow-sm">All (120)</button>
            <button className="px-4 py-2 text-[#777c78]">Attending</button>
            <button className="px-4 py-2 text-[#777c78]">Not attending</button>
          </div>
        </div>

        <div className="mt-5 divide-y divide-[#eeeae2]">
          {guests.map(([name, status]) => (
            <div key={name} className="flex items-center gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7eee8] text-sm font-semibold text-[#193c32]">
                {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#202522]">{name}</p>
                <p className={`mt-1 text-xs ${status === "Not attending" ? "text-[#a35b5b]" : status === "Maybe" ? "text-[#b0803e]" : "text-[#4f8567]"}`}>
                  ● {status}
                </p>
              </div>
              <button className="text-sm text-[#777c78]">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}