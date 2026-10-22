"use client";

import { useEffect } from "react";
import { playSound } from "@/lib/sound";

/**
 * Plays a tick for every whole second left, then "go" at 0.
 * Pass null whenever no countdown is running.
 *
 * Each tick is slightly higher pitched than the last (3 → 2 → 1), which
 * builds tension for free with a single tick.mp3.
 */
export function useCountdownSounds(secondsLeft: number | null) {
    useEffect(() => {
        if (secondsLeft === null) return;

        if (secondsLeft > 0) {
            playSound("tick", { rate: 1 + Math.max(3, 3 - secondsLeft) * 0.06 });
        } else {
            playSound("go");
        }
    }, [secondsLeft]);
}
