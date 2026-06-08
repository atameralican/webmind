import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 uses proxy.ts instead of middleware.ts when src/ is present.
// Locale detection is now enabled in routing.ts:
// - Turkish speakers (Accept-Language: tr) are automatically routed to /tr/*
// - All others default to English (no URL prefix)
// - NEXT_LOCALE cookie persists the choice for 1 year
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)"],
};
