// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing, Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Await the incoming locale parameter (required in modern versions)
    const requestedLocale = await requestLocale;

    // 2. Fall back to your default locale if the requested one isn't supported or is undefined
    const locale: Locale = 
        requestedLocale && routing.locales.includes(requestedLocale as Locale)
        ? (requestedLocale as Locale)
        : routing.defaultLocale;

    return {
        locale, // 3. FIXED: You must return the locale property here!
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
