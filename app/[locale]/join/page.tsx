"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RoomField } from "@/components/actions/RoomField";
import { PlayerTag } from "@/components/actions/PlayerTag";
import Link from "next/link";
import { addPlayerToRoom, findRoomByCode } from "@/services/room.service";
import { Player } from "@/types/player";
import { ensureAuthenticated } from "@/services/auth.service";
import { useTranslations } from "next-intl";

const TOKEN_COLORS = ["coral", "marigold", "grass", "periwinkle"] as const;
const CODE_LENGTH = 4;

export default function JoinRoomPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("JoinPage");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [color] = useState(() => TOKEN_COLORS[Math.floor(Math.random() * TOKEN_COLORS.length)]);

  const trimmedName = nickname.trim();
  const cleanCode = code.trim();
  const canSubmit = trimmedName.length >= 2 && cleanCode.length === 4 && !loading;

  function handleCodeChange(value: string) {
    setCode(value.replace(/[^a-zA-Z0-9]/g, "").slice(0, CODE_LENGTH));
    if (error) setError("");
  }


async function handleJoin() {
  if (!canSubmit) return;

  setLoading(true);
  setError("");

  try {
    const user = await ensureAuthenticated();

    const room = await findRoomByCode(cleanCode);

    if (!room) {
      throw new Error("ROOM_NOT_FOUND");
    }

    if (room.status !== "waiting") {
      throw new Error("ROOM_NOT_WAITING");
    }

    // Don't create a duplicate player if this user is already in the room.
    const existingPlayer = room.players?.[user.uid];

    if (existingPlayer) {
      router.push(
        `/room/${cleanCode}?nickname=${encodeURIComponent(existingPlayer.nickname)}&uid=${user.uid}`
      );
      return;
    }

    const player: Player = {
      uid: user.uid,
      nickname: trimmedName,
      score: 0,
      ready: false,
      connected: true,
      joinedAt: Date.now(),
    };

    await addPlayerToRoom(room.id, player);

    router.push(
      `/room/${cleanCode}?nickname=${encodeURIComponent(trimmedName)}&uid=${player.uid}`
    );
  } catch (error) {
    console.error("Failed to join room:", error);

    if (error instanceof Error && error.message === "ROOM_NOT_WAITING") {
      setError("This room is currently playing or has finished.");
    } else {
      setError(tc("errors.notFound.description"));
    }
  } finally {
    setLoading(false);
  }
}


  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-dvh max-w-130 flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit items-center gap-2 text-[14px] font-semibold text-body-text/70 hover:text-body-text"
        >
          ← {tc("actions.back")}
        </Link>

        <div className="rounded-card border-2 border-ink bg-grass p-8 text-chalk shadow-poke-lg sm:p-10">
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
              label={tc("labels.code")}
              value={code}
              onChange={handleCodeChange}
              placeholder="XXXXX"
              maxLength={CODE_LENGTH}
              uppercase
              center
              trackWide
              autoFocus
              error={error || undefined}
            />

            <div className="mt-5">
              <RoomField
                label={tc("labels.nickname")}
                value={nickname}
                onChange={setNickname}
                placeholder="e.g. Sami"
                maxLength={16}
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium text-body-text/60">
                You&rsquo;ll show up as
              </span>
              <PlayerTag name={trimmedName} color={color} />
            </div>

            <button
              type="button"
              onClick={handleJoin}
              disabled={!canSubmit}
              aria-busy={loading}
              className="mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-pill border-2 border-ink bg-grass font-display text-[16px] font-bold text-chalk shadow-poke transition-transform enabled:hover:-translate-x-0.5 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t("buttonLoadingLabel") : t("buttonLabel")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}