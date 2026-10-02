"use client";

import {
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type GuestStatus =
  | "PENDING"
  | "ATTENDING"
  | "MAYBE"
  | "NOT_ATTENDING";

type RsvpActionsProps = {
  token: string;
  initialStatus: GuestStatus;
};

const options: {
  status: Exclude<GuestStatus, "PENDING">;
  title: string;
  description: string;
}[] = [
  {
    status: "ATTENDING",
    title: "Joyfully attending",
    description: "I'll be there",
  },
  {
    status: "MAYBE",
    title: "Maybe",
    description: "I'm not certain yet",
  },
  {
    status: "NOT_ATTENDING",
    title: "Unable to attend",
    description: "I won't be able to make it",
  },
];

function getOptionStyles(
  status: Exclude<GuestStatus, "PENDING">,
  selected: boolean
) {
  if (!selected) {
    return "border-[#e5e1d9] bg-white text-[#193c32] hover:border-[#cfc9bd] hover:bg-[#faf9f6]";
  }

  switch (status) {
    case "ATTENDING":
      return "border-[#193c32] bg-[#193c32] text-white";

    case "MAYBE":
      return "border-[#c99a6b] bg-[#fbf3e8] text-[#193c32]";

    case "NOT_ATTENDING":
      return "border-[#d7aaa5] bg-[#fbf1f0] text-[#6f302b]";

    default:
      return "border-[#e5e1d9] bg-white text-[#193c32]";
  }
}

function getIconStyles(
  status: Exclude<GuestStatus, "PENDING">,
  selected: boolean
) {
  if (selected && status === "ATTENDING") {
    return "bg-white/15 text-white";
  }

  if (selected && status === "MAYBE") {
    return "bg-[#f1dfc8] text-[#9a683d]";
  }

  if (selected && status === "NOT_ATTENDING") {
    return "bg-[#eedbd8] text-[#8b4942]";
  }

  return "bg-[#f4f1eb] text-[#193c32]";
}

function StatusIcon({
  status,
}: {
  status: Exclude<GuestStatus, "PENDING">;
}) {
  if (status === "ATTENDING") {
    return <Check size={17} />;
  }

  if (status === "MAYBE") {
    return <Clock3 size={17} />;
  }

  return <X size={17} />;
}

export default function RsvpActions({
  token,
  initialStatus,
}: RsvpActionsProps) {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] =
    useState<GuestStatus>(initialStatus);

  const [savingStatus, setSavingStatus] =
    useState<GuestStatus | null>(null);

  const [error, setError] = useState("");

  const [confirmed, setConfirmed] = useState(
    initialStatus !== "PENDING"
  );

  async function submitRsvp(
    status: Exclude<GuestStatus, "PENDING">
  ) {
    if (savingStatus) return;

    try {
      setSavingStatus(status);
      setError("");
      setConfirmed(false);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(
          /\/$/,
          ""
        );

      if (!apiUrl) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured."
        );
      }

      const response = await fetch(
        `${apiUrl}/public/invitations/${token}/rsvp`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        const body = await response
          .json()
          .catch(() => null);

        throw new Error(
          body?.message ??
            "Unable to update your RSVP. Please try again."
        );
      }

      setSelectedStatus(status);
      setConfirmed(true);

      /*
       * Refresh the server-rendered invitation so the
       * guest status displayed above the RSVP section
       * also reflects the newly saved response.
       */
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your RSVP. Please try again."
      );
    } finally {
      setSavingStatus(null);
    }
  }

  const currentLabel =
    selectedStatus === "ATTENDING"
      ? "You're attending"
      : selectedStatus === "MAYBE"
        ? "Your response is maybe"
        : selectedStatus === "NOT_ATTENDING"
          ? "You've declined"
          : "Response needed";

  return (
    <div className="mt-7">
      <div className="space-y-3">
        {options.map((option) => {
          const selected =
            selectedStatus === option.status;

          const saving =
            savingStatus === option.status;

          return (
            <button
              key={option.status}
              type="button"
              onClick={() =>
                submitRsvp(option.status)
              }
              disabled={Boolean(savingStatus)}
              aria-pressed={selected}
              className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${getOptionStyles(
                option.status,
                selected
              )}`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${getIconStyles(
                  option.status,
                  selected
                )}`}
              >
                {saving ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <StatusIcon
                    status={option.status}
                  />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={`block text-sm font-medium ${
                    selected &&
                    option.status === "ATTENDING"
                      ? "text-white"
                      : ""
                  }`}
                >
                  {option.title}
                </span>

                <span
                  className={`mt-0.5 block text-xs ${
                    selected &&
                    option.status === "ATTENDING"
                      ? "text-white/70"
                      : selected
                        ? "text-[#777c78]"
                        : "text-[#99958d]"
                  }`}
                >
                  {option.description}
                </span>
              </span>

              {selected && !saving && (
                <CheckCircle2
                  size={19}
                  className={
                    option.status ===
                    "ATTENDING"
                      ? "text-white"
                      : option.status === "MAYBE"
                        ? "text-[#b47d48]"
                        : "text-[#a65b53]"
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {confirmed && !error && (
        <div
          aria-live="polite"
          className="mt-5 rounded-2xl border border-[#dfe9e2] bg-[#f3f8f4] px-5 py-4 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#193c32]">
            <CheckCircle2 size={17} />
            {currentLabel}
          </div>

          <p className="mt-1 text-xs text-[#777c78]">
            Your response has been saved. You can
            change it at any time.
          </p>
        </div>
      )}
    </div>
  );
}