"use client";

import {
  CalendarDays,
  Clock3,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Event } from "@/types";

type ScheduleItem = {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime?: string | null;
  location?: string | null;
  eventId: string;
  createdAt: string;
  updatedAt: string;
};

type EventResponse = Event & {
  coverImage?: string | null;
  _count?: {
    guests: number;
  };
  scheduleItems?: ScheduleItem[];
};

type ScheduleForm = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
};

const emptyScheduleForm: ScheduleForm = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  location: "",
};

function formatScheduleTime(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatScheduleDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toISOString(value: string) {
  return new Date(value).toISOString();
}

export default function EventPage() {
  const [event, setEvent] = useState<EventResponse | null>(null);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [scheduleForm, setScheduleForm] =
    useState<ScheduleForm>(emptyScheduleForm);

  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [savingSchedule, setSavingSchedule] = useState(false);
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(
    null
  );

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
          ).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`
        );

        // Load the real schedule from the backend.
        const schedule = await api<ScheduleItem[]>(
          `/events/${currentEvent.id}/schedule`
        );

        setScheduleItems(schedule);
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

  function resetScheduleForm() {
    setScheduleForm(emptyScheduleForm);
    setEditingScheduleId(null);
  }

  function handleScheduleChange(
    field: keyof ScheduleForm,
    value: string
  ) {
    setScheduleForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEditSchedule(item: ScheduleItem) {
    setEditingScheduleId(item.id);

    setScheduleForm({
      title: item.title,
      description: item.description ?? "",
      startTime: toDateTimeLocal(item.startTime),
      endTime: item.endTime ? toDateTimeLocal(item.endTime) : "",
      location: item.location ?? "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  async function handleScheduleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!event) return;

    if (!scheduleForm.title.trim()) {
      setError("Please enter a title for this schedule item.");
      return;
    }

    if (!scheduleForm.startTime) {
      setError("Please select a start time.");
      return;
    }

    if (
      scheduleForm.endTime &&
      new Date(scheduleForm.endTime) <= new Date(scheduleForm.startTime)
    ) {
      setError("End time must be later than the start time.");
      return;
    }

    try {
      setSavingSchedule(true);
      setError("");
      setMessage("");

      const payload = {
        title: scheduleForm.title.trim(),
        description: scheduleForm.description.trim() || undefined,
        startTime: toISOString(scheduleForm.startTime),
        endTime: scheduleForm.endTime
          ? toISOString(scheduleForm.endTime)
          : undefined,
        location: scheduleForm.location.trim() || undefined,
      };

      if (editingScheduleId) {
        const updated = await api<ScheduleItem>(
          `/events/${event.id}/schedule/${editingScheduleId}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );

        setScheduleItems((current) =>
          current
            .map((item) =>
              item.id === editingScheduleId ? updated : item
            )
            .sort(
              (a, b) =>
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime()
            )
        );

        setMessage("Schedule item updated successfully.");
      } else {
        const created = await api<ScheduleItem>(
          `/events/${event.id}/schedule`,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        setScheduleItems((current) =>
          [...current, created].sort(
            (a, b) =>
              new Date(a.startTime).getTime() -
              new Date(b.startTime).getTime()
          )
        );

        setMessage("Schedule item added successfully.");
      }

      resetScheduleForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save this schedule item."
      );
    } finally {
      setSavingSchedule(false);
    }
  }

  async function handleDeleteSchedule(item: ScheduleItem) {
    if (!event) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}" from the schedule?`
    );

    if (!confirmed) return;

    try {
      setDeletingScheduleId(item.id);
      setError("");
      setMessage("");

      await api(`/events/${event.id}/schedule/${item.id}`, {
        method: "DELETE",
      });

      setScheduleItems((current) =>
        current.filter((schedule) => schedule.id !== item.id)
      );

      if (editingScheduleId === item.id) {
        resetScheduleForm();
      }

      setMessage("Schedule item deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete this schedule item."
      );
    } finally {
      setDeletingScheduleId(null);
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
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-[#c99a6b]">
          Event management
        </p>

        <h1 className="serif mt-1 text-4xl text-[#193c32]">
          {event.name}
        </h1>

        <p className="mt-2 text-[#777c78]">
          Manage the details and schedule of your celebration.
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

      {/* EVENT DETAILS */}
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

      {/* EVENT SCHEDULE */}
      <section className="mt-8 rounded-3xl border border-[#ebe8e1] bg-white p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#c99a6b]">
              Celebration timeline
            </p>

            <h2 className="serif mt-1 text-3xl text-[#193c32]">
              Event schedule
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-[#888d89]">
              Create the timeline your guests will see on their invitation.
            </p>
          </div>

          {scheduleItems.length > 0 && (
            <div className="rounded-full bg-[#f5f1e9] px-4 py-2 text-xs font-medium text-[#193c32]">
              {scheduleItems.length}{" "}
              {scheduleItems.length === 1 ? "event" : "events"}
            </div>
          )}
        </div>

        {/* SCHEDULE TIMELINE */}
        <div className="mt-8">
          {scheduleItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#ded9d0] bg-[#fcfbf8] px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2eee6] text-[#193c32]">
                <Clock3 size={24} />
              </div>

              <h3 className="serif mt-4 text-2xl text-[#193c32]">
                No schedule yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888d89]">
                Add your ceremony, reception, cocktail hour, dinner,
                after-party, or any other important moment.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute bottom-4 left-[18px] top-4 w-px bg-[#ded9d0] md:left-1/2 md:-translate-x-1/2" />

              <div className="space-y-8">
                {scheduleItems.map((item, index) => {
                  const isLeft = index % 2 === 0;

                  return (
                    <div
                      key={item.id}
                      className="relative md:grid md:grid-cols-2 md:gap-10"
                    >
                      {/* LEFT */}
                      <div
                        className={`pl-12 md:pl-0 ${
                          isLeft
                            ? "md:pr-10"
                            : "md:col-start-1 md:row-start-1 md:opacity-0"
                        }`}
                      >
                        {isLeft && (
                          <ScheduleCard
                            item={item}
                            onEdit={startEditSchedule}
                            onDelete={handleDeleteSchedule}
                            deleting={deletingScheduleId === item.id}
                          />
                        )}
                      </div>

                      {/* TIMELINE DOT */}
                      <div className="absolute left-[8px] top-6 z-10 flex h-5 w-5 items-center justify-center rounded-full border-4 border-white bg-[#c99a6b] shadow-sm md:left-1/2 md:-translate-x-1/2" />

                      {/* RIGHT */}
                      <div
                        className={`mt-8 pl-12 md:mt-0 md:pl-0 ${
                          !isLeft
                            ? "md:col-start-2 md:row-start-1 md:pl-10"
                            : "md:opacity-0"
                        }`}
                      >
                        {!isLeft && (
                          <ScheduleCard
                            item={item}
                            onEdit={startEditSchedule}
                            onDelete={handleDeleteSchedule}
                            deleting={deletingScheduleId === item.id}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ADD / EDIT SCHEDULE FORM */}
        <div className="mt-10 border-t border-[#ebe8e1] pt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#193c32]">
                {editingScheduleId
                  ? "Edit schedule item"
                  : "Add schedule item"}
              </h3>

              <p className="mt-1 text-sm text-[#888d89]">
                {editingScheduleId
                  ? "Update this part of your celebration timeline."
                  : "Add another moment to your event timeline."}
              </p>
            </div>

            {editingScheduleId && (
              <button
                type="button"
                onClick={resetScheduleForm}
                className="inline-flex items-center gap-2 rounded-full border border-[#dedbd4] px-4 py-2 text-sm font-medium text-[#193c32] transition hover:bg-[#fcfbf8]"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>

          <form
            onSubmit={handleScheduleSubmit}
            className="mt-6 rounded-3xl bg-[#fcfbf8] p-5 md:p-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="schedule-title"
                  className="mb-2 block text-sm font-medium text-[#303632]"
                >
                  Title
                </label>

                <input
                  id="schedule-title"
                  value={scheduleForm.title}
                  onChange={(e) =>
                    handleScheduleChange("title", e.target.value)
                  }
                  placeholder="e.g. Wedding Ceremony"
                  required
                  className="w-full rounded-2xl border border-[#e4e0d8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="schedule-start"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-[#303632]"
                >
                  <Clock3 size={16} />
                  Start time
                </label>

                <input
                  id="schedule-start"
                  type="datetime-local"
                  value={scheduleForm.startTime}
                  onChange={(e) =>
                    handleScheduleChange("startTime", e.target.value)
                  }
                  required
                  className="w-full rounded-2xl border border-[#e4e0d8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="schedule-end"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-[#303632]"
                >
                  <Clock3 size={16} />
                  End time
                </label>

                <input
                  id="schedule-end"
                  type="datetime-local"
                  value={scheduleForm.endTime}
                  onChange={(e) =>
                    handleScheduleChange("endTime", e.target.value)
                  }
                  className="w-full rounded-2xl border border-[#e4e0d8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="schedule-location"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-[#303632]"
                >
                  <MapPin size={16} />
                  Location
                </label>

                <input
                  id="schedule-location"
                  value={scheduleForm.location}
                  onChange={(e) =>
                    handleScheduleChange("location", e.target.value)
                  }
                  placeholder="e.g. The Grand Ballroom"
                  className="w-full rounded-2xl border border-[#e4e0d8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="schedule-description"
                  className="mb-2 block text-sm font-medium text-[#303632]"
                >
                  Description
                </label>

                <input
                  id="schedule-description"
                  value={scheduleForm.description}
                  onChange={(e) =>
                    handleScheduleChange("description", e.target.value)
                  }
                  placeholder="Optional description"
                  className="w-full rounded-2xl border border-[#e4e0d8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingSchedule}
                className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245347] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingScheduleId ? (
                  <Save size={17} />
                ) : (
                  <Plus size={17} />
                )}

                {savingSchedule
                  ? "Saving..."
                  : editingScheduleId
                    ? "Update schedule"
                    : "Add to schedule"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* DANGER ZONE */}
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

function ScheduleCard({
  item,
  onEdit,
  onDelete,
  deleting,
}: {
  item: ScheduleItem;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (item: ScheduleItem) => void;
  deleting: boolean;
}) {
  return (
    <div className="rounded-3xl border border-[#ebe8e1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#c99a6b]">
            {formatScheduleTime(item.startTime)}
            {item.endTime
              ? ` — ${formatScheduleTime(item.endTime)}`
              : ""}
          </p>

          <h3 className="serif mt-1 text-2xl text-[#193c32]">
            {item.title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#193c32] transition hover:bg-[#f5f1e9]"
            aria-label={`Edit ${item.title}`}
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={deleting}
            className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 disabled:opacity-50"
            aria-label={`Delete ${item.title}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {item.description && (
        <p className="mt-3 text-sm leading-6 text-[#777c78]">
          {item.description}
        </p>
      )}

      {item.location && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#777c78]">
          <MapPin size={15} className="shrink-0 text-[#c99a6b]" />
          <span>{item.location}</span>
        </div>
      )}
    </div>
  );
}