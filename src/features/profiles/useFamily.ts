"use client";

import { useCallback, useEffect, useReducer } from "react";
import { getFamilyClient } from "@/features/families/familyClient";
import {
  emptyFamilyState,
  type FamilyState,
  type ProfileWriteResult,
} from "./profileStorage";
import type { ChildProfile, ProfileDraft } from "./types";

/**
 * Client access to the signed-in parent's family.
 *
 * The data now lives in the database and is reached over the family client
 * (`src/features/families`), not in this browser's local storage — but the
 * hydration pattern is unchanged: the family is loaded after mount, `hydrated`
 * stays false until it arrives, and a page shows a loading state rather than
 * flashing "no profiles" (before, that guarded server/client markup agreement;
 * now it also covers the round-trip). Every mutation goes through the client,
 * which is scoped on the server to this parent, and the resulting family state
 * is dispatched back so the UI stays in step.
 *
 * There is no context provider on purpose: the two surfaces that need profiles
 * (`/learn`, `/parent`) are separate routes with separate roots, and a provider
 * would be machinery without a second consumer.
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
  create: (draft: ProfileDraft) => Promise<ProfileWriteResult>;
  update: (
    profileId: string,
    draft: Partial<ProfileDraft>,
  ) => Promise<ProfileWriteResult>;
  select: (profileId: string | null) => void;
  /** Removes the profile AND its lesson progress (a database cascade). */
  remove: (profileId: string) => Promise<void>;
  /** Clears the profile's lesson progress, keeping the profile. */
  resetProgress: (profileId: string) => Promise<void>;
  finishOnboarding: () => void;
};

export function useFamily(): Family {
  const [state, dispatch] = useReducer(reducer, {
    family: emptyFamilyState,
    hydrated: false,
  });

  useEffect(() => {
    let active = true;
    void getFamilyClient()
      .loadFamily()
      .then((family) => {
        if (active) dispatch({ type: "hydrate", family });
      });
    return () => {
      active = false;
    };
  }, []);

  const create = useCallback(
    async (draft: ProfileDraft): Promise<ProfileWriteResult> => {
      const result = await getFamilyClient().createProfile(draft);
      if (result.ok) dispatch({ type: "set", family: result.state });
      return result;
    },
    [],
  );

  const update = useCallback(
    async (
      profileId: string,
      draft: Partial<ProfileDraft>,
    ): Promise<ProfileWriteResult> => {
      const result = await getFamilyClient().updateProfile(profileId, draft);
      if (result.ok) dispatch({ type: "set", family: result.state });
      return result;
    },
    [],
  );

  const select = useCallback((profileId: string | null) => {
    void getFamilyClient()
      .selectProfile(profileId)
      .then((family) => dispatch({ type: "set", family }));
  }, []);

  const remove = useCallback(async (profileId: string): Promise<void> => {
    // Progress cascades away with the profile on the server; the returned
    // family already omits it.
    const family = await getFamilyClient().deleteProfile(profileId);
    dispatch({ type: "set", family });
  }, []);

  const resetProgress = useCallback(
    (profileId: string): Promise<void> =>
      getFamilyClient().resetProgress(profileId),
    [],
  );

  const finishOnboarding = useCallback(() => {
    void getFamilyClient()
      .completeOnboarding()
      .then((family) => dispatch({ type: "set", family }));
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
