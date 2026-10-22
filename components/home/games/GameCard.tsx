import React, { ComponentType } from "react";

// Explicitly type the incoming properties to match your JSON schema
interface GameCardProps {
    title: string;
    description: string;
    category: string;
    playersCount: string;
    Icon: ComponentType<React.ComponentProps<"svg">>;
    accentClass: string;
    shadowVariant: string;
    actionLabel?: string;
    onActionClick?: () => void;
}

export default function GameCard({
    title,
    description,
    category,
    playersCount,
    Icon,
    accentClass,
    shadowVariant,
}: GameCardProps) {
    return (
        <div
            data-sound="select"
            className={`${shadowVariant} flex flex-col gap-2 justify-between p-6 rounded-card border-2 border-ink bg-paper-card text-ink transition duration-200 hover:-translate-x-1 hover:-translate-y-1 cursor-pointer active:translate-x-0 active:translate-y-0 `}
        >
            {/* Top Details Wrapper */}
                {/* Text Content */}
                <div className="space-y-4 text-body-text">
                    {/* text-start seamlessly flips text alignment for English (LTR) vs Arabic (RTL) */}
                    <h3 className="text-2xl flex items-center gap-2 font-display font-black text-start tracking-tight">
                        <span
                            className={` p-2 flex items-center  justify-center w-fit rounded-md text-chalk ${accentClass}`}
                        >
                            <Icon className="md:w-8 md:h-8" />
                        </span>{" "}
                        {title}
                    </h3>
                    <p className="text-sm text-ink-soft text-start leading-relaxed font-body">
                        {description}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold">
                    {/* Category Badge */}
                    <span className="px-2.5 py-1 rounded-pill bg-periwinkle/15 text-periwinkle border border-periwinkle/30 uppercase tracking-wider">
                        {category}
                    </span>

                    {/* Players Badge */}
                    <span className="px-2.5 py-1 rounded-pill bg-ink-faint text-ink-soft">
                        {playersCount}
                    </span>
                </div>


            {/* Action Button - Applying your custom tactile push animations */}
            {/* <button
                onClick={onActionClick}
                className="mt-6 w-full py-3 px-4 bg-coral border-2 border-ink rounded-pill text-chalk font-display font-black text-center text-sm shadow-poke-coral cursor-pointer transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 select-none"
            >
                {actionLabel}
            </button> */}
        </div>
    );
}
