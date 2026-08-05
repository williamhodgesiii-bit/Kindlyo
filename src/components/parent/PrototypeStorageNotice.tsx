import { InlineFeedback } from "@/components/ui/InlineFeedback";

/**
 * "This is a prototype, and it is stored on this device."
 *
 * Required to be explicit rather than buried: the brief for this phase asks
 * that prototype storage be clearly marked, and a parent typing their child's
 * nickname into a form deserves to know where it lands before they type it —
 * not in a settings page afterwards.
 *
 * It is a neutral notice, not an alarm. Nothing is going wrong; the honest
 * facts are simply that your account is real now, but your children's profiles
 * and their progress still live only in this browser, and clearing site data
 * clears them.
 */
export function PrototypeStorageNotice({ className }: { className?: string }) {
  return (
    <InlineFeedback
      tone="neutral"
      title="Prototype — stored on this device only"
      className={className}
    >
      Your account is real, but your children&rsquo;s profiles and their
      progress are still kept only in this browser while we build. Nothing about
      a child is sent anywhere, and anything saved here disappears if you clear
      your browser data.
    </InlineFeedback>
  );
}
