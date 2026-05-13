"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  ];

  const switchLocale = (newLocale: string) => {
    // Set NEXT_LOCALE cookie — next-intl middleware uses this to override Accept-Language header
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

    // Remove current locale prefix from path
    let newPath = pathname;
    if (pathname.startsWith(`/${locale}/`)) {
      newPath = pathname.slice(`/${locale}`.length);
    } else if (pathname === `/${locale}`) {
      newPath = "/";
    }
    if (!newPath.startsWith("/")) newPath = "/" + newPath;

    // English = no prefix, Turkish = /tr prefix
    const finalPath = newLocale === "en" ? newPath : `/${newLocale}${newPath}`;

    // Full navigation so server reads the cookie on next request
    window.location.href = finalPath || "/";
  };

  const currentLang = languages.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 transition-colors"
        aria-label="Select language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            className={`cursor-pointer gap-2 ${locale === lang.code ? "bg-primary/10 font-semibold" : ""}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
