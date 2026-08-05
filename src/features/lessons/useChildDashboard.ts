"use client";

import { useEffect, useState } from "react";
import { meetingPeopleModule } from "@/content/modules";
import { getFamilyClient } from "@/features/families/familyClient";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { buildChildDashboard, type ChildDashboard } from "./childDashboard";

/**
 * One child's dashboard, loaded from the server after mount.
 *
 * Same pattern and same reasons as `useModulePath`: fetched in an effect, `null`
 * until it arrives, and re-fetched (without blanking first) when `revision` is
 * bumped after a write. A change of child does blank it, so no sibling's
 * figures ever show under the wrong name.
 */
export function useChildDashboard(
  profileId: string | null,
  revision = 0,
): ChildDashboard | null {
  const [loaded, setLoaded] = useState<{
    forProfileId: string;
    dashboard: ChildDashboard;
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
            dashboard: buildChildDashboard(
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
  // Tie the loaded dashboard to the child it describes, so no sibling's figures
  // ever show under the wrong name while a switch is loading. A revision bump
  // keeps the same child, so a re-read (after a mission mark) shows in place.
  return loaded !== null && loaded.forProfileId === profileId
    ? loaded.dashboard
    : null;
}
