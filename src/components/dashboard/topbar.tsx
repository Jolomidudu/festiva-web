import { Bell, Menu } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-[#ebe8e1] bg-white/80 px-5 backdrop-blur md:px-8">
      <button className="rounded-xl border border-[#ebe8e1] p-2 lg:hidden"><Menu size={20} /></button>
      <div className="hidden lg:block">
        <p className="text-sm text-[#777c78]">Sunday, September 23, 2026</p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button className="relative rounded-xl border border-[#ebe8e1] p-2.5 text-[#193c32]">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#c99a6b]" />
        </button>
        <div className="flex items-center gap-3 border-l border-[#ebe8e1] pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7eee8] text-sm font-semibold text-[#193c32]">TA</div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-[#202522]">Timi Adeyemi</p>
            <p className="text-xs text-[#888d89]">Couple</p>
          </div>
        </div>
      </div>
    </header>
  );
}