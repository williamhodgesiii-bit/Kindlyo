"use client";

import { Text } from "@/components/ui/Typography";
import { getFamilyClient } from "@/features/families/familyClient";
import { CurrentMission, TalkingPoints } from "./ChildDashboardPanels";
import { ParentChildSection } from "./ParentChildSection";

/**
 * The Missions section (COMPONENT_STATES.md §4/§6, §9).
 *
 * This week's offline mission to try together, with the mark-practised toggle
 * and the lesson's own "prompt for afterwards", plus the "worth talking about"
 * moments — choices whose outcome depended on the situation, framed as
 * conversation starters, never as corrections. Marking a mission is not scored
 * and not timed; it is a note that it happened.
 */
export function MissionsSection() {
  return (
    <ParentChildSection
      title="Missions"
      intro={
        <Text size="lg" tone="secondary" className="mt-4 max-w-prose">
          This week&rsquo;s real-world mission to try together, and a gentle
          prompt for afterwards. Mark it practised whenever it happens — there
          is no timer, and nothing is scored.
        </Text>
      }
    >
      {({ dashboard, profile, onChanged }) => (
        <div className="mt-8 grid gap-8">
          <CurrentMission
            dashboard={dashboard}
            headingLevel={2}
            onToggle={async (lessonId, done) => {
              await getFamilyClient().setMissionStatus(
                profile.id,
                lessonId,
                done ? null : "done",
              );
              onChanged();
            }}
          />
          <TalkingPoints dashboard={dashboard} headingLevel={2} />
        </div>
      )}
    </ParentChildSection>
  );
}
