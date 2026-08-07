import type { Metadata } from "next";
import { ParentSurface } from "@/components/nav/ParentSurface";
import { MissionsSection } from "@/components/parent/MissionsSection";

export const metadata: Metadata = {
  title: "Missions",
};

/**
 * The parent Missions section (COMPONENT_STATES.md §4/§6, §9): this week's
 * offline mission with the mark-practised toggle, and the conversation prompts.
 * A thin server shell over the client section, which loads the child's data
 * through the scoped family client after mount.
 */
export default function MissionsPage() {
  return (
    <ParentSurface>
      <MissionsSection />
    </ParentSurface>
  );
}
