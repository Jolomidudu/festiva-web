"use client";

import {
  CalendarClock,
  Globe2,
  Loader2,
  Save,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";

type Event = {
  id: string;
  name: string;
  date: string;
};

type EventPreference = {
  id: string;
  eventId: string;
  timezone: string;
  rsvpDeadline: string | null;
  allowPlusOne: boolean;
  allowRsvpChanges: boolean;
  showGuestContactInfo: boolean;
  visibility: "PRIVATE" | "PUBLIC";
};

type EventsResponse = Event[];

const timezones = [
  {
    value: "Africa/Lagos",
    label: "West Africa Time (Lagos)",
  },
  {
    value: "Africa/Accra",
    label: "Greenwich Mean Time (Accra)",
  },
  {
    value: "Europe/London",
    label: "United Kingdom",
  },
  {
    value: "America/New_York",
    label: "Eastern Time (New York)",
  },
  {
    value: "America/Los_Angeles",
    label: "Pacific Time (Los Angeles)",
  },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked
          ? "bg-[#193c32]"
          : "bg-[#d9d8d3]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          checked
            ? "left-6"
            : "left-1"
        }`}
      />
    </button>
  );
}

function formatDateTimeLocal(
  value: string | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");
  const hours = String(
    date.getHours(),
  ).padStart(2, "0");
  const minutes = String(
    date.getMinutes(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function dateTimeLocalToIso(
  value: string,
) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export function EventPreferences() {
  const [events, setEvents] =
    useState<EventsResponse>([]);

  const [selectedEventId, setSelectedEventId] =
    useState("");

  const [preferences, setPreferences] =
    useState<EventPreference | null>(null);

  const [loadingEvents, setLoadingEvents] =
    useState(true);

  const [loadingPreferences, setLoadingPreferences] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoadingEvents(true);
        setError("");

        const response =
          await api<EventsResponse>("/events");

        setEvents(response);

        if (response.length > 0) {
          setSelectedEventId(
            response[0].id,
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your events.",
        );
      } finally {
        setLoadingEvents(false);
      }
    }

    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    async function loadPreferences() {
      try {
        setLoadingPreferences(true);
        setError("");
        setMessage("");

        const response =
          await api<EventPreference>(
            `/events/${selectedEventId}/preferences`,
          );

        setPreferences(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load event preferences.",
        );
      } finally {
        setLoadingPreferences(false);
      }
    }

    loadPreferences();
  }, [selectedEventId]);

  function updatePreference<
    K extends keyof EventPreference
  >(
    key: K,
    value: EventPreference[K],
  ) {
    setPreferences((current) =>
      current
        ? {
            ...current,
            [key]: value,
          }
        : current,
    );

    setMessage("");
    setError("");
  }

  async function handleSave() {
    if (!preferences || !selectedEventId) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const updated =
        await api<EventPreference>(
          `/events/${selectedEventId}/preferences`,
          {
            method: "PATCH",
            body: JSON.stringify({
              timezone:
                preferences.timezone,
              rsvpDeadline:
                preferences.rsvpDeadline
                  ? new Date(
                      preferences.rsvpDeadline,
                    ).toISOString()
                  : null,
              allowPlusOne:
                preferences.allowPlusOne,
              allowRsvpChanges:
                preferences.allowRsvpChanges,
              showGuestContactInfo:
                preferences.showGuestContactInfo,
              visibility:
                preferences.visibility,
            }),
          },
        );

      setPreferences(updated);
      setMessage(
        "Event preferences saved successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save event preferences.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loadingEvents) {
    return (
      <section className="rounded-3xl border border-[#ebe8e1] bg-white p-6">
        <div className="flex items-center gap-3 text-sm text-[#777c78]">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading your events...
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="rounded-3xl border border-[#ebe8e1] bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7eee8] text-[#193c32]">
            <CalendarClock size={20} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#202522]">
              Event preferences
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#777c78]">
              Create an event first before configuring
              its RSVP and guest preferences.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[#ebe8e1] bg-white">
      {/* Header */}
      <div className="border-b border-[#ebe8e1] p-6 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a9d9a]">
              Event preferences
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#202522]">
              Customize your event experience
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#777c78]">
              Control how guests interact with your event,
              invitations, and RSVP experience.
            </p>
          </div>

          <div className="w-full md:w-72">
            <label
              htmlFor="event-preferences-event"
              className="mb-2 block text-xs font-medium text-[#777c78]"
            >
              Event
            </label>

            <select
              id="event-preferences-event"
              value={selectedEventId}
              onChange={(event) =>
                setSelectedEventId(
                  event.target.value,
                )
              }
              className="w-full rounded-2xl border border-[#dedbd4] bg-white px-4 py-3 text-sm text-[#202522] outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
            >
              {events.map((event) => (
                <option
                  key={event.id}
                  value={event.id}
                >
                  {event.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loadingPreferences ? (
        <div className="p-7">
          <div className="flex items-center gap-3 text-sm text-[#777c78]">
            <Loader2
              size={18}
              className="animate-spin"
            />
            Loading preferences...
          </div>
        </div>
      ) : preferences ? (
        <>
          {/* General */}
          <div className="border-b border-[#ebe8e1] p-6 md:p-7">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f2ec] text-[#193c32]">
                <Globe2 size={19} />
              </div>

              <div>
                <h3 className="font-semibold text-[#202522]">
                  General
                </h3>

                <p className="mt-1 text-sm text-[#777c78]">
                  Set the time and visibility rules for this event.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="event-timezone"
                  className="mb-2 block text-sm font-medium text-[#3e4541]"
                >
                  Event timezone
                </label>

                <select
                  id="event-timezone"
                  value={preferences.timezone}
                  onChange={(event) =>
                    updatePreference(
                      "timezone",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-[#dedbd4] bg-white px-4 py-3.5 text-sm text-[#202522] outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                >
                  {timezones.map((timezone) => (
                    <option
                      key={timezone.value}
                      value={timezone.value}
                    >
                      {timezone.label}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs leading-5 text-[#92958f]">
                  This timezone is used when displaying event
                  times to guests.
                </p>
              </div>

              <div>
                <label
                  htmlFor="event-visibility"
                  className="mb-2 block text-sm font-medium text-[#3e4541]"
                >
                  Event visibility
                </label>

                <select
                  id="event-visibility"
                  value={preferences.visibility}
                  onChange={(event) =>
                    updatePreference(
                      "visibility",
                      event.target
                        .value as EventPreference["visibility"],
                    )
                  }
                  className="w-full rounded-2xl border border-[#dedbd4] bg-white px-4 py-3.5 text-sm text-[#202522] outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                >
                  <option value="PRIVATE">
                    Private — invitation only
                  </option>

                  <option value="PUBLIC">
                    Public — accessible to guests
                  </option>
                </select>

                <p className="mt-2 text-xs leading-5 text-[#92958f]">
                  Controls how your event experience is exposed.
                </p>
              </div>
            </div>
          </div>

          {/* RSVP */}
          <div className="border-b border-[#ebe8e1] p-6 md:p-7">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f2ec] text-[#193c32]">
                <CalendarClock size={19} />
              </div>

              <div>
                <h3 className="font-semibold text-[#202522]">
                  RSVP settings
                </h3>

                <p className="mt-1 text-sm text-[#777c78]">
                  Decide when and how guests can respond.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="rsvp-deadline"
                  className="mb-2 block text-sm font-medium text-[#3e4541]"
                >
                  RSVP deadline
                </label>

                <input
                  id="rsvp-deadline"
                  type="datetime-local"
                  value={formatDateTimeLocal(
                    preferences.rsvpDeadline,
                  )}
                  onChange={(event) =>
                    updatePreference(
                      "rsvpDeadline",
                      dateTimeLocalToIso(
                        event.target.value,
                      ),
                    )
                  }
                  className="w-full rounded-2xl border border-[#dedbd4] bg-white px-4 py-3.5 text-sm text-[#202522] outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10 md:max-w-md"
                />

                <p className="mt-2 text-xs leading-5 text-[#92958f]">
                  Leave empty if you do not want to set a response
                  deadline.
                </p>
              </div>

              <div className="divide-y divide-[#ebe8e1] rounded-2xl border border-[#ebe8e1]">
                <div className="flex items-center justify-between gap-5 p-4">
                  <div className="flex items-start gap-3">
                    <UserPlus
                      size={18}
                      className="mt-0.5 shrink-0 text-[#193c32]"
                    />

                    <div>
                      <p className="text-sm font-medium text-[#202522]">
                        Allow plus-ones
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#777c78]">
                        Let invited guests indicate that they are
                        bringing an additional guest.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    checked={
                      preferences.allowPlusOne
                    }
                    onChange={(value) =>
                      updatePreference(
                        "allowPlusOne",
                        value,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-5 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-[#193c32]"
                    />

                    <div>
                      <p className="text-sm font-medium text-[#202522]">
                        Allow RSVP changes
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#777c78]">
                        Allow guests to change their response after
                        submitting it.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    checked={
                      preferences.allowRsvpChanges
                    }
                    onChange={(value) =>
                      updatePreference(
                        "allowRsvpChanges",
                        value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Guest privacy */}
          <div className="p-6 md:p-7">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f2ec] text-[#193c32]">
                <Users size={19} />
              </div>

              <div>
                <h3 className="font-semibold text-[#202522]">
                  Guest privacy
                </h3>

                <p className="mt-1 text-sm text-[#777c78]">
                  Control what guest information is visible.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ebe8e1]">
              <div className="flex items-center justify-between gap-5 p-4">
                <div>
                  <p className="text-sm font-medium text-[#202522]">
                    Show guest contact information
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#777c78]">
                    Allow guest contact details to be displayed
                    within the guest experience.
                  </p>
                </div>

                <Toggle
                  checked={
                    preferences.showGuestContactInfo
                  }
                  onChange={(value) =>
                    updatePreference(
                      "showGuestContactInfo",
                      value,
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Messages + save */}
          <div className="border-t border-[#ebe8e1] bg-[#fcfbf8] p-6 md:p-7">
            {error && (
              <div className="mb-4 rounded-2xl border border-[#ead1d1] bg-[#fdf5f5] px-4 py-3 text-sm text-[#9b5555]">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 rounded-2xl border border-[#d7e5da] bg-[#f3f8f4] px-4 py-3 text-sm text-[#315d46]">
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#193c32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123229] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save preferences
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}