"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Check,
  CircleHelp,
  CircleX,
  Clock3,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
  Utensils,
  X,
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
  createdAt: string;
  updatedAt: string;
};

type Event = {
  id: string;
  name: string;
};

type GuestForm = {
  name: string;
  email: string;
  phone: string;
  status: RsvpStatus;
  plusOne: boolean;
  dietaryRequirements: string;
};

const STATUS_OPTIONS: {
  value: RsvpStatus;
  label: string;
}[] = [
  { value: "PENDING", label: "Pending" },
  { value: "ATTENDING", label: "Attending" },
  { value: "MAYBE", label: "Maybe" },
  { value: "NOT_ATTENDING", label: "Not attending" },
];

const emptyForm: GuestForm = {
  name: "",
  email: "",
  phone: "",
  status: "PENDING",
  plusOne: false,
  dietaryRequirements: "",
};

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
      return <Check size={13} />;

    case "MAYBE":
      return <CircleHelp size={13} />;

    case "NOT_ATTENDING":
      return <CircleX size={13} />;

    default:
      return <Clock3 size={13} />;
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

export default function GuestsPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | RsvpStatus>("ALL");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [form, setForm] = useState<GuestForm>(emptyForm);

  useEffect(() => {
    loadGuests();
  }, []);

  async function loadGuests() {
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
          : "Unable to load guests."
      );
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowAddModal(true);
  }

  function closeAddModal() {
    if (saving) return;

    setShowAddModal(false);
    setForm(emptyForm);
  }

  function openEditModal(guest: Guest) {
    setEditingGuest(guest);
    setError("");
    setSuccess("");

    setForm({
      name: guest.name,
      email: guest.email ?? "",
      phone: guest.phone ?? "",
      status: guest.status,
      plusOne: guest.plusOne,
      dietaryRequirements: guest.dietaryRequirements ?? "",
    });
  }

  function closeEditModal() {
    if (saving) return;

    setEditingGuest(null);
    setForm(emptyForm);
  }

  function updateForm(
    field: keyof GuestForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

 async function handleAddGuest(
  formEvent: FormEvent<HTMLFormElement>
) {
  formEvent.preventDefault();

  if (!form.name.trim()) {
    setError("Please enter the guest's name.");
    return;
  }

  try {
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      status: form.status,
      plusOne: form.plusOne,
      dietaryRequirements:
        form.dietaryRequirements.trim() || undefined,
    };

    const createdGuest = await api<Guest>(
      `/events/${eventId()}/guests`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

      setGuests((current) =>
        [...current, createdGuest].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );

      setShowAddModal(false);
      setForm(emptyForm);
      setSuccess("Guest added successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add guest."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleEditGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingGuest) return;

    if (!form.name.trim()) {
      setError("Please enter the guest's name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        status: form.status,
        plusOne: form.plusOne,
        dietaryRequirements:
          form.dietaryRequirements.trim() || undefined,
      };

      const updatedGuest = await api<Guest>(
        `/events/${eventId()}/guests/${editingGuest.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

      setGuests((current) =>
        current
          .map((guest) =>
            guest.id === updatedGuest.id
              ? updatedGuest
              : guest
          )
          .sort((a, b) => a.name.localeCompare(b.name))
      );

      setEditingGuest(null);
      setForm(emptyForm);
      setSuccess("Guest updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update guest."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteGuest(guest: Guest) {
    const confirmed = window.confirm(
      `Remove ${guest.name} from your guest list?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api<{ success: boolean }>(
        `/events/${eventId()}/guests/${guest.id}`,
        {
          method: "DELETE",
        }
      );

      setGuests((current) =>
        current.filter((item) => item.id !== guest.id)
      );

      setSuccess(`${guest.name} was removed.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove guest."
      );
    }
  }

  function eventId() {
    if (!event) {
      throw new Error("No event found.");
    }

    return event.id;
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
              Loading your guests...
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
            Create your event first, then you can start
            adding and managing guests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#c99a6b]">
            Guest management
          </p>

          <h1 className="serif mt-1 text-4xl text-[#193c32]">
            Guests
          </h1>

          <p className="mt-2 text-sm text-[#777c78]">
            Manage everyone invited to {event.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#244c40]"
        >
          <UserPlus size={17} />
          Add guest
        </button>
      </div>

      {/* Feedback */}
      {error && !showAddModal && !editingGuest && (
        <div className="mt-5 rounded-2xl border border-[#efd5d5] bg-[#fff7f7] px-4 py-3 text-sm text-[#a35b5b]">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-2xl border border-[#d8e9dc] bg-[#f4faf5] px-4 py-3 text-sm text-[#4f8567]">
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total guests"
          value={counts.total}
          icon={<Users size={18} />}
        />

        <StatCard
          label="Attending"
          value={counts.attending}
          icon={<Check size={18} />}
        />

        <StatCard
          label="Maybe"
          value={counts.maybe}
          icon={<CircleHelp size={18} />}
        />

        <StatCard
          label="Pending"
          value={counts.pending}
          icon={<Clock3 size={18} />}
        />

        <StatCard
          label="Not attending"
          value={counts.notAttending}
          icon={<CircleX size={18} />}
        />
      </div>

      {/* Guest List */}
      <div className="mt-7 rounded-3xl border border-[#ebe8e1] bg-white p-5">
        {/* Search + Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-[#f7f5ef] px-4">
            <Search
              size={17}
              className="shrink-0 text-[#999d99]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent py-3 text-sm outline-none"
              placeholder="Search guests..."
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <FilterButton
              active={filter === "ALL"}
              onClick={() => setFilter("ALL")}
            >
              All ({counts.total})
            </FilterButton>

            <FilterButton
              active={filter === "PENDING"}
              onClick={() => setFilter("PENDING")}
            >
              Pending ({counts.pending})
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
              active={filter === "NOT_ATTENDING"}
              onClick={() => setFilter("NOT_ATTENDING")}
            >
              Not attending ({counts.notAttending})
            </FilterButton>
          </div>
        </div>

        {/* Results */}
        <div className="mt-5">
          {filteredGuests.length === 0 ? (
            <div className="py-16 text-center">
              <Users
                size={36}
                className="mx-auto text-[#c9c5bc]"
              />

              <p className="mt-3 text-sm font-medium text-[#454b47]">
                No guests found
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

                  {/* Main info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#202522]">
                        {guest.name}
                      </p>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                          guest.status
                        )}`}
                      >
                        {getStatusIcon(guest.status)}
                        {getStatusLabel(guest.status)}
                      </span>

                      {guest.plusOne && (
                        <span className="rounded-full bg-[#f5eee6] px-2.5 py-1 text-[11px] font-medium text-[#9a744d]">
                          +1
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#888d89]">
                      {guest.email && (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail size={13} />
                          {guest.email}
                        </span>
                      )}

                      {guest.phone && (
                        <span className="inline-flex items-center gap-1.5">
                          <Phone size={13} />
                          {guest.phone}
                        </span>
                      )}

                      {guest.dietaryRequirements && (
                        <span className="inline-flex items-center gap-1.5">
                          <Utensils size={13} />
                          {guest.dietaryRequirements}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 md:ml-auto">
                    <button
                      type="button"
                      onClick={() => openEditModal(guest)}
                      className="inline-flex items-center gap-2 rounded-full border border-[#e6e1d8] px-4 py-2 text-xs font-medium text-[#555b57] transition hover:bg-[#f7f5ef]"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteGuest(guest)}
                      className="inline-flex items-center gap-2 rounded-full border border-[#efd8d8] px-4 py-2 text-xs font-medium text-[#a35b5b] transition hover:bg-[#fff6f6]"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {guests.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#eeeae2] pt-4 text-xs text-[#999d99]">
            <span>
              Showing {filteredGuests.length} of{" "}
              {guests.length} guests
            </span>

            <span>
              {counts.plusOnes} guest
              {counts.plusOnes === 1 ? "" : "s"} with
              a plus-one
            </span>
          </div>
        )}
      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <Modal
          title="Add guest"
          subtitle="Add someone to your event guest list."
          onClose={closeAddModal}
        >
          <form
            onSubmit={handleAddGuest}
            className="space-y-5"
          >
            {error && (
              <FormError message={error} />
            )}

            <GuestFormFields
              form={form}
              updateForm={updateForm}
            />

            <ModalActions
              saving={saving}
              submitLabel="Add guest"
              onCancel={closeAddModal}
            />
          </form>
        </Modal>
      )}

      {/* Edit Guest Modal */}
      {editingGuest && (
        <Modal
          title="Edit guest"
          subtitle="Update this guest's details and RSVP."
          onClose={closeEditModal}
        >
          <form
            onSubmit={handleEditGuest}
            className="space-y-5"
          >
            {error && (
              <FormError message={error} />
            )}

            <GuestFormFields
              form={form}
              updateForm={updateForm}
            />

            <ModalActions
              saving={saving}
              submitLabel="Save changes"
              onCancel={closeEditModal}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#ebe8e1] bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#888d89]">
          {label}
        </span>

        <span className="text-[#193c32]">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-2xl font-semibold text-[#193c32]">
        {value}
      </p>
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

function Modal({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#eeeae2] px-6 py-5">
          <div>
            <h2 className="serif text-2xl text-[#193c32]">
              {title}
            </h2>

            <p className="mt-1 text-sm text-[#888d89]">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#777c78] transition hover:bg-[#f7f5ef]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function GuestFormFields({
  form,
  updateForm,
}: {
  form: GuestForm;
  updateForm: (
    field: keyof GuestForm,
    value: string | boolean
  ) => void;
}) {
  return (
    <>
      <div>
        <label className="text-sm font-medium text-[#343936]">
          Full name
        </label>

        <input
          required
          value={form.name}
          onChange={(e) =>
            updateForm("name", e.target.value)
          }
          placeholder="e.g. Adebayo Adeyemi"
          className="mt-2 w-full rounded-2xl border border-[#e3ded5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#193c32]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-[#343936]">
            Email
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              updateForm("email", e.target.value)
            }
            placeholder="guest@example.com"
            className="mt-2 w-full rounded-2xl border border-[#e3ded5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#193c32]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#343936]">
            Phone
          </label>

          <input
            type="tel"
            value={form.phone}
            onChange={(e) =>
              updateForm("phone", e.target.value)
            }
            placeholder="+234..."
            className="mt-2 w-full rounded-2xl border border-[#e3ded5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#193c32]"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-[#343936]">
          RSVP status
        </label>

        <select
          value={form.status}
          onChange={(e) =>
            updateForm(
              "status",
              e.target.value as RsvpStatus
            )
          }
          className="mt-2 w-full rounded-2xl border border-[#e3ded5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#193c32]"
        >
          {STATUS_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[#f7f5ef] p-4">
        <input
          type="checkbox"
          checked={form.plusOne}
          onChange={(e) =>
            updateForm("plusOne", e.target.checked)
          }
          className="h-4 w-4 accent-[#193c32]"
        />

        <div>
          <p className="text-sm font-medium text-[#343936]">
            Guest has a plus-one
          </p>

          <p className="mt-0.5 text-xs text-[#888d89]">
            Allow this guest to bring another person.
          </p>
        </div>
      </label>

      <div>
        <label className="text-sm font-medium text-[#343936]">
          Dietary requirements
        </label>

        <textarea
          value={form.dietaryRequirements}
          onChange={(e) =>
            updateForm(
              "dietaryRequirements",
              e.target.value
            )
          }
          placeholder="e.g. Vegetarian, halal, allergies..."
          rows={3}
          className="mt-2 w-full resize-none rounded-2xl border border-[#e3ded5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#193c32]"
        />
      </div>
    </>
  );
}

function ModalActions({
  saving,
  submitLabel,
  onCancel,
}: {
  saving: boolean;
  submitLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-[#eeeae2] pt-5">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="rounded-full border border-[#e3ded5] px-5 py-2.5 text-sm font-medium text-[#555b57] transition hover:bg-[#f7f5ef] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#244c40] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}

        {saving ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[#efd5d5] bg-[#fff7f7] px-4 py-3 text-sm text-[#a35b5b]">
      {message}
    </div>
  );
}