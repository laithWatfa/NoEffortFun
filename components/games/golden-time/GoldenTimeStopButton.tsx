"use client";

import { useTranslations } from "next-intl";

interface GoldenTimeStopButtonProps {
    disabled?: boolean;
    onClick: () => void;
}

export function GoldenTimeStopButton({
    disabled = false,
    onClick,
}: GoldenTimeStopButtonProps) {
    const t = useTranslations("GoldenTime")
    return (
        <button
            data-sound="stop"
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="
                flex
                h-32
                w-32
                items-center
                justify-center
                rounded-full
                border-4
                border-black
                bg-grass
                text-lg
                font-bold
                text-white
                shadow-[0_12px_0_0_#000]
                transition-all
                duration-100
                hover:translate-y-1
                hover:shadow-[0_8px_0_0_#000]
                active:translate-y-3
                active:shadow-[0_2px_0_0_#000]
                disabled:cursor-not-allowed
                disabled:opacity-60
            "
        >
            {t("stop")}
        </button>
    );
}
