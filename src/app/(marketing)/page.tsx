import type { Metadata } from "next";
import Link from "next/link";
import { HeroScene } from "@/components/marketing/HeroScene";
import { JsonLd } from "@/components/marketing/JsonLd";
import { SampleScenarioSection } from "@/components/marketing/SampleScenarioSection";
import { ButtonLink } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { pageMetadata } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/structuredData";

/**
 * The public homepage.
 *
 * Kept deliberately short — a hero, one real playable lesson, and a quiet way
 * into the product — rather than a long scroll of feature cards. It shows the
 * thing instead of describing it: the sample below is a real lesson rendered by
 * the real lesson components, not a mock-up. The detail (curriculum, safety,
 * pricing, parents) lives on its own pages, reached from the header and footer.
 *
 * The one hard rule still holds every line: nothing here claims a result we
 * cannot support — no testimonials, no user counts, no implied expert review.
 */

export const metadata: Metadata = pageMetadata({
  title: "Little Learner's Club",
  absoluteTitle:
    "Little Learner's Club — social skills practice for children ages 5 to 9",
  description:
    "Practice makes kind. A little club where children ages 5 to 9 rehearse everyday social moments through short, story-based lessons — then try one for real. Private beta.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      <section aria-labelledby="hero-heading">
        <PageContainer className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <div className="max-w-xl">
              <p className="inline-flex items-center rounded-round bg-tint-honey px-3 py-1 text-sm font-semibold text-ink">
                A social-skills club · ages 5–9
              </p>

              <Heading
                level={1}
                size="display"
                id="hero-heading"
                className="mt-6 font-display leading-[1.05]"
              >
                Practice makes{" "}
                <span className="relative inline-block whitespace-nowrap text-brand-primary-strong">
                  kind.
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 240 16"
                    preserveAspectRatio="none"
                    fill="none"
                    className="absolute -bottom-1 left-0 h-2.5 w-full text-brand-primary"
                  >
                    <path
                      d="M4 10C64 3 132 3 196 7c18 1 30 2 40 1"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </Heading>

              <Text size="lg" tone="secondary" className="mt-6">
                A little club where children five to nine rehearse the tricky
                social moments — five minutes at a time, then one small thing to
                try for real.
              </Text>

              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="#sample-heading" size="lg">
                  Try a lesson
                </ButtonLink>
                <ButtonLink href="/waitlist" variant="secondary" size="lg">
                  Join the club
                </ButtonLink>
              </div>
            </div>

            {/* Decorative — the copy carries the whole message. */}
            <HeroScene className="mx-auto w-full max-w-md lg:max-w-none" />
          </div>
        </PageContainer>
      </section>

      <SampleScenarioSection headingId="sample-heading" tone="muted" />

      {/* A quiet way straight into the live product; the detail pages sit in the
          header and footer. */}
      <section
        aria-labelledby="peek-heading"
        className="border-t border-border"
      >
        <PageContainer className="flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Heading
            level={2}
            size="sm"
            id="peek-heading"
            className="font-display"
          >
            Rather look around yourself?
          </Heading>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/learn"
              className="font-semibold text-brand-primary-strong underline-offset-4 hover:underline"
            >
              Open the learning app →
            </Link>
            <Link
              href="/parent"
              className="font-semibold text-brand-primary-strong underline-offset-4 hover:underline"
            >
              Peek at the parent dashboard →
            </Link>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
