/**
 * Emits a schema.org block for search engines.
 *
 * The data is always built in this repository from typed objects, never from
 * anything a visitor supplied, so the only escaping needed is for `<` — which
 * would otherwise let a stray sequence in authored copy close the script tag
 * early. `JSON.stringify` handles the rest.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
