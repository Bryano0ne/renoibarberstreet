import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://renoi-citybarber.com";

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/reserver`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/prestations`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/nos-salons`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/equipe`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/galerie`, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/avis`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/cadeaux`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
