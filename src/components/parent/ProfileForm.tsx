"use client";

import { useId, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { Text } from "@/components/ui/Typography";
import {
  avatarIds,
  avatarLabels,
  ageBands,
  maxNicknameLength,
  type AgeBand,
  type AvatarId,
  type ChildProfile,
  type ProfileDraft,
} from "@/features/profiles/types";

/**
 * The one form for creating and editing a child profile.
 *
 * Three fields, and that is the whole of it: a nickname, an age band, and an
 * optional drawn avatar. There is deliberately nowhere to type a surname, an
 * email address, or a birthday — docs/PRIVACY_AND_SAFETY.md asks for the
 * minimum, and a form with no field for something collects it never.
 *
 * The avatar picker is a radio group rather than a set of toggle buttons,
 * because picking one of six is exactly what a radio group is for, and it
 * gives arrow-key navigation for free. "No picture" is a real option in the
 * group, not an absence — a child who wants their initial should be able to
 * choose that, and to change their mind back.
 */

export type ProfileFormProps = {
  /** Present when editing; absent when creating. */
  profile?: ChildProfile;
  submitLabel: string;
  onSubmit: (draft: ProfileDraft) => Promise<{ ok: boolean; reason?: string }>;
  onCancel?: () => void;
  /** Rendered under the nickname field; a place for the storage notice. */
  hint?: string;
};

const NO_AVATAR = "none";

export function ProfileForm({
  profile,
  submitLabel,
  onSubmit,
  onCancel,
  hint,
}: ProfileFormProps) {
  const nicknameId = useId();
  const ageGroupName = useId();
  const avatarGroupName = useId();

  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [ageBand, setAgeBand] = useState<AgeBand>(
    profile?.ageBand ?? ageBands[0] ?? "5–6",
  );
  const [avatarId, setAvatarId] = useState<AvatarId | null>(
    profile?.avatarId ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        void onSubmit({ nickname, ageBand, avatarId })
          .then((result) => {
            setError(
              result.ok
                ? null
                : (result.reason ?? "That did not save. Please try again."),
            );
          })
          .finally(() => setSubmitting(false));
      }}
    >
      <div>
        <label htmlFor={nicknameId} className="block font-semibold">
          Nickname
        </label>
        <Text tone="secondary" size="sm" className="mt-1 max-w-prose">
          {hint ??
            "A first name or nickname is all we store — no surname, no birthday, no email."}
        </Text>
        <input
          id={nicknameId}
          name="nickname"
          value={nickname}
          maxLength={maxNicknameLength}
          autoComplete="off"
          onChange={(event) => setNickname(event.target.value)}
          className="mt-3 w-full max-w-sm rounded-lg border border-border bg-surface px-4 py-2 text-base"
        />
      </div>

      <fieldset>
        <legend className="font-semibold">Age</legend>
        <Text tone="secondary" size="sm" className="mt-1">
          A band, not a birthday. It only shapes the reading level.
        </Text>
        <div className="mt-3 flex flex-wrap gap-3">
          {ageBands.map((band) => (
            <label
              key={band}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2"
            >
              <input
                type="radio"
                name={ageGroupName}
                value={band}
                checked={ageBand === band}
                onChange={() => setAgeBand(band)}
                className="h-auto w-auto min-h-0 min-w-0"
              />
              Ages {band}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold">Picture</legend>
        <Text tone="secondary" size="sm" className="mt-1">
          Optional, and drawn by us — there is no way to upload a photo.
        </Text>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
            <input
              type="radio"
              name={avatarGroupName}
              value={NO_AVATAR}
              checked={avatarId === null}
              onChange={() => setAvatarId(null)}
              className="h-auto w-auto min-h-0 min-w-0"
            />
            No picture
          </label>
          {avatarIds.map((id) => (
            <label
              key={id}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
            >
              <input
                type="radio"
                name={avatarGroupName}
                value={id}
                checked={avatarId === id}
                onChange={() => setAvatarId(id)}
                className="h-auto w-auto min-h-0 min-w-0"
              />
              <Avatar avatarId={id} size="sm" decorative />
              {avatarLabels[id]}
            </label>
          ))}
        </div>
      </fieldset>

      {error ? (
        <InlineFeedback tone="problem" title="That did not save">
          {error}
        </InlineFeedback>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={submitting}>
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
