import type { ReactNode } from "react";
import { ParentNav } from "./ParentNav";

/**
 * Layout for the navigable parent surfaces (the dashboard and its sibling
 * sections).
 *
 * On phones the content flows full width with the section nav pinned to the
 * bottom; `pb-24` keeps the last content clear of the bar. From `tablet` up it
 * becomes the two-column layout the design calls for — a left rail beside the
 * content (docs/design/COMPONENT_STATES.md §4).
 *
 * The content keeps its own PageContainer, so this wrapper only owns the rail
 * and the column split. Onboarding does not use this wrapper, which is how it
 * stays nav-free.
 */
export function ParentSurface({ children }: { children: ReactNode }) {
  return (
    <div className="tablet:mx-auto tablet:flex tablet:max-w-6xl tablet:gap-4 tablet:px-4 tablet:py-8">
      <ParentNav />
      <div className="min-w-0 flex-1 pb-24 tablet:pb-0">{children}</div>
    </div>
  );
}
