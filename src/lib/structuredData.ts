import type { FaqEntry } from "@/content/marketing/faq";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";

/**
 * schema.org objects for the public site.
 *
 * Built from the same values the pages render — the FAQ blocks come from the
 * array the FAQ section maps over — so structured data cannot drift into
 * describing a page that no longer exists. That drift is the usual way this
 * kind of markup turns into a lie.
 *
 * Nothing here asserts a rating, a review, a founding date, or an offer. Those
 * would be claims we cannot support, and search engines treat them as
 * statements of fact.
 */

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: absoluteUrl("/"),
    description: siteDescription,
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl("/"),
    description: siteDescription,
    inLanguage: "en-GB",
  };
}

export function faqJsonLd(
  entries: readonly FaqEntry[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}
