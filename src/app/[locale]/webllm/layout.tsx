import type { Metadata } from "next";
import Link from "next/link";
import { webllmModels } from "@/lib/models/webllm-models";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr
      ? "WebLLM — Llama, Phi, Gemma ve Daha Fazlasını Tarayıcıda Çalıştır"
      : "WebLLM Models — Run Llama, Phi, Gemma in Your Browser",
    description: isTr
      ? "Llama 3.2, Phi-3.5 Mini, Gemma 2, Qwen 2.5, Mistral 7B ve DeepSeek R1'i tarayıcınızda çalıştırın. WebGPU hızlandırması, sunucu gerekmez, verileriniz cihazınızda kalır."
      : "Run Llama 3.2, Phi-3.5 Mini, Gemma 2, Qwen 2.5, Mistral 7B and DeepSeek R1 directly in your browser. WebGPU-powered — no server, no API key, your data stays on your device.",
    alternates: {
      canonical: isTr ? "/tr/webllm" : "/webllm",
      languages: {
        "x-default": "/webllm",
        en: "/webllm",
        tr: "/tr/webllm",
      },
    },
    openGraph: {
      title: isTr
        ? "WebLLM — Tarayıcıda LLM Çalıştırın"
        : "WebLLM — Run Language Models in Your Browser",
      description: isTr
        ? "9 açık kaynak dil modeli. Sunucu yok, tam gizlilik."
        : "9 open-source language models. No server, complete privacy.",
      url: isTr
        ? "https://webmind-ai.vercel.app/tr/webllm"
        : "https://webmind-ai.vercel.app/webllm",
    },
  };
}

