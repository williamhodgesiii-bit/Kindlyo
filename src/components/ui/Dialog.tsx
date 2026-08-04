"use client";

import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";
import { CloseIcon } from "./icons";
import { Heading, Text } from "./Typography";

/**
 * Modal dialog.
 *
 * Hand-rolled rather than using the native <dialog> element or a headless
 * library. The behaviours that matter here - focus moving in, staying trapped,
 * and returning to the trigger - are exactly the ones we need to be able to
 * assert in tests, and a plain implementation keeps them testable in jsdom
 * without a dependency (docs/DECISIONS.md, record 012).
 *
 * Rendered inline rather than through a portal: nothing in this product needs
 * to escape a stacking context yet, and inline keeps it simple.
 */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  closeOnOverlayClick?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeLabel = "Close",
  closeOnOverlayClick = true,
  initialFocusRef,
  className,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const focusableWithin = useCallback((): HTMLElement[] => {
    const panel = panelRef.current;
    if (!panel) return [];
    return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
  }, []);

  // Move focus in on open, and put it back where it came from on close.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const target = initialFocusRef?.current ?? closeButtonRef.current;
    target?.focus();

    return () => {
      previouslyFocused?.focus();
    };
  }, [open, initialFocusRef]);

  // Escape closes, Tab cycles within the panel.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = focusableWithin();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        // Nothing to move to; keep focus inside rather than escaping to the
        // page behind the overlay.
        event.preventDefault();
        return;
      }

      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, focusableWithin]);

  // Stop the page behind the overlay from scrolling.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center p-4",
        "bg-text-primary/40 sm:items-center",
      )}
      onClick={
        closeOnOverlayClick
          ? (event) => {
              if (event.target === event.currentTarget) onClose();
            }
          : undefined
      }
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "max-h-full w-full max-w-lg overflow-y-auto rounded-xl",
          "border border-border bg-surface p-6 shadow-lifted",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <Heading level={2} size="md" id={titleId}>
            {title}
          </Heading>
          <IconButton
            ref={closeButtonRef}
            label={closeLabel}
            icon={<CloseIcon />}
            onClick={onClose}
            className="-mt-1 -mr-2"
          />
        </div>

        {description ? (
          <Text tone="secondary" id={descriptionId} className="mt-2">
            {description}
          </Text>
        ) : null}

        {children ? <div className="mt-4">{children}</div> : null}

        {footer ? (
          <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
