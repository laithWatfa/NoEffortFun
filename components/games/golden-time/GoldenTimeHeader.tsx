"use client";

import QuitButton from "@/components/actions/QuitButton";
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
            <QuitButton onQuit={onQuit}/>

            <div className="flex items-center gap-2">
                <LanguageToggle/>

                <ThemeToggle/>

                <SoundToggle/>
            </div>
        </header>
    );
}
