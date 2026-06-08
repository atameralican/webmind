import type { Metadata } from "next";
import Link from "next/link";
import { transformersModels } from "@/lib/models/transformers-models";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr
      ? "Transformers.js — NLP, Görsel ve Ses Modelleri Tarayıcıda"
      : "Transformers.js — NLP, Vision & Audio AI Models in Browser",
    description: isTr
      ? "Duygu analizi, çeviri, özetleme, görüntü sınıflandırma, nesne tespiti ve konuşma tanımayı tarayıcınızda çalıştırın. 12 Transformers.js modeli — sunucu gerekmez."
      : "Run sentiment analysis, translation, summarization, image classification, object detection and speech recognition in your browser. 12 Transformers.js models — no server needed.",
    alternates: {
      canonical: isTr ? "/tr/transformers" : "/transformers",
      languages: {
        "x-default": "/transformers",
        en: "/transformers",
        tr: "/tr/transformers",
      },
    },
    openGraph: {
      title: isTr
        ? "Transformers.js — Tarayıcıda 12 Yapay Zeka Görevi"
        : "Transformers.js — 12 AI Tasks in Your Browser",
      description: isTr
        ? "NLP, görsel, ses ve çok modlu yapay zeka. Hugging Face tarafından desteklenen modeller. Gizlilik garantisi."
        : "NLP, vision, audio and multimodal AI. Hugging Face-powered models. Guaranteed privacy.",
      url: isTr
        ? "https://webmind-ai.vercel.app/tr/transformers"
        : "https://webmind-ai.vercel.app/transformers",
    },
  };
}

function formatMB(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

const categoryLabels: Record<string, { en: string; tr: string }> = {
  nlp:        { en: "NLP / Text",   tr: "Metin" },
  vision:     { en: "Vision",       tr: "Görsel" },
  audio:      { en: "Audio",        tr: "Ses" },
  multimodal: { en: "Multimodal",   tr: "Çok Modlu" },
};

const faqs = [
  {
    q: "Does Transformers.js require WebGPU?",
    a: "No. Most Transformers.js models run via WebAssembly (ONNX Runtime) and work on all modern browsers including Firefox and Safari. WebGPU acceleration is available for faster inference in Chrome and Edge when supported.",
  },
  {
    q: "What AI tasks can I run in the browser with Transformers.js?",
    a: "You can run: sentiment analysis, named entity recognition, translation (200+ languages), text summarization, question answering, zero-shot classification, image classification, object detection, depth estimation, speech recognition (99 languages), image-text matching (CLIP), and text generation.",
  },
  {
    q: "Do the models send my text or images to any server?",
    a: "No. All model inference happens locally in your browser using WebAssembly or WebGPU. Your text, images, and audio files never leave your device. WebMind has no server that processes your inputs.",
  },
  {
    q: "How large are the Transformers.js models?",
    a: "Models range from 67 MB (DistilBERT Sentiment) to 1.6 GB (BART Zero-Shot). Most NLP models are under 500 MB. Vision and audio models are typically 100–600 MB. All models are cached after the first download.",
  },
  {
    q: "How is Transformers.js different from running Python transformers?",
    a: "Transformers.js uses the same model architectures as the Python Hugging Face library, but runs in your browser via ONNX Runtime Web. No Python, no pip install, no server needed. Just open the page and run the model.",
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
      name: "Transformers.js Models",
      item: "https://webmind-ai.vercel.app/transformers",
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

export default async function TransformersLayout({
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

      {/* Server-rendered content — Googlebot indexes this even though the
          interactive task runner above is a "use client" component. */}
      <section aria-label={isTr ? "Görev kataloğu ve bilgiler" : "Task catalog and information"}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl space-y-16">

          {/* Task catalog table */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {isTr
                ? "12 Yapay Zeka Görevi — Tarayıcınızda Çalışıyor"
                : "12 AI Tasks Running Directly in Your Browser"}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {isTr
                ? "Tüm görevler Hugging Face Transformers.js ile ONNX Runtime üzerinde çalışır. Çoğu model CPU üzerinde (WebAssembly) çalışır — WebGPU gerekmez."
                : "All tasks run via Hugging Face Transformers.js on ONNX Runtime. Most models run on CPU (WebAssembly) — no WebGPU required."}
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">
                      {isTr ? "Görev" : "Task"}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">
                      {isTr ? "Kategori" : "Category"}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      {isTr ? "Model Boyutu" : "Model Size"}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">
                      {isTr ? "Girdi" : "Input"}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">
                      {isTr ? "CPU Uyumlu" : "CPU Compatible"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transformersModels.map((model) => (
                    <tr key={model.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span aria-hidden="true">{model.companyLogo}</span>
                          <div>
                            <p className="font-medium">
                              {isTr ? model.taskLabel.tr : model.taskLabel.en}
                            </p>
                            <p className="text-xs text-muted-foreground">{model.name}</p>
                          </div>
                          {model.badge === "popular" && (
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">Popular</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {isTr
                          ? categoryLabels[model.category].tr
                          : categoryLabels[model.category].en}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {formatMB(model.sizeMB)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground capitalize hidden md:table-cell">
                        {model.inputType}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {model.minVramMB === 0 ? (
                          <span className="text-emerald-600 font-medium text-xs">
                            {isTr ? "Evet" : "Yes"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            {isTr ? "GPU önerili" : "GPU preferred"}
                          </span>
                        )}
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
              {isTr ? "Nasıl Çalışır?" : "How Does Transformers.js Work?"}
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              {isTr
                ? "Python'un Hugging Face kütüphanesi ile aynı modeller — tarayıcıda."
                : "Same models as Python's Hugging Face library — running in your browser."}
            </p>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: isTr ? "Görev Seç" : "Choose a Task",
                  desc: isTr
                    ? "Duygu analizi, çeviri, konuşma tanıma gibi bir görev seçin. Her görevin kendi önceden eğitilmiş modeli vardır."
                    : "Select a task — sentiment analysis, translation, speech recognition, and more. Each task has its own pre-trained model optimized for that purpose.",
                },
                {
                  step: "2",
                  title: isTr ? "Model İndirilir" : "Model Downloads",
                  desc: isTr
                    ? "Seçilen model tarayıcı önbelleğine indirilir. ONNX formatındaki modeller hem CPU hem de GPU üzerinde çalışır."
                    : "The model downloads to your browser cache in ONNX format. ONNX Runtime Web runs it on CPU via WebAssembly or on GPU via WebGPU.",
                },
                {
                  step: "3",
                  title: isTr ? "Sonuçlar Anında" : "Instant Results",
                  desc: isTr
                    ? "Girdilerinizi yazın veya yükleyin — sonuçlar saniyeler içinde gelir. Hiçbir veri sunucuya gönderilmez."
                    : "Type or upload your input — results appear in seconds. No data is sent to any server. Your text, images, and audio stay on your device.",
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
                ? "Büyük dil modelleri için WebLLM'i deneyin (Llama, Phi, Gemma):"
                : "Also try WebLLM for large language model chat (Llama, Phi, Gemma):"}
            </p>
            <Link
              href={localePath("/webllm")}
              className="text-sm text-primary hover:underline font-medium whitespace-nowrap"
            >
              {isTr ? "WebLLM'i Keşfet →" : "Explore WebLLM →"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
