"use client";

import { useEffect } from "react";
import { resetLegacyLocalData } from "@/features/families/resetLegacyLocalData";

/**
 * Runs the one-time reset of old browser-local prototype data after mount.
 *
 * Renders nothing. It lives in the root layout so it runs once on a browser's
 * first visit after the persistence slice ships, clearing the legacy profile
 * and progress keys (see `resetLegacyLocalData`). The marker it sets means every
 * later visit is a no-op.
 */
export function LegacyLocalDataReset() {
  useEffect(() => {
    resetLegacyLocalData();
  }, []);

  return null;
}
