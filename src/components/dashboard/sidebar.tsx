import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Gift,
  Heart,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Event", href: "/event", icon: Heart },
  { label: "Guests", href: "/guests", icon: Users },
  { label: "Invitations", href: "/invitations", icon: CalendarDays },
  { label: "RSVPs", href: "/rsvps", icon: CalendarDays },
  { label: "Gift & Wishlist", href: "/gifts", icon: Gift },
];

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  return (
    <aside className={`${mobile ? "block" : "hidden lg:flex"} w-full lg:w-64 shrink-0 flex-col border-r border-[#ebe8e1] bg-white`}>
      <div className="flex h-20 items-center justify-between border-b border-[#ebe8e1] px-6">
        <Link href="/" className="serif text-3xl text-[#193c32]">Festiva</Link>
        {mobile && <X size={20} />}
      </div>
      <div className="flex-1 p-4">
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a9d9a]">Workspace</p>
        <nav className="space-y-1">
          {navigation.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#646965] hover:bg-[#f4f2ec] hover:text-[#193c32]">
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={15} className="ml-auto opacity-40" />
            </Link>
          ))}
        </nav>
        <p className="px-3 pb-3 pt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a9d9a]">Account</p>
        <Link href="/settings" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#646965] hover:bg-[#f4f2ec]">
          <Settings size={18} /> Settings
        </Link>
      </div>
      <div className="border-t border-[#ebe8e1] p-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#9b5555]">
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </aside>
  );
}