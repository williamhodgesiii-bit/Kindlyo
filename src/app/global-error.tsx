"use client";

import { useEffect } from "react";

/**
 * Root error boundary.
 *
 * Only used when the root layout itself fails, so it must render its own
 * <html> and <body> and cannot rely on shared styles.
 *
 * This is the one file that may hardcode colours. It cannot import design
 * system components or read tokens, because the stylesheet may never have
 * loaded. The literals below mirror --color-background, --color-text-primary,
 * --color-brand-primary-strong, and --radius-md in src/styles/tokens.css; if
 * those change, change these by hand.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: "3rem 1rem",
          backgroundColor: "#fffaf2",
          color: "#2f2925",
          lineHeight: 1.6,
        }}
      >
        <main style={{ maxWidth: "36rem", margin: "0 auto" }}>
          <h1 style={{ fontSize: "1.875rem" }}>Something went wrong</h1>
          <p>
            Little Learner&apos;s Club could not load. Please try again in a
            moment; nothing has been lost.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: "2.75rem",
              minWidth: "2.75rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.875rem",
              border: "none",
              backgroundColor: "#b0492f",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
