/**
 * StrengthCalc 1RM formula engine.
 *
 * Pure functions only: no DOM, no network, no side effects.
 * All six formulas below are published estimation equations. They disagree
 * with each other on the same input — that disagreement is expected, and the
 * site always shows the full spread instead of hiding it behind one number.
 *
 * The formulas, tables and plate solver are unit-agnostic: pass every weight
 * in the SAME unit and the result comes back in that unit. toKg()/fromKg()
 * convert at the edges (input/output) only.
 */

// Exact-ish conversion factors used everywhere on the site.
export const LB_PER_KG = 2.20462;
export const KG_PER_LB = 1 / LB_PER_KG;

/** Convert a lifter-entered weight to kilograms. */
export function toKg(weight, unit) {
  return unit === 'lb' ? weight * KG_PER_LB : weight;
}

/** Convert kilograms to the display unit. */
export function fromKg(weightKg, unit) {
  return unit === 'lb' ? weightKg * LB_PER_KG : weightKg;
}

/* ------------------------------------------------------------------ */
/* The six published formulas (w = weight, r = reps).                  */
/* ------------------------------------------------------------------ */

/** Epley (1985) — linear, +3.33% per rep. */
export function epley(w, r) {
  return w * (1 + r / 30);
}

/** Brzycki (1993) — lowest of the six at 2–5 reps, rises fastest above 10; undefined at 37 reps. */
export function brzycki(w, r) {
  return (w * 36) / (37 - r);
}

/** Lombardi (1989) — power curve that flattens as reps rise. */
export function lombardi(w, r) {
  return w * Math.pow(r, 0.1);
}

/** Mayhew et al. (1992) — exponential; not anchored at 1 rep, so it reads high on very low-rep sets. */
export function mayhew(w, r) {
  return (100 * w) / (52.2 + 41.9 * Math.exp(-0.055 * r));
}

/** O'Conner et al. (1989) — linear, +2.5% per rep. */
export function oconner(w, r) {
  return w * (1 + 0.025 * r);
}

/** Wathan (1994, also spelled Wathen) — exponential; within ~1% of Epley at 3–8 reps. */
export function wathan(w, r) {
  return (100 * w) / (48.8 + 53.8 * Math.exp(-0.075 * r));
}

/**
 * The six formulas shipped in v1, in a fixed order used by the UI.
 * NOTE: Lander was found on competitors during research but is DELIBERATELY
 * excluded from v1 — it is only reconsidered after its equation and behaviour
 * are verified against published sources.
 */
export const FORMULAS = [
  { id: 'epley', name: 'Epley', equation: '1RM = w × (1 + r ÷ 30)', fn: epley },
  { id: 'brzycki', name: 'Brzycki', equation: '1RM = w × 36 ÷ (37 − r)', fn: brzycki },
  { id: 'lombardi', name: 'Lombardi', equation: '1RM = w × r^0.10', fn: lombardi },
  { id: 'mayhew', name: 'Mayhew', equation: '1RM = 100w ÷ (52.2 + 41.9e^(−0.055r))', fn: mayhew },
  { id: 'oconner', name: "O'Conner", equation: '1RM = w × (1 + 0.025 × r)', fn: oconner },
  { id: 'wathan', name: 'Wathan', equation: '1RM = 100w ÷ (48.8 + 53.8e^(−0.075r))', fn: wathan },
];

/**
 * Run all six formulas on a set. Returns one row per formula plus the
 * Average Estimate (the plain arithmetic mean of the six), the range and the
 * spread between the lowest and highest formula as a percentage.
 *
 * The Average Estimate is a SUMMARY of the spread — it is NOT a scientifically
 * validated consensus and is NEVER presented as more accurate than any
 * individual formula.
 *
 * Edge case: 1 rep means the lifter already did a single — there is nothing to
 * estimate, so every formula returns the weight unchanged, with an explanation.
 */
export function estimateAll(weight, reps) {
  const oneRep = reps === 1;
  const rows = FORMULAS.map((f) => ({
    id: f.id,
    name: f.name,
    equation: f.equation,
    // A true single needs no estimation; raw formulas would add up to 9%.
    value: oneRep ? weight : f.fn(weight, reps),
    estimated: !oneRep,
  }));
  const values = rows.map((r) => r.value);
  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return {
    rows,
    average,
    min,
    max,
    spreadPct: ((max - min) / min) * 100,
    oneRep,
  };
}

