"use client";

import { useId, useState } from "react";
import { genericResetSentMessage } from "@/features/auth/errors";
import { parseEmail } from "@/features/auth/validate";
import { maxEmailLength } from "@/features/waitlist/types";
import { Button } from "@/components/ui/Button";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { LabeledInput } from "./LabeledInput";
import { postAuth } from "./postAuth";

/**
 * Request a password-reset link.
 *
 * Whatever address is entered, a well-formed one produces the same confirmation.
 * The form never says whether an account exists — that answer would be an
 * enumeration oracle, and this is a children's product.
 */

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent" }
  | { kind: "error"; issues: string[] };

export function ForgotPasswordForm() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const submitting = status.kind === "submitting";

  if (status.kind === "sent") {
    return (
      <InlineFeedback tone="helpful" title="Check your inbox">
        {genericResetSentMessage}
      </InlineFeedback>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (submitting) return;

        const parsed = parseEmail(email);
        if (!parsed.ok) {
          setStatus({ kind: "error", issues: parsed.issues });
          return;
        }

        setStatus({ kind: "submitting" });
        void postAuth("/api/auth/reset-request", { email: parsed.value }).then(
          (result) => {
            setStatus(
              result.ok
                ? { kind: "sent" }
                : { kind: "error", issues: result.issues },
            );
          },
        );
      }}
    >
      <LabeledInput
        id={emailId}
        name="email"
        label="Email address"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        maxLength={maxEmailLength}
      />

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
          Send reset link
        </Button>
      </div>
    </form>
  );
}
