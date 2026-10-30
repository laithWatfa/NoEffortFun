"use client";

import { useSyncExternalStore } from "react";
import {
    getSoundEnabled,
    playSound,
    setSoundEnabled,
    subscribeSound,
} from "@/lib/sound";

function SpeakerIcon({ muted }: { muted: boolean }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M11 5 6 9H3v6h3l5 4V5z" />
            {muted ? (
                <path d="m16 9 5 6M21 9l-5 6" />
            ) : (
                <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
            )}
        </svg>
    );
}

export function SoundToggle() {
    // Server renders "on"; if the saved preference is "off" React corrects it
    // right after hydration, with no mismatch warning.
    const enabled = useSyncExternalStore(
        subscribeSound,
        getSoundEnabled,
        () => false,
    );

    function toggle() {
        const next = !enabled;
        setSoundEnabled(next);
        if (next) playSound("click"); // quick confirmation that sound is back
    }

    return (
        <button
            type="button"
            
            data-sound="none"
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? "Mute sound" : "Unmute sound"}
            title={enabled ? "Sound on" : "Sound off"}
            className="group relative flex items-center justify-center w-12 h-12 rounded-pill border-2 
            border-body-text bg-paper text-body-text transition hover:-translate-x-0.5 hover:-translate-y-0.5 
            active:translate-x-0 active:translate-y-0 active:shadow-poke shadow-poke hover:shadow-poke-lg cursor-pointer"
        >
            <SpeakerIcon muted={!enabled} />
        </button>
    );
}
