import { defineRouting } from "next-intl/routing";

// Desteklenen diller ve varsayılan dil tanımı
export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true,
  localeCookie: { name: "NEXT_LOCALE", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" },
});
