"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { parseSignInCredentials } from "@/features/auth/validate";
import { maxEmailLength } from "@/features/waitlist/types";
import { Button } from "@/components/ui/Button";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { LabeledInput } from "./LabeledInput";
import { navigateTo } from "./navigate";
import { dataString, postAuth } from "./postAuth";

/**
 * Parent sign-in.
 *
 * Client-validates with the same parser the endpoint uses, then posts to
 * `/api/auth/signin`. On success the whole page navigates to where the parent
 * was headed (validated server-side against open redirects); on failure it shows
 * the one generic message the server returned. There is deliberately no
 * "unknown email" versus "wrong password" distinction anywhere in this flow.
 */

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; issues: string[] };

const linkClass =
  "font-medium text-brand-primary-strong underline underline-offset-2 hover:no-underline";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const submitting = status.kind === "submitting";

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (submitting) return;

        const parsed = parseSignInCredentials({ email, password });
        if (!parsed.ok) {
          setStatus({ kind: "error", issues: parsed.issues });
          return;
        }

        setStatus({ kind: "submitting" });
        const url = `/api/auth/signin?redirectTo=${encodeURIComponent(redirectTo)}`;
        void postAuth(url, parsed.value).then((result) => {
          if (result.ok) {
            navigateTo(dataString(result.data, "next") ?? redirectTo);
            return;
          }
          setStatus({ kind: "error", issues: result.issues });
        });
      }}
    >
      <div className="grid gap-4">
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
        <LabeledInput
          id={passwordId}
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
      </div>

      {status.kind === "error" ? (
        <InlineFeedback
          tone="problem"
          title="We could not sign you in"
          className="mt-6"
        >
          <ul className="grid gap-1">
            {status.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </InlineFeedback>
      ) : null}

      <div className="mt-6 grid gap-4">
        <Button type="submit" size="lg" fullWidth isLoading={submitting}>
          Sign in
        </Button>
        <p>
          <Link href="/forgot-password" className={linkClass}>
            Forgot your password?
          </Link>
        </p>
      </div>
    </form>
  );
}
