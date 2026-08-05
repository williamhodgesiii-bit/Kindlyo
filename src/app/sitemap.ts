import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * The public routes, and only those.
 *
 * Lesson routes are deliberately absent. Every lesson is draft content and its
 * page already sets `robots: { index: false }`, so listing it here would ask
 * search engines to index a page we have told them not to.
 *
 * `/learn` and `/parent` are absent for a different reason: they are prototype
 * surfaces backed by local storage rather than an account, and a search result
 * pointing at them would set an expectation the product cannot meet yet.
 */

const routes = [
  { path: "/", priority: 1 },
  { path: "/how-it-works", priority: 0.8 },
  { path: "/curriculum", priority: 0.8 },
  { path: "/for-parents", priority: 0.8 },
  { path: "/safety", priority: 0.7 },
  { path: "/pricing", priority: 0.6 },
  { path: "/waitlist", priority: 0.9 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
