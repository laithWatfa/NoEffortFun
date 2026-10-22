import { GameConfig, GAMES } from "@/config/games";
import { Player } from "@/types/player";
import type { Room } from "@/types/room";

export interface LobbyState {
        players: Player[];
        selectedGame: GameConfig | null | undefined;
        everyoneReady: boolean;
        enoughPlayersForGame: boolean;
        tooManyPlayersForGame: boolean;
        canStart: boolean;
} 

export function getRoomLobbyState(room: Room | null) : LobbyState | undefined {
    if(!room) return
    const players = Object.values(room.players);

    const everyoneReady =
        players.length > 0 &&
        players.every((player) => player.ready);

    const selectedGame = room.gameType
        ? GAMES.find((game) => game.id === room.gameType)
        : null;

    const enoughPlayersForGame =
        selectedGame !== null &&
        players.length >= ( selectedGame?.minPlayers ?? 2);

    const tooManyPlayersForGame =
        selectedGame !== null &&
        players.length > (selectedGame?.maxPlayers ?? 8 );

    const canStart =
        room.status === "waiting" &&
        selectedGame !== null &&
        everyoneReady &&
        enoughPlayersForGame &&
        !tooManyPlayersForGame;

    return {
        players,
        everyoneReady,
        selectedGame,
        enoughPlayersForGame,
        tooManyPlayersForGame,
        canStart,
    };
}