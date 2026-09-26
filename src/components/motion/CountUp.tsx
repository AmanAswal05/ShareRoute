"use client";

import { useEffect, useState } from "react";

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1000,
}: {
  value: number | string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const numericTarget = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0 : value;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.floor(easedProgress * numericTarget));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(numericTarget);
      }
    };

    window.requestAnimationFrame(step);
  }, [numericTarget, duration]);

  if (isNaN(numericTarget)) {
    return <span>{value}</span>;
  }

  return (
    <span>
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}
