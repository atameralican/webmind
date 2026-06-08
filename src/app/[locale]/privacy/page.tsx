import type { Metadata } from "next";
import { Shield, Eye, Cookie, Code, BarChart3, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";
  return {
    title: isTr ? "Gizlilik Politikası — WebMind AI" : "Privacy Policy — WebMind AI",
    description: isTr
      ? "WebMind AI gizlilik politikası. Model çıktıları cihazınızdan asla çıkmaz. Analitik veriler, çerezler ve açık kaynak doğrulaması hakkında bilgi edinin."
      : "WebMind AI privacy policy. Model inputs never leave your device. Learn about analytics, cookies, and how to verify our open-source code.",
    alternates: {
      canonical: isTr ? "/tr/privacy" : "/privacy",
      languages: {
        "x-default": "/privacy",
        en: "/privacy",
        tr: "/tr/privacy",
      },
    },
    robots: { index: true, follow: true },
  };
}

interface Section {
  icon: React.ElementType;
  titleEn: string;
  titleTr: string;
  bodyEn: React.ReactNode;
  bodyTr: React.ReactNode;
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";

  const sections: Section[] = [
    {
      icon: Shield,
      titleEn: "AI Inference — 100% Local",
      titleTr: "Yapay Zeka Çıkarımı — %100 Yerel",
      bodyEn: (
        <p>
          Everything you type into WebMind stays on your device. When you run a model —
          whether it&apos;s a language model via WebLLM or an NLP/vision/audio task via
          Transformers.js — the entire computation happens inside your browser using
          your GPU (WebGPU) or CPU (WebAssembly). <strong>Your prompts, inputs, and
          model outputs are never sent to any server.</strong> There is no backend
          that processes your requests. WebMind has no ability to read what you type.
        </p>
      ),
      bodyTr: (
        <p>
          WebMind&apos;e yazdığınız her şey cihazınızda kalır. Bir model çalıştırdığınızda —
          ister WebLLM aracılığıyla bir dil modeli, ister Transformers.js ile NLP/görsel/ses
          görevi olsun — tüm hesaplama, GPU&apos;nuz (WebGPU) veya CPU&apos;nuz (WebAssembly)
          kullanılarak tarayıcınızın içinde gerçekleşir.{" "}
          <strong>İstemleriniz, girdileriniz ve model çıktılarınız hiçbir sunucuya
          gönderilmez.</strong> İsteklerinizi işleyecek bir arka uç yoktur.
          WebMind yazdıklarınızı okuyamaz.
        </p>
      ),
    },
    {
      icon: BarChart3,
      titleEn: "Analytics — Pageviews Only",
      titleTr: "Analitik — Yalnızca Sayfa Görüntülemeleri",
      bodyEn: (
        <div className="space-y-3">
          <p>
            WebMind uses <strong>Vercel Analytics</strong> to collect anonymized
            pageview data. This helps understand which features are used and whether
            the site is working correctly. Vercel Analytics collects:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
            <li>Page URL visited (e.g., /webllm, /transformers)</li>
            <li>Approximate country (not city or address)</li>
            <li>Device type and browser (e.g., Chrome, desktop)</li>
            <li>Referrer URL (where you came from)</li>
          </ul>
          <p>
            Vercel Analytics does <strong>not</strong> collect: your name, email,
            IP address (it is hashed and discarded), any inference content, or any
            data you enter into the AI models. See{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Vercel&apos;s privacy policy
              <ExternalLink className="h-3 w-3" />
            </a>{" "}
            for full details.
          </p>
        </div>
      ),
      bodyTr: (
        <div className="space-y-3">
          <p>
            WebMind, anonim sayfa görüntüleme verilerini toplamak için{" "}
            <strong>Vercel Analytics</strong> kullanır. Bu, hangi özelliklerin
            kullanıldığını ve sitenin doğru çalışıp çalışmadığını anlamaya yardımcı olur.
            Vercel Analytics şunları toplar:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
            <li>Ziyaret edilen sayfa URL&apos;si (örn. /webllm, /transformers)</li>
            <li>Yaklaşık ülke (şehir veya adres değil)</li>
            <li>Cihaz türü ve tarayıcı (örn. Chrome, masaüstü)</li>
            <li>Yönlendiren URL (nereden geldiğiniz)</li>
          </ul>
          <p>
            Vercel Analytics şunları <strong>toplamaz</strong>: adınızı, e-postanızı,
            IP adresinizi (karma alınır ve atılır), herhangi bir çıkarım içeriğini
            veya yapay zeka modellerine girdiğiniz verileri.
          </p>
        </div>
      ),
    },
    {
      icon: Cookie,
      titleEn: "Cookies",
      titleTr: "Çerezler",
      bodyEn: (
        <div className="space-y-3">
          <p>WebMind sets one first-party cookie:</p>
          <div className="bg-muted/40 rounded-xl p-4 border border-border/30">
            <p className="font-mono text-sm font-semibold mb-1">NEXT_LOCALE</p>
            <p className="text-sm text-muted-foreground">
              Stores your language preference (English or Turkish). Expires after 1 year.
              Contains no personal data — only the string &quot;en&quot; or &quot;tr&quot;.
            </p>
          </div>
          <p>
            No advertising cookies, tracking pixels, or third-party cookies are set by WebMind.
          </p>
        </div>
      ),
      bodyTr: (
        <div className="space-y-3">
          <p>WebMind bir birinci taraf çerezi ayarlar:</p>
          <div className="bg-muted/40 rounded-xl p-4 border border-border/30">
            <p className="font-mono text-sm font-semibold mb-1">NEXT_LOCALE</p>
            <p className="text-sm text-muted-foreground">
              Dil tercihinizi saklar (İngilizce veya Türkçe). 1 yıl sonra sona erer.
              Kişisel veri içermez — yalnızca &quot;en&quot; veya &quot;tr&quot; dizesini içerir.
            </p>
          </div>
          <p>
            WebMind tarafından reklam çerezi, izleme pikseli veya üçüncü taraf çerezi ayarlanmaz.
          </p>
        </div>
      ),
    },
    {
      icon: Eye,
      titleEn: "What We Cannot See",
      titleTr: "Göremediğimiz Şeyler",
      bodyEn: (
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
          <li>What you type into any AI model</li>
          <li>What responses the models generate for you</li>
          <li>Which model you downloaded or ran</li>
          <li>Any file or image you upload to vision/audio models</li>
          <li>Your GPU specs, VRAM, or hardware details</li>
          <li>Any conversation history (stored only in your browser memory, cleared on page reload)</li>
        </ul>
      ),
      bodyTr: (
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
          <li>Herhangi bir yapay zeka modeline yazdıklarınız</li>
          <li>Modellerin sizin için oluşturduğu yanıtlar</li>
          <li>İndirdiğiniz veya çalıştırdığınız model</li>
          <li>Görsel/ses modellerine yüklediğiniz dosya veya görüntüler</li>
          <li>GPU özellikleriniz, VRAM&apos;ınız veya donanım ayrıntılarınız</li>
          <li>Sohbet geçmişi (yalnızca tarayıcı belleğinizde saklanır, sayfa yenilendiğinde silinir)</li>
        </ul>
      ),
    },
    {
      icon: Code,
      titleEn: "Open Source Verification",
      titleTr: "Açık Kaynak Doğrulaması",
      bodyEn: (
        <p>
          WebMind is fully open source. You can inspect every line of code on{" "}
          <a
            href="https://github.com/atameralican"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
          . You can verify that no inference data is transmitted by opening
          DevTools → Network tab while using a model and confirming that only
          model weight files are downloaded — no requests carry your inputs or outputs.
        </p>
      ),
      bodyTr: (
        <p>
          WebMind tamamen açık kaynaklıdır. Her kod satırını{" "}
          <a
            href="https://github.com/atameralican"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            GitHub&apos;da
            <ExternalLink className="h-3 w-3" />
          </a>{" "}
          inceleyebilirsiniz. Hiçbir çıkarım verisinin iletilmediğini doğrulamak için
          bir model kullanırken DevTools → Ağ sekmesini açın ve yalnızca model ağırlık
          dosyalarının indirildiğini — hiçbir isteğin girdilerinizi veya çıktılarınızı
          taşımadığını — onaylayın.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
            {isTr ? "Gizlilik" : "Privacy"}
          </Badge>
          <h1 className="text-4xl font-extrabold mb-4 gradient-text">
            {isTr ? "Gizlilik Politikası" : "Privacy Policy"}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {isTr
              ? "WebMind, gizlilik ilkesi üzerine inşa edilmiştir. Yapay zeka modellerinizi çalıştırırken verilerinizin ne olduğu hakkında tam şeffaflık."
              : "WebMind is built on a privacy-first principle. Full transparency about what happens to your data when you run AI models."}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            {isTr ? "Son güncelleme: Haziran 2026" : "Last updated: June 2026"}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl space-y-12">
        {sections.map((section) => (
          <section key={section.titleEn}>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-4">
                  {isTr ? section.titleTr : section.titleEn}
                </h2>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {isTr ? section.bodyTr : section.bodyEn}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Contact / Questions */}
        <section className="border-t border-border/50 pt-12">
          <h2 className="text-xl font-bold mb-3">
            {isTr ? "Sorularınız mı var?" : "Questions?"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isTr
              ? "Gizlilik veya veri işleme hakkında sorularınız için GitHub üzerinden iletişime geçebilirsiniz."
              : "For questions about privacy or data handling, reach out via GitHub."}
          </p>
          <a
            href="https://github.com/atameralican"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            github.com/atameralican
          </a>
        </section>
      </div>
    </div>
  );
}
