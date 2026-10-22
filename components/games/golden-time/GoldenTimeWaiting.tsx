"use client";

import type { GoldenTimeRound } from "@/types/golden-time";
import type { Player } from "@/types/player";

import { GoldenTimeTimer } from "./GoldenTimeTimer";
import { GoldenTimePlayerStatus } from "./GoldenTimePlayerStatus";
import { useTranslations } from "next-intl";

interface GoldenTimeWaitingProps {
    elapsedMs: number;
    players: Record<string, Player>;
    round: GoldenTimeRound;
    currentUserId: string;
}

export function GoldenTimeWaiting({
    elapsedMs,
    players,
    round,
    currentUserId,
}: GoldenTimeWaitingProps) {
    const t = useTranslations("GoldenTime.waiting")
    return (
        <div className="flex w-full flex-col items-center gap-8">
            <div
                className="
                    flex
                    min-h-32
                    w-full
                    max-w-xl
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    rounded-card
                    border-4
                    border-ink
                    bg-paper-card
                    px-6
                    py-8
                    shadow-poke
                    "
            >
                <GoldenTimeTimer elapsedMs={elapsedMs} />

                <span className="text-sm font-bold uppercase tracking-widest text-grass">
                    ✓ {t("lockedIn")}
                </span>
            </div>

            <p className="text-center text-sm opacity-60">
                {t("p1")}
            </p>

            <GoldenTimePlayerStatus
                players={players}
                round={round}
                currentUserId={currentUserId}
            />
        </div>
    );
}
