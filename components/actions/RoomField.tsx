"use client";

import { playSound } from "@/lib/sound";
import { useId } from "react";

type RoomFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
    autoFocus?: boolean;
    /** Forces input to uppercase as the user types — used for room codes. */
    uppercase?: boolean;
    center?: boolean;
    /** Wide letter-spacing, for short code-style input. */
    trackWide?: boolean;
    inputMode?: "text" | "numeric" | "search";
    error?: string;
};

export function RoomField({
    label,
    value,
    onChange,
    placeholder,
    maxLength,
    autoFocus,
    uppercase,
    center,
    trackWide,
    inputMode = "text",
    error,
}: RoomFieldProps) {
    const id = useId();
    const errorId = `${id}-error`;

    return (
        <div className="flex flex-col gap-2">
            {/* Always a real, visible label — never placeholder-only. */}
            <label
                htmlFor={id}
                className="text-[14px] font-semibold text-body-text"
            >
                {label}
            </label>
            <input
                id={id}
                onKeyDown={() => {playSound("keypress")}}
                data-sound="keypress"
                value={value}
                onChange={(e) =>
                    onChange(
                        uppercase
                            ? e.target.value.toUpperCase()
                            : e.target.value,
                    )
                }
                placeholder={placeholder}
                maxLength={maxLength}
                autoFocus={autoFocus}
                inputMode={inputMode}
                autoComplete="off"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={[
                    "min-h-13 w-full rounded-card border-2 bg-paper px-4 font-body text-[17px] text-body-text",
                    "placeholder:text-body-text/35 focus:outline-none",
                    center ? "text-center" : "",
                    trackWide ? "font-semibold tracking-[0.35em]" : "",
                    error ? "border-coral" : "border-ink",
                ].join(" ")}
            />
            {error ? (
                <p
                    id={errorId}
                    role="alert"
                    className="text-[13px] font-medium text-coral"
                >
                    {error}
                </p>
            ) : null}
        </div>
    );
}
