"use client";

import type { GoldenTimeRound } from "@/types/golden-time";
import type { Player } from "@/types/player";
import { useTranslations } from "next-intl";

import type { EndGameAction } from "./GoldenTimeGameView";
import EndGameActions from "@/components/actions/EndGameActions";

interface GoldenTimeResultsProps {
    round: GoldenTimeRound;
    players: Record<string, Player>;
    currentUserId: string;

    isFinalRound: boolean;
    isHost: boolean;
    onPlayAgain: () => void;
    onAnotherGame: () => void;
    endGameAction: EndGameAction;
}

export function GoldenTimeResults({
    round,
    players,
    currentUserId,
    isFinalRound,
    isHost,
    onPlayAgain,
    onAnotherGame,
    endGameAction,
}: GoldenTimeResultsProps) {
    const t = useTranslations();
    const results = Object.entries(round.players)
        .map(([uid, result]) => ({
            uid,
            player: players[uid],
            result,
        }))
        .sort((a, b) => {
            if (a.result.rank === null && b.result.rank === null) {
                return 0;
            }

            if (a.result.rank === null) return 1;
            if (b.result.rank === null) return -1;

            return a.result.rank - b.result.rank;
        });

    return (
        <div className="flex w-full max-w-xl flex-col gap-5">
            {/* Last Round */}
            <section
                className="
          rounded-card
          border-2
          border-ink
          bg-paper-card
          p-5
          shadow-poke
        "
            >
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest opacity-60">
                    {t("GoldenTime.lastRound")}
                </h2>

                <div className="divide-y-2 divide-ink/10">
                    {results.map(({ uid, player, result }) => {
                        if (!player) return null;

                        const isYou = uid === currentUserId;

                        const elapsed = result.elapsedMs;

                        const difference = result.differenceMs;

                        return (
                            <div
                                key={uid}
                                className="flex items-center justify-between py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="h-3 w-3 rounded-full bg-periwinkle" />

                                    <div>
                                        <div className="font-bold">
                                            {player.nickname}
                                            {isYou && " (you)"}
                                        </div>

                                        {result.rank === 1 && (
                                            <span className="text-xs font-bold text-marigold">
                                                ★ {t("GoldenTime.best")}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="font-display font-bold">
                                        {elapsed !== null
                                            ? formatTime(elapsed)
                                            : "—"}
                                    </div>

                                    {difference !== null && (
                                        <div className="text-xs font-semibold opacity-60">
                                            {formatDifference(
                                                result.elapsedMs!,
                                                round.targetMs,
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Scoreboard */}
            <section
                className="
          rounded-card
          border-2
          border-ink
          bg-paper-card
          p-5
          shadow-poke
        "
            >
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest opacity-60">
                    {t("Common.labels.scoreboard")}
                </h2>

                <div className="divide-y-2 divide-ink/10">
                    {results.map(({ uid, player, result }) => {
                        if (!player) return null;

                        const isYou = uid === currentUserId;

                        return (
                            <div
                                key={uid}
                                className="flex items-center gap-3 py-3"
                            >
                                <span className="w-6 text-sm font-bold opacity-50">
                                    {result.rank ?? "—"}
                                </span>

                                <span className="h-3 w-3 rounded-full bg-periwinkle" />

                                <span className="flex-1 font-bold">
                                    {player.nickname}
                                    {isYou && " (you)"}
                                </span>

                                <span className="font-display text-lg font-bold">
                                    {player.score}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {isFinalRound && (
                <EndGameActions
                    isHost={isHost}
                    onAnotherGame={onAnotherGame}
                    onPlayAgain={onPlayAgain}
                    endGameAction={endGameAction}
                />
            )}
        </div>
    );
}

function formatTime(ms: number) {
    return (ms / 1000).toFixed(2).padStart(5, "0");
}

function formatDifference(elapsedMs: number, targetMs: number) {
    const difference = elapsedMs - targetMs;

    const sign = difference >= 0 ? "+" : "−";

    return `${sign}${Math.abs(difference / 1000).toFixed(2)}`;
}
