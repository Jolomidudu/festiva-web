import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Gift,
  Heart,
  Mail,
  MapPin,
  Send,
  Users,
  Sparkles,
  Clock3,
} from "lucide-react";

import Navbar from "@/components/landing/Navbar";

const features = [
  {
    icon: Heart,
    title: "Beautiful event websites",
    text: "Create a beautiful home for your story, event details, schedule and memories.",
  },
  {
    icon: Users,
    title: "Guest management",
    text: "Keep your guests, plus-ones, contact details and RSVP responses organized.",
  },
  {
    icon: Mail,
    title: "Digital invitations",
    text: "Create personalized invitations and share them with your guests through a simple link.",
  },
  {
    icon: CalendarDays,
    title: "Event planning",
    text: "Keep dates, venues, schedules and important event information together.",
  },
  {
    icon: Send,
    title: "RSVP management",
    text: "Give guests an easy way to respond and keep their attendance status up to date.",
  },
  {
    icon: Gift,
    title: "Gift registry",
    text: "Give your guests a thoughtful way to discover gifts and support your celebration.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your event",
    text: "Start with your celebration details including the name, date, location and description.",
  },
  {
    number: "02",
    title: "Add your guests",
    text: "Organize the people you want to celebrate with and keep their information in one place.",
  },
  {
    number: "03",
    title: "Send invitations",
    text: "Create invitations and share a personalized invitation link with your guests.",
  },
  {
    number: "04",
    title: "Manage the celebration",
    text: "Track RSVPs, manage your schedule and keep everything organized as your event approaches.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f6] text-[#193c32]">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative">
        <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#e7eee8] blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-2 lg:px-8 lg:pb-28">
          {/* Hero Copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dce6df] bg-[#e7eee8] px-4 py-2 text-sm font-medium text-[#193c32]">
              <Sparkles size={15} />
              Your special moments, beautifully managed.
            </div>

            <h1 className="serif mt-7 max-w-3xl text-5xl leading-[0.98] tracking-tight text-[#193c32] sm:text-6xl md:text-7xl">
              Plan the celebration.
              <span className="block text-[#c99a6b]">
                Enjoy the moment.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#6c716d] sm:text-lg sm:leading-8">
              Festyvibe brings your event website, invitations, guests, RSVPs,
              schedule and celebration details into one elegant experience.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#193c32] px-6 py-4 font-medium text-white transition hover:bg-[#244c40]"
              >
                Create your Festyvibe
                <ArrowRight size={18} />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-[#dcd8cf] bg-white px-6 py-4 font-medium text-[#193c32] transition hover:bg-[#f4f2ed]"
              >
                Explore features
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#777c78]">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-[#193c32]" />
                Guest management
              </div>

              <div className="flex items-center gap-2">
                <Check size={16} className="text-[#193c32]" />
                Digital invitations
              </div>

              <div className="flex items-center gap-2">
                <Check size={16} className="text-[#193c32]" />
                RSVP tracking
              </div>
            </div>
          </div>

          {/* Hero Product Preview */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-8 rounded-[3rem] bg-[#dfe9e2] blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-3 shadow-2xl">
              <div className="relative h-[480px] overflow-hidden rounded-[1.5rem] bg-[#e7eee8] sm:h-[540px]">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
                  alt="Wedding celebration"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                <div className="absolute left-5 right-5 top-5 flex items-center justify-between rounded-full bg-white/90 px-4 py-3 text-xs font-medium text-[#193c32] backdrop-blur sm:left-6 sm:right-6">
                  <span>Festyvibe</span>
                  <span>Wedding invitation</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur sm:bottom-7 sm:left-7 sm:right-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c99a6b]">
                    You're invited
                  </p>

                  <p className="serif mt-2 text-3xl text-[#193c32]">
                    Timi & Lola
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#777c78]">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      Saturday, November 22
                    </span>

                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      Lagos, Nigeria
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating schedule card */}
            <div className="absolute -bottom-6 -left-2 hidden w-52 rounded-2xl border border-[#ebe8e1] bg-white p-4 shadow-xl sm:block lg:-left-12">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c99a6b]">
                <Clock3 size={14} />
                Schedule
              </div>

              <p className="mt-2 text-sm font-semibold text-[#193c32]">
                Wedding Ceremony
              </p>

              <p className="mt-1 text-xs text-[#777c78]">
                10:30 AM · Lagos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO / VALUE
      ========================================================= */}
      <section className="border-y border-[#ebe8e1] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c99a6b]">
              One place for everything
            </p>

            <h2 className="serif mt-3 max-w-3xl text-4xl leading-tight text-[#193c32] sm:text-5xl">
              Your celebration deserves more than scattered notes and
              messages.
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-xl text-base leading-7 text-[#777c78]">
              From the first guest list to the final RSVP, Festyvibe gives you
              one place to organize the important details of your celebration
              and create a beautiful experience for your guests.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section id="features" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c99a6b]">
              Everything in one place
            </p>

            <h2 className="serif mt-3 text-4xl leading-tight text-[#193c32] sm:text-5xl">
              Made for the moments that matter.
            </h2>

            <p className="mt-5 text-base leading-7 text-[#777c78]">
              The tools you need to organize your celebration and keep your
              guests connected.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group rounded-[1.75rem] border border-[#ebe8e1] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e2d5] text-[#193c32] transition group-hover:bg-[#193c32] group-hover:text-white">
                  <Icon size={21} />
                </div>

                <h3 className="mt-6 text-base font-semibold text-[#193c32]">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#777c78]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-y border-[#ebe8e1] bg-[#f3f1eb]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-24 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c99a6b]">
                How it works
              </p>

              <h2 className="serif mt-3 text-4xl leading-tight text-[#193c32] sm:text-5xl">
                From idea to celebration.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-[#777c78]">
                Keep the planning simple. Create your event, organize your
                guests and let Festyvibe handle the details that keep
                everything moving.
              </p>

              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#193c32] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#244c40]"
              >
                Start planning
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[1.75rem] border border-[#e4e0d7] bg-white p-6 sm:p-8"
                >
                  <div className="flex gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#193c32] text-xs font-semibold text-white">
                      {step.number}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[#193c32]">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#777c78]">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INVITATION EXPERIENCE
      ========================================================= */}
      <section className="bg-[#193c32] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#dcb895]">
              A beautiful guest experience
            </p>

            <h2 className="serif mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">
              Give every guest a place to feel part of the celebration.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
              Your guests can open their invitation, view the event details,
              explore the schedule and respond to your RSVP request from one
              simple experience.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Personalized guest invitations",
                "Event date and location",
                "Schedule and ceremony details",
                "Simple RSVP responses",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/80"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <Check size={14} />
                  </span>

                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Invitation preview */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[2rem] bg-[#f7f5ef] p-3 shadow-2xl">
              <div className="rounded-[1.5rem] border border-[#e7e3da] bg-white px-6 py-9 text-center sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c99a6b]">
                  You are invited
                </p>

                <div className="mx-auto mt-6 h-px w-16 bg-[#c99a6b]/40" />

                <p className="serif mt-6 text-2xl text-[#193c32]">
                  Dear Guest
                </p>

                <p className="mt-5 text-xs uppercase tracking-[0.22em] text-[#999d99]">
                  to celebrate
                </p>

                <h3 className="serif mt-3 text-4xl text-[#193c32]">
                  Timi & Lola
                </h3>

                <p className="mt-6 text-sm leading-6 text-[#777c78]">
                  Join us as we celebrate a beautiful new chapter together.
                </p>

                <div className="mt-7 rounded-2xl bg-[#f5f2eb] p-4 text-left">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={18}
                      className="text-[#193c32]"
                    />

                    <div>
                      <p className="text-xs font-semibold text-[#193c32]">
                        Saturday, November 22
                      </p>

                      <p className="mt-1 text-xs text-[#777c78]">
                        Lagos, Nigeria
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-full bg-[#193c32] px-4 py-3 text-xs font-semibold text-white">
                    Attending
                  </div>

                  <div className="rounded-full border border-[#ddd8ce] px-4 py-3 text-xs font-semibold text-[#193c32]">
                    Maybe
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-24 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#e7eee8] px-6 py-14 text-center sm:px-10 md:py-20">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/50 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c99a6b]">
                Your celebration starts here
              </p>

              <h2 className="serif mt-4 text-4xl leading-tight text-[#193c32] sm:text-5xl">
                Make the planning part of the experience.
              </h2>

              <p className="mt-5 text-base leading-7 text-[#6f756f]">
                Bring your event details, guests, invitations and RSVPs
                together with Festyvibe.
              </p>

              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#193c32] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#244c40]"
              >
                Create your Festyvibe
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-[#ebe8e1] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link href="/" className="serif text-2xl text-[#193c32]">
            Festyvibe
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-[#777c78]">
            <a
              href="#features"
              className="transition hover:text-[#193c32]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-[#193c32]"
            >
              How it works
            </a>

            <Link
              href="/login"
              className="transition hover:text-[#193c32]"
            >
              Sign in
            </Link>
          </div>

          <p className="text-xs text-[#999d99]">
            © {new Date().getFullYear()} Festyvibe
          </p>
        </div>
      </footer>
    </main>
  );
}