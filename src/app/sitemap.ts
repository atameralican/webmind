import { MetadataRoute } from "next";

const BASE_URL = "https://webmind-ai.vercel.app";
const LAST_MODIFIED = new Date();

type PageConfig = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const pages: PageConfig[] = [
  { path: "",               priority: 1.0, changeFrequency: "weekly"  },
  { path: "/webllm",        priority: 0.9, changeFrequency: "weekly"  },
  { path: "/transformers",  priority: 0.9, changeFrequency: "weekly"  },
  { path: "/about",         priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy",       priority: 0.4, changeFrequency: "yearly"  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const enEntries = pages.map(({ path, priority, changeFrequency }) => ({
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

  // Turkish pages as standalone <url> entries — Google prefers explicit locale
  // URLs over alternates-only entries for bilingual sites.
  const trEntries = pages.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}/tr${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority: priority * 0.9,
    alternates: {
      languages: {
        "x-default": `${BASE_URL}${path}`,
        en: `${BASE_URL}${path}`,
        tr: `${BASE_URL}/tr${path}`,
      },
    },
  }));

  return [...enEntries, ...trEntries];
}
