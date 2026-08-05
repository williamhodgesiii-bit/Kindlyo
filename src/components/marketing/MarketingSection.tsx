import type { ReactNode } from "react";
import { PageContainer, type PageWidth } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

/**
 * One band of a marketing page.
 *
 * Every section on the public site is labelled by its own heading, so somebody
 * navigating by landmark or by heading gets a usable outline of a long page
 * rather than one undifferentiated `main`.
 *
 * The tinted variant is a full-bleed background with the container inside it,
 * which is why the background sits on the `section` and not on the container:
 * a tint that stopped at the text measure would look like a mistake on a wide
 * screen. Tints stay to `surface-muted` and the sand tint — the design system
 * asks for calm, and a page of alternating brand colour is not that.
 */

export type SectionTone = "plain" | "muted" | "sand";

const tones = {
  plain: "",
  muted: "bg-surface-muted",
  sand: "bg-tint-sand",
} satisfies Record<SectionTone, string>;

export type MarketingSectionProps = {
  /** Referenced by `aria-labelledby`; must be unique on the page. */
  headingId: string;
  title: string;
  lead?: ReactNode;
  tone?: SectionTone;
  width?: PageWidth;
  className?: string;
  children?: ReactNode;
};

export function MarketingSection({
  headingId,
  title,
  lead,
  tone = "plain",
  width = "default",
  className,
  children,
}: MarketingSectionProps) {
  return (
    <section aria-labelledby={headingId} className={cn(tones[tone], className)}>
      <PageContainer width={width}>
        <Heading level={2} id={headingId} size="xl">
          {title}
        </Heading>
        {lead ? (
          <Text size="lg" tone="secondary" className="mt-4 max-w-prose">
            {lead}
          </Text>
        ) : null}
        {children}
      </PageContainer>
    </section>
  );
}