/**
 * Plain-language confidence note driven by rep count. Every statement here is
 * checked against the formula outputs in tests (see "confidence notes").
 */
export function confidenceNote(reps) {
  if (reps === 1) {
    return 'This is your tested single — no estimation was needed.';
  }
  if (reps <= 3) {
    return 'Low reps: the least extrapolation, so research favours heavy sets like this. The formulas still disagree by several percent here, mainly because Mayhew reads high on very low-rep sets.';
  }
  if (reps <= 6) {
    return 'Mid reps: the formulas agree most closely in this range. A solid estimate — 3–6 clean reps is the sweet spot.';
  }
  if (reps <= 10) {
    return 'Higher reps: the formulas start to spread apart and individual differences in muscular endurance matter more. Treat this as a rough guide, not a promise.';
  }
  // reps 11–12: allowed, but with the strongest warning.
  return 'Very high reps: estimates are unreliable here — the formulas diverge sharply and can miss your true max by a wide margin. For a better number, test with fewer reps.';
}

/* Input rules: 1–12 reps accepted. Above 12 the site shows no number. */
export const MIN_REPS = 1;
export const MAX_REPS = 12;
export const WARN_REPS = 10;
/** Upper sanity bound for any entered weight (kg or lb) — above every recorded lift. */
export const MAX_WEIGHT = 1500;

/**
 * Validate a single positive weight field. Returns { ok: true, value } or
 * { ok: false, error } with a plain-language explanation.
 */
export function validateWeight(raw, label = 'the weight you lifted') {
  const text = raw == null ? '' : String(raw).trim();
  const value = Number(text);
  const fail = (error) => ({ ok: false, error, field: 'weight' });
  if (text === '' || Number.isNaN(value)) {
    return fail(`Please enter ${label} as a number (for example 100).`);
  }
  if (!Number.isFinite(value)) {
    return fail('That weight does not look like a real number. Please try again.');
  }
  if (value <= 0) {
    return fail('The weight must be more than zero — you cannot estimate a max from nothing.');
  }
  if (value > MAX_WEIGHT) {
    return fail(`That is more than ${MAX_WEIGHT} — please check the number and the unit.`);
  }
  return { ok: true, value };
}

/**
 * Validate raw user input. Returns { ok: true, weight, reps } or
 * { ok: false, error, field } with a plain-language explanation — never NaN,
 * never a number for invalid input. `field` names the input to fix.
 */
export function validateInput(rawWeight, rawReps) {
  const w = validateWeight(rawWeight);
  if (!w.ok) return w;

  const repsText = rawReps == null ? '' : String(rawReps).trim();
  const reps = Number(repsText);
  if (repsText === '' || Number.isNaN(reps)) {
    return { ok: false, field: 'reps', error: `Please enter how many reps you completed as a whole number (${MIN_REPS} to ${MAX_REPS}).` };
  }
  if (!Number.isInteger(reps) || reps < MIN_REPS) {
    return { ok: false, field: 'reps', error: 'Reps must be a whole number of at least 1.' };
  }
  if (reps > MAX_REPS) {
    return {
      ok: false,
      field: 'reps',
      error:
        `We do not estimate from more than ${MAX_REPS} reps: the formulas diverge badly up there, ` +
        'and a number would be misleading. Try a heavier set of 3–6 clean reps instead.',
    };
  }
  return { ok: true, weight: w.value, reps };
}

/* ------------------------------------------------------------------ */
/* Training tables derived from an estimated 1RM.                       */
/* ------------------------------------------------------------------ */

/** Standard percentage steps shown on the training table. */
export const PERCENT_STEPS = [100, 95, 90, 85, 80, 75, 70, 65, 60, 50];

/** Smallest practical jump with standard plates: 2.5 kg or 5 lb (a pair of the smallest plates). */
export function loadStep(unit) {
  return unit === 'lb' ? 5 : 2.5;
}

const round3 = (v) => Math.round(v * 1000) / 1000;

/**
 * Round DOWN to the nearest loadable step — the same rule as the plate loader,
 * so a "loadable" number never exceeds the exact percentage it came from.
 * The epsilon absorbs float noise (e.g. 112.49999999 → 112.5, not 110).
 */
export function loadableDown(value, step) {
  return round3(Math.floor(value / step + 1e-9) * step);
}

