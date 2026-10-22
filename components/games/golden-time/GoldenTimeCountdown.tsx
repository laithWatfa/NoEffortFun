"use client";

import { useTranslations } from "next-intl";

interface GoldenTimeCountdownProps {
    seconds: number;
}

export function GoldenTimeCountdown({ seconds }: GoldenTimeCountdownProps) {
    const t = useTranslations("GoldenTime")
    return (
        <div className="flex flex-col items-center gap-5">
            <div
                key={seconds}
                className="
                    flex
                    h-40
                    w-40
                    items-center
                    justify-center
                    rounded-card
                    border-4
                    border-ink
                    bg-paper-card
                    shadow-poke
                    animate-[pulse_0.8s_ease-out]
                    "
            >
                <span className="font-display text-7xl font-bold">
                    {seconds}
                </span>
            </div>

            <span className="text-sm font-bold uppercase tracking-[0.3em]">
                {t("getReady")}
            </span>
        </div>
    );
}
