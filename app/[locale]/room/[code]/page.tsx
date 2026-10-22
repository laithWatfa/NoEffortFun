"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    findRoomByCode,
    addPlayerToRoom,
    subscribeToRoom,
    bindPlayerPresence,
    updatePlayer,
    selectGame,
} from "@/services/room.service";
import { GAMES } from "@/config/games";

import type { Player } from "@/types/player";
import { GoldenTimeGameView } from "@/components/games/golden-time/GoldenTimeGameView";
import { useRoomStore } from "@/stores/room.store";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { getRoomLobbyState } from "@/services/room.validation";
import { GameType } from "@/types/room";
import { useGoldenTimeCoordinator } from "@/hooks/use-golden-time-coordinator";
import { startGoldenTimeGame } from "@/services/golden-time.service";
import { useTranslations } from "next-intl";
import PlayerList from "@/components/room/PlayerList";
import GameSelector from "@/components/room/GameSelector";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { playSound } from "@/lib/sound";
import { SoundToggle } from "@/components/actions/SoundToggle";

export default function RoomPage() {
    const { code } = useParams<{ code: string }>();
    const tc = useTranslations("Common");
    const searchParams = useSearchParams();
    const router = useRouter();

    const nickname = searchParams.get("nickname");

    const { user, loading: authLoading } = useAuth();

    const { room, setRoom, clearRoom } = useRoomStore();

    const hasRoomData = !!room;
    const [status, setStatus] = useState<
        "loading" | "not-found" | "ready" | "error"
    >("loading");

    const [actionLoading, setActionLoading] = useState(false);
    const [selectingGame, setSelectingGame] = useState(false);
    const [startingGame, setStartingGame] = useState(false);

    const hasJoined = useRef(false);

    const isHost = room?.hostId === user?.uid;
    const players: Player[] = room?.players ? Object.values(room.players) : [];
    const selectedGame = room?.gameType
        ? (GAMES.find((game) => game.id === room.gameType) ?? null)
        : GAMES[0];

    const lobby = getRoomLobbyState(room);

    useGoldenTimeCoordinator({
        room,
        userId: user?.uid ?? null,
    });

    useEffect(() => {
        if (authLoading) return;

        const userId = user?.uid;

        if (!userId) {
            router.replace(`/join?code=${code}`);
            return;
        }

        let cancelled = false;
        let unsubscribeRoom: (() => void) | undefined;
        let unsubscribePresence: (() => void) | undefined;

        async function initializeRoom() {
            try {
                const found = await findRoomByCode(String(code));

                if (cancelled) return;

                if (!found) {
                    setStatus("not-found");
                    return;
                }

                const roomId = found.id;

                const isCurrentUserHost = found.hostId === userId;

                /*
                 * Only non-host users need to be added here.
                 *
                 * The host was already added when the room
                 * was created.
                 */
                const existingPlayer = found.players?.[userId??""];

                if (!isCurrentUserHost && !hasJoined.current) {
                    hasJoined.current = true;



                    /*
                     * If the player already exists, don't create
                     * another player object.
                     */
                    if (!existingPlayer) {
                        if (!nickname) {
                            router.replace(`/join?code=${code}`);
                            return;
                        }
                        const newPlayer: Player = {
                            uid: userId as string,
                            nickname: nickname as string,
                            score: 0,
                            ready: false,
                            connected: true,
                            joinedAt: Date.now(),
                        };

                        await addPlayerToRoom(roomId, newPlayer);
                    }
                }

                /*
                 * Subscribe to the entire room.
                 */
                unsubscribeRoom = subscribeToRoom(roomId, (data) => {
                    if (cancelled) return;

                    setRoom(data);
                    setStatus("ready");
                });

                /*
                 * Presence is attached to this Firebase user.
                 */
                unsubscribePresence = bindPlayerPresence(
                    roomId,
                    user?.uid ?? "",
                );
            } catch (error) {
                console.error("Failed to initialize room:", error);

                if (!cancelled) {
                    setStatus("error");
                }
            }
        }

        initializeRoom();

        return () => {
            cancelled = true;

            unsubscribeRoom?.();
            unsubscribePresence?.();

        };
    }, [code, nickname, user?.uid, authLoading, router, setRoom, clearRoom]);

    function handleQuit() {
        clearRoom();
        router.push(`/join?code=${code}`);
    }

    /*
     * Derive host status from the realtime room.
     * No separate React state required.
     */

    const currentPlayer = user?.uid ? room?.players?.[user.uid] : undefined;

    const canStart = isHost && !!lobby?.everyoneReady && !!lobby.canStart;

    async function handleToggleReady() {
        if (!room || !user) return;
        const me = room.players[user.uid];
        if (!me) return;
        try {
            setActionLoading(true);

            await updatePlayer(room.id, user.uid, {
                ready: !me.ready,
            });
        } catch (error) {
            console.error("Failed to update ready state:", error);
        } finally {
            setActionLoading(false);
        }
    }

    /*
     * Host selects a game.
     *
     * Important:
     * This intentionally does NOT reset ready states.
     */
    async function handleSelectGame(gameType: GameType) {
        if (!room || !isHost) return;

        if (room.gameType === gameType) return;

        setSelectingGame(true);

        try {
            await selectGame(room.id, gameType);
        } catch (error) {
            console.error("Failed to select game:", error);
        } finally {
            setSelectingGame(false);
        }
    }

    async function handleStartGame() {
        if (!room || !lobby?.canStart || !isHost || startingGame) {
            return;
        }

        if (room.gameType !== "golden-time") {
            console.error(
                "This game has not been implemented yet:",
                room.gameType,
            );
            return;
        }

        setStartingGame(true);
        setActionLoading(true);

        try {
            const playerIds = Object.keys(room.players);

            await startGoldenTimeGame(room.id, playerIds);
        } catch (error) {
            console.error("Failed to start game:", error);
        } finally {
            setStartingGame(false);
            setActionLoading(false);
        }
    }
    if (status === "loading" && !hasRoomData) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-paper">
                <p className="text-[15px] font-medium text-body-text/70">
                    {tc("actions.findingYourRoom")}
                </p>
            </main>
        );
    }

    if (status === "not-found") {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
                <p className="font-display text-[24px] font-bold text-body-text">
                    {tc("errors.notFound.title", { code: code })}
                </p>

                <p className="max-w-[36ch] text-[15px] text-body-text/70">
                    {tc("errors.notFound.description")}
                </p>

                <Link
                    href="/join"
                    className="mt-2 rounded-pill border-2 border-ink bg-coral px-6 py-3 font-display text-[15px] font-bold text-chalk"
                >
                    {tc("errors.notFound.action")}
                </Link>
            </main>
        );
    }

    if (status === "error") {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
                <p className="font-display text-[24px] font-bold text-body-text">
                    {tc("errors.title")}
                </p>

                <p className="max-w-[36ch] text-[15px] text-body-text/70">
                    {tc("errors.description")}
                </p>

                <Link
                    href={`/join?code=${code}`}
                    className="mt-2 rounded-pill border-2 border-ink bg-coral px-6 py-3 font-display text-[15px] font-bold text-chalk"
                >
                    {tc("errors.action")}
                </Link>
            </main>
        );
    }

    const goldenTimeGame = room?.game?.goldenTime;

    if (
        room &&
        room.gameType === "golden-time" &&
        (room.status === "playing" || room.status === "finished") &&
        goldenTimeGame?.round
    ) {
        return (
            <GoldenTimeGameView
                roomId={room.id}
                userId={user?.uid ?? ""}
                players={room.players}
                game={goldenTimeGame}
                onQuit={handleQuit}
            />
        );
    }

    return (
        <main className="min-h-dvh bg-paper px-6 py-16">
            <div className="mx-auto">
                <div className="flex justify-between">
                    <div>
                        <p className="mb-1 text-[13px] font-semibold text-body-text/60">
                            {tc("labels.code")}
                        </p>

                        <h1 className="mb-8 font-display text-[40px] font-bold tracking-widest text-body-text">
                            {code}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <SoundToggle/>
                        <ThemeToggle/>

                        <LanguageToggle/>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
                    <section className="rounded-card border-2 border-ink bg-paper-card p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-[13px] font-semibold text-body-text/60">
                                {tc("labels.players")} ({players.length})
                            </p>

                            {selectedGame && (
                                <span className="rounded-pill border-2 border-ink bg-paper px-3 py-1 text-[12px] font-semibold">
                                    {players.length}/{selectedGame.maxPlayers}
                                </span>
                            )}

                            {isHost && (
                                <span className="text-[12px] font-semibold text-periwinkle">
                                    {tc("labels.host")}
                                </span>
                            )}
                        </div>

                        <PlayerList players={players} user={user} room={room} />

                        <button
                            type="button"
                            data-sound="click"
                            onClick={() => {playSound("click"); handleToggleReady();}}
                            disabled={actionLoading || !user || !room}
                            className={`button  mt-5 w-full rounded-pill border-2 border-ink px-5 py-3 font-display text-[14px] font-bold text-chalk transition-transform  disabled:cursor-not-allowed disabled:opacity-50 ${
                                currentPlayer?.ready
                                    ? "bg-grass"
                                    : "bg-marigold"
                            }`}
                        >
                            {actionLoading
                                ? tc("actions.updating")
                                : currentPlayer?.ready
                                    ? tc("labels.ready") + " ✓"
                                    : tc("actions.ready")}
                        </button>
                    </section>
                    <GameSelector
                        lobby={lobby}
                        canStart={canStart}
                        isHost={isHost}
                        selectedGame={selectedGame}
                        playersCount={players.length}
                        startingGame={startingGame}
                        selectingGame={selectingGame}
                        currentGameType={room?.gameType || "golden-time"}
                        onStart={handleStartGame}
                        onSelect={handleSelectGame}
                    />
                </div>
            </div>
        </main>
    );
}
