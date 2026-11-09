/**
 * 5/3/1 (Jim Wendler) main-lift sets from a training max.
 * Percentages are of the TRAINING MAX, not the 1RM. Week 4 is the deload.
 * The last set of weeks 1–3 is an "as many reps as possible" set (marked amrap),
 * done for at least the listed reps. Loadable weights round DOWN, the site-wide rule.
 * Pure functions; any single unit in, the same unit out.
 */
import { loadableDown } from './onerepmax.js';

export const WEEKS_531 = [
  { week: 1, name: 'Week 1 (5s)', sets: [{ pct: 65, reps: 5 }, { pct: 75, reps: 5 }, { pct: 85, reps: 5, amrap: true }] },
  { week: 2, name: 'Week 2 (3s)', sets: [{ pct: 70, reps: 3 }, { pct: 80, reps: 3 }, { pct: 90, reps: 3, amrap: true }] },
  { week: 3, name: 'Week 3 (5/3/1)', sets: [{ pct: 75, reps: 5 }, { pct: 85, reps: 3 }, { pct: 95, reps: 1, amrap: true }] },
  { week: 4, name: 'Week 4 (deload)', sets: [{ pct: 40, reps: 5 }, { pct: 50, reps: 5 }, { pct: 60, reps: 5 }] },
];

/** Training max increase per cycle: 5 lb / 2.5 kg upper body, 10 lb / 5 kg lower body. */
export function tmIncrease(lift, unit) {
  const lower = lift === 'squat' || lift === 'deadlift';
  if (unit === 'lb') return lower ? 10 : 5;
  return lower ? 5 : 2.5;
}

/**
 * Four weeks of sets for one lift. `trainingMax` and `step` (smallest loadable
 * jump) in the same unit. Returns WEEKS_531 with { weight, loadable } on every set.
 */
export function plan531(trainingMax, step) {
  if (!(trainingMax > 0)) throw new RangeError('Training max must be positive');
  if (!(step > 0)) throw new RangeError('Step must be positive');
  return WEEKS_531.map((w) => ({
    ...w,
    sets: w.sets.map((s) => {
      const weight = (trainingMax * s.pct) / 100;
      return { ...s, weight, loadable: loadableDown(weight, step) };
    }),
  }));
}
