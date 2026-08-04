"use client";

import { useEffect, useReducer } from "react";
import { meetingPeopleModule } from "@/content/modules";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { buildChildDashboard, type ChildDashboard } from "./childDashboard";
import { readProfileProgress } from "./progressStorage";

/**
 * One child's dashboard, read from local storage after mount.
 *
 * Same pattern and same reason as `useModulePath`: reading storage during
 * render would make server and client markup disagree, so the answer is `null`
 * until the effect runs and callers show a loading state.
 *
 * `revision` is a caller-controlled refresh signal — bump it after writing
 * (marking a mission, resetting a profile) to re-read.
 */
export function useChildDashboard(
  profileId: string | null,
  revision = 0,
): ChildDashboard | null {
  const [dashboard, refresh] = useReducer(
    (_current: ChildDashboard | null, forProfileId: string | null) =>
      forProfileId === null
        ? null
        : buildChildDashboard(
            meetingPeopleModule,
            getLessonBySlug,
            readProfileProgress(forProfileId),
          ),
    null,
  );

  useEffect(() => {
    refresh(profileId);
  }, [profileId, revision]);

  return dashboard;
}
