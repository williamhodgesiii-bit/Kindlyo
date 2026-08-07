"use client";

import { useRef, useState } from "react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { Heading, Text } from "@/components/ui/Typography";

/**
 * The interactive account controls: the two data rights parents are owed
 * (docs/PRIVACY_AND_SAFETY.md) — export and deletion.
 *
 * Export is a plain link to the download endpoint, so it works with scripting
 * unavailable and lets the browser handle the file. Deletion is guarded: an
 * explicit confirm dialog names exactly what goes, offers signing out as the
 * gentler alternative, and only then removes everything and ends the session.
 * The gentler "sign out" is a real form POST to the same route the account bar
 * uses, so it needs no scripting either.
 *
 * The register is the parent area's: calm and plain, danger colour reserved for
 * the one destructive action (COMPONENT_STATES.md §10/§12).
 */

const DELETE_FAILED =
  "Something went wrong and your account was not changed. Please try again.";

export function AccountPanel() {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // A hidden POST form: after deletion there is nothing left to stay signed in
  // to, so we submit it to end the session and land on the public site.
  const signOutRef = useRef<HTMLFormElement>(null);

  async function deleteAccount() {
    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/family", { method: "DELETE" });
      if (!response.ok) {
        setError(DELETE_FAILED);
        setBusy(false);
        return;
      }
      signOutRef.current?.submit();
    } catch {
      setError(DELETE_FAILED);
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 grid gap-8">
      <Card>
        <Heading level={2} size="sm">
          Your data
        </Heading>
        <Text tone="secondary" className="mt-2 max-w-prose">
          Download everything Kindlyo keeps about your family — your email, your
          children&rsquo;s profiles, and what they have practised — as a single
          file you can keep.
        </Text>
        <a
          href="/api/family/export"
          className={buttonClasses("secondary", "md", false, "mt-4")}
        >
          Download my data
        </a>
      </Card>

      <Card className="border-danger/40">
        <Heading level={2} size="sm">
          Delete your account
        </Heading>
        <Text tone="secondary" className="mt-2 max-w-prose">
          This permanently removes your children&rsquo;s profiles and everything
          they have practised, and signs you out. It cannot be undone. If you
          only want to step away, sign out instead and it will all be here when
          you come back.
        </Text>

        {error !== null ? (
          <InlineFeedback
            tone="problem"
            title="That did not work"
            className="mt-4"
          >
            {error}
          </InlineFeedback>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="danger" onClick={() => setConfirming(true)}>
            Delete account
          </Button>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="secondary">
              Sign out instead
            </Button>
          </form>
        </div>
      </Card>

      <Dialog
        open={confirming}
        onClose={() => {
          if (!busy) setConfirming(false);
        }}
        title="Delete your account?"
        description="Your children's profiles and all of their progress will be permanently removed, and you'll be signed out. This cannot be undone."
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => setConfirming(false)}
            >
              Keep my account
            </Button>
            <Button
              variant="danger"
              isLoading={busy}
              disabled={busy}
              onClick={deleteAccount}
            >
              Delete account
            </Button>
          </div>
        }
      />

      <form
        ref={signOutRef}
        action="/auth/signout"
        method="post"
        className="hidden"
      />
    </div>
  );
}
