import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Intercepts traffic to evaluate paths, cookies, and headers for localization
export default createMiddleware(routing);

export const config = {
  // Capture application paths while strictly avoiding static files, images, and API endpoints
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
