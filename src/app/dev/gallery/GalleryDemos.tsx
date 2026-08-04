"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChoiceCard, ChoiceList } from "@/components/ui/ChoiceCard";
import { Dialog } from "@/components/ui/Dialog";
import { ErrorState } from "@/components/ui/ErrorState";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { MissionCard } from "@/components/ui/MissionCard";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Heading, Text } from "@/components/ui/Typography";

/**
 * The interactive half of the gallery.
 *
 * Split out so the gallery page itself stays a server component. The sample
 * strings here are throwaway scaffolding for reviewing states, not curriculum:
 * real lesson content lives in the content model, never in a component or a
 * dev route.
 */

const choices = [
  {
    id: "wave",
    label: "Wave and say hello",
    description: "Maya sees you want to join in.",
  },
  {
    id: "wait",
    label: "Wait nearby until someone notices",
    description: "It might take a while, and that is okay.",
  },
] as const;

export function ChoiceDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <ChoiceList label="Sample choices">
        {choices.map((choice) => (
          <ChoiceCard
            key={choice.id}
            label={choice.label}
            description={choice.description}
            selected={selected === choice.id}
            onClick={() => setSelected(choice.id)}
          />
        ))}
        <ChoiceCard label="A disabled choice" disabled />
      </ChoiceList>

      {selected ? (
        <InlineFeedback tone="needs-context">
          Different situations can need different responses.
        </InlineFeedback>
      ) : (
        <Text tone="secondary">Pick a choice to see the feedback state.</Text>
      )}
    </div>
  );
}

export function DialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open the dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Remove this profile?"
        description="Progress saved against this profile is removed too. This cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Remove
            </Button>
          </>
        }
      >
        <Text tone="secondary">
          Tab stays inside this panel, Escape closes it, and focus returns to
          the button that opened it.
        </Text>
      </Dialog>
    </div>
  );
}

export function ProfileDemo() {
  const [selected, setSelected] = useState("Robin");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {["Robin", "Sam"].map((nickname) => (
        <ProfileCard
          key={nickname}
          nickname={nickname}
          ageBand="Ages 5 to 6"
          selected={selected === nickname}
          onSelect={() => setSelected(nickname)}
          meta={
            <ProgressBar
              label="Module progress"
              value={nickname === "Robin" ? 3 : 1}
              max={8}
              tone="calm"
            />
          }
        />
      ))}
    </div>
  );
}

export function ErrorStateDemo() {
  const [retries, setRetries] = useState(0);

  return (
    <ErrorState
      live
      title="We could not load progress"
      description={
        retries === 0
          ? "This one is on us. Nothing has been lost."
          : `This one is on us. Nothing has been lost. (Retried ${retries} times.)`
      }
      onRetry={() => setRetries((count) => count + 1)}
    />
  );
}

export function MissionDemo() {
  const [status, setStatus] = useState<"suggested" | "done">("suggested");

  return (
    <div className="space-y-4">
      <MissionCard
        title="Say hello to one new person"
        description="Somewhere you both already are - the park, the shop, the school gate."
        status={status}
        action={
          <Button
            variant="secondary"
            onClick={() =>
              setStatus((current) =>
                current === "done" ? "suggested" : "done",
              )
            }
          >
            {status === "done" ? "Mark as not done" : "We tried it"}
          </Button>
        }
      />
      <Heading level={3} size="sm">
        Loading state
      </Heading>
      <Button isLoading>Saving</Button>
    </div>
  );
}
