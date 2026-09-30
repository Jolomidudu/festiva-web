"use client";

import {
  Check,
  ChevronDown,
  Copy,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  description?: string | null;
  coverImage?: string | null;
};

type GuestStatus =
  | "PENDING"
  | "ATTENDING"
  | "MAYBE"
  | "NOT_ATTENDING";

type Guest = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: GuestStatus;
  plusOne: boolean;
};

type InvitationStatus = "DRAFT" | "SENT" | "OPENED";

type Invitation = {
  id: string;
  token: string;
  status: InvitationStatus;
  sentAt?: string | null;
  openedAt?: string | null;
  createdAt: string;
  guest: Guest;
  event: Event;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatStatus(status: InvitationStatus) {
  switch (status) {
    case "SENT":
      return "Sent";
    case "OPENED":
      return "Opened";
    default:
      return "Draft";
  }
}

function statusClasses(status: InvitationStatus) {
  switch (status) {
    case "SENT":
      return "bg-blue-50 text-blue-700";
    case "OPENED":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function guestStatusClasses(status: GuestStatus) {
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

function formatGuestStatus(status: GuestStatus) {
  switch (status) {
    case "ATTENDING":
      return "Attending";
    case "NOT_ATTENDING":
      return "Not attending";
    case "MAYBE":
      return "Maybe";
    default:
      return "Pending";
  }
}

export default function InvitationsPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const events = await api<Event[]>("/events");

      if (!events || events.length === 0) {
        setEvent(null);
        setGuests([]);
        setInvitations([]);
        return;
      }

      const currentEvent = events[0];

      setEvent(currentEvent);

      const [guestData, invitationData] = await Promise.all([
        api<Guest[]>(`/events/${currentEvent.id}/guests`),
        api<Invitation[]>(
          `/events/${currentEvent.id}/invitations`
        ),
      ]);

      setGuests(guestData);
      setInvitations(invitationData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load invitations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const invitationGuestIds = useMemo(
    () => new Set(invitations.map((invitation) => invitation.guest.id)),
    [invitations]
  );

  const availableGuests = useMemo(
    () =>
      guests.filter(
        (guest) => !invitationGuestIds.has(guest.id)
      ),
    [guests, invitationGuestIds]
  );

  const selectedGuest = guests.find(
    (guest) => guest.id === selectedGuestId
  );

  const draftCount = invitations.filter(
    (invitation) => invitation.status === "DRAFT"
  ).length;

  const sentCount = invitations.filter(
    (invitation) => invitation.status === "SENT"
  ).length;

  const openedCount = invitations.filter(
    (invitation) => invitation.status === "OPENED"
  ).length;

  async function createInvitation() {
    if (!event || !selectedGuestId) return;

    try {
      setCreating(true);
      setActionError("");

      const invitation = await api<Invitation>(
        `/events/${event.id}/invitations`,
        {
          method: "POST",
          body: JSON.stringify({
            guestId: selectedGuestId,
          }),
        }
      );

      setInvitations((current) => {
        const exists = current.some(
          (item) => item.id === invitation.id
        );

        if (exists) {
          return current.map((item) =>
            item.id === invitation.id ? invitation : item
          );
        }

        return [invitation, ...current];
      });

      setSelectedGuestId("");
      setShowCreateModal(false);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to create invitation."
      );
    } finally {
      setCreating(false);
    }
  }

  async function sendInvitation(invitation: Invitation) {
    if (!event) return;

    try {
      setUpdatingId(invitation.id);
      setActionError("");

      const updated = await api<Invitation>(
        `/events/${event.id}/invitations/${invitation.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "SENT",
          }),
        }
      );

      setInvitations((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item
        )
      );
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to update invitation."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteInvitation(invitation: Invitation) {
    if (!event) return;

    const confirmed = window.confirm(
      `Delete the invitation for ${invitation.guest.name}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(invitation.id);
      setActionError("");

      await api(
        `/events/${event.id}/invitations/${invitation.id}`,
        {
          method: "DELETE",
        }
      );

      setInvitations((current) =>
        current.filter((item) => item.id !== invitation.id)
      );
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to delete invitation."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function copyInvitationToken(invitation: Invitation) {
    try {
      await navigator.clipboard.writeText(invitation.token);

      setCopiedId(invitation.id);

      window.setTimeout(() => {
        setCopiedId((current) =>
          current === invitation.id ? null : current
        );
      }, 2000);
    } catch {
      setActionError("Unable to copy the invitation token.");
    }
  }

  function openCreateModal() {
    setActionError("");
    setSelectedGuestId("");
    setGuestDropdownOpen(false);
    setShowCreateModal(true);
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#c99a6b]">
            Digital invitations
          </p>

          <h1 className="serif mt-1 text-4xl text-[#193c32]">
            Invitations
          </h1>

          {event && (
            <p className="mt-2 text-sm text-[#777c78]">
              Manage invitations for{" "}
              <span className="font-medium text-[#193c32]">
                {event.name}
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-[#dedbd4] bg-white px-4 py-3 text-sm font-medium text-[#193c32] transition hover:bg-[#f7f5f0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            disabled={!event || availableGuests.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#245246] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={17} />
            New invitation
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={loadData}
            className="shrink-0 font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      {!loading && event && (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#ebe8e1] bg-white p-5">
            <p className="text-sm text-[#777c78]">
              Total invitations
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#193c32]">
              {invitations.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#ebe8e1] bg-white p-5">
            <p className="text-sm text-[#777c78]">Drafts</p>
            <p className="mt-2 text-3xl font-semibold text-[#193c32]">
              {draftCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#ebe8e1] bg-white p-5">
            <p className="text-sm text-[#777c78]">Sent</p>
            <p className="mt-2 text-3xl font-semibold text-[#193c32]">
              {sentCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#ebe8e1] bg-white p-5">
            <p className="text-sm text-[#777c78]">Opened</p>
            <p className="mt-2 text-3xl font-semibold text-[#193c32]">
              {openedCount}
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl border border-[#ebe8e1] bg-white"
            >
              <div className="h-52 animate-pulse bg-[#eeece6]" />

              <div className="space-y-3 p-5">
                <div className="h-6 w-40 animate-pulse rounded bg-[#eeece6]" />
                <div className="h-4 w-28 animate-pulse rounded bg-[#eeece6]" />
                <div className="h-10 w-28 animate-pulse rounded-full bg-[#eeece6]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No event */}
      {!loading && !event && !error && (
        <div className="mt-7 rounded-3xl border border-[#ebe8e1] bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f1eb] text-[#193c32]">
            <Send size={22} />
          </div>

          <h2 className="serif mt-5 text-2xl text-[#193c32]">
            No event found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777c78]">
            Create an event first before creating digital
            invitations.
          </p>
        </div>
      )}

      {/* Empty invitations */}
      {!loading && event && invitations.length === 0 && (
        <div className="mt-7 rounded-3xl border border-dashed border-[#dcd8d0] bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f1eb] text-[#193c32]">
            <Send size={22} />
          </div>

          <h2 className="serif mt-5 text-2xl text-[#193c32]">
            No invitations yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777c78]">
            Create your first invitation from one of your
            event guests.
          </p>

          {availableGuests.length > 0 ? (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white"
            >
              <Plus size={17} />
              Create invitation
            </button>
          ) : (
            <p className="mt-6 text-sm font-medium text-[#9a958c]">
              Add guests to your event first.
            </p>
          )}
        </div>
      )}

      {/* Invitation cards */}
      {!loading && invitations.length > 0 && (
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="overflow-hidden rounded-3xl border border-[#ebe8e1] bg-white"
            >
              {/* Cover */}
              <div className="relative h-52 overflow-hidden bg-[#f0ede7]">
                {invitation.event.coverImage ? (
                  <img
                    src={invitation.event.coverImage}
                    alt={invitation.event.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#f1ece3] via-[#faf8f4] to-[#e7eee9] px-6 text-center">
                    <div>
                      <p className="serif text-3xl text-[#193c32]">
                        {invitation.event.name}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#8b877f]">
                        Digital Invitation
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute right-4 top-4">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${statusClasses(
                      invitation.status
                    )}`}
                  >
                    {formatStatus(invitation.status)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="serif text-2xl text-[#193c32]">
                      {invitation.guest.name}
                    </p>

                    <p className="mt-1 text-sm text-[#777c78]">
                      {invitation.event.name}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${guestStatusClasses(
                      invitation.guest.status
                    )}`}
                  >
                    {formatGuestStatus(
                      invitation.guest.status
                    )}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-[#777c78]">
                  <p>{formatDate(invitation.event.date)}</p>

                  <p className="truncate">
                    {invitation.event.location}
                  </p>

                  {invitation.guest.email && (
                    <p className="truncate">
                      {invitation.guest.email}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {invitation.status === "DRAFT" && (
                    <button
                      type="button"
                      onClick={() =>
                        sendInvitation(invitation)
                      }
                      disabled={updatingId === invitation.id}
                      className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#245246] disabled:opacity-60"
                    >
                      {updatingId === invitation.id ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Send size={15} />
                      )}

                      Mark as sent
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      copyInvitationToken(invitation)
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-[#dedbd4] px-4 py-2.5 text-sm text-[#193c32] transition hover:bg-[#f7f5f0]"
                  >
                    {copiedId === invitation.id ? (
                      <Check size={15} />
                    ) : (
                      <Copy size={15} />
                    )}

                    {copiedId === invitation.id
                      ? "Copied"
                      : "Copy token"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteInvitation(invitation)
                    }
                    disabled={deletingId === invitation.id}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {deletingId === invitation.id ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={15} />
                    )}

                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action error */}
      {actionError && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <p>{actionError}</p>

            <button
              type="button"
              onClick={() => setActionError("")}
              className="shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Create invitation modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#c99a6b]">
                  New invitation
                </p>

                <h2 className="serif mt-1 text-3xl text-[#193c32]">
                  Choose a guest
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#777c78]">
                  Select a guest from your event to create
                  their digital invitation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dedbd4] text-[#777c78] transition hover:bg-[#f7f5f0]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="relative mt-6">
              <label className="mb-2 block text-sm font-medium text-[#193c32]">
                Guest
              </label>

              <button
                type="button"
                onClick={() =>
                  setGuestDropdownOpen((current) => !current)
                }
                disabled={availableGuests.length === 0}
                className="flex w-full items-center justify-between rounded-2xl border border-[#dedbd4] bg-white px-4 py-3.5 text-left text-sm text-[#193c32] outline-none transition hover:border-[#bdb8ae] disabled:cursor-not-allowed disabled:bg-[#f7f5f0]"
              >
                <span
                  className={
                    selectedGuest
                      ? "text-[#193c32]"
                      : "text-[#9a958c]"
                  }
                >
                  {selectedGuest
                    ? selectedGuest.name
                    : availableGuests.length > 0
                    ? "Select a guest"
                    : "All guests already have invitations"}
                </span>

                <ChevronDown
                  size={17}
                  className="text-[#777c78]"
                />
              </button>

              {guestDropdownOpen &&
                availableGuests.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-64 overflow-auto rounded-2xl border border-[#dedbd4] bg-white p-1 shadow-xl">
                    {availableGuests.map((guest) => (
                      <button
                        key={guest.id}
                        type="button"
                        onClick={() => {
                          setSelectedGuestId(guest.id);
                          setGuestDropdownOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-[#f7f5f0]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#193c32]">
                            {guest.name}
                          </p>

                          {guest.email && (
                            <p className="mt-0.5 truncate text-xs text-[#8b877f]">
                              {guest.email}
                            </p>
                          )}
                        </div>

                        <span
                          className={`ml-3 shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${guestStatusClasses(
                            guest.status
                          )}`}
                        >
                          {formatGuestStatus(
                            guest.status
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
            </div>

            {selectedGuest && (
              <div className="mt-4 rounded-2xl bg-[#f8f6f1] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#9a958c]">
                  Selected guest
                </p>

                <p className="mt-1 font-medium text-[#193c32]">
                  {selectedGuest.name}
                </p>

                <div className="mt-1 text-sm text-[#777c78]">
                  {selectedGuest.email ||
                    selectedGuest.phone ||
                    "No contact information"}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-full border border-[#dedbd4] px-5 py-3 text-sm font-medium text-[#193c32] transition hover:bg-[#f7f5f0]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={createInvitation}
                disabled={!selectedGuestId || creating}
                className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#245246] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                Create invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}