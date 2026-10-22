export type GamePhase =
    | "waiting"
    | "countdown"
    | "playing"
    | "results"
    | "finished";

export interface GameState {
    phase: GamePhase;

    currentRound: number;

    startedAt?: number;

    endsAt?: number;
}


