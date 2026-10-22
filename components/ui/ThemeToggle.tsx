// src/components/ThemeToggle.tsx
"use client";

import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
    // Use a string or null state to prevent server/client rendering hydration mismatches
    const [theme, setTheme] = useState<"light" | "dark" | null>(null);

    useEffect(() => {
        let savedTheme = localStorage.getItem("playhub-theme") as
            | "light"
            | "dark"
            | null;

        // 2. Fallback to the active DOM element attribute if localStorage is empty
        if (!savedTheme) {
            savedTheme = document.documentElement.getAttribute("data-theme") as
                | "light"
                | "dark"
                | null;
        }

        const finalTheme = savedTheme || "light";

        // 3. Force-apply the attribute to the document element
        // This ensures the theme survives client-side route changes safely!
        document.documentElement.setAttribute("data-theme", finalTheme);
        queueMicrotask(() => {
            setTheme(finalTheme);
        });
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";

        // 1. Update state
        setTheme(nextTheme);
        // 2. Set structural DOM attribute for Tailwind v4 selectors
        document.documentElement.setAttribute("data-theme", nextTheme);
        // 3. Persist choices locally
        localStorage.setItem("playhub-theme", nextTheme);
    };

    // Prevent rendering an incorrect icon state during the initial client hydration wave
    if (theme === null) {
        return (
            <div className="w-12 h-12 rounded-pill bg-paper border-2 border-ink opacity-20" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="group relative flex items-center justify-center w-12 h-12 rounded-pill border-2 
            border-body-text bg-paper text-body-text transition hover:-translate-x-0.5 hover:-translate-y-0.5 
            active:translate-x-0 active:translate-y-0 active:shadow-poke shadow-poke hover:shadow-poke-lg cursor-pointer"
        >
            {theme === "light" ? (
                // Light Mode Icon (Shows Sun, transitions cleanly)
                <svg
                    xmlns="http://w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 transition-transform group-hover:rotate-45"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M17.66 6.34l1.58-1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                    />
                </svg>
            ) : (
                // Dark Mode Icon (Shows Moon, transitions cleanly)
                <svg
                    xmlns="http://w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 transition-transform group-hover:-rotate-12"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                </svg>
            )}
        </button>
    );
}
