import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Typography";

/**
 * The signed-in strip at the top of every parent screen.
 *
 * Shows which account is in use and offers the way out. Sign-out is a real form
 * POST to `/auth/signout` rather than a scripted button, so it ends the session
 * even with JavaScript unavailable and cannot be triggered by a prefetch.
 *
 * It lives in the parent area only. The child shell keeps its single "For
 * parents" link and no session controls: a child tapping around the learning
 * area should never be able to sign the grown-up out.
 */
export function ParentAccountBar({ email }: { email: string }) {
  return (
    <div className="border-b border-border bg-surface-muted">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-2">
        <Text size="sm" tone="secondary">
          Signed in as{" "}
          <span className="font-medium text-text-primary">{email}</span>
        </Text>
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="quiet" size="md">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
