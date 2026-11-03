import type { MetadataRoute } from "next";

const routes = [
  "", "/assignment-help", "/essay-help", "/dissertation", "/coursework", "/homework",
  "/proofreading-editing", "/programming-technical", "/order", "/reviews",
  "/about-us.html", "/contact_us.html", "/faqs.html", "/blog",
  "/terms-of-use", "/privacy-policy", "/revision-refund-policy", "/fair-use-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
