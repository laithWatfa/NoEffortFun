"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface QuitButtonProps {
    onQuit: () => void | Promise<void>;
}

const QuitButton = ({ onQuit }: QuitButtonProps) => {
    const t = useTranslations("Common.actions");
    const [loading, setLoading] = useState(false);

    async function handleQuit() {
        if (loading) return;

        setLoading(true);

        try {
            await onQuit();
        } catch (error) {
            console.error("Failed to quit:", error);
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleQuit}
            disabled={loading}
            className="button border-2 flex! gap-1 items-center! border-body-text text-sm text-body-text! disabled:opacity-50"
        >
            ← {loading ? "..." : t("quit")}
        </button>
    );
};

export default QuitButton;
