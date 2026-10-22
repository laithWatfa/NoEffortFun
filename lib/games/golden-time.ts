import {
    GOLDEN_TIME_MAX_TARGET_MS,
    GOLDEN_TIME_MIN_TARGET_MS,
} from "@/config/golden-time";

export function generateGoldenTimeTarget(): number {
    const min =
        GOLDEN_TIME_MIN_TARGET_MS / 10;

    const max =
        GOLDEN_TIME_MAX_TARGET_MS / 10;

    const value =
        Math.floor(
            Math.random() * (max - min + 1),
        ) + min;

    return value * 10;
}


export function formatGoldenTime(ms: number): string {
    return (ms / 1000).toFixed(2);
}



export interface GoldenTimeResultInput {
    uid: string;
    elapsedMs: number | null;
    timedOut: boolean;
}

export interface GoldenTimeResult
    extends GoldenTimeResultInput {
    differenceMs: number | null;
    rank: number | null;
    points: number;
}

export function calculateGoldenTimeResults(
    players: GoldenTimeResultInput[],
    targetMs: number,
): GoldenTimeResult[] {
    const activePlayers = players
        .filter(
            (player) =>
                !player.timedOut &&
                player.elapsedMs !== null,
        )
        .map((player) => ({
            ...player,
            differenceMs: Math.abs(
                player.elapsedMs! - targetMs,
            ),
        }));

    const timedOutPlayers = players
        .filter(
            (player) =>
                player.timedOut ||
                player.elapsedMs === null,
        )
        .map((player) => ({
            ...player,
            differenceMs: null,
        }));


    activePlayers.sort(
        (a, b) =>
            a.differenceMs! - b.differenceMs!,
    );

    const results: GoldenTimeResult[] = [];

    let previousDifferenceMs: number | null = null;
    let currentRank = 0;

    activePlayers.forEach(
        (player, index) => {
            const isTie =
                previousDifferenceMs !== null &&
                player.differenceMs ===
                    previousDifferenceMs;

            if (!isTie) {
                currentRank = index + 1;
            }

            results.push({
                ...player,
                rank: currentRank,
                points: Math.max(
                    players.length - currentRank,
                    0,
                ),
            });

            previousDifferenceMs =
                player.differenceMs;
        },
    );

    /*
     * Players who timed out receive 0 points
     * and are placed after all normal players.
     */
    timedOutPlayers.forEach((player) => {
        results.push({
            ...player,
            rank: null,
            points: 0,
        });
    });

    return results;
}