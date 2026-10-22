"use client";

import { useEffect, useRef } from "react";

import {
    GOLDEN_TIME_RESULTS_DURATION_MS,
    GOLDEN_TIME_TOTAL_ROUNDS,
} from "@/config/golden-time";

import { updateRoom } from "@/services/room.service";

import {
    createGoldenTimeRound,
    resolveGoldenTimeRound,
    updateGoldenTimeRound,
} from "@/services/golden-time.service";

import type { Room } from "@/types/room";
import type {
    GoldenTimeGame,
} from "@/types/golden-time";

interface UseGoldenTimeCoordinatorOptions {
    room: Room | null;
    userId: string | null;
}

export function useGoldenTimeCoordinator({
    room,
    userId,
}: UseGoldenTimeCoordinatorOptions) {
    const resolvingRef =
        useRef(false);

    const nextRoundTimeoutRef =
        useRef<ReturnType<
            typeof setTimeout
        > | null>(null);

    const countdownTimeoutRef =
        useRef<ReturnType<
            typeof setTimeout
        > | null>(null);
    
    const finishingRoundRef = useRef<number | null>(null);

    const isHost =
        !!room &&
        !!userId &&
        room.hostId === userId;

    const game =
        room?.game?.goldenTime as
            | GoldenTimeGame
            | undefined;

    const round = game?.round;

    useEffect(() => {
        if (!isHost) {
            return;
        }

        if (
            !room ||
            room.status !== "playing"
        ) {
            return;
        }

        /*
         * The host hasn't created the first round yet.
         */
        if (!game || !round) {
            const playerIds =
                Object.keys(
                    room.players,
                );

            if (
                playerIds.length === 0
            ) {
                return;
            }

            createGoldenTimeRound(
                room.id,
                playerIds,
                1,
            ).catch(console.error);

            return;
        }

        /*
         * ─────────────────────────────
         * COUNTDOWN
         * ─────────────────────────────
         */
        if (
            round.phase === "countdown"
        ) {
            const remaining =
                Math.max(
                    round.countdownEndsAt -
                        Date.now(),
                    0,
                );

            countdownTimeoutRef.current =
                setTimeout(
                    async () => {
                        try {
                            await updateGoldenTimeRound(
                                room.id,
                                {
                                    phase:
                                        "playing",
                                },
                            );
                        } catch (error) {
                            console.error(
                                "Failed to start Golden Time round:",
                                error,
                            );
                        }
                    },
                    remaining,
                );

            return () => {
                if (
                    countdownTimeoutRef.current
                ) {
                    clearTimeout(
                        countdownTimeoutRef.current,
                    );
                }
            };
        }

        /*
         * ─────────────────────────────
         * PLAYING
         * ─────────────────────────────
         */
        if (
            round.phase === "playing"
        ) {
            const players =
                Object.values(
                    round.players,
                );

            const everyoneSubmitted =
                players.length > 0 &&
                players.every(
                    (player) =>
                        player.elapsedMs !=
                            null ||
                        player.timedOut === true,
                );

            const deadlineReached =
                Date.now() >=
                round.resultsDeadline;

            if (
                everyoneSubmitted ||
                deadlineReached
            ) {
                if (
                    resolvingRef.current
                ) {
                    return;
                }

                resolvingRef.current =
                    true;

                resolveGoldenTimeRound(
                    room.id,
                )
                    .catch(console.error)
                    .finally(() => {
                        resolvingRef.current =
                            false;
                    });

                return;
            }

            /*
             * Nothing has happened yet.
             *
             * Wake up close to the deadline
             * so we don't depend on a Firebase
             * update to detect it.
             */
            const remaining =
                Math.max(
                    round.resultsDeadline -
                        Date.now(),
                    0,
                );

            const timeout =
                setTimeout(() => {
                    resolveGoldenTimeRound(
                        room.id,
                    ).catch(console.error);
                }, remaining);

            return () => {
                clearTimeout(timeout);
            };
        }


/*
 * RESULTS
 */
if (round.phase === "results") {
    /*
     * Final round: finish the room instead of
     * creating another round.
     */
    if (
        round.roundNumber >=
        GOLDEN_TIME_TOTAL_ROUNDS
    ) {
        if (
            finishingRoundRef.current ===
            round.roundNumber
        ) {
            return;
        }

        finishingRoundRef.current =
            round.roundNumber;

        updateRoom(room.id, {
            status: "finished",
        }).catch((error) => {
            console.error(
                "Failed to finish Golden Time game:",
                error,
            );

            finishingRoundRef.current = null;
        });

        return;
    }

    nextRoundTimeoutRef.current = setTimeout(
        async () => {
            try {
                await createGoldenTimeRound(
                    room.id,
                    Object.keys(room.players),
                    round.roundNumber + 1,
                );
            } catch (error) {
                console.error(
                    "Failed to create next Golden Time round:",
                    error,
                );
            }
        },
        GOLDEN_TIME_RESULTS_DURATION_MS,
    );

    return () => {
        if (nextRoundTimeoutRef.current) {
            clearTimeout(
                nextRoundTimeoutRef.current,
            );
        }
    };
}
    }, [
        isHost,
        room,
        userId,
        game,
        round,
    ]);
}