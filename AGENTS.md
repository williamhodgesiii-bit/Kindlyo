# Agent instructions

The guardrails, product principles, and working process for this repository live
in [`CLAUDE.md`](./CLAUDE.md). Read that file first — it is the source of truth
for both humans and agents.

This file exists so that `next dev`, which appends a generated Next.js rules
block to whichever agent file it finds, writes to this file instead of appending
to `CLAUDE.md` on every run. Anything below the generated marker is written by
Next.js, not by us; leave it alone and let the tool manage it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
