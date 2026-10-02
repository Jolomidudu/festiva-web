"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference =
    new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ),
    hours: Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    ),
    minutes: Math.floor(
      (difference / (1000 * 60)) % 60
    ),
    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  };
}

function TimeBlock({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="min-w-[68px] rounded-2xl bg-[#f8f6f1] px-3 py-4 text-center sm:min-w-[82px]">
      <p className="serif text-2xl text-[#193c32] sm:text-3xl">
        {String(value).padStart(2, "0")}
      </p>

      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a958c]">
        {label}
      </p>
    </div>
  );
}

export default function Countdown({
  targetDate,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    const update = () => {
      setTimeLeft(calculateTimeLeft(targetDate));
    };

    update();

    const interval = window.setInterval(
      update,
      1000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [targetDate]);

  const isStarted =
    new Date(targetDate).getTime() <= Date.now();

  if (isStarted) {
    return (
      <div className="rounded-3xl bg-[#f8f6f1] px-6 py-5 text-center">
        <p className="text-sm font-medium text-[#193c32]">
          The celebration has begun
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      <TimeBlock
        value={timeLeft.days}
        label="Days"
      />

      <TimeBlock
        value={timeLeft.hours}
        label="Hours"
      />

      <TimeBlock
        value={timeLeft.minutes}
        label="Minutes"
      />

      <TimeBlock
        value={timeLeft.seconds}
        label="Seconds"
      />
    </div>
  );
}