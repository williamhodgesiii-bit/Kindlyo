"use client";

import { useId, useState } from "react";
import { parseNewPassword } from "@/features/auth/validate";
import { minPasswordLength } from "@/features/auth/types";
import { Button } from "@/components/ui/Button";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { LabeledInput } from "./LabeledInput";
import { navigateTo } from "./navigate";
import { dataString, postAuth } from "./postAuth";

/**
 * Set a new password.
 *
 * Reached from the reset link, where `/auth/confirm` has already established a
 * short-lived recovery session. The two fields must match (checked here, on the
 * client) and the new password must meet the length rule (checked here and again
 * on the server). On success the parent is signed in and sent to their area.
 */

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; issues: string[] };

export function ResetPasswordForm() {
  const passwordId = useId();
  const confirmId = useId();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const submitting = status.kind === "submitting";

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (submitting) return;

        const parsed = parseNewPassword(password);
        if (!parsed.ok) {
          setStatus({ kind: "error", issues: parsed.issues });
          return;
        }
        if (password !== confirm) {
          setStatus({
            kind: "error",
            issues: ["Those passwords do not match."],
          });
          return;
        }

        setStatus({ kind: "submitting" });
        void postAuth("/api/auth/update-password", {
          password: parsed.value,
        }).then((result) => {
          if (result.ok) {
            navigateTo(dataString(result.data, "next") ?? "/parent");
            return;
          }
          setStatus({ kind: "error", issues: result.issues });
        });
      }}
    >
      <div className="grid gap-4">
        <LabeledInput
          id={passwordId}
          name="password"
          label="New password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          hint={`At least ${minPasswordLength} characters.`}
          hintId={`${passwordId}-hint`}
        />
        <LabeledInput
          id={confirmId}
          name="confirm"
          label="Confirm new password"
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
        />
      </div>

      {status.kind === "error" ? (
        <InlineFeedback
          tone="problem"
          title="That did not work"
          className="mt-6"
        >
          <ul className="grid gap-1">
            {status.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </InlineFeedback>
      ) : null}

      <div className="mt-6">
        <Button type="submit" size="lg" fullWidth isLoading={submitting}>
          Save new password
        </Button>
      </div>
    </form>
  );
}
