import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  LessonProgressEntry,
  ProfileProgress,
} from "@/features/lessons/progressStorage";
import type { FamilyState } from "@/features/profiles/profileStorage";
import {
  isAvatarId,
  maxNicknameLength,
  maxProfiles,
  type AgeBand,
  type AvatarId,
  type ChildProfile,
} from "@/features/profiles/types";
import { env } from "@/lib/env";
import type { FamilyStore } from "./store";

/**
 * The real family store, on PostgreSQL through Supabase.
 *
 * Reached only when the database is configured (preview and production, and
 * local development that opts in). Like the Supabase auth gateway (decision
 * 033), this path is integration-level: it is covered by the types, the build,
 * and the `FamilyStore` interface its in-memory sibling is unit-tested against,
 * rather than by offline unit tests, because there is no database in CI.
 *
 * It uses the service-role key, so it is not itself bound by row-level
 * security — the scoping is `FamilyService`'s job and every query here is
 * filtered by the `familyId` (or an id already checked to belong to it) that
 * the service resolved from the authenticated parent. The RLS policies shipped
 * in the migration are the backstop for any other access path.
 */

type FamilyRow = {
  id: string;
  onboarded_at: string | null;
  selected_profile_id: string | null;
};

type ChildProfileRow = {
  id: string;
  nickname: string;
  age_band: string;
  avatar_id: string | null;
  created_at: string;
};

type LessonProgressRow = {
  lesson_id: string;
  run_lesson_version: number | null;
  run_step_index: number | null;
  run_choices: Record<string, string> | null;
  run_practice_option_id: string | null;
  run_completed_at: string | null;
  completed_lesson_version: number | null;
  completed_at: string | null;
  updated_at: string | null;
};

type MissionRow = { lesson_id: string };

function isAgeBand(value: string): value is AgeBand {
  return value === "5–6" || value === "7–9";
}

function toChildProfile(row: ChildProfileRow): ChildProfile {
  const profile: ChildProfile = {
    id: row.id,
    nickname: row.nickname,
    ageBand: isAgeBand(row.age_band) ? row.age_band : "5–6",
    createdAt: row.created_at,
  };
  if (isAvatarId(row.avatar_id)) profile.avatarId = row.avatar_id;
  return profile;
}

function cleanNickname(nickname: string): string | null {
  const trimmed = nickname.trim().slice(0, maxNicknameLength);
  return trimmed === "" ? null : trimmed;
}

function toProfileProgress(
  rows: LessonProgressRow[],
  missionRows: MissionRow[],
): ProfileProgress {
  const missions = new Set(missionRows.map((row) => row.lesson_id));
  const progress: ProfileProgress = {};

  for (const row of rows) {
    const entry: LessonProgressEntry = {};
    if (row.run_lesson_version !== null && row.run_step_index !== null) {
      entry.run = {
        lessonVersion: row.run_lesson_version,
        state: {
          stepIndex: row.run_step_index,
          choiceBySceneId: row.run_choices ?? {},
          practiceOptionId: row.run_practice_option_id,
          completedAt: row.run_completed_at,
        },
      };
    }
    if (row.completed_lesson_version !== null && row.completed_at !== null) {
      entry.completion = {
        lessonVersion: row.completed_lesson_version,
        completedAt: row.completed_at,
      };
    }
    if (missions.has(row.lesson_id)) entry.missionStatus = "done";
    if (row.updated_at !== null) entry.updatedAt = row.updated_at;
    if (Object.keys(entry).length > 0) progress[row.lesson_id] = entry;
  }

  // A mission marked before any run leaves no progress row; keep it visible.
  for (const lessonId of missions) {
    if (!(lessonId in progress)) progress[lessonId] = { missionStatus: "done" };
  }

  return progress;
}

