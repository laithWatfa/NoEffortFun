"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseGoldenTimeTimerOptions {
    startAt: number;
    running: boolean;
}

export function useGoldenTimeTimer({
    startAt,
    running,
}: UseGoldenTimeTimerOptions) {
    const [elapsedMs, setElapsedMs] = useState(0);

    const elapsedRef = useRef(0);

    const getElapsedMs = useCallback(() => {
        if (!running) {
            return elapsedRef.current;
        }

        return Math.max(performance.now() - startAt, 0);
    }, [running, startAt]);

    useEffect(() => {
        if (!running) return;

        let frameId: number;

        const tick = () => {
            const elapsed = Math.max(performance.now() - startAt, 0);

            elapsedRef.current = elapsed;
            setElapsedMs(elapsed);

            frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [running, startAt]);

    return {
        elapsedMs,
        getElapsedMs,
    };
}
