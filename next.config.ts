import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// next-intl plugin'ini i18n request dosyasıyla bağla
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // WebLLM ve Transformers.js için WebAssembly desteği
  webpack: (config, { isServer }) => {
    // WASM dosyalarını doğru şekilde yükle
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Transformers.js için node modüllerini dışarıda bırak (sadece client'ta çalışır)
    if (isServer) {
      config.externals = [...(config.externals || []), "@mlc-ai/web-llm", "@huggingface/transformers"];
    }

    return config;
  },

  // Cross-Origin Isolation — WebGPU ve SharedArrayBuffer için zorunlu
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },

  // Resim optimizasyonu — next/image için
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);
