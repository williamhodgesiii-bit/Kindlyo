/**
 * Site footer.
 *
 * The draft-content notice is a product requirement: we must never imply
 * professional, psychological, educational, or clinical validation that has not
 * occurred (CLAUDE.md, "Content status").
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-text-secondary">
        <p>
          Kindlyo is an early-stage product. All learning content is draft
          content and has not yet been reviewed by qualified specialists.
        </p>
      </div>
    </footer>
  );
}
