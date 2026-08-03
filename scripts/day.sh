#!/usr/bin/env bash
#
# Kindlyo daily branch workflow.
#
#   scripts/day.sh start          Start (or resume) today's branch from main
#   scripts/day.sh save "message" Commit everything and push to today's branch
#   scripts/day.sh ship           Run checks, write the changelog, merge to main
#   scripts/day.sh cleanup        Delete merged, stale claude/* branches
#
# Environment overrides:
#   MAIN_BRANCH=main       Target branch for releases
#   BRANCH_PREFIX=claude   Namespace for daily branches
#   STALE_DAYS=14          Age before a merged branch is cleanup-eligible
#   SKIP_CHECKS=1          Skip verification during `ship` (not recommended)
#   RUN_E2E=1              Also run Playwright during `ship`
#
set -euo pipefail

MAIN_BRANCH="${MAIN_BRANCH:-main}"
BRANCH_PREFIX="${BRANCH_PREFIX:-claude}"
STALE_DAYS="${STALE_DAYS:-14}"
CHANGELOG="CHANGELOG.md"
CHANGELOG_MARKER="new-entries-below"

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

info() { printf '\n==> %s\n' "$*"; }
note() { printf '    %s\n' "$*"; }

today() { date +%F; }
today_branch() { printf '%s/%s' "$BRANCH_PREFIX" "$(today)"; }

current_branch() {
  git symbolic-ref --quiet --short HEAD ||
    die "HEAD is detached; check out a branch first"
}

