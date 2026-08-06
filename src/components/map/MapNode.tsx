import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CheckIcon } from "@/components/ui/icons";
import type { NeighborhoodNode } from "@/features/lessons/neighborhood";

/**
 * One world on the neighborhood map (docs/design/COMPONENT_STATES.md §03).
 *
 * The node is themed by its world: `data-module` maps to the world's accent and
 * tint (src/styles/tokens.css). The accent disc is one of the few sanctioned
 * full circles (DESIGN.md §4) and is decorative — every meaning is also in
 * words. State is carried by a text chip and the node's shape, never by colour
 * alone (ACCESSIBILITY.md).
 *
 * Only a world with content and a place to go is a link; a "later" world is
 * information, not a button — there is no control to press and be refused. The
 * current world breathes once on arrival (`.llc-breathe-once`), which
 * reduced-motion collapses to stillness; its meaning lives in the "Current"
 * chip regardless.
 */

const chip: Record<
  NeighborhoodNode["state"],
  { label: string; className: string; icon?: ReactNode }
> = {
  current: { label: "Current", className: "text-module-accent-strong" },
  next: { label: "Up next", className: "text-module-accent-strong" },
  later: { label: "A little later", className: "text-text-secondary" },
  complete: {
    label: "Done",
    className: "text-feedback-helpful",
    icon: <CheckIcon className="h-4 w-4" />,
  },
};

function NodeBody({ node }: { node: NeighborhoodNode }) {
  const { world, state, completed, total } = node;
  const info = chip[state];
  const reachable = state !== "later";

  return (
    <>
      {/* An accent ring, not a fill: the module accent is a non-text token, so
          the number/check rides on the surface in the text-safe accent-strong
          step instead (DESIGN.md §2). One of the sanctioned full circles. */}
      <span
        aria-hidden="true"
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2",
          reachable
            ? "border-module-accent bg-surface"
            : "border-border bg-surface-muted",
          state === "current" && "llc-breathe-once",
        )}
      >
        {state === "complete" ? (
          <CheckIcon className="h-6 w-6 text-module-accent-strong" />
        ) : (
          <span
            className={cn(
              "font-display text-lg font-semibold",
              reachable ? "text-module-accent-strong" : "text-text-secondary",
            )}
          >
            {world.order}
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl font-semibold text-text-primary">
          <span className="sr-only">World {world.order}: </span>
          {world.title}
        </span>
        <span className="mt-1 block text-sm text-text-secondary">
          {world.teaches}
        </span>
        <span
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-sm font-semibold",
            info.className,
          )}
        >
          {info.icon}
          {info.label}
          {reachable && total > 0 ? (
            <span className="font-normal text-text-secondary">
              <span aria-hidden="true"> · </span>
              {completed} of {total}
            </span>
          ) : null}
        </span>
      </span>
    </>
  );
}

export function MapNode({ node }: { node: NeighborhoodNode }) {
  const { world, state } = node;
  const href = world.pathHref;
  const interactive = href !== undefined && state !== "later";

  const shared = "flex items-center gap-4 rounded-xl border border-border p-4";

  return (
    <li data-module={world.id}>
      {interactive ? (
        <Link
          href={href}
          aria-label={`${world.title} — ${chip[state].label}. ${world.teaches}`}
          className={cn(
            shared,
            "bg-surface transition-colors hover:bg-surface-muted",
          )}
        >
          <NodeBody node={node} />
        </Link>
      ) : (
        <div className={cn(shared, "bg-surface")}>
          <NodeBody node={node} />
        </div>
      )}
    </li>
  );
}
