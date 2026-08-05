"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { Text } from "@/components/ui/Typography";
import { ageBands, type AgeBand } from "@/features/profiles/types";
import {
  maxEmailLength,
  type WaitlistSubmission,
} from "@/features/waitlist/types";
import { parseWaitlistSubmission } from "@/features/waitlist/validate";

/**
 * The founding-family waitlist form.
 *
 * One required field. The age band is optional and defaults to unanswered,
 * because nobody should have to tell us about their child to hear about a beta,
 * and there is deliberately nowhere to type a name — the same rule
 * `ProfileForm` follows.
 *
 * Validation runs through `parseWaitlistSubmission`, the same function the
 * route handler uses, so the message shown before the request and the message
 * returned after it cannot contradict each other. Native browser validation is
 * turned off (`noValidate`) so there is exactly one voice giving feedback;
 * `type="email"` stays because it is what gives a phone the right keyboard.
 *
 * Feedback is inline rather than a toast, matching docs/DECISIONS.md record 016:
 * a message about something you just typed should stay next to it.
 */

const UNANSWERED = "unanswered";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; issues: string[] };

async function submitToWaitlist(
  submission: WaitlistSubmission,
): Promise<Status> {
  let response: Response;
  try {
    response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(submission),
    });
  } catch {
    return {
      kind: "error",
      issues: [
        "We could not reach the server. Check your connection and try again.",
      ],
    };
  }

  if (response.ok) return { kind: "success" };

  // A non-JSON error body is a server problem, not something to show verbatim.
  const fallback = "Something went wrong at our end. Please try again.";
  try {
    const body: unknown = await response.json();
    const issues =
      typeof body === "object" &&
      body !== null &&
      "issues" in body &&
      Array.isArray(body.issues)
        ? body.issues.filter(
            (issue): issue is string => typeof issue === "string",
          )
        : [];
    return { kind: "error", issues: issues.length > 0 ? issues : [fallback] };
  } catch {
    return { kind: "error", issues: [fallback] };
  }
}

export type WaitlistFormProps = {
  /** Distinguishes the homepage copy from the dedicated page's. */
  submitLabel?: string;
  className?: string;
};

export function WaitlistForm({
  submitLabel = "Join the waitlist",
  className,
}: WaitlistFormProps) {
  const emailId = useId();
  const emailHintId = useId();
  const ageGroupName = useId();

  const [email, setEmail] = useState("");
  const [ageBand, setAgeBand] = useState<AgeBand | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const submitting = status.kind === "submitting";

  return (
    <form
      className={className}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (submitting) return;

        const draft = ageBand === null ? { email } : { email, ageBand };
        const parsed = parseWaitlistSubmission(draft);
        if (!parsed.ok) {
          setStatus({ kind: "error", issues: parsed.issues });
          return;
        }

        setStatus({ kind: "submitting" });
        void submitToWaitlist(parsed.value).then((next) => {
          setStatus(next);
          if (next.kind === "success") {
            setEmail("");
            setAgeBand(null);
          }
        });
      }}
    >
      <div>
        <label htmlFor={emailId} className="block font-semibold">
          Your email address
        </label>
        <Text
          id={emailHintId}
          tone="secondary"
          size="sm"
          className="mt-1 max-w-prose"
        >
          A grown-up’s address, please. We use it to tell you when beta places
          open, and for nothing else — no newsletter, no advertising, and we
          never sell it.
        </Text>
        <input
          id={emailId}
          name="email"
          type="email"
          value={email}
          maxLength={maxEmailLength}
          autoComplete="email"
          aria-describedby={emailHintId}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-3 w-full max-w-sm rounded-lg border border-border bg-surface px-4 py-2 text-base"
        />
      </div>

      <fieldset className="mt-6">
        <legend className="font-semibold">
          How old is your child? (optional)
        </legend>
        <Text tone="secondary" size="sm" className="mt-1 max-w-prose">
          A band, not a birthday. It only helps us know which lessons to write
          next, and you can skip it.
        </Text>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
            <input
              type="radio"
              name={ageGroupName}
              value={UNANSWERED}
              checked={ageBand === null}
              onChange={() => setAgeBand(null)}
              className="h-auto w-auto min-h-0 min-w-0"
            />
            Rather not say
          </label>
          {ageBands.map((band) => (
            <label
              key={band}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2"
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

      {status.kind === "error" ? (
        <InlineFeedback
          tone="problem"
          title="That did not send"
          className="mt-6"
        >
          <ul className="grid gap-1">
            {status.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </InlineFeedback>
      ) : null}

      {status.kind === "success" ? (
        <InlineFeedback
          tone="helpful"
          title="You are on the list"
          className="mt-6"
        >
          Thank you — your address is recorded. We will be in touch when
          founding places open. Nothing has been charged, and nothing else about
          you or your child was collected.
        </InlineFeedback>
      ) : null}

      <div className="mt-6">
        <Button type="submit" size="lg" isLoading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
