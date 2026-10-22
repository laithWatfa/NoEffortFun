import type { Player } from "@/types/player";
import type { GoldenTimeRound } from "@/types/golden-time";
import { useTranslations } from "next-intl";

interface GoldenTimePlayerStatusProps {
    players: Record<string, Player>;
    round: GoldenTimeRound;
    currentUserId: string;
}

export function GoldenTimePlayerStatus({
    players,
    round,
    currentUserId,
}: GoldenTimePlayerStatusProps) {
    const t = useTranslations("Common.labels")
    return (
        <div className="w-full max-w-xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest opacity-60">
                {t("players")}
            </p>

            <div className="flex flex-wrap justify-center gap-2">
                {Object.entries(players).map(([uid, player]) => {
                    const result = round.players?.[uid];

                    const submitted =
                        result?.elapsedMs !== null &&
                        result?.elapsedMs !== undefined;

                    const isCurrentPlayer = uid === currentUserId;

                    return (
                        <div
                            key={uid}
                            className="
                            flex
                            items-center
                            gap-2
                            rounded-pill
                            border-2
                            border-ink
                            bg-paper-card
                            px-3
                            py-1.5
                            text-sm
                            font-semibold
                            "
                        >
                            <span
                                className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-periwinkle
                            "
                            />

                            <span>
                                {player.nickname}
                                {isCurrentPlayer && t("you")}
                            </span>

                            <span className="font-bold">
                                {submitted ? "✓" : "..."}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
