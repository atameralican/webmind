import type { Metadata } from "next";

// Route-level layout: provides unique metadata for /transformers without
// touching the "use client" page component.
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

export default function TransformersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
