import type { ComponentType } from "react";
import type { GameType } from "@/types/room";

import { PiSpeedometerBold as WaveLength } from "react-icons/pi";
import { FaStopwatch20 as Timer } from "react-icons/fa6";
import { MdPersonOff as Impostor } from "react-icons/md";

export interface GameConfig {
    id: GameType;
    minPlayers: number;
    maxPlayers: number;

    icon: ComponentType<React.ComponentProps<"svg">>;
    accentClass: string;
    shadowVariant:
        | "shadow-poke-grass hover:shadow-poke-grass-lg active:shadow-poke-grass"
        | "shadow-poke-periwinkle hover:shadow-poke-periwinkle-lg active:shadow-poke-periwinkle"
        | "shadow-poke-coral hover:shadow-poke-coral-lg active:shadow-poke-coral";
    selectedClass: {
        card: string;
        count: string;
        label: string;
    }
}

export const GAMES: GameConfig[] = [
    {
        id: "golden-time",
        minPlayers: 2,
        maxPlayers: 8,
        icon: Timer,
        accentClass: "bg-grass",
        shadowVariant:
            "shadow-poke-grass hover:shadow-poke-grass-lg active:shadow-poke-grass",
            selectedClass: {
            card: "border-grass! bg-grass/10 shadow-poke-grass!",
            count: "bg-grass text-paper",
            label: "text-grass"
        }
    },
    {
        id: "wavelength",
        minPlayers: 2,
        maxPlayers: 8,
        icon: WaveLength,
        accentClass: "bg-periwinkle",
        shadowVariant:
            "shadow-poke-periwinkle hover:shadow-poke-periwinkle-lg active:shadow-poke-periwinkle",
        selectedClass: {
            card: "border-periwinkle! bg-periwinkle/10 shadow-poke-periwinkle!",
            count: "bg-periwinkle text-paper",
            label: "text-periwinkle"
        }
    },
    {
        id: "imposter",
        minPlayers: 3,
        maxPlayers: 10,
        icon: Impostor,
        accentClass: "bg-coral",
        shadowVariant:
            "shadow-poke-coral hover:shadow-poke-coral-lg active:shadow-poke-coral",
        selectedClass: {
            card: "border-coral! bg-coral/10 shadow-poke-coral!",
            count: "bg-coral text-paper",
            label: "text-coral"
        }
    },
];

export function getGameConfig(gameType: GameType) {
    return GAMES.find((game) => game.id === gameType);
}