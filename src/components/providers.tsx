"use client";

// Providers bileşeni — tema ve tooltip sağlayıcılarını sarmalar
// next-themes ile sistem teması algılanır, localStorage'a kaydedilir

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"          // Tema sınıfı HTML elementine uygulanır
      defaultTheme="dark"        // Varsayılan tema: koyu
      enableSystem={true}        // Sistem temasını algıla
      storageKey="webmind-theme" // localStorage anahtarı
      disableTransitionOnChange={false}
    >
      {/* Shadcn/ui Tooltip bileşenleri için global provider */}
      <TooltipProvider delay={300}>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
