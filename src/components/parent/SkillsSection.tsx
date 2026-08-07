"use client";

import { Text } from "@/components/ui/Typography";
import { ReadyToReview, SkillAreaSummary } from "./ChildDashboardPanels";
import { ParentChildSection } from "./ParentChildSection";

/**
 * The Skills section (COMPONENT_STATES.md §4/§7, §8).
 *
 * Skill areas with their status chips — describing the lessons, never the child,
 * and never a score — and the "ready to review" list of lessons already been
 * through once, where going back is encouraged and never re-locks anything.
 */
export function SkillsSection() {
  return (
    <ParentChildSection
      title="Skills"
      intro={
        <Text size="lg" tone="secondary" className="mt-4 max-w-prose">
          The skill areas your child has been exploring, described by the
          lessons rather than as a score — and the ones that are ready for
          another look.
        </Text>
      }
    >
      {({ dashboard }) => (
        <div className="mt-8 grid gap-8">
          <SkillAreaSummary dashboard={dashboard} headingLevel={2} />
          <ReadyToReview dashboard={dashboard} headingLevel={2} />
        </div>
      )}
    </ParentChildSection>
  );
}
