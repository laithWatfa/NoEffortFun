// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Strongly typed array of supported languages
    locales: ['en', 'ar'] as const,
    
    // Default fallback language if none matches
    defaultLocale: 'en'
});


export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
