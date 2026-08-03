# Daily Workflow

How work moves from a day's branch to `main`, and how old branches get cleaned
up. The whole flow is four commands.

## The loop

```bash
scripts/day.sh start              # morning: branch from main
scripts/day.sh save "What I did"  # any time: commit and push
scripts/day.sh ship               # end of day: verify, document, merge to main
scripts/day.sh cleanup            # occasionally: preview stale branch removal
```

Run `scripts/day.sh --help` for the full option list.

## Branch naming

Daily work happens on `claude/YYYY-MM-DD` — for example `claude/2026-08-14`.

The date prefix means branches sort chronologically, the namespace keeps them
clearly separate from long-lived branches, and cleanup can safely target
`claude/*` without touching anything else.

## What each command does

### `start`

Fetches `main`, then creates `claude/<today>` from it and pushes so the branch
exists remotely from the beginning. Run it again later the same day and it
simply resumes that branch.

Always branching from the latest `main` is what keeps days from stacking on each
other and producing conflicts at ship time.

### `save "message"`

Stages everything, commits with your message, and pushes. Use it as often as you
like — it is the checkpoint command, not a release. It refuses to run if you are
not on a `claude/*` branch.

### `ship`

The end-of-day release. In order:

1. Confirms the working tree is clean and there is something to ship.
2. Runs the full verification suite: `lint`, `format:check`, `typecheck`,
   `test`, `build`. **Any failure stops the ship.** This enforces the rule in
   `CLAUDE.md` that nothing is complete while checks are failing. Add
   `RUN_E2E=1` to include Playwright.
3. Writes a dated section into `CHANGELOG.md` listing every commit that is about
   to land, and commits it.
4. Merges into `main` with `--no-ff`, so `main`'s history shows exactly one
   `Ship claude/YYYY-MM-DD` commit per day.
5. Pushes `main`, then tags the release `ship/YYYY-MM-DD` and pushes the tag.

`main` is pushed before the tag on purpose. Some hosts restrict who may create
tags, and a blocked tag must never leave a finished release sitting unpushed on
your machine. If the tag cannot be pushed you get a warning, the tag still
exists locally, and the release is unaffected.

`SKIP_CHECKS=1` exists for emergencies. Reaching for it routinely defeats the
purpose of the command.

### `cleanup`

Deletes daily branches that are **both** already merged into `main` **and**
older than `STALE_DAYS` (default 14).

It is a **dry run by default** — it prints what it would remove and changes
nothing. Add `--yes` to actually delete.

Two guarantees, both covered by the safety rules above: a branch with unmerged
commits is never deleted, and the branch you currently have checked out is never
deleted.

## How the work stays recoverable

Deleting a branch never loses anything, because every shipping day leaves three
durable records:

| Record                | What it gives you                            |
| --------------------- | -------------------------------------------- |
| `CHANGELOG.md` entry  | Plain-language list of what shipped that day |
| `Ship claude/…` merge | The exact commits, grouped by day, in `main` |
| `ship/YYYY-MM-DD` tag | An immutable pointer to that day's state     |

To see a past day: `git show ship/2026-08-03`, or
`git log ship/2026-08-02..ship/2026-08-03` for everything between two days.

## Automated cleanup

`.github/workflows/cleanup-branches.yml` runs the same merged-and-stale rule
every Monday at 04:00 UTC.

It lives in GitHub Actions rather than in a local script because deleting a
remote branch needs repository write permission, which a developer machine or a
sandboxed agent session may not have. If `scripts/day.sh cleanup --yes` reports
`permission denied`, this workflow is the fallback — or delete the branch from
the repository's Branches page.

Trigger it by hand from the Actions tab. Manual runs default to a dry run;
untick "dry run" to delete.

## Pushing tags and deleting branches from a hosted session

Hosted agent sessions route git through a proxy that allows pushing commits and
branches but refuses **tag creation** and **branch deletion**. Day-to-day work is
unaffected; only `ship`'s tag step and `cleanup`'s deletions hit it.

To lift the restriction, give the session a GitHub token:

1. Create a **fine-grained personal access token** on GitHub
   (Settings → Developer settings → Personal access tokens → Fine-grained).
   - Repository access: only this repository.
   - Permission: **Contents → Read and write**. Nothing else is needed.
2. Add it to the environment as **`GH_PAT`**
   (Claude Code → environment settings → environment variables).

With `GH_PAT` set, `ship` and `cleanup` automatically send just those two
operations straight to GitHub. Everything else keeps using the normal remote.

The token is passed through `GIT_ASKPASS`, so it never lands in the command
line, in `.git/config`, or in any commit. Without `GH_PAT` nothing breaks — you
get a warning, and the weekly cleanup workflow still handles deletions.

## Prerequisites

- `main` should be the repository's **default branch**
  (Settings → General → Default branch).
- Consider protecting `main` so it only advances through this flow.
- The script uses `bash`, `git`, and `npm`. Nothing else.
