"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FaRegCopy, FaCheck } from "react-icons/fa";

export function CopyInviteLink({ roomCode }: { roomCode: string }) {
    const t = useTranslations('Common');
    const locale = useLocale();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const inviteLink = new URL(`/${locale}/join`, window.location.origin);

        inviteLink.searchParams.set("code", roomCode);

        try {
            await navigator.clipboard.writeText(inviteLink.toString());
            setCopied(true);

            window.setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy invite link:", error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="button border-2 flex! gap-1 items-center! border-body-text text-sm text-body-text!"
        >
            {copied ? (
                <>

                    <FaCheck /> {t("labels.copied")}
                </>
            ) : (
                <>
                    <FaRegCopy /> {t("actions.copyLink")}
                </>
            )}
        </button>
    );
}
