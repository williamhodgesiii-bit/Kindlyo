"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ParentalGate } from "@/components/parent/ParentalGate";
import { cn } from "@/lib/cn";

/**
 * The gated way out of the child area and into the grown-up area.
 *
 * The learning area has no plain link to account, billing, or settings: a parent
 * enters it from the dashboard and leaves through the "Ask a grown-up" gate
 * (docs/design/ACCESSIBILITY.md; COMPONENT_STATES.md §4 "Safe return"). This
 * renders the visible affordance — a button, not a link, because a link would
 * navigate on a single tap — and only routes to the parent area once the gate is
 * solved.
 *
 * It carries no styling of its own beyond the label, so each caller (the shell
 * header, the profile picker) can match its own surface via `className`.
 */
export function ParentAreaExit({
  label,
  className,
  href = "/parent",
}: {
  label: string;
  className?: string;
  href?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("cursor-pointer", className)}
      >
        {label}
      </button>
      <ParentalGate
        open={open}
        purpose="return"
        onCancel={() => setOpen(false)}
        onVerified={() => {
          setOpen(false);
          router.push(href);
        }}
      />
    </>
  );
}
