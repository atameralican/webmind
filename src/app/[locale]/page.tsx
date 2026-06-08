import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/hero";
import { WebGPUCheck } from "@/components/webgpu-check";

// Ana sayfa SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "tr"
      ? "Tarayıcınızda Yapay Zeka Modelleri Çalıştırın"
      : "Run AI Models Directly in Your Browser",
    description: locale === "tr"
      ? "WebLLM ve Transformers.js ile WebGPU destekli yapay zeka modellerini tarayıcınızda çalıştırın. Sunucu yok, bulut yok, tam gizlilik."
      : "Run WebGPU-powered AI models in your browser with WebLLM and Transformers.js. No server, no cloud, complete privacy.",
    alternates: {
      canonical: locale === "tr" ? "/tr" : "/",
      languages: {
        "x-default": "/",
        "en": "/",
        "tr": "/tr",
      },
    },
  };
}

// Ana sayfa bölümleri için wrapper (Server Component)
function SectionWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={className}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "webgpu" });

  return (
    <>
      {/* Hero bölümü — particle efekti, mouse parallax */}
      <Hero />

      {/* WebGPU uyumluluk kontrolü bölümü */}
      <SectionWrapper className="py-16 bg-muted/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
          </div>
          <WebGPUCheck />
        </div>
      </SectionWrapper>

      {/* Özellikler özeti */}
      <SectionWrapper className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            {locale === "tr" ? "Neden WebMind?" : "Why WebMind?"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {locale === "tr"
              ? "Yapay zeka modellerini tarayıcınızda çalıştırmanın en kolay ve en gizli yolu."
              : "The easiest and most private way to run AI models directly in your browser."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🔒",
              title: locale === "tr" ? "Tam Gizlilik" : "Complete Privacy",
              desc: locale === "tr"
                ? "Verileriniz cihazınızdan asla çıkmaz. Sunucu yok, API yok, bulut yok."
                : "Your data never leaves your device. No server, no API, no cloud.",
            },
            {
              emoji: "⚡",
              title: locale === "tr" ? "WebGPU Hızı" : "WebGPU Speed",
              desc: locale === "tr"
                ? "Doğrudan GPU hızlandırması ile saniyeler içinde sonuç alın."
                : "Get results in seconds with direct GPU acceleration.",
            },
            {
              emoji: "🌐",
              title: locale === "tr" ? "Tamamen Açık Kaynak" : "Fully Open Source",
              desc: locale === "tr"
                ? "Tüm modeller ve kod açık kaynak. İstediğiniz zaman inceleyebilirsiniz."
                : "All models and code are open source. Inspect anytime.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 text-center hover-lift border border-border hover:border-primary/30"
            >
              <div className="text-3xl mb-3">{feature.emoji}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
