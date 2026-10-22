"use client";

import { SoundToggle } from "@/components/actions/SoundToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTranslations } from "next-intl";

interface GoldenTimeHeaderProps {
    onQuit: () => void;
}

export function GoldenTimeHeader({ onQuit }: GoldenTimeHeaderProps) {
    const t = useTranslations("Common.actions")
    return (
        <header className="flex items-center justify-between">
            <button
                type="button"
                onClick={onQuit}
                className="
                    rounded-pill
                    border-2
                    border-ink
                    bg-paper-card
                    px-4
                    py-2
                    text-sm
                    font-bold
                    shadow-[3px_3px_0_0_#000]
                    transition-transform
                    hover:translate-y-0.5
                    active:translate-y-1
                "
            >
                ← {t("quit")}
            </button>

            <div className="flex items-center gap-2">
                <LanguageToggle/>

                <ThemeToggle/>

                <SoundToggle/>
            </div>
        </header>
    );
}
