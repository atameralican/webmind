import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "../globals.css";

// next/font/google self-hosts Inter on Vercel's CDN — eliminates the
// render-blocking request to fonts.googleapis.com and removes font layout
// shift. This is the primary LCP improvement in this file.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

// Global metadata — individual pages override via generateMetadata
export const metadata: Metadata = {
  metadataBase: new URL("https://webmind-ai.vercel.app"),
  title: {
    default: "WebMind AI — Run AI Models in Your Browser",
    template: "%s | WebMind AI",
  },
  description:
    "Run powerful AI models — WebLLM LLMs and Transformers.js tasks — directly in your browser using WebGPU. No server, no cloud, complete privacy.",
  keywords: [
    "WebMind",
    "browser AI",
    "local AI browser",
    "WebGPU AI",
    "run AI in browser",
    "WebLLM",
    "Transformers.js",
    "local LLM",
    "offline AI",
    "private AI",
    "in-browser AI",
    "client-side AI",
    "edge AI inference",
    "web AI platform",
    "Llama browser",
    "Phi browser",
    "Gemma browser",
    "privacy-first AI",
  ],
  authors: [{ name: "Alican Atamer", url: "https://github.com/atameralican" }],
  creator: "Alican Atamer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://webmind-ai.vercel.app",
    siteName: "WebMind AI",
    title: "WebMind AI — Run AI Models in Your Browser",
    description:
      "WebGPU-powered AI models running directly in your browser. No server required.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "WebMind AI — Browser AI Platform",
      },
    ],
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
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  },
  verification: {
    google: "bvZZ8jKx59FGixcKj0pF23HBKdXdZ4VsBfYYZd57ABw",
  },
};

// Three schema blocks injected globally:
// 1. SoftwareApplication — enables Google rich results for the app itself
// 2. WebSite — establishes the site entity and enables Sitelinks Searchbox
// 3. Person — builds Alican Atamer's Knowledge Graph entity as creator
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WebMind AI",
    alternateName: "WebMind",
    description:
      "Run powerful AI models — WebLLM LLMs and Transformers.js tasks — directly in your browser using WebGPU. No server, no cloud, complete privacy.",
    url: "https://webmind-ai.vercel.app",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Artificial Intelligence",
    operatingSystem: "Chrome 113+, Edge 113+",
    browserRequirements:
      "Requires WebGPU support. Compatible with Chrome 113+ and Edge 113+.",
    featureList: [
      "Run large language models (LLMs) in-browser with WebLLM",
      "Run NLP, vision, audio and multimodal models with Transformers.js",
      "WebGPU hardware acceleration",
      "Complete data privacy — no server or API calls during inference",
      "Offline-capable after initial model download",
      "Fully open source (MIT license)",
      "Supports Llama, Phi, Gemma, Qwen, Mistral, DeepSeek models",
      "Available in English and Turkish",
    ],
    screenshot: "https://webmind-ai.vercel.app/opengraph-image",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isAccessibleForFree: true,
    inLanguage: ["en", "tr"],
    author: {
      "@type": "Person",
      name: "Alican Atamer",
      url: "https://webmind-ai.vercel.app/about",
      sameAs: [
        "https://github.com/atameralican",
        "https://www.linkedin.com/in/alican-atamer/",
        "https://twitter.com/atameralican",
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WebMind AI",
    alternateName: "WebMind",
    url: "https://webmind-ai.vercel.app",
    description:
      "Open-source browser AI platform — run LLMs and ML models in-browser with WebGPU. No server, complete privacy.",
    inLanguage: ["en", "tr"],
    author: {
      "@type": "Person",
      name: "Alican Atamer",
      sameAs: [
        "https://github.com/atameralican",
        "https://www.linkedin.com/in/alican-atamer/",
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alican Atamer",
    url: "https://webmind-ai.vercel.app/about",
    jobTitle: "Software Developer",
    knowsAbout: [
      "WebGPU",
      "Large Language Models",
      "Browser-based AI inference",
      "Next.js",
      "Open Source Development",
      "Transformers.js",
    ],
    sameAs: [
      "https://github.com/atameralican",
      "https://www.linkedin.com/in/alican-atamer/",
      "https://twitter.com/atameralican",
    ],
    creator: {
      "@type": "SoftwareApplication",
      name: "WebMind AI",
      url: "https://webmind-ai.vercel.app",
    },
  },
];

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Structured data — three schema blocks for App, Site, and Author */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Author entity links — strengthens E-E-A-T association */}
        <link rel="me" href="https://github.com/atameralican" />
        <link rel="me" href="https://www.linkedin.com/in/alican-atamer/" />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        {/* Google Analytics 4 — afterInteractive keeps it off the critical path */}
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

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
