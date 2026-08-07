"use client";

import { useMemo } from "react";
import { meetingPeopleModule, type CurriculumModule } from "@/content/modules";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { buildModulePath, type ModulePath } from "./moduleProgress";
import { useProgress } from "./useProgress";

/**
 * One child's path through a given module, derived from their progress.
 *
 * Defaults to Meeting People (Hello Garden) so the many existing call sites and
 * the `/learn` home need no argument; a per-world learning path passes the
 * module it is rendering. The path itself is pure and cheap to recompute, so it
 * is memoised on the child, the module, and the loaded progress rather than
 * being stored — a save re-reads in place, and a change of child yields `null`
 * (loading) rather than the previous child's path.
 */
export function useModulePath(
  profileId: string | null,
  module: CurriculumModule = meetingPeopleModule,
  revision = 0,
): ModulePath | null {
  const progress = useProgress(profileId, revision);

  return useMemo(() => {
    if (profileId === null || progress === null) return null;
    return buildModulePath(module, getLessonBySlug, progress);
  }, [profileId, module, progress]);
}
