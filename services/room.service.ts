import {
  ref,
  set,
  get,

  update,
  onValue,

} from "firebase/database";

import { database } from "@/lib/firebase/client";

import type { GameType, Room } from "@/types/room";
import type { Player } from "@/types/player";

const ROOM_CODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRoomCode(length = 4) {
    let code = "";

    for (let i = 0; i < length; i++) {
        const index = Math.floor(
        Math.random() * ROOM_CODE_CHARACTERS.length
        );

        code += ROOM_CODE_CHARACTERS[index];
    }

    return code;
}



export async function createRoom(
    host: Player,
    gameType: GameType | null = null
) {
            const roomId = crypto.randomUUID();
    const code = generateRoomCode();
    const createdAt = Date.now();

    const room = {
        id: roomId,
        code,
        hostId: host.uid,
        gameType,
        status: "waiting",
        currentRound: 0,
        createdAt,
        expiresAt: createdAt + 24 * 60 * 60 * 1000,
        players: {
        [host.uid]: host,
        },
    };

    await set(ref(database, `rooms/${roomId}`), room);

    try {
        await set(ref(database, `roomCodes/${code}`), roomId);
    } catch (error) {
        await set(ref(database, `rooms/${roomId}`), null);
        throw error;
    }

    return room;
}

export async function findRoomByCode(
    code: string,
): Promise<Room | null> {
    const normalizedCode = code.trim().toUpperCase();

    const codeRef = ref(
        database,
        `roomCodes/${normalizedCode}`,
    );

    const codeSnapshot = await get(codeRef);

    if (!codeSnapshot.exists()) {
        return null;
    }

    const roomId = codeSnapshot.val();

    const roomRef = ref(
        database,
        `rooms/${roomId}`,
    );

    const roomSnapshot = await get(roomRef);

    if (!roomSnapshot.exists()) {
        return null;
    }

    return roomSnapshot.val() as Room;
}


export async function addPlayerToRoom(
    roomId: string,
    player: Player
) {
    const playerRef = ref(
        database,
        `rooms/${roomId}/players/${player.uid}`
    );

    await set(playerRef, player);
}


export function subscribeToRoom(
    roomId: string,
    callback: (room: Room | null) => void
) {
    const roomRef = ref(database, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
        if (!snapshot.exists()) {
        callback(null);
        return;
        }

        callback(snapshot.val());
    });

    return unsubscribe;
}



import { onDisconnect, serverTimestamp } from "firebase/database";

/** Marks this player connected while their tab is open, and flips them to
 * disconnected automatically (server-side) the moment the connection drops —
 * tab closed, phone locked, wifi dies. No heartbeat/polling required. */
export function bindPlayerPresence(roomId: string, uid: string) {
    const connectedRef = ref(database, ".info/connected");
    const playerConnectedRef = ref(database, `rooms/${roomId}/players/${uid}/connected`);
    const playerLastSeenRef = ref(database, `rooms/${roomId}/players/${uid}/lastSeen`);

    const unsubscribe = onValue(connectedRef, (snapshot) => {
        if (snapshot.val() !== true) return;

        onDisconnect(playerConnectedRef).set(false);
        onDisconnect(playerLastSeenRef).set(serverTimestamp());
        set(playerConnectedRef, true);
    });

    return unsubscribe;
}


export async function updatePlayer(
    roomId: string,
    uid: string,
    data: Partial<Player>,
) {
    const playerRef = ref(
        database,
        `rooms/${roomId}/players/${uid}`,
    );

    await update(playerRef, data);
}




export async function updateRoom(
    roomId: string,
    data: Partial<Room>,
) {
    const RoomRef = ref(
        database,
        `rooms/${roomId}`,
    );

    await update(RoomRef, data);
}

export async function selectGame(
    roomId: string,
    gameType: GameType,
) {
    await updateRoom(roomId, {
        gameType,
    });
}

export async function returnRoomToLobby(
  roomId: string,
  playerIds: string[],
) {
  const updates: Record<string, unknown> = {
    status: "waiting",
    currentRound: 0,
    gameType: null,
    game: null,
  };

  for (const uid of playerIds) {
    updates[`players/${uid}/score`] = 0;
    updates[`players/${uid}/ready`] = false;
  }

  await update(ref(database, `rooms/${roomId}`), updates);
}