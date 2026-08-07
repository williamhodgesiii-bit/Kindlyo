"use client";

import { type FormEvent, type RefObject, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Text } from "@/components/ui/Typography";
import {
  createGatePuzzle,
  type GatePuzzle,
  isAnswerCorrect,
} from "@/features/parental-gate/puzzle";

/**
 * The "Ask a grown-up" gate.
 *
 * Any exit to the open web or a purchase sits behind this: a grown-up must read
 * a small sum, whose numbers are spelled out in words, and type the answer
 * (docs/design/ACCESSIBILITY.md, "Parental gate"; COMPONENT_STATES.md §4). The
 * written answer — not a bright button — is the barrier a pre-reader cannot tap
 * through by accident, and the numbers change on every open so it cannot be
 * memorised.
 *
 * It reuses the hand-rolled Dialog (decision 014) for its focus trap, Escape and
 * scroll lock, and is a controlled component: the caller owns `open` and decides
 * what happens on `onVerified` (leave to the parent area, or start checkout).
 * There is no success toast — the navigation that follows is the confirmation.
 *
 * Two purposes only, which tailor the reassurance copy:
 * - `return`   — leaving the child area for the grown-up area.
 * - `purchase` — before any payment screen.
 */

export type ParentalGatePurpose = "return" | "purchase";

const PURPOSE_DESCRIPTION: Record<ParentalGatePurpose, string> = {
  return:
    "This is the way back to the grown-up area, so a grown-up answers first.",
  purchase: "This is the way to the payment page, so a grown-up answers first.",
};

export function ParentalGate({
  open,
  purpose,
  onCancel,
  onVerified,
}: {
  open: boolean;
  purpose: ParentalGatePurpose;
  onCancel: () => void;
  onVerified: () => void;
}) {
  // The input lives inside GateForm, which mounts fresh on each open; the ref is
  // stable so Dialog can move focus to it when the gate opens.
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title="Ask a grown-up"
      description={PURPOSE_DESCRIPTION[purpose]}
      closeLabel="Close"
      initialFocusRef={inputRef}
    >
      <GateForm
        inputRef={inputRef}
        onCancel={onCancel}
        onVerified={onVerified}
      />
    </Dialog>
  );
}

/**
 * The puzzle itself. Kept in a child so it unmounts with the Dialog when the
 * gate closes and remounts with a fresh sum on the next open — no stale-answer
 * flash, no reset effect.
 */
function GateForm({
  inputRef,
  onCancel,
  onVerified,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  onCancel: () => void;
  onVerified: () => void;
}) {
  const [puzzle] = useState<GatePuzzle>(() => createGatePuzzle());
  const [value, setValue] = useState("");
  const inputId = useId();
  const correct = isAnswerCorrect(value, puzzle.answer);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (correct) onVerified();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={inputId} className="block font-semibold">
        To continue, please type the answer. {puzzle.question}
      </label>
      <input
        id={inputId}
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputMode="numeric"
        autoComplete="off"
        placeholder="Type a number"
        className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2 text-base"
      />
      <Text tone="secondary" size="sm" className="mt-3 max-w-prose">
        A written answer, not a bright button — hard for a young child to tap
        through by accident.
      </Text>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={!correct}>
          Continue
        </Button>
      </div>
    </form>
  );
}
