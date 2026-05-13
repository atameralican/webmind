import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "../globals.css";

// SEO — Tüm sayfalara uygulanır, her sayfa kendi metadata'sını override edebilir
export const metadata: Metadata = {
  metadataBase: new URL("https://webmind-ai.vercel.app"),
  title: {
    default: "WebMind AI — Run AI Models in Your Browser",
    template: "%s | WebMind AI",
  },
  description:
    "Run powerful AI models — WebLLM LLMs and Transformers.js tasks — directly in your browser using WebGPU. No server, no cloud, complete privacy.",
  keywords: [
    "WebMind", "browser AI", "local AI browser", "WebGPU AI", "run AI in browser",
    "WebLLM", "Transformers.js", "local LLM", "offline AI", "private AI",
    "in-browser AI", "LLM", "Llama", "Phi", "Gemma", "privacy-first AI",
    "client-side AI", "edge AI inference", "web AI platform",
    "tarayıcı yapay zeka", "yerel yapay zeka", "WebGPU modelleri",
  ],
  authors: [{ name: "Alican Atamer", url: "https://github.com/atameralican" }],
  creator: "Alican Atamer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://webmind-ai.vercel.app",
    siteName: "WebMind",
    title: "WebMind AI — Run AI Models in Your Browser",
    description: "WebGPU-powered AI models running directly in your browser. No server required.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "WebMind — Browser AI Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebMind AI — Run AI Models in Your Browser",
    description: "WebGPU-powered AI models running directly in your browser.",
    images: ["/opengraph-image"],
    creator: "@atameralican",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large" },
  },
  verification: {
    google: "bvZZ8jKx59FGixcKj0pF23HBKdXdZ4VsBfYYZd57ABw",
  },
};

// JSON-LD yapılandırılmış veri — SEO için
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WebMind",
  description: "Run AI models directly in your browser using WebGPU",
  url: "https://actigravity-ai.vercel.app",
  author: {
    "@type": "Person",
    name: "Alican Atamer",
    url: "https://github.com/atameralican",
  },
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // Geçersiz locale = 404
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Dil mesajlarını yükle
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* JSON-LD Yapılandırılmış Veri */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Inter Google Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        {/* Google Analytics 4 — afterInteractive strateji ile performansı etkilemez */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}

        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>

        {/* Vercel Analytics */}
        <Analytics />
        {/* Vercel Speed Insights — Core Web Vitals */}
        <SpeedInsights />
      </body>
    </html>
  );
}
