"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Users,
  UserCheck,
  UserX,
  HelpCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { StatCard } from "@/components/dashboard/stat-card";
import { api } from "@/lib/api";
import type { Event, Guest } from "@/types";

type DashboardInvitation = {
  id: string;
  token: string;
  status: "DRAFT" | "SENT" | "OPENED";
  sentAt?: string | null;
  openedAt?: string | null;
  createdAt: string;
  eventId: string;
  guestId: string;
  guest: Guest;
};

type ScheduleItem = {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime?: string | null;
  location?: string | null;
};

export default function DashboardPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [invitations, setInvitations] = useState<
    DashboardInvitation[]
  >([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

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
          setInvitations([]);
          setSchedule([]);
          return;
        }

        const currentEvent = events[0];

        setEvent(currentEvent);

        const [
          eventGuests,
          eventInvitations,
          eventSchedule,
        ] = await Promise.all([
          api<Guest[]>(
            `/events/${currentEvent.id}/guests`
          ),
          api<DashboardInvitation[]>(
            `/events/${currentEvent.id}/invitations`
          ),
          api<ScheduleItem[]>(
            `/events/${currentEvent.id}/schedule`
          ),
        ]);

        setGuests(eventGuests);
        setInvitations(eventInvitations);
        setSchedule(eventSchedule);
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

  /* ---------------------------------
     Guest statistics
  --------------------------------- */

  const attending = guests.filter(
    (guest) => guest.status === "ATTENDING"
  ).length;

  const maybe = guests.filter(
    (guest) => guest.status === "MAYBE"
  ).length;

  const notAttending = guests.filter(
    (guest) => guest.status === "NOT_ATTENDING"
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

  /* ---------------------------------
     Invitation statistics
  --------------------------------- */

  const invitationsSent = invitations.filter(
    (invitation) =>
      invitation.status === "SENT" ||
      invitation.status === "OPENED"
  ).length;

  const invitationsOpened = invitations.filter(
    (invitation) => invitation.status === "OPENED"
  ).length;

  const invitationsDraft = invitations.filter(
    (invitation) => invitation.status === "DRAFT"
  ).length;

  /* ---------------------------------
     Event countdown
  --------------------------------- */

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
  ? new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(event.date))
  : "";

 const formattedShortDate = event
  ? new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(event.date))
  : "";
  /* ---------------------------------
     Helpers
  --------------------------------- */

