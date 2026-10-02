"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Event",
    href: "/event",
    icon: Heart,
  },
  {
    label: "Guests",
    href: "/guests",
    icon: Users,
  },
  {
    label: "Invitations",
    href: "/invitations",
    icon: CalendarDays,
  },
  {
    label: "RSVPs",
    href: "/rsvps",
    icon: CalendarDays,
  },
  {
    label: "Gift & Wishlist",
    href: "/gifts",
    icon: Gift,
  },
];

type SidebarProps = {
  mobile?: boolean;
  onClose?: () => void;
};

export function Sidebar({
  mobile = false,
  onClose,
}: SidebarProps) {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("festyvibe_token");
    localStorage.removeItem("festyvibe_user");

    router.replace("/login");
  }

  function handleNavigation() {
    if (mobile) {
      onClose?.();
    }
  }

  return (
    <aside
      className={
        mobile
          ? "flex h-full w-[min(86vw,320px)] shrink-0 flex-col bg-white shadow-2xl"
          : "hidden w-64 shrink-0 flex-col border-r border-[#ebe8e1] bg-white lg:flex"
      }
    >
      {/* Logo */}
      <div className="flex h-20 items-center justify-between border-b border-[#ebe8e1] px-6">
        <Link
          href="/"
          onClick={handleNavigation}
          className="serif text-3xl text-[#193c32]"
        >
          Festyvibe
        </Link>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-xl p-2 text-[#777c78] transition hover:bg-[#f4f2ec] hover:text-[#193c32]"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a9d9a]">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map(
            ({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={handleNavigation}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#646965] transition hover:bg-[#f4f2ec] hover:text-[#193c32]"
              >
                <Icon size={18} />

                <span>{label}</span>

                <ChevronRight
                  size={15}
                  className="ml-auto opacity-40"
                />
              </Link>
            )
          )}
        </nav>

        {/* Account */}
        <p className="px-3 pb-3 pt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a9d9a]">
          Account
        </p>

        <Link
          href="/settings"
          onClick={handleNavigation}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#646965] transition hover:bg-[#f4f2ec] hover:text-[#193c32]"
        >
          <Settings size={18} />

          <span>Settings</span>

          <ChevronRight
            size={15}
            className="ml-auto opacity-40"
          />
        </Link>
      </div>

      {/* Sign out */}
      <div className="border-t border-[#ebe8e1] p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#9b5555] transition hover:bg-[#fdf2f2]"
        >
          <LogOut size={18} />

          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}