"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("festyvibe_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setCheckingAuth(false);
  }, [router, pathname]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9f7f2]">
        <div className="text-center">
          <p className="serif text-3xl text-[#193c32]">Festyvibe</p>
          <p className="mt-2 text-sm text-[#777c78]">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9f7f2]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}