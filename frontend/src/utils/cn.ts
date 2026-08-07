/**
 * Minimal className joiner. Avoids pulling in clsx/tailwind-merge for a
 * one-line utility — accepts strings, falsy values, and objects mapping
 * class -> boolean.
 */
type ClassValue = string | number | bigint | boolean | null | undefined | Record<string, boolean | undefined>;

export function cn(...values: ClassValue[]): string {
  const classes: string[] = [];

  for (const value of values) {
    if (!value) continue;

    if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
      classes.push(String(value));
      continue;
    }

    if (typeof value === "boolean") continue;

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) classes.push(key);
    }
  }

  return classes.join(" ");
}
