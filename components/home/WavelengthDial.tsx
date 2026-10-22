"use client";

import { useEffect, useRef, useState } from "react";

type WavelengthDialProps = {
  /** Small label above the scale, e.g. "Wavelength · this round's scale" */
  label?: string;
  /** Term on the low end of the scale */
  leftTerm?: string;
  /** Term on the high end of the scale */
  rightTerm?: string;
  /** Where the needle settles, in degrees. 0 = straight up, negative = left, positive = right. */
  restAngle?: number;
  className?: string;
};

// The three arc segments stand in for the app's "player token" accent
// colors, reused here rather than introducing a fourth ad-hoc palette.
const SEGMENT_COLORS = ["stroke-coral", "stroke-marigold", "stroke-grass"] as const;

export function WavelengthDial({
  label = "Wavelength · this round's scale",
  leftTerm = "Overrated",
  rightTerm = "Underrated",
  restAngle = 75,
  className = "",
}: WavelengthDialProps) {
  // Needle starts pointing straight up and settles into place on mount —
  // a small "something is alive here" moment for the hero, not a loop.
  const [angle, setAngle] = useState(45);
  const hasAnimated = useRef(true);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      queueMicrotask(() => {
        setAngle(restAngle);
      })
      return;
    }

    const timer = setTimeout(() => setAngle(restAngle), 250);
    return () => clearTimeout(timer);
  }, [restAngle]);

  return (
    <div
      className={`  rounded-card border-2 border-ink bg-paper-card p-8 shadow-poke-lg ${className}`}
    >
      <p className="mb-3 text-[13px] font-semibold text-center text-body-text/60">
        {label}
      </p>
      <p className="mb-4 font-display text-[19px] text-center font-semibold text-body-text">
        {leftTerm} <span className="opacity-50">—</span> {rightTerm}
      </p>

      <svg
        viewBox="0 0 400 220"
        className="h-auto w-full rtl:-scale-x-100"
        role="img"
        aria-label={`Scale from ${leftTerm} to ${rightTerm}`}
      >
        {/* track */}
        <path
          d="M 30 200 A 170 170 0 0 1 370 200"
          fill="none"
          className="stroke-ink-faint"
          strokeWidth={34}
          strokeLinecap="round"
        />

        {/* colored zones */}
        {SEGMENT_COLORS.map((colorClass, i) => (
          <path
            key={colorClass}
            d="M 30 200 A 170 170 0 0 1 370 200"
            fill="none"
            className={colorClass}
            strokeWidth={34}
            strokeLinecap="round"
            strokeDasharray="80 620"
            strokeDashoffset={-220 * i}
            opacity={0.9}
          />
        ))}

        {/* needle */}
        <g
          className="transition-transform duration-1400 ease-[cubic-bezier(0.2,1.4,0.3,1)]"
          style={{ transform: `rotate(${angle}deg)`, transformOrigin: "200px 200px" }}
        >
          <line
            x1="200"
            y1="200"
            x2="200"
            y2="55"
            strokeWidth={6}
            strokeLinecap="round"
            className="stroke-body-text"
          />
          <circle cx="200" cy="200" r="14" className="fill-body-text" />
          <circle cx="200" cy="200" r="5" className="fill-paper-card" />
        </g>
      </svg>
    </div>
  );
}
