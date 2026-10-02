"use client";

import {
  CalendarPlus,
  Download,
} from "lucide-react";

type AddToCalendarProps = {
  title: string;
  description?: string | null;
  startDate: string;
  location?: string | null;
};

const EVENT_DURATION_MS = 60 * 60 * 1000;

function toCalendarDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function createGoogleCalendarUrl({
  title,
  description,
  startDate,
  location,
}: AddToCalendarProps) {
  const start = new Date(startDate);
  const end = new Date(
    start.getTime() + EVENT_DURATION_MS
  );

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toCalendarDate(start)}/${toCalendarDate(end)}`,
    details: description ?? "",
    location: location ?? "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function createICS({
  title,
  description,
  startDate,
  location,
}: AddToCalendarProps) {
  const start = new Date(startDate);
  const end = new Date(
    start.getTime() + EVENT_DURATION_MS
  );

  const escapeICS = (value: string) =>
    value
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");

  const uid = `${crypto.randomUUID()}@festyvibe`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FestyVibe//Event Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toCalendarDate(new Date())}`,
    `DTSTART:${toCalendarDate(start)}`,
    `DTEND:${toCalendarDate(end)}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description ?? "")}`,
    `LOCATION:${escapeICS(location ?? "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(props: AddToCalendarProps) {
  const ics = createICS(props);

  const blob = new Blob([ics], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${props.title
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()}.ics`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export default function AddToCalendar(
  props: AddToCalendarProps
) {
  const googleUrl = createGoogleCalendarUrl(props);

  return (
    <div className="mt-8 rounded-3xl border border-[#ebe7df] bg-[#faf9f6] p-6 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#e8eee9] text-[#193c32]">
        <CalendarPlus size={20} />
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-[#c99a6b]">
        Save the date
      </p>

      <h3 className="serif mt-2 text-2xl text-[#193c32]">
        Keep the celebration on your calendar
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777c78]">
        Add this event to your calendar so you don't
        miss the celebration.
      </p>

      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href={googleUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#245246]"
        >
          <CalendarPlus size={16} />
          Google Calendar
        </a>

        <button
          type="button"
          onClick={() => downloadICS(props)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dedbd4] bg-white px-5 py-3 text-sm font-medium text-[#193c32] transition hover:bg-[#f7f5f0]"
        >
          <Download size={16} />
          Download calendar file
        </button>
      </div>

      <p className="mt-4 text-[11px] leading-5 text-[#9a958c]">
        The calendar file works with Apple Calendar,
        Outlook, Google Calendar, and other calendar apps.
      </p>
    </div>
  );
}