import type { WaitlistEntry } from "./types";

/**
 * Where a waitlist signup goes.
 *
 * There is no database in this repository yet — persistence arrives in
 * `prompts/09-database.md` — so the only implementation writes one structured
 * line to the server log, which the hosting platform retains. This is a
 * deliberate placeholder and it is recorded as one in docs/DECISIONS.md and
 * docs/MARKETING_SITE.md.
 *
 * Two consequences worth stating plainly rather than discovering later:
 *
 * - Log retention is not a mailing list. Before the site is promoted publicly,
 *   this sink must be replaced with real storage, or the addresses collected
 *   cannot actually be used and should not be collected at all.
 * - The confirmation the parent sees is written to match what this does. It
 *   acknowledges the interest; it does not promise an email that no system
 *   currently sends.
 *
 * The interface exists so that replacement is a new module and one line in
 * `getWaitlistSink`, not a rewrite of the route handler.
 */

export type WaitlistSink = {
  record(entry: WaitlistEntry): Promise<void>;
};

/**
 * Writes the signup as a single JSON line, using the lowercase dot-notation
 * event name from docs/ANALYTICS.md so it reads like the rest of the product's
 * events when a log drain eventually collects them.
 */
export const logWaitlistSink: WaitlistSink = {
  record(entry: WaitlistEntry): Promise<void> {
    console.info(
      JSON.stringify({
        event: "waitlist.submitted",
        email: entry.email,
        ageBand: entry.ageBand ?? null,
        receivedAt: entry.receivedAt,
      }),
    );
    return Promise.resolve();
  },
};

export function getWaitlistSink(): WaitlistSink {
  return logWaitlistSink;
}
