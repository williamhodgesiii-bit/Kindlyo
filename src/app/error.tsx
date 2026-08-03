"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary.
 *
 * Shows a calm, non-technical message and offers a retry. The raw error is
 * logged for developers but never rendered, so internal details do not leak to
 * users.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replaced by real error monitoring in the hardening slice.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-lg text-text-secondary">
          This one is on us, not on you. You can try again, and your progress is
          safe.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-brand-primary-hover"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