/** One percentage row: exact value plus the loadable value, both in the display unit. */
export function percentOf(e1rmKg, pct, unit) {
  const raw = fromKg((pct / 100) * e1rmKg, unit);
  return { pct, raw, loadable: loadableDown(raw, loadStep(unit)) };
}

/** Percentage table rows for the standard steps (or a custom list). */
export function percentageTable(e1rmKg, unit, steps = PERCENT_STEPS) {
  return steps.map((pct) => percentOf(e1rmKg, pct, unit));
}

/**
 * 2RM–10RM estimates derived from an estimated 1RM via the Epley equation
 * solved backwards: w = 1RM ÷ (1 + r/30). Clearly labelled estimates.
 */
export function repMaxTable(e1rm) {
  const rows = [];
  for (let r = 2; r <= 10; r += 1) {
    rows.push({ reps: r, value: e1rm / (1 + r / 30) });
  }
  return rows;
}

/**
 * Formula comparison grid: for each rep count, every formula's estimate as a
 * percentage of the weight lifted (raw formula output — no 1-rep override),
 * plus the spread. Used to build the published comparison tables, so the
 * numbers on the site always come from the same code as the calculator.
 */
export function formulaGrid(fromReps = 1, toReps = MAX_REPS) {
  const rows = [];
  for (let r = fromReps; r <= toReps; r += 1) {
    const values = FORMULAS.map((f) => f.fn(100, r));
    const min = Math.min(...values);
    const max = Math.max(...values);
    rows.push({
      reps: r,
      byFormula: Object.fromEntries(FORMULAS.map((f, i) => [f.id, values[i]])),
      average: values.reduce((s, v) => s + v, 0) / values.length,
      spreadPct: ((max - min) / min) * 100,
      lowest: FORMULAS[values.indexOf(min)].id,
      highest: FORMULAS[values.indexOf(max)].id,
    });
  }
  return rows;
}

/**
 * Reps the formulas imply you could do at a given % of your 1RM, from the
 * two equations that invert cleanly:
 *   Epley:   r = 30 × (100/pct − 1)
 *   Brzycki: r = 37 − 36 × pct/100
 * Returned unrounded; real lifters vary widely around these numbers.
 */
export function repsAtPercent(pct) {
  return {
    pct,
    epley: 30 * (100 / pct - 1),
    brzycki: 37 - (36 * pct) / 100,
  };
}

/* ------------------------------------------------------------------ */
/* Plate loading.                                                       */
/* ------------------------------------------------------------------ */

/** Standard plate sets available in most gyms. The lifter ticks what they have. */
export const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
export const LB_PLATES = [45, 35, 25, 10, 5, 2.5];

/** Common bar weights (kg or lb). Custom values are also allowed. */
export const BAR_PRESETS = [
  { label: '20 kg (Olympic)', value: 20, unit: 'kg' },
  { label: '15 kg (women’s Olympic)', value: 15, unit: 'kg' },
  { label: '10 kg (technique bar)', value: 10, unit: 'kg' },
  { label: '45 lb (Olympic)', value: 45, unit: 'lb' },
  { label: '35 lb', value: 35, unit: 'lb' },
  { label: '15 lb (technique bar)', value: 15, unit: 'lb' },
];

const SCALE = 1000; // solve in integer thousandths to avoid float drift
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
/** Guard against pathological inputs; validated UI input never gets close. */
const MAX_CELLS = 1_000_000;

/**
 * Solve which plates to load per side for a target weight. All weights in
 * one unit (kg or lb) — the result comes back in the same unit.
 *
 * Rounding rule (stated on the page): the solver finds the HEAVIEST loadable
 * weight that does not exceed the target, using only the plate sizes the
 * lifter ticked (any number of each). Among combinations reaching that
 * weight it uses the fewest plates, largest first. The shortfall is shown
 * openly — the site never rounds up past the requested weight.
 *
 * If the target is lighter than the empty bar, nothing can be loaded without
 * exceeding it: `belowBar` is true and the UI explains instead of suggesting
 * the bar.
 *
 * Returns { loaded, shortfall, perSide, belowBar } — perSide lists one plate
 * per entry, heaviest first (the pair on the other side mirrors it).
 */
