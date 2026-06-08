import type { Metadata } from "next";

// Route-level layout: provides unique metadata for /webllm without touching
// the "use client" page component. Next.js merges this with the root layout
// metadata — page-specific values win over layout defaults.
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

export default function WebLLMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
