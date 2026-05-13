import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

// next-intl middleware — dil yönlendirmesini otomatik yönetir
export default createMiddleware(routing);

export const config = {
  // API, statik dosyalar ve _next hariç tüm rotaları yakala
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
