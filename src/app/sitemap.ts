import type { MetadataRoute } from "next";

const SITE = "https://edu-board-results.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/how-to-check/", "/boards/", "/faq/", "/about/", "/contact/", "/privacy/"];
  const now = new Date();
  return routes.map((r) => ({
    url: `${SITE}${r}`,
    lastModified: now,
    changeFrequency: r === "" ? "daily" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
