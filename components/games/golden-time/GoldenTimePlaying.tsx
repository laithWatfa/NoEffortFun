"use client";

import type { GoldenTimeRound } from "@/types/golden-time";
import type { Player } from "@/types/player";

import { submitGoldenTimeResult } from "@/services/golden-time.service";

import { useGoldenTimeTimer } from "./hooks/useGoldenTimeTimer";
import { GoldenTimeTimer } from "./GoldenTimeTimer";
import { GoldenTimeStopButton } from "./GoldenTimeStopButton";
import { GoldenTimePlayerStatus } from "./GoldenTimePlayerStatus";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface GoldenTimePlayingProps {
    roomId: string;
    userId: string;
    players: Record<string, Player>;
    round: GoldenTimeRound;
    onStopped?: () => void;
}

export function GoldenTimePlaying({
    roomId,
    userId,
    players,
    round,
}: GoldenTimePlayingProps) {
    const t = useTranslations("GoldenTime.waiting")
    const [startAt] = useState(
        () =>
            performance.now() + Math.max(round.countdownEndsAt - Date.now(), 0),
    );

    const [hasStopped, setHasStopped] = useState(false);
    const [coverClosed, setCoverClosed] = useState(false);


    const { elapsedMs, getElapsedMs } = useGoldenTimeTimer({
        startAt,
        running: !hasStopped,
    });

    const handleStop = async () => {
        if (hasStopped) return;

        // Calculate directly at the moment the
        // player presses Stop.
        const finalElapsedMs = Math.round(getElapsedMs());

        setHasStopped(true);

        try {
            await submitGoldenTimeResult(roomId, userId, finalElapsedMs);
        } catch (error) {
            console.error("Failed to submit Golden Time result:", error);

            setHasStopped(false);
        }
    };

    return (
        <div className="flex w-full flex-col items-center gap-8">
            <div
                className="
                flex
                min-h-32
                w-full
                max-w-xl
                items-center
                justify-center
                rounded-card
                border-4
                border-ink
                bg-paper-card
                px-6
                py-8
                shadow-poke
                relative
                "
            >
                <GoldenTimeTimer elapsedMs={elapsedMs} />

                <div
                    onAnimationEnd={(e) => {
                        if (e.animationName === "coverShut")
                            setCoverClosed(true);
                    }}
                    className={`absolute -inset-1 rounded-card border-8 border-grass bg-paper-card ${
                        hasStopped
                            ? "timer-cover-exit"
                            : "timer-cover"
                    }`}
                />
            </div>

            {!hasStopped && <GoldenTimeStopButton onClick={handleStop} />}

            {hasStopped && (
                <div className="text-center">
                    <div className="text-xl font-bold">✓ {t("lockedIn")}</div>

                    <div className="mt-2 text-sm opacity-60">
                        {t("p1")}
                    </div>
                </div>
            )}

            <GoldenTimePlayerStatus
                players={players}
                round={round}
                currentUserId={userId}
            />
        </div>
    );
}
