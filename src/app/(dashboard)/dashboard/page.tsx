import Link from "next/link";
import { ArrowRight, CalendarDays, Gift, Users, Mail, MapPin } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-[#c99a6b]">Your celebration workspace</p>
        <h1 className="serif mt-1 text-4xl text-[#193c32]">Hello, Timi 👋</h1>
        <p className="mt-2 text-[#777c78]">Your big day is closer than you think.</p>
      </div>

      <section className="overflow-hidden rounded-[2rem] bg-[#193c32] text-white shadow-xl">
        <div className="grid md:grid-cols-[1.15fr_.85fr]">
          <div className="p-7 md:p-9">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs">Featured event</span>
            <h2 className="serif mt-5 text-4xl md:text-5xl">Timi & Lola</h2>
            <p className="mt-2 text-lg text-white/75">Wedding Celebration</p>
            <div className="mt-7 flex flex-wrap gap-4 text-sm text-white/80">
              <span className="flex items-center gap-2"><CalendarDays size={16} /> Nov 22, 2026</span>
              <span className="flex items-center gap-2"><MapPin size={16} /> Lagos, Nigeria</span>
            </div>
            <Link href="/event" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#193c32]">
              View event <ArrowRight size={16} />
            </Link>
          </div>
          <div className="min-h-64 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85')] bg-cover bg-center" />
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Guests" value="120" helper="98 attending" icon={Users} />
        <StatCard label="RSVP response" value="82%" helper="+12% this week" icon={Mail} />
        <StatCard label="Days to event" value="60" helper="Keep planning" icon={CalendarDays} />
        <StatCard label="Gift progress" value="$2,450" helper="of $5,000" icon={Gift} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-[#ebe8e1] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#193c32]">Quick actions</h2>
              <p className="mt-1 text-sm text-[#888d89]">Keep your celebration moving.</p>
            </div>
            <Link href="/settings" className="text-sm font-medium text-[#193c32]">See all</Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Create invitation", "Design and send invitations", Mail, "/invitations"],
              ["Manage guests", "Add guests and track RSVPs", Users, "/guests"],
              ["Build your website", "Share your story and event details", CalendarDays, "/event"],
              ["Manage gifts", "Create a wishlist or cash fund", Gift, "/gifts"],
            ].map(([title, description, Icon, href]) => {
              const ActionIcon = Icon as typeof Mail;
              return (
                <Link key={String(title)} href={String(href)} className="group flex items-center gap-4 rounded-2xl border border-[#eeeae2] p-4 hover:bg-[#faf9f5]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3e2d5] text-[#193c32]">
                    <ActionIcon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[#202522]">{String(title)}</span>
                    <span className="mt-1 block text-xs text-[#888d89]">{String(description)}</span>
                  </span>
                  <ArrowRight size={16} className="ml-auto text-[#aaa]" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-[#ebe8e1] bg-white p-6">
          <h2 className="text-lg font-semibold text-[#193c32]">Upcoming</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Venue visit", "Oct 03 · 11:00 AM"],
              ["Invitation deadline", "Oct 10"],
              ["Final guest count", "Nov 01"],
            ].map(([title, date]) => (
              <div key={title} className="flex items-center gap-3 rounded-2xl bg-[#faf9f5] p-4">
                <div className="h-2 w-2 rounded-full bg-[#c99a6b]" />
                <div>
                  <p className="text-sm font-medium text-[#202522]">{title}</p>
                  <p className="mt-1 text-xs text-[#888d89]">{date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}