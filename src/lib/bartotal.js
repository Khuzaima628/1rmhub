/**
 * Reverse plate calculator ("what's on the bar?"): total weight from the bar
 * and the plates loaded on ONE side, assuming both sides match.
 * Pure functions; any single unit in, the same unit out.
 */

/** Most plates of one size a lifter could fit on one side of a bar. */
export const MAX_PLATES_PER_SIZE = 20;

/**
 * Validate per-side plate counts given as { [plateSize]: rawText }.
 * Empty means 0. Returns { ok: true, counts: [{ size, count }] } or
 * { ok: false, size, error }.
 */
export function validatePlateCounts(raw) {
  const counts = [];
  for (const [sizeText, value] of Object.entries(raw)) {
    const size = Number(sizeText);
    const text = value == null ? '' : String(value).trim();
    const count = text === '' ? 0 : Number(text);
    if (!Number.isInteger(count) || count < 0) {
      return { ok: false, size, error: `Plates of ${size}: enter a whole number of plates (0 or more).` };
    }
    if (count > MAX_PLATES_PER_SIZE) {
      return { ok: false, size, error: `Plates of ${size}: more than ${MAX_PLATES_PER_SIZE} on one side is not realistic — please check the number.` };
    }
    counts.push({ size, count });
  }
  return { ok: true, counts };
}

/** Total on the bar: bar + 2 × (plates on one side). Returns { perSide, total }. */
export function barTotal(bar, counts) {
  if (!(bar >= 0)) throw new RangeError('Bar weight must be zero or more');
  const perSide = counts.reduce((sum, c) => sum + c.size * c.count, 0);
  return { perSide, total: bar + 2 * perSide };
}
