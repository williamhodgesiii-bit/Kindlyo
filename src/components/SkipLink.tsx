/**
 * Skip link: the first thing a keyboard or screen-reader user reaches, letting
 * them jump past the navigation straight to the page content.
 *
 * Visually hidden until focused — never `display: none`, which would remove it
 * from the tab order entirely.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-md bg-brand-primary px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
    >
      Skip to main content
    </a>
  );
}