export function solvePlates(target, bar, availablePlates) {
  const t = Math.round(Number(target) * SCALE);
  const b = Math.round(Number(bar) * SCALE);
  if (!Number.isFinite(t) || !Number.isFinite(b) || t <= 0 || b < 0) {
    throw new RangeError('solvePlates needs a positive target and a non-negative bar weight');
  }
  if (t < b) {
    return { loaded: 0, shortfall: round3(t / SCALE), perSide: [], belowBar: true };
  }

  const plates = [...new Set(
    availablePlates.map(Number).filter((p) => Number.isFinite(p)).map((p) => Math.round(p * SCALE)),
  )].filter((p) => p > 0).sort((x, y) => y - x); // sizes below 0.0005 round to 0 and are dropped
  const perSideCap = Math.floor((t - b) / 2);
  const barOnly = { loaded: round3(b / SCALE), shortfall: round3((t - b) / SCALE), perSide: [], belowBar: false };
  if (!plates.length || perSideCap < plates[plates.length - 1]) return barOnly;

  // Unbounded "fewest coins" DP over multiples of the plates' common divisor.
  const unit = plates.reduce(gcd);
  const cells = Math.floor(perSideCap / unit);
  if (cells > MAX_CELLS) throw new RangeError('Target is too large for the plate solver');
  const steps = plates.map((p) => p / unit);
  const count = new Array(cells + 1).fill(Infinity);
  count[0] = 0;
  for (let s = 1; s <= cells; s += 1) {
    for (const step of steps) {
      if (step <= s && count[s - step] + 1 < count[s]) count[s] = count[s - step] + 1;
    }
  }
  let best = cells;
  while (best > 0 && count[best] === Infinity) best -= 1;

  // Rebuild the combination, taking the heaviest plate that stays optimal.
  const perSide = [];
  for (let s = best; s > 0;) {
    const step = steps.find((st) => st <= s && count[s - st] === count[s] - 1);
    perSide.push((step * unit) / SCALE);
    s -= step;
  }
  const loaded = b + 2 * best * unit;
  return { loaded: round3(loaded / SCALE), shortfall: round3((t - loaded) / SCALE), perSide, belowBar: false };
}

/* ------------------------------------------------------------------ */
/* Warm-up sets.                                                        */
/* ------------------------------------------------------------------ */

/** Default ramp: percentages of the top set, and reps for the start set + each jump. */
export const WARMUP_DEFAULT_PERCENTS = [50, 70, 85];
export const WARMUP_DEFAULT_REPS = [8, 5, 3, 1];

/** Reps used when the lifter gave fewer rep counts than sets: fewer reps as the load climbs. */
function defaultWarmupReps(fraction) {
  if (fraction < 0.6) return 5;
  if (fraction < 0.8) return 3;
  return 1;
}

/**
 * Build a warm-up ramp to a top set. All weights in one unit.
 *
 * - The first set is the starting weight (usually the empty bar).
 * - Each percentage becomes one set at that % of the top-set weight. Jumps
 *   are sorted, de-duplicated, and any that land at or below the starting
 *   weight or at/above the top set are dropped, so the ramp only climbs.
 * - repsPerSet[0] is the start set, repsPerSet[i] the i-th jump; missing
 *   values fall back to a descending default.
 * - The top set uses the lifter's own reps — the generator never invents a
 *   heavier or longer top set than the one requested.
 *
 * This is a STARTING SUGGESTION — the page frames it as adjustable by feel,
 * equipment and the lift, never as a prescription.
 */
export function warmupSets({ topWeight, topReps, startWeight, percents, repsPerSet = [] }) {
  const top = Number(topWeight);
  const start = Number(startWeight);
  const sets = [];
  if (start > 0 && start < top) {
    sets.push({ label: 'Warm-up 1', weight: round3(start), reps: repsPerSet[0] ?? 8, pct: (start / top) * 100 });
  }
  const jumps = [...new Set(percents.map(Number).filter((p) => Number.isFinite(p)))]
    .sort((a, b) => a - b)
    .map((pct) => ({ pct, weight: round3((pct / 100) * top) }))
    .filter((j) => j.weight > start && j.weight < top);
  jumps.forEach((j) => {
    const i = sets.length;
    sets.push({
      label: `Warm-up ${i + 1}`,
      weight: j.weight,
      reps: repsPerSet[i] ?? defaultWarmupReps(j.pct / 100),
      pct: j.pct,
    });
  });
  sets.push({ label: 'Top set', weight: round3(top), reps: topReps, pct: 100 });
  return sets;
}
