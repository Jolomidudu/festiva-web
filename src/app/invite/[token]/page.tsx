import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  Users,
} from "lucide-react";

import RsvpActions from "./RsvpActions";

type GuestStatus =
  | "PENDING"
  | "ATTENDING"
  | "MAYBE"
  | "NOT_ATTENDING";

type InvitationStatus = "DRAFT" | "SENT" | "OPENED";

type Guest = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: GuestStatus;
  plusOne: boolean;
  dietaryRequirements?: string | null;
};

type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  description?: string | null;
  coverImage?: string | null;
};

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

async function getInvitation(
  token: string
): Promise<Invitation | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/$/,
    ""
  );

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(
    `${apiUrl}/public/invitations/${token}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(
      `Unable to load invitation: ${response.status}`
    );
  }

  return response.json();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function formatGuestStatus(status: GuestStatus) {
  switch (status) {
    case "ATTENDING":
      return "Attending";
    case "MAYBE":
      return "Maybe";
    case "NOT_ATTENDING":
      return "Not attending";
    default:
      return "Awaiting response";
  }
}

function statusClasses(status: GuestStatus) {
  switch (status) {
    case "ATTENDING":
      return "bg-emerald-50 text-emerald-700";
    case "MAYBE":
      return "bg-amber-50 text-amber-700";
    case "NOT_ATTENDING":
      return "bg-red-50 text-red-700";
    default:
      return "bg-[#f1f1ee] text-[#666a66]";
  }
}

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let invitation: Invitation | null = null;

  try {
    invitation = await getInvitation(token);
  } catch {
    invitation = null;
  }

  if (!invitation) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-5 py-16">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[#e7e3da] bg-white px-7 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3eee6] text-[#193c32]">
              <Heart size={25} />
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-[#c99a6b]">
              FestyVibe
            </p>

            <h1 className="serif mt-2 text-4xl text-[#193c32]">
              Invitation unavailable
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#777c78]">
              This invitation could not be found. The link may
              be invalid, expired, or no longer available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const { event, guest } = invitation;

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#193c32]">
      {/* Top brand */}
      <div className="px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-center">
          <p className="serif text-2xl tracking-tight text-[#193c32]">
            FestyVibe
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 pb-10 sm:px-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#e7e3da] bg-white shadow-sm">
          <div className="relative min-h-[620px] overflow-hidden">
            {event.coverImage ? (
              <>
                <img
                  src={event.coverImage}
                  alt={event.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/35" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#eee5d7,transparent_38%),radial-gradient(circle_at_bottom_right,#dfe9e2,transparent_42%),linear-gradient(135deg,#faf8f3,#edf1ed)]" />
            )}

            <div
              className={`relative flex min-h-[620px] items-center justify-center px-6 py-20 text-center ${
                event.coverImage
                  ? "text-white"
                  : "text-[#193c32]"
              }`}
            >
              <div className="max-w-3xl">
                <p
                  className={`text-sm font-medium uppercase tracking-[0.3em] ${
                    event.coverImage
                      ? "text-white/80"
                      : "text-[#c99a6b]"
                  }`}
                >
                  You are invited
                </p>

                <div className="mx-auto mt-8 h-px w-20 bg-current opacity-40" />

                <p className="serif mt-8 text-3xl sm:text-4xl">
                  {guest.name}
                </p>

                <p
                  className={`mt-6 text-sm uppercase tracking-[0.28em] ${
                    event.coverImage
                      ? "text-white/80"
                      : "text-[#777c78]"
                  }`}
                >
                  to celebrate
                </p>

                <h1 className="serif mt-4 text-5xl leading-tight sm:text-7xl">
                  {event.name}
                </h1>

                <div className="mx-auto mt-10 h-px w-20 bg-current opacity-40" />

                <p
                  className={`mt-8 text-base ${
                    event.coverImage
                      ? "text-white/90"
                      : "text-[#777c78]"
                  }`}
                >
                  {formatDate(event.date)}
                </p>

                <p
                  className={`mt-2 text-sm ${
                    event.coverImage
                      ? "text-white/75"
                      : "text-[#777c78]"
                  }`}
                >
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          {/* Invitation body */}
          <div className="px-6 py-14 sm:px-12 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#c99a6b]">
                With love
              </p>

              <h2 className="serif mt-3 text-4xl text-[#193c32] sm:text-5xl">
                We would love to have you with us
              </h2>

              {event.description ? (
                <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#777c78]">
                  {event.description}
                </p>
              ) : (
                <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#777c78]">
                  Join us as we gather together to celebrate
                  this beautiful occasion with the people we
                  love.
                </p>
              )}
            </div>

            {/* Event details */}
            <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-[#f8f6f1] p-6 text-center">
                <CalendarDays
                  size={21}
                  className="mx-auto text-[#c99a6b]"
                />

                <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-[#9a958c]">
                  Date
                </p>

                <p className="mt-2 text-sm font-medium text-[#193c32]">
                  {new Intl.DateTimeFormat("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(event.date))}
                </p>
              </div>

              <div className="rounded-3xl bg-[#f8f6f1] p-6 text-center">
                <Clock3
                  size={21}
                  className="mx-auto text-[#c99a6b]"
                />

                <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-[#9a958c]">
                  Time
                </p>

                <p className="mt-2 text-sm font-medium text-[#193c32]">
                  {formatTime(event.date)}
                </p>
              </div>

              <div className="rounded-3xl bg-[#f8f6f1] p-6 text-center">
                <MapPin
                  size={21}
                  className="mx-auto text-[#c99a6b]"
                />

                <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-[#9a958c]">
                  Location
                </p>

                <p className="mt-2 text-sm font-medium text-[#193c32]">
                  {event.location}
                </p>
              </div>
            </div>

            {/* Guest section */}
            <div className="mx-auto mt-12 max-w-3xl border-t border-[#ebe7df] pt-10">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#193c32] text-white">
                  <Users size={21} />
                </div>

                <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-[#9a958c]">
                  Your invitation
                </p>

                <h3 className="serif mt-2 text-3xl text-[#193c32]">
                  {guest.name}
                </h3>

                <span
                  className={`mt-4 rounded-full px-4 py-2 text-xs font-medium ${statusClasses(
                    guest.status
                  )}`}
                >
                  {formatGuestStatus(guest.status)}
                </span>

                {guest.plusOne && (
                  <p className="mt-4 text-sm text-[#777c78]">
                    This invitation includes a plus-one.
                  </p>
                )}
              </div>
            </div>

           {/* RSVP */}
<div className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-[#e8e3da] bg-[#fbfaf7] p-7 sm:p-10">
  <div className="text-center">
    <CheckCircle2
      size={24}
      className="mx-auto text-[#c99a6b]"
    />

    <h3 className="serif mt-4 text-3xl text-[#193c32]">
      Will you be joining us?
    </h3>

    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#777c78]">
      Let us know whether you’ll be celebrating with us.
      You can update your response at any time.
    </p>
  </div>

  <RsvpActions
    token={token}
    initialStatus={guest.status}
  />
</div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#ebe7df] px-6 py-10 text-center sm:px-12">
            <Heart
              size={18}
              className="mx-auto text-[#c99a6b]"
              fill="currentColor"
            />

            <p className="serif mt-4 text-2xl text-[#193c32]">
              {event.name}
            </p>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#9a958c]">
              Created with FestyVibe
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}