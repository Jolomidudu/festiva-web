"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  CircleHelp,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import { api } from "@/lib/api";

type RsvpStatus =
  | "PENDING"
  | "ATTENDING"
  | "MAYBE"
  | "NOT_ATTENDING";

type Guest = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: RsvpStatus;
  plusOne: boolean;
  dietaryRequirements?: string | null;
};

type Event = {
  id: string;
  name: string;
};

type Filter = "ALL" | RsvpStatus;

function getStatusLabel(status: RsvpStatus) {
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

function getStatusClasses(status: RsvpStatus) {
  switch (status) {
    case "ATTENDING":
      return "bg-[#e7f3ea] text-[#4f8567]";

    case "MAYBE":
      return "bg-[#f8f0df] text-[#a47737]";

    case "NOT_ATTENDING":
      return "bg-[#f7e7e7] text-[#a35b5b]";

    default:
      return "bg-[#f1eee8] text-[#777c78]";
  }
}

function getStatusIcon(status: RsvpStatus) {
  switch (status) {
    case "ATTENDING":
      return <CheckCircle2 size={14} />;

    case "MAYBE":
      return <CircleHelp size={14} />;

    case "NOT_ATTENDING":
      return <XCircle size={14} />;

    default:
      return <Clock3 size={14} />;
  }
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function RSVPsPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  useEffect(() => {
    loadRsvps();
  }, []);

  async function loadRsvps() {
    try {
      setLoading(true);
      setError("");

      const events = await api<Event[]>("/events");

      if (!events.length) {
        setEvent(null);
        setGuests([]);
        return;
      }

      const firstEvent = events[0];

      setEvent(firstEvent);

      const guestData = await api<Guest[]>(
        `/events/${firstEvent.id}/guests`
      );

      setGuests(guestData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load RSVP information."
      );
    } finally {
      setLoading(false);
    }
  }

  const counts = useMemo(() => {
    return {
      total: guests.length,

      attending: guests.filter(
        (guest) => guest.status === "ATTENDING"
      ).length,

      maybe: guests.filter(
        (guest) => guest.status === "MAYBE"
      ).length,

      pending: guests.filter(
        (guest) => guest.status === "PENDING"
      ).length,

      notAttending: guests.filter(
        (guest) => guest.status === "NOT_ATTENDING"
      ).length,

      plusOnes: guests.filter(
        (guest) => guest.plusOne
      ).length,
    };
  }, [guests]);

  const filteredGuests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return guests.filter((guest) => {
      const matchesSearch =
        !query ||
        guest.name.toLowerCase().includes(query) ||
        guest.email?.toLowerCase().includes(query) ||
        guest.phone?.toLowerCase().includes(query);

      const matchesFilter =
        filter === "ALL" || guest.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [guests, search, filter]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#d9d5cc] border-t-[#193c32]" />

            <p className="mt-4 text-sm text-[#777c78]">
              Loading RSVP responses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-[#ebe8e1] bg-white p-10 text-center">
          <Users
            size={42}
            className="mx-auto text-[#193c32]"
          />

          <h1 className="serif mt-4 text-3xl text-[#193c32]">
            No event yet
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777c78]">
            Create an event first, then your guest RSVP
            responses will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[#c99a6b]">
          Guest responses
        </p>

        <h1 className="serif mt-1 text-4xl text-[#193c32]">
          RSVPs
        </h1>

        <p className="mt-2 text-sm text-[#777c78]">
          Track responses from guests invited to{" "}
          {event.name}.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-2xl border border-[#efd5d5] bg-[#fff7f7] px-4 py-3 text-sm text-[#a35b5b]">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <RsvpStat
          label="Total guests"
          value={counts.total}
          icon={Users}
        />

        <RsvpStat
          label="Attending"
          value={counts.attending}
          icon={CheckCircle2}
        />

        <RsvpStat
          label="Maybe"
          value={counts.maybe}
          icon={CircleHelp}
        />

        <RsvpStat
          label="Pending"
          value={counts.pending}
          icon={Clock3}
        />

        <RsvpStat
          label="Not attending"
          value={counts.notAttending}
          icon={XCircle}
        />
      </div>

      {/* Response summary */}
      <div className="mt-7 rounded-3xl border border-[#ebe8e1] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#202522]">
              Response summary
            </h2>

            <p className="mt-1 text-xs text-[#888d89]">
              Live totals based on your guest list.
            </p>
          </div>

          <div className="rounded-full bg-[#f7f5ef] px-4 py-2 text-xs text-[#777c78]">
            {counts.plusOnes} plus-one
            {counts.plusOnes === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-6">
          <ResponseBar
            label="Attending"
            value={counts.attending}
            total={counts.total}
          />

          <ResponseBar
            label="Maybe"
            value={counts.maybe}
            total={counts.total}
          />

          <ResponseBar
            label="Pending"
            value={counts.pending}
            total={counts.total}
          />

          <ResponseBar
            label="Not attending"
            value={counts.notAttending}
            total={counts.total}
          />
        </div>
      </div>

      {/* Guest responses */}
      <div className="mt-7 rounded-3xl border border-[#ebe8e1] bg-white p-5">
        <div>
          <h2 className="text-base font-semibold text-[#202522]">
            Guest responses
          </h2>

          <p className="mt-1 text-xs text-[#888d89]">
            View the RSVP status of every guest.
          </p>
        </div>

        {/* Search */}
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#f7f5ef] px-4">
          <Search
            size={17}
            className="shrink-0 text-[#999d99]"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guests..."
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </div>

        {/* Filters */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <FilterButton
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
          >
            All ({counts.total})
          </FilterButton>

          <FilterButton
            active={filter === "ATTENDING"}
            onClick={() => setFilter("ATTENDING")}
          >
            Attending ({counts.attending})
          </FilterButton>

          <FilterButton
            active={filter === "MAYBE"}
            onClick={() => setFilter("MAYBE")}
          >
            Maybe ({counts.maybe})
          </FilterButton>

          <FilterButton
            active={filter === "PENDING"}
            onClick={() => setFilter("PENDING")}
          >
            Pending ({counts.pending})
          </FilterButton>

          <FilterButton
            active={filter === "NOT_ATTENDING"}
            onClick={() =>
              setFilter("NOT_ATTENDING")
            }
          >
            Not attending ({counts.notAttending})
          </FilterButton>
        </div>

        {/* List */}
        <div className="mt-5">
          {filteredGuests.length === 0 ? (
            <div className="py-14 text-center">
              <Users
                size={36}
                className="mx-auto text-[#c9c5bc]"
              />

              <p className="mt-3 text-sm font-medium text-[#454b47]">
                No RSVP responses found
              </p>

              <p className="mt-1 text-xs text-[#999d99]">
                Try another search or filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#eeeae2]">
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex flex-col gap-4 py-5 md:flex-row md:items-center"
                >
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e7eee8] text-sm font-semibold text-[#193c32]">
                    {getInitials(guest.name)}
                  </div>

                  {/* Guest */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#202522]">
                        {guest.name}
                      </p>

                      {guest.plusOne && (
                        <span className="rounded-full bg-[#f5eee6] px-2.5 py-1 text-[11px] font-medium text-[#9a744d]">
                          +1
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#888d89]">
                      {guest.email && (
                        <span>{guest.email}</span>
                      )}

                      {guest.phone && (
                        <span>{guest.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                      guest.status
                    )}`}
                  >
                    {getStatusIcon(guest.status)}

                    {getStatusLabel(guest.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {guests.length > 0 && (
          <div className="mt-5 border-t border-[#eeeae2] pt-4 text-xs text-[#999d99]">
            Showing {filteredGuests.length} of{" "}
            {guests.length} guests
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

function RsvpStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-3xl border border-[#ebe8e1] bg-white p-5">
      <Icon
        size={20}
        className="text-[#193c32]"
      />

      <p className="mt-5 text-3xl font-semibold text-[#193c32]">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#777c78]">
        {label}
      </p>
    </div>
  );
}

function ResponseBar({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-[#555b57]">
          {label}
        </span>

        <span className="text-[#999d99]">
          {value} · {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#f0ede7]">
        <div
          className="h-full rounded-full bg-[#193c32] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium transition ${
        active
          ? "bg-white text-[#193c32] shadow-sm"
          : "text-[#777c78] hover:bg-white hover:text-[#193c32]"
      }`}
    >
      {children}
    </button>
  );
}