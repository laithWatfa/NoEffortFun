"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RoomField } from "@/components/actions/RoomField";
import { PlayerTag } from "@/components/actions/PlayerTag";
import Link from "next/link";
import { createRoom } from "@/services/room.service";
import { Player } from "@/types/player";
import { ensureAuthenticated } from "@/services/auth.service";
import { useTranslations } from "next-intl";

const TOKEN_COLORS = ["coral", "marigold", "grass", "periwinkle"] as const;




export default function CreateRoomPage() {
      const t = useTranslations("CreatePage");
      const tc = useTranslations("Common");
    const router = useRouter();
    const [nickname, setNickname] = useState("");
    const [loading, setLoading] = useState(false);
    const { locale } = useParams<{ locale: string }>();

    // Assigned once per visit so the preview tag doesn't jump colors on
    // every keystroke — a real app would let the server assign this.
    const [color] = useState(
        () => TOKEN_COLORS[Math.floor(Math.random() * TOKEN_COLORS.length)],
    );

    const trimmedName = nickname.trim();
    const canSubmit = trimmedName.length >= 2 && !loading;

    async function handleCreate() {
        if (!canSubmit) return;
        setLoading(true);

        // TODO: replace with the real room-creation call, e.g.
        
        const user = await ensureAuthenticated();
        const host : Player =  {
                uid: user.uid,
                nickname: trimmedName,
                score: 0 ,
                ready: false,
                connected: true,
                joinedAt:  Date.now(),
        }

        console.log(host);
        const room = await createRoom(host)

        router.push(
            `/${locale}/room/${room.code}?nickname=${encodeURIComponent(trimmedName)}&host=1&uid=${user.uid}`,
        );
    }

    return (
        <main className="min-h-screen bg-paper">
            <div className="mx-auto flex min-h-screen max-w-130 flex-col justify-center px-6 py-16">
                <Link
                    href="/"
                    className="mb-8 inline-flex w-fit items-center gap-2 text-[14px] font-semibold text-body-text/70 hover:text-body-text"
                >
                    ← {tc("actions.back")}
                </Link>

                <div className="rounded-card border-2 border-ink bg-periwinkle p-8 text-chalk shadow-poke-lg sm:p-10">
                    <p className="mb-2 text-[14px] font-semibold opacity-80">
                        {t("note")}
                    </p>
                    <h1 className="mb-3 font-display text-[34px] font-bold leading-tight">
                        {t("title")}
                    </h1>
                    <p className="mb-8 max-w-[36ch] text-[15.5px] opacity-90">
                        {t("description")}
                    </p>

                    <div className="rounded-card border-2 border-ink bg-paper-card p-6">
                        <RoomField
                            label={tc("labels.nickname")}
                            value={nickname}
                            onChange={setNickname}
                            placeholder="e.g. Sami"
                            maxLength={16}
                            autoFocus
                        />

                        <div className="mt-5 flex items-center justify-between gap-3">
                            <span className="text-[13px] font-medium text-body-text/60">
                                You&rsquo;ll show up as
                            </span>
                            <PlayerTag name={trimmedName} color={color} />
                        </div>

                        <button

                            type="button"
                            onClick={handleCreate}
                            disabled={!canSubmit}
                            aria-busy={loading}
                            className="mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-pill border-2 border-ink bg-coral font-display text-[16px] font-bold text-chalk shadow-poke transition-transform enabled:hover:-translate-x-0.5 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? t("buttonLoadingLabel") : t("buttonLabel")}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