export function createPostgresFamilyStore(): FamilyStore {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (url === null || key === null) {
    throw new Error("The database is not configured.");
  }

  const db: SupabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  async function getFamilyRow(familyId: string): Promise<FamilyRow | null> {
    const { data, error } = await db
      .from("families")
      .select("id, onboarded_at, selected_profile_id")
      .eq("id", familyId)
      .maybeSingle();
    if (error !== null) throw new Error(error.message);
    return (data as FamilyRow | null) ?? null;
  }

  async function readFamily(familyId: string): Promise<FamilyState> {
    const family = await getFamilyRow(familyId);
    const { data, error } = await db
      .from("child_profiles")
      .select("id, nickname, age_band, avatar_id, created_at")
      .eq("family_id", familyId)
      .order("created_at", { ascending: true });
    if (error !== null) throw new Error(error.message);

    const profiles = (data as ChildProfileRow[] | null) ?? [];
    return {
      profiles: profiles.map(toChildProfile),
      selectedProfileId: family?.selected_profile_id ?? null,
      onboardedAt: family?.onboarded_at ?? null,
    };
  }

  async function countProfiles(familyId: string): Promise<number> {
    const { count, error } = await db
      .from("child_profiles")
      .select("id", { count: "exact", head: true })
      .eq("family_id", familyId);
    if (error !== null) throw new Error(error.message);
    return count ?? 0;
  }

  return {
    async ensureFamily(userId) {
      const existing = await db
        .from("family_memberships")
        .select("family_id")
        .eq("user_id", userId)
        .maybeSingle();
      if (existing.error !== null) throw new Error(existing.error.message);
      const found = existing.data as { family_id: string } | null;
      if (found !== null) return found.family_id;

      const created = await db
        .from("families")
        .insert({})
        .select("id")
        .single();
      if (created.error !== null) throw new Error(created.error.message);
      const familyId = (created.data as { id: string }).id;

      const membership = await db
        .from("family_memberships")
        .insert({ family_id: familyId, user_id: userId, role: "owner" });
      if (membership.error !== null) {
        // A concurrent first request may have won the unique(user_id) race;
        // fall back to whatever landed rather than failing the request.
        const retry = await db
          .from("family_memberships")
          .select("family_id")
          .eq("user_id", userId)
          .maybeSingle();
        const settled = retry.data as { family_id: string } | null;
        if (settled !== null) return settled.family_id;
        throw new Error(membership.error.message);
      }
      return familyId;
    },

    getFamily(familyId) {
      return readFamily(familyId);
    },

    async profileExists(familyId, profileId) {
      const { data, error } = await db
        .from("child_profiles")
        .select("id")
        .eq("id", profileId)
        .eq("family_id", familyId)
        .maybeSingle();
      if (error !== null) throw new Error(error.message);
      return data !== null;
    },

    async createProfile(familyId, draft) {
      const nickname = cleanNickname(draft.nickname);
      if (nickname === null) return { ok: false, reason: "empty-nickname" };
      if ((await countProfiles(familyId)) >= maxProfiles) {
        return { ok: false, reason: "limit" };
      }

      const avatarId: AvatarId | null =
        draft.avatarId != null && isAvatarId(draft.avatarId)
          ? draft.avatarId
          : null;

      const { data, error } = await db
        .from("child_profiles")
        .insert({
          family_id: familyId,
          nickname,
          age_band: draft.ageBand,
          avatar_id: avatarId,
        })
        .select("id, nickname, age_band, avatar_id, created_at")
        .single();
      if (error !== null) throw new Error(error.message);

      return {
        ok: true,
        state: await readFamily(familyId),
        profile: toChildProfile(data as ChildProfileRow),
      };
    },

    async updateProfile(familyId, profileId, draft) {
      const patch: Record<string, string | null> = {};
      if (draft.nickname !== undefined) {
        const nickname = cleanNickname(draft.nickname);
        if (nickname === null) return { ok: false, reason: "empty-nickname" };
        patch.nickname = nickname;
      }
      if (draft.ageBand !== undefined) patch.age_band = draft.ageBand;
      if (draft.avatarId !== undefined) {
        patch.avatar_id =
          draft.avatarId != null && isAvatarId(draft.avatarId)
            ? draft.avatarId
            : null;
      }

      const { data, error } = await db
        .from("child_profiles")
        .update(patch)
        .eq("id", profileId)
        .eq("family_id", familyId)
        .select("id, nickname, age_band, avatar_id, created_at")
        .maybeSingle();
      if (error !== null) throw new Error(error.message);
      if (data === null) return { ok: false, reason: "not-found" };

      return {
        ok: true,
        state: await readFamily(familyId),
        profile: toChildProfile(data as ChildProfileRow),
      };
    },

    async deleteProfile(familyId, profileId) {
      // Progress and missions cascade away via ON DELETE CASCADE, and the
      // family's selection clears via ON DELETE SET NULL.
      const { error } = await db
        .from("child_profiles")
        .delete()
        .eq("id", profileId)
        .eq("family_id", familyId);
      if (error !== null) throw new Error(error.message);
      return readFamily(familyId);
    },

    async selectProfile(familyId, profileId) {
      const { error } = await db
        .from("families")
        .update({ selected_profile_id: profileId })
        .eq("id", familyId);
      if (error !== null) throw new Error(error.message);
      return readFamily(familyId);
    },

    async completeOnboarding(familyId) {
      const { error } = await db
        .from("families")
        .update({ onboarded_at: new Date().toISOString() })
        .eq("id", familyId)
        .is("onboarded_at", null);
      if (error !== null) throw new Error(error.message);
      return readFamily(familyId);
    },

    async getProgress(_familyId, profileId) {
      const progress = await db
        .from("lesson_progress")
        .select(
          "lesson_id, run_lesson_version, run_step_index, run_choices, run_practice_option_id, run_completed_at, completed_lesson_version, completed_at, updated_at",
        )
        .eq("child_profile_id", profileId);
      if (progress.error !== null) throw new Error(progress.error.message);

      const missions = await db
        .from("mission_completions")
        .select("lesson_id")
        .eq("child_profile_id", profileId);
      if (missions.error !== null) throw new Error(missions.error.message);

      return toProfileProgress(
        (progress.data as LessonProgressRow[] | null) ?? [],
        (missions.data as MissionRow[] | null) ?? [],
      );
    },

    async saveRun(_familyId, profileId, lessonId, lessonVersion, state) {
      const { error } = await db.from("lesson_progress").upsert(
        {
          child_profile_id: profileId,
          lesson_id: lessonId,
          run_lesson_version: lessonVersion,
          run_step_index: state.stepIndex,
          run_choices: state.choiceBySceneId,
          run_practice_option_id: state.practiceOptionId,
          run_completed_at: state.completedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "child_profile_id,lesson_id" },
      );
      if (error !== null) throw new Error(error.message);
    },

    async clearRun(_familyId, profileId, lessonId) {
      const { error } = await db
        .from("lesson_progress")
        .update({
          run_lesson_version: null,
          run_step_index: null,
          run_choices: {},
          run_practice_option_id: null,
          run_completed_at: null,
        })
        .eq("child_profile_id", profileId)
        .eq("lesson_id", lessonId);
      if (error !== null) throw new Error(error.message);
    },

    async recordCompletion(
      _familyId,
      profileId,
      lessonId,
      lessonVersion,
      completedAt,
    ) {
      // First completion wins; a replay only moves the activity clock.
      const existing = await db
        .from("lesson_progress")
        .select("completed_at")
        .eq("child_profile_id", profileId)
        .eq("lesson_id", lessonId)
        .maybeSingle();
      if (existing.error !== null) throw new Error(existing.error.message);
      const already = existing.data as { completed_at: string | null } | null;
      const alreadyCompleted = already?.completed_at != null;

      const { error } = await db.from("lesson_progress").upsert(
        {
          child_profile_id: profileId,
          lesson_id: lessonId,
          completed_lesson_version: alreadyCompleted
            ? undefined
            : lessonVersion,
          completed_at: alreadyCompleted ? undefined : completedAt,
          updated_at: completedAt,
        },
        { onConflict: "child_profile_id,lesson_id" },
      );
      if (error !== null) throw new Error(error.message);
    },

    async setMissionStatus(_familyId, profileId, lessonId, status, markedBy) {
      if (status === null) {
        const { error } = await db
          .from("mission_completions")
          .delete()
          .eq("child_profile_id", profileId)
          .eq("lesson_id", lessonId);
        if (error !== null) throw new Error(error.message);
        return;
      }
      const { error } = await db.from("mission_completions").upsert(
        {
          child_profile_id: profileId,
          lesson_id: lessonId,
          marked_by_user_id: markedBy,
        },
        { onConflict: "child_profile_id,lesson_id" },
      );
      if (error !== null) throw new Error(error.message);
    },

    async resetProgress(_familyId, profileId) {
      const progress = await db
        .from("lesson_progress")
        .delete()
        .eq("child_profile_id", profileId);
      if (progress.error !== null) throw new Error(progress.error.message);
      const missions = await db
        .from("mission_completions")
        .delete()
        .eq("child_profile_id", profileId);
      if (missions.error !== null) throw new Error(missions.error.message);
    },

    async deleteFamily(familyId) {
      // One delete does it all: family_memberships, child_profiles (and their
      // lesson_progress and mission_completions), and family_subscriptions all
      // reference families with ON DELETE CASCADE (migrations 0001/0002), so the
      // whole account goes with the row.
      const { error } = await db.from("families").delete().eq("id", familyId);
      if (error !== null) throw new Error(error.message);
    },
  };
}
