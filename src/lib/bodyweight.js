/**
 * Weighted bodyweight lifts (pull-ups, chin-ups, dips): the load moved is
 * bodyweight + added weight, so the six 1RM formulas run on that total and the
 * bodyweight is taken off again to give the added weight for a max.
 * Pure functions; any single unit in, the same unit out.
 *
 * Caveat shown on the page: the formulas were developed on barbell lifts and
 * have not been validated for bodyweight exercises, so results are estimates.
 */
import { estimateAll, validateWeight, validateInput, MAX_WEIGHT } from './onerepmax.js';

/**
 * Validate a weighted set. Added weight may be empty or 0 (bodyweight only).
 * Returns { ok: true, bodyweight, added, reps } or { ok: false, error, field }.
 */
export function validateBodyweightSet(rawBodyweight, rawAdded, rawReps) {
  const bw = validateWeight(rawBodyweight, 'your bodyweight');
  if (!bw.ok) return { ...bw, field: 'bodyweight' };

  const addedText = rawAdded == null ? '' : String(rawAdded).trim();
  const added = addedText === '' ? 0 : Number(addedText);
  if (!Number.isFinite(added)) {
    return { ok: false, field: 'added', error: 'Please enter the added weight as a number, or leave it empty for bodyweight only.' };
  }
  if (added < 0) {
    return { ok: false, field: 'added', error: 'Assisted reps (negative added weight) are not supported — enter 0 for bodyweight only.' };
  }
  if (bw.value + added > MAX_WEIGHT) {
    return { ok: false, field: 'added', error: `Bodyweight plus added weight is more than ${MAX_WEIGHT} — please check the numbers and the unit.` };
  }

  const set = validateInput(bw.value + added, rawReps);
  if (!set.ok) return set;
  return { ok: true, bodyweight: bw.value, added, reps: set.reps };
}

/**
 * Estimate a weighted bodyweight lift. Returns the full-load estimate from
 * estimateAll plus the added weight (load − bodyweight) for a 1RM: average,
 * lowest and highest formula.
 */
export function estimateBodyweightLift(bodyweight, added, reps) {
  const total = estimateAll(bodyweight + added, reps);
  return {
    total,
    addedAverage: total.average - bodyweight,
    addedMin: total.min - bodyweight,
    addedMax: total.max - bodyweight,
  };
}

/**
 * Added weight for 2–10 reps from an estimated full-load 1RM, using the Epley
 * equation solved backwards (the same method as the site's rep-max table).
 * `added` below zero means bodyweight alone is already heavier than needed.
 */
export function addedForReps(total1rm, bodyweight) {
  const rows = [];
  for (let r = 2; r <= 10; r += 1) {
    rows.push({ reps: r, added: total1rm / (1 + r / 30) - bodyweight });
  }
  return rows;
}
