
import { PlayerTag } from "../actions/PlayerTag";
import { useTranslations } from "next-intl";
import { Player } from "@/types/player";

interface PlayerListProps {
    players : Player[] ;
    user: {
        uid : string;
        
    } | null ; 
    room : {
        hostId : string
    } | null; 
}

const TOKEN_COLORS = ["coral", "marigold", "grass", "periwinkle"] as const;

function colorForUid(uid: string) {
    const sum = Array.from(uid).reduce(
        (total, char) => total + char.charCodeAt(0),
        0,
    );

    return TOKEN_COLORS[sum % TOKEN_COLORS.length];
}

const PlayerList = ({players , user , room} : PlayerListProps) => {
    const tc = useTranslations("Common.labels");
    return (
        <ul className="flex flex-col gap-3">
            {players.map((player) => {
                const isMe = player.uid === user?.uid;
                const isPlayerHost = player.uid === room?.hostId;

                return (
                    <li
                        key={player.uid}
                        className="flex items-center justify-between gap-3 rounded-card border-2 border-ink bg-paper px-4 py-3"
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <PlayerTag
                                name={`${player.nickname} ${
                                    isMe ? tc("you") : ""
                                }`}
                                color={colorForUid(player.uid)}
                            />

                            {isPlayerHost && (
                                <span className="shrink-0 text-[12px] font-semibold text-body-text/50">
                                    {tc("host")}
                                </span>
                            )}
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            <span
                                className={`text-[13px] font-semibold ${
                                    player.connected
                                        ? "text-grass"
                                        : "text-body-text/40"
                                }`}
                            >
                                {player.connected
                                    ? tc("online")
                                    : tc("offline")}
                            </span>

                            <span
                                className={`text-[13px] box-sha font-semibold ${
                                    player.ready
                                        ? "text-grass"
                                        : "text-marigold"
                                }`}
                            >
                                {player.ready ? tc("ready") : tc("notReady")}
                            </span>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default PlayerList;
