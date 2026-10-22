// src/components/LanguageToggle.tsx
"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, type Locale } from "@/i18n/routing";

export default function LanguageToggle() {
    // 1. Get the current active language ('en' or 'ar')
    const currentLocale = useLocale() as Locale;

    // 2. Access updated routing hooks that maintain route structure
    const pathname = usePathname();
    const router = useRouter();

    // 3. Optional: Access dictionary keys if you want localized text
    const t = useTranslations("LanguageSwitcher");

    const toggleLanguage = () => {
        // Determine the next target language segment
        const nextLocale: Locale = currentLocale === "en" ? "ar" : "en";

        // Update the URL route while maintaining the user's exact current subpage path
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <button
            onClick={toggleLanguage}
            aria-label={
                currentLocale === "en"
                    ? "تغيير اللغة إلى العربية"
                    : "Switch language to English"
            }
            className="group relative flex items-center gap-2 px-4 h-12 rounded-pill border-2 border-body-text bg-paper  
            font-medium tracking-wide transition hover:-translate-x-0.5 
            hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-poke
            shadow-poke hover:shadow-poke-lg cursor-pointer text-sm"
        >
            {/* Target Language Indicator Globe Icon */}
            <svg
                xmlns="http://w3.org"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 opacity-70 group-hover:rotate-12 transition-transform"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.856.12-1.683.342-2.466"
                />
            </svg>

            {/* Button labels that alternate depending on active locale layout */}
            <span className="font-display font-bold">
                {currentLocale === "en" ? "AR" : "EN"}
            </span>
        </button>
    );
}
