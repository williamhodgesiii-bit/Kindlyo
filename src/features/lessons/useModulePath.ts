"use client";

import { useEffect, useReducer } from "react";
import { meetingPeopleModule } from "@/content/modules";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { buildModulePath, type ModulePath } from "./moduleProgress";
import { readProfileProgress } from "./progressStorage";

/**
 * One child's module path, read from local storage after mount.
 *
 * Storage is read in an effect rather than during render, for the same reason
 * as `useLessonRun`: reading it while rendering would make the server and
 * client markup disagree. Until the read happens the answer is `null`, which
 * callers show as a loading state.
 *
 * `revision` is a caller-controlled refresh signal: bump it after writing
 * progress (marking a mission, resetting a profile) to re-read. Local storage
 * has no change notification worth subscribing to within one document, so the
 * writer says when.
 */
export function useModulePath(
  profileId: string | null,
  revision = 0,
): ModulePath | null {
  const [path, refresh] = useReducer(
    (_current: ModulePath | null, forProfileId: string | null) =>
      forProfileId === null
        ? null
        : buildModulePath(
            meetingPeopleModule,
            getLessonBySlug,
            readProfileProgress(forProfileId),
          ),
    null,
  );

  useEffect(() => {
    refresh(profileId);
  }, [profileId, revision]);

  return path;
}
