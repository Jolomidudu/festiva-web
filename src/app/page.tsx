import Link from "next/link";
import { ArrowRight, CalendarDays, Gift, Heart, Users } from "lucide-react";

const features = [
  { icon: Heart, title: "Wedding Websites", text: "Create a beautiful home for your story, schedule and memories." },
  { icon: Users, title: "Guest Management", text: "Keep every guest, RSVP and plus-one organized in one place." },
  { icon: CalendarDays, title: "Event Planning", text: "Manage dates, venues, schedules and everything in between." },
  { icon: Gift, title: "Gift Registry", text: "Share thoughtful gifts and cash-fund options with your guests." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="serif text-3xl text-[#193c32]">Festyvibe</Link>
        <div className="hidden items-center gap-8 text-sm text-[#5d625e] md:flex">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <Link href="/login">Sign in</Link>
        </div>
        <Link href="/register" className="rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white">
          Get started
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-20">
        <div>
          <span className="mb-6 inline-flex rounded-full bg-[#e7eee8] px-4 py-2 text-sm font-medium text-[#193c32]">
            Your special moments, beautifully managed.
          </span>
          <h1 className="serif max-w-3xl text-6xl leading-[0.95] tracking-tight text-[#193c32] md:text-7xl">
            Plan the celebration. <span className="text-[#c99a6b]">Enjoy the moment.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#6c716d]">
            Festyvibe brings your wedding website, invitations, guests, RSVPs, gifts and event details into one elegant experience.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-6 py-4 font-medium text-white">
              Create your Festyvibe <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="rounded-full border border-[#dcd8cf] bg-white px-6 py-4 font-medium text-[#193c32]">
              View dashboard
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-8 rounded-[3rem] bg-[#e7eee8] blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-3 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
              alt="Wedding celebration"
              className="h-[520px] w-full rounded-[1.5rem] object-cover"
            />
            <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur">
              <p className="serif text-2xl text-[#193c32]">Timi & Lola</p>
              <p className="mt-1 text-sm text-[#777c78]">Saturday, November 22 · Lagos, Nigeria</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-[#ebe8e1] bg-white/60">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c99a6b]">Everything in one place</p>
            <h2 className="serif mt-3 text-4xl text-[#193c32] md:text-5xl">Made for the moments that matter.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-[#ebe8e1] bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e2d5] text-[#193c32]">
                  <Icon size={20} />
                </div>
                <h3 className="mt-6 font-semibold text-[#193c32]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#777c78]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}