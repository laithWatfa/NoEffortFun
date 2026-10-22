import  type { GoldenTimeGame } from "./golden-time";
import type { Player } from "./player";

export type RoomStatus = "waiting" | "playing" | "finished";

export type GameType = "golden-time" | "wavelength" | "imposter";

export interface Room {
    id: string;
    code: string;

    hostId: string;

    gameType: GameType | null;

    status: RoomStatus;

    currentRound: number;

    createdAt: number;

    players: Record<string, Player>;

    game?: {
        goldenTime?: GoldenTimeGame;
    };
}
