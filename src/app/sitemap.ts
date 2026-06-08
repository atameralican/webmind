import { MetadataRoute } from "next";

const BASE_URL = "https://webmind-ai.vercel.app";
const LAST_MODIFIED = new Date();

type PageConfig = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

// All crawlable pages, including Turkish (/tr) alternates.
// x-default hreflang tells Google which URL to show for unmatched locales.
const pages: PageConfig[] = [
  { path: "",           priority: 1.0, changeFrequency: "weekly"  },
  { path: "/webllm",   priority: 0.9, changeFrequency: "weekly"  },
  { path: "/transformers", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about",    priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy",  priority: 0.4, changeFrequency: "yearly"  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        "x-default": `${BASE_URL}${path}`,
        en: `${BASE_URL}${path}`,
        tr: `${BASE_URL}/tr${path}`,
      },
    },
  }));
}
