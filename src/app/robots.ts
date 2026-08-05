import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Crawl rules.
 *
 * The public site is meant to be found. What is disallowed is the API surface
 * and the development-only component gallery, neither of which is a page for a
 * reader — `/dev/gallery` already returns 404 outside development, and this
 * simply stops crawlers asking.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dev/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
