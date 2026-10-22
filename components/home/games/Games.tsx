"use client";

import React from "react";
import { useTranslations } from "next-intl";

import GameCard from "./GameCard";
import { GAMES } from "@/config/games";

const Games = () => {
    const t = useTranslations("Games");

    return (
        <section className="px-8 py-20">
            <h1 className="font-black text-3xl md:text-4xl lg:text-5xl">
                {t("title")}
            </h1>

            <p className="mb-4 max-w-lg text-ink-soft">
                {t("description")}
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {GAMES.map((game) => {
                    const Icon = game.icon;

                    return (
                        <GameCard
                            key={game.id}
                            title={t(`${game.id}.title`)}
                            description={t(`${game.id}.description`)}
                            category={t(`${game.id}.category`)}
                            playersCount={t(`${game.id}.playersCount`, {min : game.minPlayers , max: game.maxPlayers})}
                            Icon={Icon}
                            accentClass={game.accentClass}
                            shadowVariant={game.shadowVariant}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default Games;