import React from 'react'
import { EndGameAction } from '../games/golden-time/GoldenTimeGameView';
import { useTranslations } from 'next-intl';
import { FaRepeat } from "react-icons/fa6";
import { PiGameControllerBold } from "react-icons/pi";

interface EndGameActionsProps {
    isHost : boolean;
        onPlayAgain: () => void;
        onAnotherGame: () => void;
        endGameAction: EndGameAction;
}
const EndGameActions = ({
    isHost,
    onPlayAgain,
    onAnotherGame,
    endGameAction,
}: EndGameActionsProps) => {
    const t = useTranslations("Common.actions")
  return (
        <section className="flex w-full  gap-3">
        {isHost ? (
            <>
                <button
                    type="button"
                    onClick={onPlayAgain}
                    disabled={endGameAction !== null}
                    className="button flex! items-center! justify-center gap-2 w-full rounded-pill border-2 border-ink bg-grass px-5 py-3 font-display font-bold text-chalk disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {endGameAction === "replay"
                        ? t("starting")
                        : <><FaRepeat/> {t("playAgain")}</>}
                </button>

                <button
                    type="button"
                    onClick={onAnotherGame}
                    disabled={endGameAction !== null}
                    className="button flex! items-center! justify-center gap-2 w-full rounded-pill border-2 border-ink bg-periwinkle px-5 py-3 font-display font-bold text-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {endGameAction === "lobby"
                        ? t("returning")
                        :<> <PiGameControllerBold className='w-5 h-5'/> {t("anotherGame")}</> }
                </button>
            </>
        ) : (
            <p className="rounded-card border-2 border-ink/10 p-4 text-center text-sm font-medium text-body-text/70">
                {t("waitingForHost")}
            </p>
        )}
    </section>
  )
}

export default EndGameActions