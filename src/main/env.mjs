/**
 * Small environment parsing helpers used by agent-skill.
 *
 * Keeping these helpers dependency-free makes CLI and runtime artifact startup
 * predictable, and gives all config readers the same treatment of empty values.
 */

export function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function parseList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value !== "string" || !value.trim()) return [];
  return value.split(/[;,]/).map((item) => item.trim()).filter(Boolean);
}

export function stringField(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
