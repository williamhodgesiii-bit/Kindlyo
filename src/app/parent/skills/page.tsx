import type { Metadata } from "next";
import { ParentSurface } from "@/components/nav/ParentSurface";
import { SkillsSection } from "@/components/parent/SkillsSection";

export const metadata: Metadata = {
  title: "Skills",
};

/**
 * The parent Skills section (COMPONENT_STATES.md §4/§7, §8): skill areas with
 * their status chips, and the "ready to review" list. A thin server shell over
 * the client section, which loads the child's data through the scoped family
 * client after mount.
 */
export default function SkillsPage() {
  return (
    <ParentSurface>
      <SkillsSection />
    </ParentSurface>
  );
}
