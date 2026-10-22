import { useTranslations } from "next-intl";
import { GameConfig, GAMES } from "@/config/games";
import React from "react";
import { GameType } from "@/types/room";
import { LobbyState } from "@/services/room.validation";
import { playSound } from "@/lib/sound";

interface GameSelectorProps {
    isHost: boolean;
    canStart: boolean;
    selectedGame: GameConfig | null;
    onSelect: (id: GameType) => Promise<void>;
    playersCount: number;
    currentGameType: GameType | null; // room?.gameType
    lobby: LobbyState | undefined;
    onStart: () => void;
    startingGame: boolean;
    selectingGame: boolean;
}

const GameSelector = ({
    isHost,
    selectedGame,
    playersCount,
    canStart,
    onSelect,
    currentGameType,
    lobby,
    startingGame,
    selectingGame,
    onStart,
}: GameSelectorProps) => {
    const t = useTranslations("Games");
    const tc = useTranslations("Common");
    // Fetch the raw translated JSON list array parameters safely
    return (
        <section className="rounded-card border-2 border-ink bg-paper-card p-5">
            <div className="mb-5">
                <p className="text-[13px] font-semibold text-body-text/60">
                    {t("GameSelector.note")}
                </p>

                <h2 className="font-display text-xl font-bold text-body-text">
                    {t("GameSelector.title")}
                </h2>

                {!isHost && (
                    <p className="mt-1 text-[12px] font-semibold text-body-text/40">
                        {t("GameSelector.hostOnly")}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {GAMES.map((game) => {
                    const isSelected = currentGameType === game.id;

                    const hasTooFewPlayers = playersCount < game.minPlayers;

                    const hasTooManyPlayers = playersCount > game.maxPlayers;

                    const Icon = game.icon;

                    return (
                        <button
                            data-sound="select"
                            key={game.id}
                            // onPointerDown={() => playSound("select")}
                            type="button"
                            disabled={!isHost || selectingGame}
                            onClick={() => {onSelect(game.id); playSound("select"); }}
                            className={`group w-full rounded-card border-2 p-4 text-left transition-all ${game.shadowVariant} ${
                                isSelected
                                    ?  game.selectedClass.card
                                    : "border-ink bg-paper active:translate-y-0 active:translate-x-0 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-poke"
                            } ${!isHost ? "cursor-default" : "cursor-pointer"}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                        <h3 className="font-display text-base flex items-baseline gap-2 font-bold text-body-text">
                                            <span
                                                className={` p-2 flex items-center  justify-center w-fit rounded-md text-chalk ${game.accentClass}`}
                                            >
                                                <Icon className="md:w-4 md:h-4" />
                                            </span>
                                            {t(`${game.id}.title`)}
                                        </h3>

                                        <span className="rounded-pill border border-ink/30 px-2 py-0.5 text-[10px] font-semibold text-body-text/50">
                                            {t(`${game.id}.category`)}
                                        </span>
                                    </div>

                                    <p className="text-[12px] text-start leading-relaxed text-body-text/60">
                                        {t(`${game.id}.description`)}
                                    </p>
                                </div>

                                <span
                                    className={`shrink-0 rounded-pill px-2 py-1 text-[11px] font-bold ${
                                        isSelected
                                            ? game.selectedClass.count
                                            : "bg-paper-card text-body-text/50"
                                    }`}
                                >
                                    {game.minPlayers}–{game.maxPlayers}
                                </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <span
                                    className={`text-[11px] font-semibold ${
                                        hasTooManyPlayers
                                            ? "text-coral"
                                            : hasTooFewPlayers
                                              ? "text-marigold"
                                              : "text-grass"
                                    }`}
                                >
                                    {hasTooManyPlayers
                                        ? t(
                                              "GameSelector.validation.tooManyPlayers",
                                          )
                                        : hasTooFewPlayers
                                          ? t(
                                                "GameSelector.validation.tooFewPlayers",
                                                {
                                                    n:
                                                        game.minPlayers -
                                                        playersCount,
                                                },
                                            )
                                          : t("GameSelector.validation.ready")}
                                </span>

                                {isSelected && (
                                    <span className={`text-[11px] font-bold ${game.selectedClass.label}`}>
                                        {tc("labels.selected")}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Start section */}
            <div className="mt-6 border-t-2 border-ink/10 pt-5">
                {!selectedGame && (
                    <p className="mb-3 text-[12px] font-semibold text-body-text/50">
                        {t("GameSelector.validation.noSelectedGame")}
                    </p>
                )}

                {selectedGame && !lobby?.everyoneReady && (
                    <p className="mb-3 text-[12px] font-semibold text-coral">
                        {t("GameSelector.validation.notEveryoneReady")}
                    </p>
                )}

                {selectedGame &&
                    lobby?.everyoneReady &&
                    !lobby?.enoughPlayersForGame && (
                        <p className="mb-3 text-[12px] font-semibold text-marigold">
                            {t(
                                "GameSelector.validation.notEnoughPlayersForGame",
                                { min: selectedGame.minPlayers },
                            )}
                        </p>
                    )}

                {selectedGame && lobby?.tooManyPlayersForGame && (
                    <p className="mb-3 text-[12px] font-semibold text-coral">
                        {t("GameSelector.validation.tooManyPlayersForGame", {
                            max: selectedGame.maxPlayers,
                        })}
                    </p>
                )}

                <button
                    type="button"
                    disabled={!canStart || startingGame}
                    onClick={onStart}
                    className={`button w-full border-2 text-[13px] font-semibold ${
                        canStart
                            ? "cursor-pointer border-periwinkle! text-periwinkle! shadow-poke-periwinkle! hover:-translate-x-1! hover:-translate-y-1! hover:shadow-poke-periwinkle-lg!"
                            : "cursor-not-allowed border-ink/20! text-body-text/30!"
                    }`}
                >
                    {startingGame
                        ? t("GameSelector.starting")
                        : selectedGame
                          ? t("GameSelector.startGame", {
                                title: t(`${selectedGame.id}.title`),
                            })
                          : t("GameSelector.select")}
                </button>
            </div>
        </section>
    );
};

export default GameSelector;