require_daily_branch() {
  local branch
  branch="$(current_branch)"
  case "$branch" in
  "$BRANCH_PREFIX"/*) printf '%s' "$branch" ;;
  *) die "expected a $BRANCH_PREFIX/* branch, but you are on '$branch'" ;;
  esac
}

require_clean_tree() {
  git diff --quiet && git diff --cached --quiet ||
    die "working tree has uncommitted changes; commit or stash them first"
}

# Network calls occasionally fail in sandboxes and CI; retry with backoff.
push_with_retry() {
  local attempt=0
  until [ "$attempt" -ge 4 ]; do
    if git push "$@"; then return 0; fi
    attempt=$((attempt + 1))
    [ "$attempt" -ge 4 ] && die "git push failed after 4 attempts"
    local wait=$((2 ** attempt))
    note "push failed; retrying in ${wait}s"
    sleep "$wait"
  done
}

cmd_start() {
  local branch
  branch="$(today_branch)"

  info "Fetching origin/$MAIN_BRANCH"
  git fetch origin "$MAIN_BRANCH"

  if git show-ref --verify --quiet "refs/heads/$branch"; then
    info "Resuming $branch"
    git checkout "$branch"
  else
    info "Creating $branch from origin/$MAIN_BRANCH"
    git checkout -b "$branch" "origin/$MAIN_BRANCH"
  fi

  push_with_retry -u origin "$branch"
  info "Ready on $branch"
}

cmd_save() {
  local message="${1:-}"
  [ -n "$message" ] || die "usage: scripts/day.sh save \"commit message\""

  local branch
  branch="$(require_daily_branch)"

  git add -A
  if git diff --cached --quiet; then
    info "Nothing to commit"
    return 0
  fi

  git commit -m "$message"
  push_with_retry -u origin "$branch"
  info "Saved to $branch"
}

# Inserts a dated section immediately after the changelog marker.
write_changelog_entry() {
  local body_file="$1"
  local tmp
  [ -f "$CHANGELOG" ] || die "$CHANGELOG not found"
  grep -q "$CHANGELOG_MARKER" "$CHANGELOG" ||
    die "$CHANGELOG is missing the '$CHANGELOG_MARKER' marker"

  tmp="$(mktemp)"
  awk -v date="$(today)" -v bodyfile="$body_file" -v marker="$CHANGELOG_MARKER" '
    { print }
    index($0, marker) && !inserted {
      print ""
      print "## " date
      print ""
      while ((getline line < bodyfile) > 0) print line
      close(bodyfile)
      inserted = 1
    }
  ' "$CHANGELOG" >"$tmp"
  mv "$tmp" "$CHANGELOG"
}

cmd_ship() {
  local branch
  branch="$(require_daily_branch)"
  require_clean_tree

  info "Fetching origin/$MAIN_BRANCH"
  git fetch origin "$MAIN_BRANCH"

  local commits_file
  commits_file="$(mktemp)"
  git log --no-merges --reverse --pretty=format:'- %s' \
    "origin/$MAIN_BRANCH..HEAD" >"$commits_file"
  printf '\n' >>"$commits_file"

  if [ ! -s "$commits_file" ] || [ -z "$(tr -d '[:space:]' <"$commits_file")" ]; then
    rm -f "$commits_file"
    die "nothing to ship: $branch has no commits beyond origin/$MAIN_BRANCH"
  fi

  if [ "${SKIP_CHECKS:-0}" = "1" ]; then
    info "Skipping checks (SKIP_CHECKS=1)"
  else
    info "Running verification (must pass before shipping)"
    npm run lint
    npm run format:check
    npm run typecheck
    npm run test
    npm run build
    if [ "${RUN_E2E:-0}" = "1" ]; then npm run test:e2e; fi
  fi

  info "Recording the day in $CHANGELOG"
  write_changelog_entry "$commits_file"
  rm -f "$commits_file"

  if ! git diff --quiet -- "$CHANGELOG"; then
    git add "$CHANGELOG"
    git commit -m "Document $(today) release"
    push_with_retry -u origin "$branch"
  fi

  info "Merging $branch into $MAIN_BRANCH"
  git checkout "$MAIN_BRANCH"
  git pull --ff-only origin "$MAIN_BRANCH"
  # --no-ff so main's history shows one merge commit per shipping day.
  git merge --no-ff "$branch" -m "Ship $branch"

  # Push the release before the tag. If tagging is restricted on the host, a
  # failure here must not leave the merge sitting unpushed on your machine.
  push_with_retry origin "$MAIN_BRANCH"

  local tag="ship/$(today)"
  if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
    note "tag $tag already exists locally; leaving it alone"
  else
    git tag -a "$tag" -m "Shipped $branch"
  fi

  # Best effort: some hosts refuse tag creation. The release is already out, so
  # this is a warning, never a failure.
  if git push origin "$tag" >/dev/null 2>&1; then
    note "pushed tag $tag"
  else
    note "could not push tag $tag (permission denied?); it still exists locally"
  fi

  git checkout "$branch"
  info "Shipped $branch to $MAIN_BRANCH"
}

cmd_cleanup() {
  local apply=0
  [ "${1:-}" = "--yes" ] && apply=1

  info "Pruning stale remote-tracking refs"
  git fetch origin --prune

  local cutoff
  cutoff=$(($(date +%s) - STALE_DAYS * 86400))

  local merged
  merged="$(git branch -r --merged "origin/$MAIN_BRANCH" --format='%(refname:short)')"

  local found=0
  while read -r ref timestamp; do
    [ -n "$ref" ] || continue
    # Never touch a branch whose work is not already in main.
    printf '%s\n' "$merged" | grep -qx "$ref" || {
      note "skip $ref (not merged into $MAIN_BRANCH)"
      continue
    }
    [ "$timestamp" -lt "$cutoff" ] || {
      note "skip $ref (newer than $STALE_DAYS days)"
      continue
    }

    found=1
    local short="${ref#origin/}"
    if [ "$apply" = "1" ]; then
      if git push origin --delete "$short"; then
        note "deleted $short"
      else
        note "could not delete $short (permission denied?) - remove it on GitHub"
      fi
    else
      note "would delete $short"
    fi
  done < <(git for-each-ref \
    --format='%(refname:short) %(committerdate:unix)' \
    "refs/remotes/origin/$BRANCH_PREFIX/")

  info "Cleaning merged local branches"
  # Collected up front: `grep` finding nothing would abort the script under
  # `set -o pipefail`.
  local local_merged
  local_merged="$(git branch --merged "$MAIN_BRANCH" --format='%(refname:short)' |
    grep "^$BRANCH_PREFIX/" || true)"

  if [ -z "$local_merged" ]; then
    note "none"
  else
    local checked_out
    checked_out="$(git symbolic-ref --quiet --short HEAD || true)"

    while read -r local_branch; do
      [ -n "$local_branch" ] || continue
      if [ "$local_branch" = "$checked_out" ]; then
        note "skip local $local_branch (currently checked out)"
        continue
      fi
      if [ "$apply" = "1" ]; then
        # -D rather than -d: `-d` measures merges against HEAD, but this list
        # already came from `--merged $MAIN_BRANCH`, which is the check we want.
        if git branch -D "$local_branch" >/dev/null 2>&1; then
          note "deleted local $local_branch"
        else
          note "could not delete local $local_branch"
        fi
      else
        note "would delete local $local_branch"
      fi
    done <<<"$local_merged"
  fi

  if [ "$found" = "0" ]; then
    info "No stale remote branches to remove"
  elif [ "$apply" != "1" ]; then
    info "Dry run. Re-run with --yes to actually delete."
  fi
}

usage() {
  cat <<'USAGE'
Kindlyo daily branch workflow.

  scripts/day.sh start            Start (or resume) today's branch from main
  scripts/day.sh save "message"   Commit everything and push to today's branch
  scripts/day.sh ship             Run checks, write the changelog, merge to main
  scripts/day.sh cleanup          Preview stale branch deletion (dry run)
  scripts/day.sh cleanup --yes    Actually delete merged, stale branches

Environment overrides:
  MAIN_BRANCH=main       Target branch for releases
  BRANCH_PREFIX=claude   Namespace for daily branches
  STALE_DAYS=14          Age before a merged branch is cleanup-eligible
  SKIP_CHECKS=1          Skip verification during `ship` (not recommended)
  RUN_E2E=1              Also run Playwright during `ship`
USAGE
}

main() {
  cd "$(git rev-parse --show-toplevel)"
  local command="${1:-}"
  shift || true
  case "$command" in
  start) cmd_start "$@" ;;
  save) cmd_save "$@" ;;
  ship) cmd_ship "$@" ;;
  cleanup) cmd_cleanup "$@" ;;
  ""| -h | --help | help) usage ;;
  *) die "unknown command '$command' (try --help)" ;;
  esac
}

main "$@"
