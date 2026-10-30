import { get, set, onValue, ref, update, runTransaction } from "firebase/database";
import {
    GOLDEN_TIME_COUNTDOWN_MS,
    GOLDEN_TIME_TIMEOUT_AFTER_TARGET_MS,
    GOLDEN_TIME_TOTAL_ROUNDS,
} from "@/config/golden-time";

import {
    generateGoldenTimeTarget,
    calculateGoldenTimeResults,
} from "@/lib/games/golden-time";

import { database } from "@/lib/firebase/client";

import type {
    GoldenTimeGame,
    GoldenTimeRound,
} from "@/types/golden-time";

import type { Room } from "@/types/room";

const GAME_PATH = (roomId: string) => `rooms/${roomId}/game/goldenTime`;

const ROUND_PATH = (roomId: string) => `${GAME_PATH(roomId)}/round`;

const ROUND_PLAYERS_PATH = (roomId: string) => `${ROUND_PATH(roomId)}/players`;

export async function startGoldenTimeGame(roomId: string, playerIds: string[]) {
    
    const firstRound = createGoldenTimeRoundData(playerIds, 1);

    const game: GoldenTimeGame = {
        roundNumber: 1,
        totalRounds: GOLDEN_TIME_TOTAL_ROUNDS,
        phase: "countdown",
        round: firstRound,
    };

    const updates: Record<string, unknown> = {
  status: "playing",
  currentRound: 1,
  game: { goldenTime: game },
};

for (const uid of playerIds) {
  updates[`players/${uid}/score`] = 0;
  updates[`players/${uid}/ready`] = false;
}

    await update(ref(database, `rooms/${roomId}`), updates);
}

export async function getGoldenTimeGame(
    roomId: string,
): Promise<GoldenTimeGame | null> {
    const gameRef = ref(database, GAME_PATH(roomId));

    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.val() as GoldenTimeGame;
}

export function subscribeToGoldenTimeGame(
    roomId: string,
    callback: (game: GoldenTimeGame | null) => void,
) {
    const gameRef = ref(database, GAME_PATH(roomId));

    return onValue(gameRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback(null);
            return;
        }

        callback(snapshot.val() as GoldenTimeGame);
    });
}

export async function createGoldenTimeGame(
    roomId: string,
    game: GoldenTimeGame,
) {
    const gameRef = ref(database, GAME_PATH(roomId));

    await update(gameRef, game);
}

export async function updateGoldenTimeGame(
    roomId: string,
    data: Partial<GoldenTimeGame>,
) {
    const gameRef = ref(database, GAME_PATH(roomId));

    await update(gameRef, data);
}

export async function updateGoldenTimeRound(
    roomId: string,
    data: Partial<GoldenTimeRound>,
) {
    const roundRef = ref(database, ROUND_PATH(roomId));

    await update(roundRef, data);
}

export async function submitGoldenTimeResult(
    roomId: string,
    uid: string,
    elapsedMs: number,
) {
    const elapsedMsRef = ref(
        database,
        `${ROUND_PLAYERS_PATH(roomId)}/${uid}/elapsedMs`,
    );

    await set(elapsedMsRef, elapsedMs);
}

export function createGoldenTimeRoundData(
    playerIds: string[],
    roundNumber: number,
): GoldenTimeRound {
    const now = Date.now();

    const targetMs = generateGoldenTimeTarget();

    const countdownEndsAt = now + GOLDEN_TIME_COUNTDOWN_MS;

    const resultsDeadline =
        countdownEndsAt + targetMs + GOLDEN_TIME_TIMEOUT_AFTER_TARGET_MS;

    const players = Object.fromEntries(
        playerIds.map((uid) => [
            uid,
            {
                elapsedMs: null,
                differenceMs: null,
                rank: null,
                points: 0,
                timedOut: false,
            },
        ]),
    );

    return {
        roundNumber,
        targetMs,
        countdownEndsAt,
        resultsDeadline,
        phase: "countdown",
        players,
    };
}

export async function createGoldenTimeRound(
    roomId: string,
    playerIds: string[],
    roundNumber: number,
) {
    const round = createGoldenTimeRoundData(playerIds, roundNumber);

    const gameRef = ref(database, GAME_PATH(roomId));

    await update(gameRef, {
        roundNumber,
        totalRounds: GOLDEN_TIME_TOTAL_ROUNDS,
        phase: "countdown",
        round,
    });

    return round;
}

export async function resolveGoldenTimeRound(roomId: string) {
    const roomRef = ref(database, `rooms/${roomId}`);

    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
        return false;
    }

    const room = snapshot.val() as Room;

    const game = room.game?.goldenTime as GoldenTimeGame | undefined;

    const round = game?.round;

    if (!round) {
        return false;
    }

    if (round.phase !== "playing" && round.phase !== "resolving") {
        return false;
    }

    /*
     * Claim the resolution.
     *
     * If another host coordinator already claimed it,
     * this transaction will not commit.
     */
    if (round.phase === "playing") {
        const phaseRef = ref(database, `${ROUND_PATH(roomId)}/phase`);

        const transaction = await runTransaction(phaseRef, (currentPhase) => {
            if (currentPhase !== "playing") {
                return;
            }

            return "resolving";
        });

        if (!transaction.committed) {
            return false;
        }
    }

    /*
     * Re-read after claiming resolution.
     * This guarantees we calculate from the latest
     * player submissions.
     */
    const latestSnapshot = await get(roomRef);

    if (!latestSnapshot.exists()) {
        return false;
    }

    const latestRoom = latestSnapshot.val() as Room;

    const latestGame = latestRoom.game?.goldenTime as
        | GoldenTimeGame
        | undefined;

    const latestRound = latestGame?.round;

    if (!latestRound) {
        return false;
    }

    const playerInputs = Object.entries(latestRound.players).map(
        ([uid, player]) => ({
            uid,
            elapsedMs: player.elapsedMs ?? null,
            timedOut: player.timedOut || player.elapsedMs === null,
        }),
    );

    const results = calculateGoldenTimeResults(
        playerInputs,
        latestRound.targetMs,
    );

    const updates: Record<string, unknown> = {};

    /*
     * Write each player's round result.
     */
    for (const result of results) {
        updates[`${ROUND_PLAYERS_PATH(roomId)}/${result.uid}`] = {
            elapsedMs: result.elapsedMs ?? null,
            differenceMs: result.differenceMs ?? null,
            rank: result.rank ?? null,
            points: result.points ?? 0,
            timedOut: result.timedOut === true,
        };

        /*
         * Update the player's total score.
         */
        const currentScore = latestRoom.players?.[result.uid]?.score ?? 0;

        updates[`rooms/${roomId}/players/${result.uid}/score`] =
            currentScore + (result.points ?? 0 );
    }

    const isFinalRound = latestRound.roundNumber >= GOLDEN_TIME_TOTAL_ROUNDS;

    /*
     * Finish the round.
     */
    updates[`${ROUND_PATH(roomId)}/phase`] = "results";

    updates[`${GAME_PATH(roomId)}/phase`] = "results";

    /*
     * After round 5 the room becomes finished.
     */
    if (isFinalRound) {
        updates[`rooms/${roomId}/status`] = "finished";
    }

    await update(ref(database), updates);

    return true;
}
