// Smolov squat routine — BASE MESOCYCLE only. The original Russian text is not
// available; this is the version that independent published copies agree on
// (see the sources on /smolov-calculator/): four squat days a week, the same
// sets and percentages for three weeks, adding a fixed amount in weeks 2 and 3,
// then a fourth week to rest and re-test the 1RM.
import { loadStep, loadableDown } from './onerepmax.js';

/** Days of one base-cycle week: sets x reps at a percentage of the 1RM. */
export const SMOLOV_DAYS = [
  { day: 'Monday', sets: 4, reps: 9, pct: 70 },
  { day: 'Wednesday', sets: 5, reps: 7, pct: 75 },
  { day: 'Friday', sets: 7, reps: 5, pct: 80 },
  { day: 'Saturday', sets: 10, reps: 3, pct: 85 },
];

/** Fixed weight added on top of the percentages in weeks 1–3, per unit. */
export const SMOLOV_ADD = { kg: [0, 10, 15], lb: [0, 20, 30] };

/**
 * Base mesocycle for a squat 1RM in `unit` ('kg' or 'lb'). Weights are
 * rounded DOWN to a loadable step (2.5 kg / 5 lb), the same rule the rest of
 * the site uses, so a prescribed weight never exceeds the exact figure.
 * Returns three weeks of days plus the week-1 total of working reps.
 */
export function smolovBase(oneRm, unit) {
  if (unit !== 'kg' && unit !== 'lb') throw new Error(`Unknown unit: ${unit}`);
  const step = loadStep(unit);
  const weeks = SMOLOV_ADD[unit].map((add, i) => ({
    week: i + 1,
    add,
    days: SMOLOV_DAYS.map((d) => ({ ...d, weight: loadableDown((d.pct / 100) * oneRm + add, step) })),
  }));
  const repsPerWeek = SMOLOV_DAYS.reduce((sum, d) => sum + d.sets * d.reps, 0);
  return { weeks, repsPerWeek };
}
