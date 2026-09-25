"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Gift,
  Users,
  Mail,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { api } from "@/lib/api";
import type { Event, Guest } from "@/types";

export default function DashboardPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const events = await api<Event[]>("/events");

        if (events.length === 0) {
          setEvent(null);
          setGuests([]);
          return;
        }

        const currentEvent = events[0];
        setEvent(currentEvent);

        const eventGuests = await api<Guest[]>(
          `/events/${currentEvent.id}/guests`
        );

        setGuests(eventGuests);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const attending = guests.filter(
    (guest) => guest.status === "ATTENDING"
  ).length;

  const pending = guests.filter(
    (guest) => guest.status === "PENDING"
  ).length;

  const responded = guests.filter(
    (guest) =>
      guest.status === "ATTENDING" ||
      guest.status === "MAYBE" ||
      guest.status === "NOT_ATTENDING"
  ).length;

  const responseRate =
    guests.length > 0
      ? Math.round((responded / guests.length) * 100)
      : 0;

  const daysToEvent = event
    ? Math.max(
        0,
        Math.ceil(
          (new Date(event.date).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const formattedDate = event
    ? new Date(event.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="serif text-3xl text-[#193c32]">
              Festyvibe
            </p>
            <p className="mt-2 text-sm text-[#777c78]">
              Loading your celebration...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Unable to load your dashboard
          </h2>

          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#c99a6b]">
            Your celebration workspace
          </p>

          <h1 className="serif mt-1 text-4xl text-[#193c32]">
            Welcome to Festyvibe 👋
          </h1>

          <p className="mt-2 text-[#777c78]">
            Let&apos;s start planning your celebration.
          </p>
        </div>

        <section className="rounded-[2rem] bg-[#193c32] p-8 text-white shadow-xl md:p-12">
          <CalendarDays size={34} />

          <h2 className="serif mt-6 text-4xl">
            Create your first event
          </h2>

          <p className="mt-3 max-w-xl text-white/70">
            Add your wedding, birthday, party, or special celebration
            and start managing everything from one place.
          </p>

          <Link
            href="/event"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#193c32]"
          >
            Create event
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-[#c99a6b]">
          Your celebration workspace
        </p>

        <h1 className="serif mt-1 text-4xl text-[#193c32]">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-[#777c78]">
          Your big day is closer than you think.
        </p>
      </div>

      <section className="overflow-hidden rounded-[2rem] bg-[#193c32] text-white shadow-xl">
        <div className="grid md:grid-cols-[1.15fr_.85fr]">
          <div className="p-7 md:p-9">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs">
              Featured event
            </span>

            <h2 className="serif mt-5 text-4xl md:text-5xl">
              {event.name}
            </h2>

            {event.description && (
              <p className="mt-2 text-lg text-white/75">
                {event.description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-4 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                {formattedDate}
              </span>

              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {event.location}
              </span>
            </div>

            <Link
              href="/event"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#193c32]"
            >
              View event
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="min-h-64 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85')] bg-cover bg-center" />
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Guests"
          value={String(guests.length)}
          helper={`${attending} attending`}
          icon={Users}
        />

        <StatCard
          label="RSVP response"
          value={`${responseRate}%`}
          helper={`${pending} still pending`}
          icon={Mail}
        />

        <StatCard
          label="Days to event"
          value={String(daysToEvent)}
          helper="Keep planning"
          icon={CalendarDays}
        />

        <StatCard
          label="Gift progress"
          value="—"
          helper="Coming soon"
          icon={Gift}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-[#ebe8e1] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#193c32]">
                Quick actions
              </h2>

              <p className="mt-1 text-sm text-[#888d89]">
                Keep your celebration moving.
              </p>
            </div>

            <Link
              href="/settings"
              className="text-sm font-medium text-[#193c32]"
            >
              See all
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              [
                "Create invitation",
                "Design and send invitations",
                Mail,
                "/invitations",
              ],
              [
                "Manage guests",
                "Add guests and track RSVPs",
                Users,
                "/guests",
              ],
              [
                "Manage event",
                "Update your event details",
                CalendarDays,
                "/event",
              ],
              [
                "Manage gifts",
                "Create a wishlist or cash fund",
                Gift,
                "/gifts",
              ],
            ].map(([title, description, Icon, href]) => {
              const ActionIcon = Icon as typeof Mail;

              return (
                <Link
                  key={String(title)}
                  href={String(href)}
                  className="group flex items-center gap-4 rounded-2xl border border-[#eeeae2] p-4 hover:bg-[#faf9f5]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3e2d5] text-[#193c32]">
                    <ActionIcon size={18} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[#202522]">
                      {String(title)}
                    </span>

                    <span className="mt-1 block text-xs text-[#888d89]">
                      {String(description)}
                    </span>
                  </span>

                  <ArrowRight
                    size={16}
                    className="ml-auto text-[#aaa]"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-[#ebe8e1] bg-white p-6">
          <h2 className="text-lg font-semibold text-[#193c32]">
            Event summary
          </h2>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-[#faf9f5] p-4">
              <p className="text-xs text-[#888d89]">Event</p>
              <p className="mt-1 text-sm font-medium text-[#202522]">
                {event.name}
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf9f5] p-4">
              <p className="text-xs text-[#888d89]">Date</p>
              <p className="mt-1 text-sm font-medium text-[#202522]">
                {formattedDate}
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf9f5] p-4">
              <p className="text-xs text-[#888d89]">Guests</p>
              <p className="mt-1 text-sm font-medium text-[#202522]">
                {guests.length} registered
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}