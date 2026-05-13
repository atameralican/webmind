/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://actigravity-ai.vercel.app",
  generateRobotsTxt: true,
  // Tüm locale'ler için sitemap üret
  alternateRefs: [
    { href: "https://actigravity-ai.vercel.app", hreflang: "en" },
    { href: "https://actigravity-ai.vercel.app/tr", hreflang: "tr" },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      // API rotalarını ve dahili next rotalarını tara
      { userAgent: "*", disallow: ["/api/", "/_next/"] },
    ],
    additionalSitemaps: ["https://actigravity-ai.vercel.app/server-sitemap.xml"],
  },
  // Belirli sayfaları dışla
  exclude: ["/server-sitemap.xml"],
  // Öncelik ayarları
  transform: async (config, path) => {
    // Ana sayfa en yüksek öncelik
    const priority = path === "/" || path === "/tr" ? 1.0
      : path.includes("/webllm") || path.includes("/transformers") ? 0.9
      : 0.7;

    return {
      loc: path,
      changefreq: "weekly",
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
