import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Kullanıcının locale'ini belirle
  let locale = await requestLocale;

  // Geçerli bir locale değilse varsayılanı kullan
  if (!locale || !routing.locales.includes(locale as "en" | "tr")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // İlgili dil dosyasını yükle
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
