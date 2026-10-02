"use client";

import { Bell, Menu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const loadUser = () => {
      const storedUser =
        localStorage.getItem("festyvibe_user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("festyvibe_user");
        }
      }
    };

    loadUser();

    window.addEventListener(
      "festyvibe:user-updated",
      loadUser
    );

    const formattedDate =
      new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date());

    setCurrentDate(formattedDate);

    return () => {
      window.removeEventListener(
        "festyvibe:user-updated",
        loadUser
      );
    };
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) {
      return "U";
    }

    const parts = user.name
      .trim()
      .split(/\s+/);

    if (parts.length === 1) {
      return parts[0]
        .charAt(0)
        .toUpperCase();
    }

    return `${parts[0].charAt(0)}${
      parts[parts.length - 1].charAt(0)
    }`.toUpperCase();
  }, [user]);

  return (
    <header className="flex h-20 items-center justify-between border-b border-[#ebe8e1] bg-white/80 px-5 backdrop-blur md:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl border border-[#ebe8e1] p-2 text-[#193c32] transition hover:bg-[#f4f2ec] lg:hidden"
        aria-label="Open navigation"
        aria-expanded={false}
      >
        <Menu size={20} />
      </button>

      {/* Desktop date */}
      <div className="hidden lg:block">
        <p className="text-sm text-[#777c78]">
          {currentDate}
        </p>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-xl border border-[#ebe8e1] p-2.5 text-[#193c32] transition hover:bg-[#f4f2ec]"
          aria-label="Notifications"
        >
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#c99a6b]" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 border-l border-[#ebe8e1] pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7eee8] text-sm font-semibold text-[#193c32]">
            {initials}
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-[#202522]">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-[#888d89]">
              Couple
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}