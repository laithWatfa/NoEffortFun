"use client";

import { useEffect } from "react";
import { playSound, unlockAudio, type SoundName } from "@/lib/sound";

/**
 * Mount once in the root layout. It does two things:
 *
 * 1. Unlocks audio on the user's first pointer/key press (browsers block
 *    sound before that, so we never try to autoplay anything).
 * 2. Plays a soft "click" for every <button> automatically. Override per
 *    element with data-sound="select" | "ready" | ..., or opt out with
 *    data-sound="none" when you trigger a sound yourself.
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const unlock = () => {
            void unlockAudio();
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("keydown", unlock);
        };
        window.addEventListener("pointerdown", unlock);
        window.addEventListener("keydown", unlock);

        const onClick = (event: MouseEvent) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey) return;
            const target = event.target as Element | null;
            const el = target?.closest<HTMLElement>("[data-sound], button, a");
            if (!el) return;
            if (el instanceof HTMLButtonElement && el.disabled) return;

            const choice = el.dataset.sound;
            if (choice === "none") return;
            playSound((choice as SoundName | undefined) ?? "click");
        };
        document.addEventListener("click", onClick);

        return () => {
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("keydown", unlock);
            document.removeEventListener("click", onClick);
        };
    }, []);

    return <>{children}</>;
}