function formatScheduleTime(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function formatScheduleDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
  function getGuestStatusLabel(status: Guest["status"]) {
    switch (status) {
      case "ATTENDING":
        return "Attending";
      case "MAYBE":
        return "Maybe";
      case "NOT_ATTENDING":
        return "Not attending";
      default:
        return "Pending";
    }
  }

  function getGuestStatusClass(
    status: Guest["status"]
  ) {
    switch (status) {
      case "ATTENDING":
        return "bg-emerald-50 text-emerald-700";
      case "MAYBE":
        return "bg-amber-50 text-amber-700";
      case "NOT_ATTENDING":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  const upcomingSchedule = schedule
    .filter(
      (item) =>
        new Date(item.startTime).getTime() >=
        Date.now()
    )
    .slice(0, 4);

  const recentGuests = guests.slice(0, 5);

  /* ---------------------------------
     Loading state
  --------------------------------- */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-3xl bg-gray-100" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  /* ---------------------------------
     Error state
  --------------------------------- */

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  /* ---------------------------------
     No event state
  --------------------------------- */

  if (!event) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#193c32]/10">
            <CalendarDays className="h-7 w-7 text-[#193c32]" />
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-[#193c32]">
            Create your first event
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Your dashboard will come alive once you create
            an event and start managing your guests,
            invitations and schedule.
          </p>

          <Link
            href="/event"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#193c32] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#102d25]"
          >
            Create event
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* ---------------------------------
          HERO
      --------------------------------- */}

      <section className="relative overflow-hidden rounded-3xl bg-[#193c32]">
        <div className="absolute inset-0">
          <img
            src={
              "coverImage" in event &&
              typeof event.coverImage === "string" &&
              event.coverImage
                ? event.coverImage
                : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80"
            }
            alt={event.name}
            className="h-full w-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#193c32]/95 via-[#193c32]/75 to-[#193c32]/30" />
        </div>

        <div className="relative z-10 px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
              Your event
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {event.name}
            </h1>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/80 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {formattedDate}
              </span>

              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            </div>

            {event.description && (
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/75">
                {event.description}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Link
              href="/event"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#193c32] transition hover:bg-white/90"
            >
              Manage event
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="text-left sm:text-right">
              <p className="text-4xl font-semibold text-white">
                {daysToEvent}
              </p>

              <p className="text-sm text-white/70">
                {daysToEvent === 1
                  ? "day to go"
                  : "days to go"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------
          STATS
      --------------------------------- */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
  icon={UserCheck}
/>

<StatCard
  label="Invitations"
  value={String(invitations.length)}
  helper={`${invitationsOpened} opened`}
  icon={Mail}
/>

<StatCard
  label="Days to event"
  value={String(daysToEvent)}
  helper={formattedShortDate}
  icon={CalendarDays}
/>
      </section>

      {/* ---------------------------------
          INVITATION + RSVP OVERVIEW
      --------------------------------- */}

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Invitation activity */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Invitations
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#193c32]">
                Invitation activity
              </h2>
            </div>

            <Link
              href="/invitations"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#193c32] hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-2xl font-semibold text-[#193c32]">
                {invitations.length}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Total
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-2xl font-semibold text-[#193c32]">
                {invitationsSent}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Sent
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-2xl font-semibold text-[#193c32]">
                {invitationsOpened}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Opened
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {invitations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
                <Mail className="mx-auto h-6 w-6 text-gray-300" />

                <p className="mt-3 text-sm font-medium text-gray-600">
                  No invitations yet
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Create invitations for your guests to start
                  tracking responses.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Draft invitations
                  </span>

                  <span className="font-medium text-gray-800">
                    {invitationsDraft}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Invitations sent
                  </span>

                  <span className="font-medium text-gray-800">
                    {invitationsSent}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Invitations opened
                  </span>

                  <span className="font-medium text-gray-800">
                    {invitationsOpened}
                  </span>
                </div>

                {invitationsSent > 0 && (
                  <div className="pt-2">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Open rate
                      </span>

                      <span className="font-medium text-gray-700">
                        {Math.round(
                          (invitationsOpened /
                            invitationsSent) *
                            100
                        )}
                        %
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#193c32] transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (invitationsOpened /
                                invitationsSent) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* RSVP breakdown */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Guest responses
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#193c32]">
                RSVP overview
              </h2>
            </div>

            <Link
              href="/rsvps"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#193c32] hover:underline"
            >
              Manage
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Attending
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {attending}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${
                        guests.length
                          ? (attending / guests.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <HelpCircle className="h-5 w-5 text-amber-600" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Maybe
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {maybe}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{
                      width: `${
                        guests.length
                          ? (maybe / guests.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <UserX className="h-5 w-5 text-red-600" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Not attending
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {notAttending}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-red-400"
                    style={{
                      width: `${
                        guests.length
                          ? (notAttending /
                              guests.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <Clock3 className="h-5 w-5 text-gray-500" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Pending
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {pending}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gray-400"
                    style={{
                      width: `${
                        guests.length
                          ? (pending / guests.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------
          SCHEDULE + RECENT GUESTS
      --------------------------------- */}

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Event timeline */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Schedule
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#193c32]">
                Event timeline
              </h2>
            </div>

            <Link
              href="/event"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#193c32] hover:underline"
            >
              Manage
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6">
            {upcomingSchedule.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-7 text-center">
                <CalendarDays className="mx-auto h-6 w-6 text-gray-300" />

                <p className="mt-3 text-sm font-medium text-gray-600">
                  No upcoming schedule items
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Add your ceremony, reception and other
                  important moments from the event page.
                </p>

                <Link
                  href="/event"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#193c32] hover:underline"
                >
                  Add schedule
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="relative space-y-5">
                {upcomingSchedule.map(
                  (item, index) => (
                    <div
                      key={item.id}
                      className="relative flex gap-4"
                    >
                      <div className="relative flex flex-col items-center">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#193c32]/10">
                          <Clock3 className="h-4 w-4 text-[#193c32]" />
                        </div>

                        {index !==
                          upcomingSchedule.length - 1 && (
                          <div className="absolute top-9 h-full w-px bg-gray-200" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pb-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <h3 className="font-medium text-gray-800">
                            {item.title}
                          </h3>

                          <span className="text-xs font-medium text-[#193c32]">
                            {formatScheduleTime(
                              item.startTime
                            )}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatScheduleDate(
                            item.startTime
                          )}
                        </p>

                        {item.description && (
                          <p className="mt-2 text-sm leading-5 text-gray-500">
                            {item.description}
                          </p>
                        )}

                        {item.location && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                            <MapPin className="h-3.5 w-3.5" />
                            {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent guests */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Guests
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#193c32]">
                Guest responses
              </h2>
            </div>

            <Link
              href="/guests"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#193c32] hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6">
            {recentGuests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-7 text-center">
                <Users className="mx-auto h-6 w-6 text-gray-300" />

                <p className="mt-3 text-sm font-medium text-gray-600">
                  No guests yet
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Add guests to start managing your
                  event responses.
                </p>

                <Link
                  href="/guests"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#193c32] hover:underline"
                >
                  Manage guests
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#193c32]/10 text-sm font-semibold text-[#193c32]">
                        {guest.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {guest.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-gray-400">
                          {guest.email ||
                            guest.phone ||
                            "No contact information"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getGuestStatusClass(
                        guest.status
                      )}`}
                    >
                      {getGuestStatusLabel(
                        guest.status
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------
          QUICK ACTIONS
      --------------------------------- */}

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
            Quick actions
          </p>

          <h2 className="mt-2 text-xl font-semibold text-[#193c32]">
            Manage your event
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/invitations"
            className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#193c32]/20 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#193c32]/10">
              <Mail className="h-5 w-5 text-[#193c32]" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              Create invitation
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Invite guests and track their responses.
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#193c32]">
              Get started
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/guests"
            className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#193c32]/20 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#193c32]/10">
              <Users className="h-5 w-5 text-[#193c32]" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              Manage guests
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add guests and keep their details up to date.
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#193c32]">
              View guests
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/event"
            className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#193c32]/20 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#193c32]/10">
              <CalendarDays className="h-5 w-5 text-[#193c32]" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              Manage event
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Update event details and manage your timeline.
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#193c32]">
              Open event
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/rsvps"
            className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#193c32]/20 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#193c32]/10">
              <MessageCircle className="h-5 w-5 text-[#193c32]" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              Review RSVPs
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              See who is attending and follow up with pending guests.
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#193c32]">
              View RSVPs
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* ---------------------------------
          EVENT SUMMARY
      --------------------------------- */}

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              Event summary
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#193c32]">
              {event.name}
            </h2>
          </div>

          <Link
            href="/event"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#193c32]/30 hover:text-[#193c32]"
          >
            View event
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
              <CalendarDays className="h-4 w-4 text-gray-500" />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Date
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {formattedShortDate}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
              <MapPin className="h-4 w-4 text-gray-500" />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Location
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {event.location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
              <Users className="h-4 w-4 text-gray-500" />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Guests
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {guests.length}{" "}
                {guests.length === 1
                  ? "guest"
                  : "guests"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}