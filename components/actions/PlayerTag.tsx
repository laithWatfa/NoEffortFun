type TokenColor = "coral" | "marigold" | "grass" | "periwinkle";

type PlayerTagProps = {
    name: string;
    color: TokenColor;
};

const DOT_CLASS: Record<TokenColor, string> = {
    coral: "bg-coral",
    marigold: "bg-marigold",
    grass: "bg-grass",
    periwinkle: "bg-periwinkle",
};

/**
 * Small live preview of how a player will show up in the room — a colored
 * "token" dot plus their nickname. Reuses the same four accent colors as
 * the rest of the design system rather than introducing per-player avatars.
 */
export function PlayerTag({ name, color }: PlayerTagProps) {
    return (
        <div className="inline-flex items-center gap-2 rounded-pill border-2 border-ink bg-paper px-4 py-2">
            <span
                className={`h-3 w-3 shrink-0 rounded-full ${DOT_CLASS[color]}`}
                aria-hidden="true"
            />
            <span className="font-display text-[15px] font-semibold text-body-text">
                {name || "Your name"}
            </span>
        </div>
    );
}
