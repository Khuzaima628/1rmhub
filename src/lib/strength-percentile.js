// Strength percentiles from OpenPowerlifting competition results.
// Shared by the data script (scripts/opl-percentiles.mjs), the page and the
// browser calculator, so weight classes and lookups can never disagree.

/**
 * IPF weight classes (kg). A lifter belongs to the first class whose upper
 * limit is at or above their bodyweight; above the last limit is the "+" class.
 */
export const CLASSES = {
  M: [
    { id: '59', label: '59 kg', max: 59 },
    { id: '66', label: '66 kg', max: 66 },
    { id: '74', label: '74 kg', max: 74 },
    { id: '83', label: '83 kg', max: 83 },
    { id: '93', label: '93 kg', max: 93 },
    { id: '105', label: '105 kg', max: 105 },
    { id: '120', label: '120 kg', max: 120 },
    { id: '120+', label: '120+ kg', max: Infinity },
  ],
  F: [
    { id: '47', label: '47 kg', max: 47 },
    { id: '52', label: '52 kg', max: 52 },
    { id: '57', label: '57 kg', max: 57 },
    { id: '63', label: '63 kg', max: 63 },
    { id: '69', label: '69 kg', max: 69 },
    { id: '76', label: '76 kg', max: 76 },
    { id: '84', label: '84 kg', max: 84 },
    { id: '84+', label: '84+ kg', max: Infinity },
  ],
};

export const LIFT_LABELS = { squat: 'Squat', bench: 'Bench press', deadlift: 'Deadlift', total: 'Total' };

/**
 * Extra lightest class open only to Sub-Junior (14–18) and Junior (19–23)
 * lifters (IPF Technical Rulebook 2026, 1.2 Bodyweight categories).
 */
export const YOUTH_CLASS = {
  M: { id: '53', label: '53 kg', max: 53 },
  F: { id: '43', label: '43 kg', max: 43 },
};

/**
 * Competition class for a bodyweight in kg. Sub-Junior and Junior lifters
 * at or under the youth limit go in the youth class; everyone else uses the
 * open classes (classFor). Returns { id, label, max, min } where min is the
 * lowest bodyweight in that class (0 for the lightest class).
 */
export function competitionClassFor(sex, bwKg, youth = false) {
  if (!CLASSES[sex]) throw new Error(`Unknown sex: ${sex}`);
  const list = classList(sex, youth);
  const i = list.findIndex((c) => bwKg <= c.max);
  return list[i];
}

/** All classes in order with their bodyweight ranges (min is exclusive above 0: next class starts 0.01 kg over). */
export function classList(sex, youth = false) {
  const base = CLASSES[sex];
  if (!base) throw new Error(`Unknown sex: ${sex}`);
  const list = youth ? [YOUTH_CLASS[sex], ...base] : base;
  return list.map((c, i) => ({ ...c, min: i === 0 ? 0 : list[i - 1].max }));
}

/** Validate a bodyweight for the class finder (kg). */
export function validateBodyweight(sex, bwKg) {
  if (sex !== 'M' && sex !== 'F') return { ok: false, field: 'sex', error: 'Choose men or women.' };
  if (!Number.isFinite(bwKg) || bwKg < 30 || bwKg > 250) {
    return { ok: false, field: 'bodyweight', error: 'Enter a bodyweight between 30 and 250 kg (66–551 lb).' };
  }
  return { ok: true };
}

/** IPF class for a bodyweight in kg. */
export function classFor(sex, bwKg) {
  const list = CLASSES[sex];
  if (!list) throw new Error(`Unknown sex: ${sex}`);
  return list.find((c) => bwKg <= c.max);
}

/**
 * Percentile of `value` within a list of the 1st..99th percentiles (ascending).
 * Returns { pct, edge } where pct is an integer 1–99 and edge is 'below' when
 * the value is under the 1st percentile, 'above' when at or over the 99th.
 */
export function percentileOf(q, value) {
  if (!Array.isArray(q) || q.length !== 99) throw new Error('Expected 99 percentile values');
  if (value < q[0]) return { pct: 1, edge: 'below' };
  if (value >= q[98]) return { pct: 99, edge: 'above' };
  // Highest percentile whose value is at or below `value`.
  let i = 0;
  while (i < 98 && q[i + 1] <= value) i++;
  const lo = q[i];
  const hi = q[i + 1];
  const frac = hi > lo ? (value - lo) / (hi - lo) : 0;
  return { pct: Math.min(99, Math.max(1, Math.floor(i + 1 + frac))), edge: null };
}

/** Validate calculator input. Weights already converted to kg. */
export function validateStrengthInput({ sex, bwKg, liftKg }) {
  if (sex !== 'M' && sex !== 'F') return { ok: false, field: 'sex', error: 'Choose men or women.' };
  if (!Number.isFinite(bwKg) || bwKg < 30 || bwKg > 250) {
    return { ok: false, field: 'bodyweight', error: 'Enter a bodyweight between 30 and 250 kg (66–551 lb).' };
  }
  if (!Number.isFinite(liftKg) || liftKg <= 0 || liftKg > 1500) {
    return { ok: false, field: 'lift', error: 'Enter the weight you lifted, greater than 0.' };
  }
  return { ok: true };
}
