"use client";

import { useEffect, useState } from "react";
import { meetingPeopleModule } from "@/content/modules";
import { getFamilyClient } from "@/features/families/familyClient";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { buildModulePath, type ModulePath } from "./moduleProgress";

/**
 * One child's module path, loaded from the server after mount.
 *
 * Progress is fetched in an effect rather than read during render, the same
 * reason as before (server and client markup must agree) plus the round-trip.
 * Until it arrives the answer is `null`, which callers show as a loading state.
 *
 * `revision` is a caller-controlled refresh signal: bump it after a write
 * (marking a mission, resetting a profile) to re-fetch. A revision bump does
 * not blank the current path first, so a save re-reads in place without a
 * flash; only a change of child clears it, so one child's path never lingers
 * under another's name.
 */
export function useModulePath(
  profileId: string | null,
  revision = 0,
): ModulePath | null {
  const [loaded, setLoaded] = useState<{
    forProfileId: string;
    path: ModulePath;
  } | null>(null);

  useEffect(() => {
    if (profileId === null) return;
    let active = true;
    void getFamilyClient()
      .loadProgress(profileId)
      .then((progress) => {
        if (active) {
          setLoaded({
            forProfileId: profileId,
            path: buildModulePath(
              meetingPeopleModule,
              getLessonBySlug,
              progress,
            ),
          });
        }
      });
    return () => {
      active = false;
    };
  }, [profileId, revision]);

  if (profileId === null) return null;
  // Tie the loaded path to the child it belongs to: while a new child's path is
  // loading, the previous child's must not linger under their name. A revision
  // bump keeps the same child, so a re-fetch shows in place without a flash.
  return loaded !== null && loaded.forProfileId === profileId
    ? loaded.path
    : null;
}
