import { GlimBubble } from "@/components/character/GlimBubble";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Typography";

/**
 * The lesson loading screen (docs/design/COMPONENT_STATES.md §13).
 *
 * Glim rests by the door with its calm resting glow while the lesson arrives,
 * over skeleton bars of the layout that is coming. The friendly line is the one
 * thing announced — `role=status`, once — and the skeleton is hidden from
 * assistive tech, because reading out a row of grey boxes helps nobody
 * (docs/design/ACCESSIBILITY.md). Glim's `dim_rest` is a resting state, never a
 * comment on anything the child did.
 */
export function LessonLoading({
  label = "Getting your lesson ready…",
}: {
  label?: string;
}) {
  return (
    <PageContainer>
      <div className="flex flex-col items-center gap-4 text-center">
        <GlimBubble state="dim_rest" />
        <Text role="status" aria-live="polite" size="lg">
          {label}
        </Text>
      </div>
      {/* Hidden from assistive tech: the status line above is the announcement. */}
      <div className="mt-10" aria-hidden="true">
        <Skeleton variant="block" />
        <Skeleton variant="text" lines={3} className="mt-6" />
      </div>
    </PageContainer>
  );
}
