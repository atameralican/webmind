import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// next-intl proxy — dil yönlendirmesini otomatik yönetir
// Next.js 16'da middleware.ts yerine proxy.ts kullanılır (src/ içinde)
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)"],
};
