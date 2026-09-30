"use client";

import { Check, Clock3, Loader2, X } from "lucide-react";
import { useState } from "react";

type GuestStatus =
  | "PENDING"
  | "ATTENDING"
  | "MAYBE"
  | "NOT_ATTENDING";

type Props = {
  token: string;
  initialStatus: GuestStatus;
};

const options: {
  status: Exclude<GuestStatus, "PENDING">;
  label: string;
  description: string;
  icon: typeof Check;
}[] = [
  {
    status: "ATTENDING",
    label: "Joyfully attending",
    description: "I’ll be there",
    icon: Check,
  },
  {
    status: "MAYBE",
    label: "Maybe",
    description: "I’m not certain yet",
    icon: Clock3,
  },
  {
    status: "NOT_ATTENDING",
    label: "Unable to attend",
    description: "I won’t be able to make it",
    icon: X,
  },
];

export default function RsvpActions({
  token,
  initialStatus,
}: Props) {
  const [status, setStatus] =
    useState<GuestStatus>(initialStatus);

  const [loadingStatus, setLoadingStatus] =
    useState<GuestStatus | null>(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  async function submitRsvp(
    nextStatus: Exclude<GuestStatus, "PENDING">
  ) {
    try {
      setLoadingStatus(nextStatus);
      setError("");
      setSuccess(false);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(
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
            status: nextStatus,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ?? "Unable to update your RSVP."
        );
      }

      setStatus(nextStatus);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your RSVP."
      );
    } finally {
      setLoadingStatus(null);
    }
  }

  return (
    <div className="mt-7">
      <div className="grid gap-3">
        {options.map((option) => {
          const Icon = option.icon;

          const selected = status === option.status;

          const loading =
            loadingStatus === option.status;

          return (
            <button
              key={option.status}
              type="button"
              onClick={() => submitRsvp(option.status)}
              disabled={loadingStatus !== null}
              className={`group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                selected
                  ? "border-[#193c32] bg-[#193c32] text-white"
                  : "border-[#dedbd4] bg-white text-[#193c32] hover:border-[#193c32] hover:bg-[#faf9f5]"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  selected
                    ? "bg-white/15 text-white"
                    : "bg-[#f3f0e9] text-[#193c32]"
                }`}
              >
                {loading ? (
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                ) : (
                  <Icon size={19} />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                  {option.label}
                </span>

                <span
                  className={`mt-0.5 block text-xs ${
                    selected
                      ? "text-white/70"
                      : "text-[#8a867e]"
                  }`}
                >
                  {option.description}
                </span>
              </span>

              {selected && !loading && (
                <Check size={18} />
              )}
            </button>
          );
        })}
      </div>

      {success && (
        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">
          Your RSVP has been updated successfully.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}