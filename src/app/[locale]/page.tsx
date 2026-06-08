import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/hero";
import { WebGPUCheck } from "@/components/webgpu-check";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "tr"
      ? "Tarayıcınızda Yapay Zeka Modelleri Çalıştırın"
      : "Run AI Models Directly in Your Browser — No Install, No Cloud",
    description: locale === "tr"
      ? "WebLLM ve Transformers.js ile WebGPU destekli yapay zeka modellerini tarayıcınızda çalıştırın. Sunucu yok, bulut yok, tam gizlilik. Kurulum gerektirmez."
      : "Run WebGPU-powered AI models in your browser with WebLLM and Transformers.js. No server, no cloud, no install, complete privacy. Your data never leaves your device.",
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

// FAQPage JSON-LD for AI citation readiness (Perplexity, ChatGPT, Claude)
const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is WebMind AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WebMind AI is an open-source platform that runs AI models directly in your browser using WebGPU. It includes WebLLM for large language model chat (Llama, Phi, Gemma, Mistral) and Transformers.js for NLP, vision, and audio tasks. No server, no cloud, no installation required.",
      },
    },
    {
      "@type": "Question",
      name: "Does WebMind AI require any installation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. WebMind AI runs entirely in Chrome 113+ or Edge 113+. There is nothing to install, no account to create, and no API key needed. Open the website and start running AI models immediately.",
      },
    },
    {
      "@type": "Question",
      name: "Is WebMind AI private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All AI inference happens locally on your device using WebGPU or WebAssembly. Your prompts, inputs, and model outputs are never sent to any server. WebMind AI has no backend that processes your requests.",
      },
    },
    {
      "@type": "Question",
      name: "What AI models does WebMind support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WebMind AI supports 9 WebLLM models (Llama 3.2 1B/3B, Phi-3.5 Mini 3.8B, Gemma 2 2B, Qwen 2.5 1.5B/7B, Mistral 7B, SmolLM2 1.7B, DeepSeek R1 1.5B) and 12 Transformers.js tasks (sentiment analysis, NER, translation, summarization, QA, image classification, object detection, speech recognition, and more).",
      },
    },
    {
      "@type": "Question",
      name: "How is WebMind AI different from Ollama or LM Studio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ollama and LM Studio require installation on your computer and admin privileges. WebMind AI runs entirely in your browser tab — no installation, no admin rights, no separate process. You can use it on any shared computer, school laptop, or work machine without installing anything.",
      },
    },
  ],
};

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
  const isTr = locale === "tr";
  const localePath = (path: string) => (locale === "en" ? path : `/${locale}${path}`);

  return (
    <>
      {/* FAQPage structured data for AI search citation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />

      {/* Hero — particle animation, mouse parallax, primary CTAs */}
      <Hero />

      {/* WebGPU compatibility check */}
      <SectionWrapper className="py-16 bg-muted/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
          </div>
          <WebGPUCheck />
        </div>
      </SectionWrapper>

      {/* Why WebMind? */}
      <SectionWrapper className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            {isTr ? "Neden WebMind?" : "Why WebMind?"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {isTr
              ? "Yapay zeka modellerini tarayıcınızda çalıştırmanın en kolay ve en gizli yolu."
              : "The easiest and most private way to run AI models directly in your browser."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🔒",
              title: isTr ? "Tam Gizlilik" : "Complete Privacy",
              desc: isTr
                ? "Verileriniz cihazınızdan asla çıkmaz. Sunucu yok, API yok, bulut yok."
                : "Your data never leaves your device. No server, no API, no cloud.",
            },
            {
              emoji: "⚡",
              title: isTr ? "WebGPU Hızı" : "WebGPU Speed",
              desc: isTr
                ? "Doğrudan GPU hızlandırması ile saniyeler içinde sonuç alın."
                : "Get results in seconds with direct GPU acceleration in your browser.",
            },
            {
              emoji: "🌐",
              title: isTr ? "Tamamen Açık Kaynak" : "Fully Open Source",
              desc: isTr
                ? "Tüm modeller ve kod açık kaynak. İstediğiniz zaman inceleyebilirsiniz."
                : "All models and code are open source. Inspect, fork, and verify anytime.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 text-center hover-lift border border-border hover:border-primary/30"
            >
              <div className="text-3xl mb-3" aria-hidden="true">{feature.emoji}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* How it works */}
      <SectionWrapper className="py-20 bg-muted/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            {isTr ? "Nasıl Çalışır?" : "How It Works"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            {isTr
              ? "Üç adımda tarayıcı yapay zekanız hazır."
              : "Three steps to running AI privately in your browser."}
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              step: "1",
              title: isTr ? "Tarayıcıyı Aç" : "Open Your Browser",
              desc: isTr
                ? "Chrome veya Edge'i açın ve WebMind AI'ya gidin. Kurulum gerekmez — hesap açmanıza gerek yok."
                : "Open Chrome or Edge and navigate to WebMind AI. No installation needed — no account, no sign-up.",
            },
            {
              step: "2",
              title: isTr ? "Model İndir" : "Download a Model",
              desc: isTr
                ? "Listeden bir model seçin. Model ağırlıkları bir kez tarayıcı önbelleğinize indirilir — sonrasında internet gerekmez."
                : "Pick a model from the list. Weights download once to your browser cache — then you can run it offline.",
            },
            {
              step: "3",
              title: isTr ? "Özel Olarak Çalıştır" : "Run Privately",
              desc: isTr
                ? "Sohbet edin, metin analiz edin, görseller işleyin — hepsi cihazınızda. Verileriniz hiçbir sunucuya gönderilmez."
                : "Chat, analyze text, process images — everything runs on your device. Your data never reaches any server.",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="glass rounded-2xl p-6 border border-border relative"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-lg">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </li>
          ))}
        </ol>
      </SectionWrapper>

      {/* Explore the tools — internal link section */}
      <SectionWrapper className="py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">
            {isTr ? "İki Güçlü Çalışma Zamanı" : "Two Powerful AI Runtimes"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            {isTr
              ? "Büyük dil modelleri için WebLLM, özelleşmiş görevler için Transformers.js."
              : "WebLLM for large language models, Transformers.js for specialized AI tasks."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* WebLLM card */}
          <div className="glass rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors group">
            <div className="text-4xl mb-4" aria-hidden="true">🤖</div>
            <h3 className="text-xl font-bold mb-2">WebLLM</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {isTr
                ? "Llama 3.2, Phi-3.5 Mini, Gemma 2, Qwen 2.5, Mistral 7B ve DeepSeek R1 dahil 9 açık kaynak büyük dil modeli. WebGPU ile GPU hızlandırması."
                : "9 open-source large language models including Llama 3.2, Phi-3.5 Mini, Gemma 2, Qwen 2.5, Mistral 7B, and DeepSeek R1. GPU-accelerated via WebGPU."}
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 mb-6">
              <li>• {isTr ? "Sohbet ve talimat takibi" : "Chat and instruction following"}</li>
              <li>• {isTr ? "Kod üretimi ve analizi" : "Code generation and analysis"}</li>
              <li>• {isTr ? "Akıl yürütme ve çok dil desteği" : "Reasoning and multilingual support"}</li>
            </ul>
            <Link
              href={localePath("/webllm")}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group-hover:gap-3 transition-all"
            >
              {isTr ? "WebLLM'i Keşfet" : "Explore WebLLM"} →
            </Link>
          </div>

          {/* Transformers.js card */}
          <div className="glass rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors group">
            <div className="text-4xl mb-4" aria-hidden="true">⚡</div>
            <h3 className="text-xl font-bold mb-2">Transformers.js</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {isTr
                ? "Duygu analizi, çeviri, özetleme, görüntü sınıflandırma, nesne tespiti ve konuşma tanıma dahil 12 görev. Çoğu model CPU üzerinde çalışır."
                : "12 AI tasks including sentiment analysis, translation, summarization, image classification, object detection, and speech recognition. Most models run on CPU."}
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 mb-6">
              <li>• {isTr ? "Metin: NLP, çeviri, özetleme" : "Text: NLP, translation, summarization"}</li>
              <li>• {isTr ? "Görsel: sınıflandırma, nesne tespiti" : "Vision: image classification, object detection"}</li>
              <li>• {isTr ? "Ses: konuşma tanıma (99 dil)" : "Audio: speech recognition (99 languages)"}</li>
            </ul>
            <Link
              href={localePath("/transformers")}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group-hover:gap-3 transition-all"
            >
              {isTr ? "Transformers.js'i Keşfet" : "Explore Transformers.js"} →
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* No-cloud comparison strip */}
      <SectionWrapper className="py-16 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {isTr
              ? "WebMind AI vs Bulut Yapay Zeka"
              : "WebMind AI vs Cloud AI"}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-semibold pr-6">
                    {isTr ? "Özellik" : "Feature"}
                  </th>
                  <th className="text-left py-3 font-semibold text-primary">WebMind AI</th>
                  <th className="text-left py-3 font-semibold text-muted-foreground">
                    {isTr ? "ChatGPT / Claude" : "ChatGPT / Claude"}
                  </th>
                  <th className="text-left py-3 font-semibold text-muted-foreground">
                    {isTr ? "Ollama / LM Studio" : "Ollama / LM Studio"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  {
                    feature: isTr ? "Kurulum" : "Installation",
                    webmind: isTr ? "Yok" : "None",
                    cloud: isTr ? "Yok" : "None",
                    local: isTr ? "Gerekli" : "Required",
                    webmindGood: true,
                  },
                  {
                    feature: isTr ? "Veri gizliliği" : "Data privacy",
                    webmind: isTr ? "100% yerel" : "100% local",
                    cloud: isTr ? "Bulut sunucuları" : "Cloud servers",
                    local: isTr ? "100% yerel" : "100% local",
                    webmindGood: true,
                  },
                  {
                    feature: isTr ? "İnternet gereksinimi" : "Internet required",
                    webmind: isTr ? "Yalnızca indirme" : "Download only",
                    cloud: isTr ? "Her zaman" : "Always",
                    local: isTr ? "Yalnızca indirme" : "Download only",
                    webmindGood: true,
                  },
                  {
                    feature: isTr ? "Hesap / API anahtarı" : "Account / API key",
                    webmind: isTr ? "Gerekmez" : "Not needed",
                    cloud: isTr ? "Zorunlu" : "Required",
                    local: isTr ? "Gerekmez" : "Not needed",
                    webmindGood: true,
                  },
                  {
                    feature: isTr ? "Ücret" : "Cost",
                    webmind: isTr ? "Ücretsiz" : "Free",
                    cloud: isTr ? "$20+/ay" : "$20+/month",
                    local: isTr ? "Ücretsiz" : "Free",
                    webmindGood: true,
                  },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-6 font-medium">{row.feature}</td>
                    <td className="py-3 text-primary font-medium">{row.webmind}</td>
                    <td className="py-3 text-muted-foreground">{row.cloud}</td>
                    <td className="py-3 text-muted-foreground">{row.local}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* Final CTA */}
      <SectionWrapper className="py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            {isTr
              ? "Hemen Başlayın — Kurulum Yok"
              : "Start Now — No Installation Required"}
          </h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            {isTr
              ? "WebMind AI ücretsiz ve açık kaynaklıdır. Hesap oluşturmanız, ödeme yapmanız veya herhangi bir şey indirmeniz gerekmez — sadece Chrome veya Edge açın."
              : "WebMind AI is free and open source. No account, no payment, no download required — just open Chrome or Edge and start."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={localePath("/webllm")}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
            >
              {isTr ? "WebLLM'i Dene" : "Try WebLLM"} →
            </Link>
            <Link
              href={localePath("/transformers")}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-border text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              {isTr ? "Transformers.js'i Dene" : "Try Transformers.js"} →
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            {isTr
              ? "Gizlilik politikamızı okuyun: "
              : "Read our privacy policy: "}
            <Link href={localePath("/privacy")} className="text-primary hover:underline">
              {isTr ? "Tüm veriler cihazınızda kalır →" : "All data stays on your device →"}
            </Link>
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
