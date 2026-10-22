

export type GoldenTimePhase =
    | "countdown"
    | "playing"
    | "resolving"
    | "results";

export interface GoldenTimePlayer {
    elapsedMs: number | null;
    differenceMs: number | null;
    rank: number | null;
    points: number;
    timedOut: boolean;
}

export interface GoldenTimeRound {
    roundNumber: number;
    targetMs: number;
    resultsDeadline: number;
    countdownEndsAt: number;
    phase: GoldenTimePhase;
    players: Record<string, GoldenTimePlayer>;
}

export interface GoldenTimeGame {
    roundNumber: number;
    totalRounds: number;
    phase: GoldenTimePhase;
    round: GoldenTimeRound | null;
}