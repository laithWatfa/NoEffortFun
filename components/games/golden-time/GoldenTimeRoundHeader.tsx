import { useTranslations } from "next-intl";

interface GoldenTimeRoundHeaderProps {
    roundNumber: number;
    totalRounds: number;
    targetMs: number;
}

export function GoldenTimeRoundHeader({
    roundNumber,
    totalRounds,
    targetMs,
}: GoldenTimeRoundHeaderProps) {
    const t = useTranslations("GoldenTime")
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-bold uppercase tracking-widest">
                {t("round")} {roundNumber} / {totalRounds}
            </div>

            <div className="flex flex-col items-center">
                <span className="text-sm font-bold uppercase text-marigold">
                    {t("target")}
                </span>

                <span className="font-display text-3xl font-bold text-marigold">
                    {formatTarget(targetMs)}
                </span>
            </div>
        </div>
    );
}

function formatTarget(ms: number) {
    return `00:${(ms / 1000).toFixed(2).padStart(5, "0")}`;
}
