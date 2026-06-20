/** D01 — Clamp a value to a range (defaults to [0, 1]). */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}
