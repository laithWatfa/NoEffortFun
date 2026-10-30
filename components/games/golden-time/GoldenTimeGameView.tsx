
"use client";

import { useEffect, useState } from "react";
import type { GoldenTimeGame } from "@/types/golden-time";
import type { Player } from "@/types/player";

import { GoldenTimeHeader } from "./GoldenTimeHeader";
import { GoldenTimeRoundHeader } from "./GoldenTimeRoundHeader";
import { GoldenTimeCountdown } from "./GoldenTimeCountdown";
import { GoldenTimePlaying } from "./GoldenTimePlaying";
import { GoldenTimeWaiting } from "./GoldenTimeWaiting";
import { GoldenTimeResults } from "./GoldenTimeResults";

import { useTranslations } from "next-intl";
import { useCountdownSounds } from "@/hooks/use-countdown-sounds";

export type EndGameAction = "replay" | "lobby" | null;

interface GoldenTimeGameViewProps {
    roomId: string;
    userId: string;
    players: Record<string, Player>;
    game: GoldenTimeGame;
    isHost: boolean;
    onQuit: () => void;
    onPlayAgain: () => void;
    onAnotherGame: () => void;
    endGameAction: EndGameAction;
}

export function GoldenTimeGameView({
    roomId,
    userId,
    players,
    game,
    isHost,
    onQuit,
    onPlayAgain,
    onAnotherGame,
    endGameAction,
}: GoldenTimeGameViewProps) {
    const t = useTranslations("GoldenTime.resolving");
    const round = game.round;

    const [countdown, setCountdown] = useState(0);
    useCountdownSounds(countdown);

    const currentPlayerResult = round?.players?.[userId];

    const hasSubmitted =
        currentPlayerResult?.elapsedMs !== null &&
        currentPlayerResult?.elapsedMs !== undefined;

    useEffect(() => {
        if (!round || round.phase !== "countdown") {
            return;
        }

        const updateCountdown = () => {
            const remaining = round.countdownEndsAt - Date.now();
            setCountdown(Math.max(Math.ceil(remaining / 1000), 0));
        };

        updateCountdown();

        const interval = window.setInterval(updateCountdown, 100);

        return () => window.clearInterval(interval);
    }, [round?.countdownEndsAt, round?.phase]);

    if (!round) {
        return null;
    }

    const isFinalRound = round.roundNumber >= game.totalRounds;

    return (
        <main className="min-h-screen bg-paper px-4 py-5 sm:px-6">
            <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-col">
                <GoldenTimeHeader onQuit={onQuit} />

                <div className="flex flex-1 flex-col items-center pt-8 sm:pt-12">
                    <GoldenTimeRoundHeader
                        roundNumber={round.roundNumber}
                        totalRounds={game.totalRounds}
                        targetMs={round.targetMs}
                    />

                    <div className="mt-10 flex w-full justify-center">
                        {round.phase === "countdown" && (
                            <GoldenTimeCountdown seconds={countdown} />
                        )}

                        {round.phase === "playing" && !hasSubmitted && (
                            <GoldenTimePlaying
                                key={round.roundNumber}
                                roomId={roomId}
                                userId={userId}
                                players={players}
                                round={round}
                            />
                        )}

                        {round.phase === "playing" && hasSubmitted && (
                            <GoldenTimeWaiting
                                elapsedMs={currentPlayerResult.elapsedMs!}
                                players={players}
                                round={round}
                                currentUserId={userId}
                            />
                        )}

                        {round.phase === "resolving" && (
                            <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-card border-4 border-ink bg-paper-card px-6 py-10 text-center shadow-poke">
                                <div className="font-display text-2xl font-bold">
                                    {t("p1")}
                                </div>
                                <p className="text-sm text-body-text/60">
                                    {t("p2")}
                                </p>
                            </div>
                        )}

                        {round.phase === "results" && (
                            <GoldenTimeResults
                                round={round}
                                players={players}
                                currentUserId={userId}
                                isFinalRound={isFinalRound}
                                isHost={isHost}
                                onPlayAgain={onPlayAgain}
                                onAnotherGame={onAnotherGame}
                                endGameAction={endGameAction}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
