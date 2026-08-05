"use client";

import { useId, useState } from "react";
import { parseSignUpCredentials } from "@/features/auth/validate";
import { minPasswordLength } from "@/features/auth/types";
import { maxEmailLength } from "@/features/waitlist/types";
import { Button } from "@/components/ui/Button";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { LabeledInput } from "./LabeledInput";
import { navigateTo } from "./navigate";
import { dataString, postAuth } from "./postAuth";

/**
 * Create a parent account.
 *
 * Mirrors the sign-in form, with the new-password length rule enforced up front.
 * Depending on the provider, a successful sign-up either establishes a session
 * (navigate straight on) or sends a confirmation email (ask the parent to check
 * their inbox); the response says which, and the form handles both.
 */

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "check-email" }
  | { kind: "error"; issues: string[] };

export function SignupForm({ redirectTo }: { redirectTo: string }) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const submitting = status.kind === "submitting";

  if (status.kind === "check-email") {
    return (
      <InlineFeedback tone="helpful" title="Almost there">
        We&rsquo;ve sent a link to <strong>{email}</strong> to confirm your
        account. Open it on this device and you&rsquo;ll be signed in.
      </InlineFeedback>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (submitting) return;

        const parsed = parseSignUpCredentials({ email, password });
        if (!parsed.ok) {
          setStatus({ kind: "error", issues: parsed.issues });
          return;
        }

        setStatus({ kind: "submitting" });
        const url = `/api/auth/signup?redirectTo=${encodeURIComponent(redirectTo)}`;
        void postAuth(url, parsed.value).then((result) => {
          if (!result.ok) {
            setStatus({ kind: "error", issues: result.issues });
            return;
          }
          const next = dataString(result.data, "next");
          if (next !== undefined) {
            navigateTo(next);
            return;
          }
          setStatus({ kind: "check-email" });
        });
      }}
    >
      <div className="grid gap-4">
        <LabeledInput
          id={emailId}
          name="email"
          label="Your email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          maxLength={maxEmailLength}
          hint="A grown-up's address. It is the only personal detail we hold, and children never provide one."
          hintId={`${emailId}-hint`}
        />
        <LabeledInput
          id={passwordId}
          name="password"
          label="Choose a password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          hint={`At least ${minPasswordLength} characters.`}
          hintId={`${passwordId}-hint`}
        />
      </div>

      {status.kind === "error" ? (
        <InlineFeedback
          tone="problem"
          title="We could not create your account"
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
          Create account
        </Button>
      </div>
    </form>
  );
}
