"use client";

interface GoldenTimeTimerProps {
    elapsedMs: number;
}

export function GoldenTimeTimer({ elapsedMs }: GoldenTimeTimerProps) {
    return (
        <div className="relative  font-display text-5xl font-bold tracking-wider sm:text-6xl text-grass">
            {/* <div className="inset-0 absolute bg-black w-full h-full rounded-lg"></div> */}
            {formatElapsedTime(elapsedMs)}
        </div>
    );
}

export function formatElapsedTime(ms: number) {
    return (ms / 1000).toFixed(2).padStart(5, "0");
}
