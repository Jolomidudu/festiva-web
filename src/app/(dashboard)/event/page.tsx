"use client";

import {
  CalendarDays,
  MapPin,
  Save,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Event } from "@/types";

type EventResponse = Event & {
  coverImage?: string | null;
  _count?: {
    guests: number;
  };
};

export default function EventPage() {
  const [event, setEvent] = useState<EventResponse | null>(null);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const events = await api<EventResponse[]>("/events");

        if (events.length === 0) {
          setEvent(null);
          return;
        }

        const currentEvent = events[0];

        setEvent(currentEvent);
        setName(currentEvent.name);
        setLocation(currentEvent.location);
        setDescription(currentEvent.description ?? "");
        setCoverImage(currentEvent.coverImage ?? "");

        const eventDate = new Date(currentEvent.date);

        setDate(
          `${eventDate.getFullYear()}-${String(
            eventDate.getMonth() + 1
          ).padStart(2, "0")}-${String(eventDate.getDate()).padStart(
            2,
            "0"
          )}`
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your event."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();

    if (!event) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const updatedEvent = await api<EventResponse>(
        `/events/${event.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name,
            date: new Date(`${date}T12:00:00`).toISOString(),
            location,
            description,
            coverImage,
          }),
        }
      );

      setEvent(updatedEvent);

      setMessage("Your event has been updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your event."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!event) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await api(`/events/${event.id}`, {
        method: "DELETE",
      });

      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete your event."
      );
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="serif text-3xl text-[#193c32]">
              Festyvibe
            </p>

            <p className="mt-2 text-sm text-[#777c78]">
              Loading your event...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#c99a6b]">
            Event management
          </p>

          <h1 className="serif mt-1 text-4xl text-[#193c32]">
            Create your event
          </h1>

          <p className="mt-2 text-[#777c78]">
            You don't have an event yet.
          </p>
        </div>

        <div className="rounded-3xl border border-[#ebe8e1] bg-white p-8">
          <p className="text-[#777c78]">
            Event creation will be available here next.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-[#c99a6b]">
          Event management
        </p>

        <h1 className="serif mt-1 text-4xl text-[#193c32]">
          {event.name}
        </h1>

        <p className="mt-2 text-[#777c78]">
          Manage the details of your celebration.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        <section className="rounded-3xl border border-[#ebe8e1] bg-white p-6 md:p-8">
          <div>
            <h2 className="text-lg font-semibold text-[#193c32]">
              Event details
            </h2>

            <p className="mt-1 text-sm text-[#888d89]">
              Update the information your guests will see.
            </p>
          </div>

          <div className="mt-7 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#303632]"
              >
                Event name
              </label>

              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#e4e0d8] bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-[#303632]"
                >
                  <CalendarDays size={16} />
                  Event date
                </label>

                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#e4e0d8] bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-[#303632]"
                >
                  <MapPin size={16} />
                  Location
                </label>

                <input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#e4e0d8] bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-[#303632]"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Tell your guests about your celebration..."
                className="w-full resize-none rounded-2xl border border-[#e4e0d8] bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
              />
            </div>

            <div>
              <label
                htmlFor="coverImage"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-[#303632]"
              >
                <ImageIcon size={16} />
                Cover image URL
              </label>

              <input
                id="coverImage"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-2xl border border-[#e4e0d8] bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
              />

              {coverImage && (
                <div className="mt-4 overflow-hidden rounded-2xl">
                  <img
                    src={coverImage}
                    alt="Event cover preview"
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245347] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </section>
      </form>

      <section className="mt-8 rounded-3xl border border-red-100 bg-red-50/40 p-6 md:p-8">
        <div>
          <h2 className="text-lg font-semibold text-red-700">
            Danger zone
          </h2>

          <p className="mt-1 text-sm text-red-600/80">
            Deleting your event is permanent and cannot be undone.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={17} />

          {deleting ? "Deleting..." : "Delete event"}
        </button>
      </section>
    </div>
  );
}