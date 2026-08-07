"use client";

import { useEffect, useState } from "react";
import { getFamilyClient } from "@/features/families/familyClient";
import type { ProfileProgress } from "./progressStorage";

/**
 * One child's raw progress, loaded from the server after mount.
 *
 * The single source the child-facing views derive from — the module path, the
 * neighborhood map, and the parent dashboard all build on top of this, so the
 * load-and-tie-to-child dance lives in one place instead of three.
 *
 * Progress is fetched in an effect rather than read during render (server and
 * client markup must agree, plus the round-trip), so it is `null` until it
 * arrives; callers show that as a loading state. `revision` is a caller-
 * controlled refresh signal: bump it after a write to re-fetch without blanking
 * the current value first. A change of child does clear it, so one child's
 * progress never lingers under another's name.
 */
export function useProgress(
  profileId: string | null,
  revision = 0,
): ProfileProgress | null {
  const [loaded, setLoaded] = useState<{
    forProfileId: string;
    progress: ProfileProgress;
  } | null>(null);

  useEffect(() => {
    if (profileId === null) return;
    let active = true;
    void getFamilyClient()
      .loadProgress(profileId)
      .then((progress) => {
        if (active) setLoaded({ forProfileId: profileId, progress });
      });
    return () => {
      active = false;
    };
  }, [profileId, revision]);

  if (profileId === null) return null;
  return loaded !== null && loaded.forProfileId === profileId
    ? loaded.progress
    : null;
}
