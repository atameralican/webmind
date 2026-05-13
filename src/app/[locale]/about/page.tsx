import type { Metadata } from "next";
import { Shield, Cpu, Zap, Globe, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "tr" ? "Hakkında — WebMind" : "About — WebMind",
    description:
      locale === "tr"
        ? "WebMind hakkında — tarayıcıda yapay zeka modelleri çalıştırmak için açık kaynaklı platform."
        : "About WebMind — run AI models directly in your browser. Free, private, no server.",
  };
}

const features = [
  {
    icon: Shield,
    titleEn: "Complete Privacy",
    titleTr: "Tam Gizlilik",
    descEn: "Your data never leaves your device. No API keys, no cloud, no telemetry on your inputs.",
    descTr: "Verileriniz cihazınızdan asla çıkmaz. API anahtarı yok, bulut yok, girişlerinizde telemetri yok.",
  },
  {
    icon: Cpu,
    titleEn: "WebGPU Acceleration",
    titleTr: "WebGPU Hızlandırması",
    descEn: "Models run directly on your GPU via the WebGPU API — the same hardware powering your games and creative apps.",
    descTr: "Modeller WebGPU API aracılığıyla doğrudan GPU'nuzda çalışır.",
  },
  {
    icon: Zap,
    titleEn: "Two Runtimes",
    titleTr: "İki Çalışma Zamanı",
    descEn: "WebLLM for large language models (LLMs) and Transformers.js for specialized tasks like vision, audio, and NLP.",
    descTr: "Büyük dil modelleri için WebLLM; görüntü, ses ve NLP görevleri için Transformers.js.",
  },
  {
    icon: Globe,
    titleEn: "Fully Open Source",
    titleTr: "Tamamen Açık Kaynak",
    descEn: "Every model and every line of code is open source. Inspect, fork, and build on top of it freely.",
    descTr: "Her model ve her kod satırı açık kaynaktır. İstediğiniz gibi inceleyin ve fork edin.",
  },
];

const stack = [
  { label: "Next.js 16", href: "https://nextjs.org" },
  { label: "WebLLM by MLC AI", href: "https://webllm.mlc.ai" },
  { label: "Transformers.js", href: "https://huggingface.co/docs/transformers.js" },
  { label: "WebGPU API", href: "https://developer.chrome.com/docs/web-platform/webgpu" },
  { label: "Tailwind CSS v4", href: "https://tailwindcss.com" },
  { label: "shadcn/ui", href: "https://ui.shadcn.com" },
  { label: "Framer Motion", href: "https://www.framer.com/motion" },
  { label: "next-intl", href: "https://next-intl-docs.vercel.app" },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
            {isTr ? "Proje" : "Project"}
          </Badge>
          <h1 className="text-4xl font-extrabold mb-4 gradient-text">
            {isTr ? "WebMind Hakkında" : "About WebMind"}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {isTr
              ? "WebMind, yapay zeka modellerini doğrudan tarayıcınızda çalıştırmanızı sağlayan açık kaynaklı bir platformdur. Sunucu yok, API yok, ücret yok — sadece tarayıcı ve GPU'nuz."
              : "WebMind is an open-source platform that lets you run AI models directly in your browser. No server, no API, no cost — just your browser and GPU."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl space-y-16">

        {/* Why section */}
        <section>
          <h2 className="text-2xl font-bold mb-8">
            {isTr ? "Neden WebMind?" : "Why WebMind?"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.titleEn}
                className="glass rounded-2xl p-6 border border-border hover:border-primary/30 hover-lift transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{isTr ? f.titleTr : f.titleEn}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isTr ? f.descTr : f.descEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            {isTr ? "Kullanılan Teknolojiler" : "Tech Stack"}
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            {isTr
              ? "WebMind modern web teknolojileriyle, açık kaynak araçlar üzerine inşa edilmiştir."
              : "WebMind is built on modern web technologies and open-source tools."}
          </p>
          <div className="flex flex-wrap gap-3">
            {stack.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border border-border bg-muted/50 hover:border-primary/40 hover:text-primary transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                {item.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
