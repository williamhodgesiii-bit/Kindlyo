import type { ChangeEventHandler } from "react";
import { Text } from "@/components/ui/Typography";

/**
 * A labelled text input, so the auth forms share one accessible field rather
 * than four hand-wired ones. The `label` is always associated with the input by
 * `htmlFor`/`id`, which is the `jsx-a11y/label-has-associated-control` rule the
 * project treats as an error.
 */
export function LabeledInput({
  id,
  name,
  label,
  type,
  value,
  onChange,
  autoComplete,
  hint,
  hintId,
  maxLength,
  required,
}: {
  id: string;
  name: string;
  label: string;
  type: "email" | "password";
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  autoComplete: string;
  hint?: string;
  hintId?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold">
        {label}
      </label>
      {hint ? (
        <Text
          id={hintId}
          tone="secondary"
          size="sm"
          className="mt-1 max-w-prose"
        >
          {hint}
        </Text>
      ) : null}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required={required}
        aria-describedby={hint ? hintId : undefined}
        className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2 text-base"
      />
    </div>
  );
}
