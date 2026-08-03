import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For parents",
};

/**
 * Placeholder parent route.
 *
 * The real dashboard, child profiles, and settings arrive with accounts and
 * persistence. This exists so the shell and navigation are testable now.
 */
export default function ParentPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">For parents</h1>
      <p className="mt-4 max-w-2xl text-lg text-text-secondary">
        This is where you will see how your child is getting on and which
        real-world mission to try next.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-surface-muted p-6">
        <h2 className="text-lg font-semibold">Not built yet</h2>
        <p className="mt-2 text-text-secondary">
          Accounts, child profiles, and progress are still to come. Nothing is
          collected or stored at this stage.
        </p>
      </div>
    </div>
  );
}
