"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

export default function Timer({
  durationMinutes,
  secondsLeft: controlledSecondsLeft,
  onSecondsChange,
  onExpire,
}: {
  durationMinutes: number;
  secondsLeft?: number;
  onSecondsChange?: (seconds: number) => void;
  onExpire: () => void;
}) {
  const [internalSecondsLeft, setInternalSecondsLeft] = useState(Math.max(1, durationMinutes) * 60);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const secondsLeft = controlledSecondsLeft ?? internalSecondsLeft;

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (controlledSecondsLeft === undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalSecondsLeft(Math.max(1, durationMinutes) * 60);
    }
    expiredRef.current = false;
  }, [controlledSecondsLeft, durationMinutes]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const update = (current: number) => {
        if (current <= 1) {
          window.clearInterval(interval);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpireRef.current();
          }
          return 0;
        }
        return current - 1;
      };

      if (controlledSecondsLeft !== undefined) {
        onSecondsChange?.(update(controlledSecondsLeft));
      } else {
        setInternalSecondsLeft(update);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [controlledSecondsLeft, durationMinutes, onSecondsChange]);

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${secondsLeft <= 300 ? "bg-red-50 text-red-600" : "bg-primary/10 text-primary"}`}>
      <Clock className="w-4 h-4" />
      {minutes}:{seconds}
    </div>
  );
}