function formatMB(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

const faqs = [
  {
    q: "What browser do I need to run WebLLM?",
    a: "WebLLM requires Chrome 113+ or Edge 113+ with WebGPU support. Firefox and Safari do not yet support WebGPU for LLM inference.",
  },
  {
    q: "Does WebLLM send my data to any server?",
    a: "No. Your prompts, conversation history, and model outputs never leave your device. All inference runs locally in your browser using WebGPU. WebMind has no backend that processes your requests.",
  },
  {
    q: "How much RAM or VRAM do I need?",
    a: "Small models like Llama 3.2 1B (800 MB) need about 1 GB VRAM. Medium models like Phi-3.5 Mini (2.2 GB) need 2.5 GB. Large 7B models like Mistral 7B (4.3 GB) need at least 5 GB VRAM. If WebGPU is not available, some models fall back to CPU via WebAssembly.",
  },
  {
    q: "Do I need to download models every time?",
    a: "No. Models are cached in your browser's cache storage after the first download. Subsequent sessions load from cache instantly without re-downloading.",
  },
  {
    q: "How is WebLLM different from Ollama?",
    a: "Ollama runs as a local server on your desktop and requires installation. WebLLM runs entirely inside a browser tab — no installation, no admin rights, no separate process. You can use WebLLM on any shared computer without installing anything.",
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://webmind-ai.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "WebLLM Models",
      item: "https://webmind-ai.vercel.app/webllm",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default async function WebLLMLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const localePath = (path: string) => (locale === "en" ? path : `/${locale}${path}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {children}

      {/* Server-rendered SEO content — Googlebot indexes this even though the
          interactive model browser above is a "use client" component. */}
      <section aria-label={isTr ? "Model kataloğu ve bilgiler" : "Model catalog and information"}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl space-y-16">

          {/* Model catalog table */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {isTr
                ? "9 Açık Kaynak LLM — Tarayıcınızda Çalışıyor"
                : "9 Open-Source LLMs Running Directly in Your Browser"}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {isTr
                ? "Tüm modeller WebGPU ile doğrudan tarayıcınızda çalışır. İndirme sonrası internet bağlantısı gerekmez."
                : "All models run on WebGPU inside your browser tab. After the initial download, no internet connection is needed."}
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">
                      {isTr ? "Model" : "Model"}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">
                      {isTr ? "Sağlayıcı" : "Provider"}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      {isTr ? "Boyut" : "Size"}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">
                      {isTr ? "Parametre" : "Params"}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">
                      {isTr ? "Min. VRAM" : "Min. VRAM"}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">
                      {isTr ? "Lisans" : "License"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {webllmModels.map((model) => (
                    <tr key={model.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span aria-hidden="true">{model.companyLogo}</span>
                          <span className="font-medium">{model.name}</span>
                          {model.badge === "popular" && (
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">Popular</span>
                          )}
                          {model.badge === "recommended" && (
                            <span className="text-xs bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-md">Recommended</span>
                          )}
                          {model.badge === "new" && (
                            <span className="text-xs bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-md">New</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {model.company}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{formatMB(model.sizeMB)}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {model.parameters}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs hidden lg:table-cell">
                        {formatMB(model.minVramMB)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                        {model.license}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How it works */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {isTr ? "Nasıl Çalışır?" : "How Does WebLLM Work?"}
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              {isTr
                ? "Tarayıcınız artık gerçek bir LLM çalışma zamanına sahip — sunucu gerekmeden."
                : "Your browser is now a real LLM runtime — no server required."}
            </p>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: isTr ? "Model Seç ve İndir" : "Pick a Model & Download",
                  desc: isTr
                    ? "Listeden bir model seçin. Model ağırlıkları doğrudan tarayıcı önbelleğinize indirilir — bir kez indirilir, sürekli çevrimiçi olmanız gerekmez."
                    : "Choose a model from the list. Model weights download directly into your browser cache — one-time download, no persistent internet needed.",
                },
                {
                  step: "2",
                  title: isTr ? "WebGPU Hızlandırması" : "WebGPU Acceleration",
                  desc: isTr
                    ? "WebLLM, modeli GPU'nuzda WebGPU API aracılığıyla çalıştırır. Oyunlar ve grafik uygulamalar için kullandığınız donanımın aynısı — şimdi LLM çıkarımı için."
                    : "WebLLM runs the model on your GPU via the WebGPU API — the same hardware your games use, now doing LLM inference at hardware speed.",
                },
                {
                  step: "3",
                  title: isTr ? "Özel Sohbet" : "Private Chat",
                  desc: isTr
                    ? "Verileriniz cihazınızdan asla çıkmaz. İstemleriniz, yanıtlarınız ve sohbet geçmişiniz yalnızca tarayıcı belleğinizde bulunur. WebMind'ın bunları okuma yolu yoktur."
                    : "Your data never leaves your device. Prompts, responses, and conversation history live only in your browser memory. WebMind has no way to read them.",
                },
              ].map((item) => (
                <li key={item.step} className="glass rounded-2xl p-6 border border-border">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Requirements */}
          <div className="glass rounded-2xl p-6 border border-border">
            <h2 className="text-lg font-bold mb-4">
              {isTr ? "Sistem Gereksinimleri" : "System Requirements"}
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">
                  {isTr ? "Tarayıcı: " : "Browser: "}
                </span>
                {isTr
                  ? "Chrome 113+ veya Edge 113+ (WebGPU desteği gerekir)"
                  : "Chrome 113+ or Edge 113+ (WebGPU support required)"}
              </li>
              <li>
                <span className="font-medium text-foreground">VRAM: </span>
                {isTr
                  ? "Küçük modeller için 1 GB, 7B modeller için 5-6 GB"
                  : "1 GB for small models, 5–6 GB for 7B models"}
              </li>
              <li>
                <span className="font-medium text-foreground">
                  {isTr ? "Depolama: " : "Storage: "}
                </span>
                {isTr
                  ? "Her model bir kez indirilir ve tarayıcı önbelleğine kaydedilir"
                  : "Each model is downloaded once and stored in browser cache"}
              </li>
              <li>
                <span className="font-medium text-foreground">
                  {isTr ? "CPU geri dönüş: " : "CPU fallback: "}
                </span>
                {isTr
                  ? "WebGPU yoksa bazı küçük modeller WebAssembly üzerinden çalışır"
                  : "When WebGPU is unavailable, small models can fall back to WebAssembly (CPU)"}
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {isTr ? "Sık Sorulan Sorular" : "Frequently Asked Questions"}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="glass rounded-xl p-5 border border-border"
                >
                  <h3 className="font-semibold mb-2 text-sm">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal links */}
          <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isTr
                ? "Metin, görsel ve ses görevleri için Transformers.js'i deneyin:"
                : "Also try Transformers.js for NLP, vision, and audio tasks:"}
            </p>
            <Link
              href={localePath("/transformers")}
              className="text-sm text-primary hover:underline font-medium whitespace-nowrap"
            >
              {isTr ? "Transformers.js'i Keşfet →" : "Explore Transformers.js →"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
