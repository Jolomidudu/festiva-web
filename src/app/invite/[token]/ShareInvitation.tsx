"use client";

import {
  Check,
  Copy,
  Share2,
} from "lucide-react";
import { useState } from "react";

export default function ShareInvitation() {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  async function shareInvitation() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        setSharing(true);

        await navigator.share({
          title: document.title,
          text: "You're invited to celebrate with us.",
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // The user may simply close the native share dialog.
    } finally {
      setSharing(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <button
        type="button"
        onClick={shareInvitation}
        disabled={sharing}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#245246] disabled:opacity-60"
      >
        <Share2 size={16} />

        {sharing ? "Sharing..." : "Share invitation"}
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dedbd4] bg-white px-5 py-3 text-sm font-medium text-[#193c32] transition hover:bg-[#f7f5f0]"
      >
        {copied ? (
          <Check size={16} />
        ) : (
          <Copy size={16} />
        )}

        {copied ? "Link copied" : "Copy invitation link"}
      </button>
    </div>
  );
}