"use client";

import { useEffect, useState } from "react";

function splitDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function Countdown({ target }: { target: string }) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const targetTime = new Date(target).getTime();
    const timer = setInterval(() => {
      setRemainingMs(Math.max(0, targetTime - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (remainingMs === null) return null;

  const { days, hours, minutes, seconds } = splitDuration(remainingMs);

  return (
    <div className="flex gap-3" aria-live="polite">
      {[
        { label: "Days", value: days },
        { label: "Hours", value: hours },
        { label: "Mins", value: minutes },
        { label: "Secs", value: seconds },
      ].map((unit) => (
        <div key={unit.label} className="rounded-md bg-surface px-3 py-2 text-center shadow-sm">
          <p className="font-serif text-xl text-text-primary">{String(unit.value).padStart(2, "0")}</p>
          <p className="text-[10px] tracking-wide text-text-muted uppercase">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}
