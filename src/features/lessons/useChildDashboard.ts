"use client";

import { useMemo } from "react";
import { curriculumModules } from "@/content/modules";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { buildChildDashboard, type ChildDashboard } from "./childDashboard";
import { useProgress } from "./useProgress";

/**
 * One child's dashboard, across every world, derived from their progress.
 *
 * Builds on the shared `useProgress` loader, then derives the dashboard purely
 * on each render (cheap, and memoised on the loaded progress). It is `null`
 * until progress arrives, and a change of child yields `null` rather than the
 * previous child's figures. A `revision` bump after a write (a mission mark)
 * re-reads in place without blanking.
 */
export function useChildDashboard(
  profileId: string | null,
  revision = 0,
): ChildDashboard | null {
  const progress = useProgress(profileId, revision);

  return useMemo(() => {
    if (profileId === null || progress === null) return null;
    return buildChildDashboard(curriculumModules, getLessonBySlug, progress);
  }, [profileId, progress]);
}
