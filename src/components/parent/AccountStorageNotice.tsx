import { InlineFeedback } from "@/components/ui/InlineFeedback";

/**
 * "This is saved to your account."
 *
 * The prototype notice this replaces said profiles lived only in the browser;
 * they now belong to the parent's account in the database (decision 034), and a
 * notice that still said "this device only" would be untrue — CLAUDE.md asks us
 * never to imply something that is not so. So this states the honest facts a
 * parent deciding whether to type their child's nickname deserves before they
 * type it: what is saved, how little of it there is, and that they can remove
 * it whenever they like.
 *
 * A calm, neutral notice, not an alarm.
 */
export function AccountStorageNotice({ className }: { className?: string }) {
  return (
    <InlineFeedback
      tone="neutral"
      title="Saved to your account"
      className={className}
    >
      Your children&rsquo;s profiles and their progress are saved to your
      account, so they are there on your next visit and on your other devices.
      We keep only the minimum — a nickname and an age band — children never
      sign in, and you can delete a profile or its progress whenever you like.
    </InlineFeedback>
  );
}
