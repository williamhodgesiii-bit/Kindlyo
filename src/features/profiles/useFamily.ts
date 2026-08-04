"use client";

import { useCallback, useEffect, useReducer } from "react";
import { resetProfileProgress } from "@/features/lessons/progressStorage";
import {
  completeOnboarding,
  createProfile,
  deleteProfile,
  emptyFamilyState,
  readFamilyState,
  selectProfile,
  updateProfile,
  type FamilyState,
  type ProfileWriteResult,
} from "./profileStorage";
import type { ChildProfile, ProfileDraft } from "./types";

/**
 * Client access to the local prototype child profiles.
 *
 * Same hydration pattern as `useLessonRun`: storage is read after mount via a
 * single reducer transition, and `hydrated` stays false until then, so server
 * and client markup never disagree and a page can show a loading state instead
 * of flashing "no profiles".
 *
 * Each page root uses this hook and passes data down as props. There is no
 * context provider on purpose: the two surfaces that need profiles (`/learn`,
 * `/parent`) are separate routes with separate roots, and a provider would be
 * machinery without a second consumer.
 */

type State = { family: FamilyState; hydrated: boolean };

type Action =
  | { type: "hydrate"; family: FamilyState }
  | { type: "set"; family: FamilyState };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return state.hydrated ? state : { family: action.family, hydrated: true };
    case "set":
      return { ...state, family: action.family };
  }
}

export type Family = {
  hydrated: boolean;
  profiles: readonly ChildProfile[];
  selectedProfile: ChildProfile | null;
  /** False until the parent has been through onboarding once. */
  onboarded: boolean;
  create: (draft: ProfileDraft) => ProfileWriteResult;
  update: (
    profileId: string,
    draft: Partial<ProfileDraft>,
  ) => ProfileWriteResult;
  select: (profileId: string | null) => void;
  /** Removes the profile AND its lesson progress. */
  remove: (profileId: string) => void;
  /** Clears the profile's lesson progress, keeping the profile. */
  resetProgress: (profileId: string) => void;
  finishOnboarding: () => void;
};

export function useFamily(): Family {
  const [state, dispatch] = useReducer(reducer, {
    family: emptyFamilyState,
    hydrated: false,
  });

  useEffect(() => {
    dispatch({ type: "hydrate", family: readFamilyState() });
  }, []);

  const create = useCallback((draft: ProfileDraft): ProfileWriteResult => {
    const result = createProfile(draft);
    if (result.ok) dispatch({ type: "set", family: result.state });
    return result;
  }, []);

  const update = useCallback(
    (profileId: string, draft: Partial<ProfileDraft>): ProfileWriteResult => {
      const result = updateProfile(profileId, draft);
      if (result.ok) dispatch({ type: "set", family: result.state });
      return result;
    },
    [],
  );

  const select = useCallback((profileId: string | null) => {
    dispatch({ type: "set", family: selectProfile(profileId) });
  }, []);

  const remove = useCallback((profileId: string) => {
    // Progress goes with the profile: an orphaned progress node would be
    // exactly the stale data this store promises to never resurrect.
    resetProfileProgress(profileId);
    dispatch({ type: "set", family: deleteProfile(profileId) });
  }, []);

  const resetProgress = useCallback((profileId: string) => {
    resetProfileProgress(profileId);
  }, []);

  const finishOnboarding = useCallback(() => {
    dispatch({ type: "set", family: completeOnboarding() });
  }, []);

  const selectedProfile =
    state.family.profiles.find(
      (profile) => profile.id === state.family.selectedProfileId,
    ) ?? null;

  return {
    hydrated: state.hydrated,
    profiles: state.family.profiles,
    selectedProfile,
    onboarded: state.family.onboardedAt !== null,
    create,
    update,
    select,
    remove,
    resetProgress,
    finishOnboarding,
  };
}
