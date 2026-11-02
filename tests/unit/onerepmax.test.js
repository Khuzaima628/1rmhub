/**
 * StrengthCalc formula verification suite.
 *
 * Rule one of the project: never display an incorrect calculation. These tests
 * lock the formula math to hand-verified examples, so a future edit can never
 * silently break a calculation. Run with: npm test
 */
import { describe, it, expect } from 'vitest';
import {
  epley,
  brzycki,
  lombardi,
  mayhew,
  oconner,
  wathan,
  estimateAll,
  confidenceNote,
  validateInput,
  percentageTable,
  repMaxTable,
  solvePlates,
  warmupSets,
  toKg,
  fromKg,
  KG_PLATES,
  LB_PLATES,
  LB_PER_KG,
  validateWeight,
  loadableDown,
  percentOf,
  formulaGrid,
  repsAtPercent,
  FORMULAS,
} from '../../src/lib/onerepmax.js';

// Round to 2 decimals for stable comparisons (display-level precision).
const r2 = (v) => Math.round(v * 100) / 100;

describe('golden test case — 100 kg × 5 reps (hand-verified)', () => {
  const w = 100;
  const r = 5;

  it('Epley: 100 × (1 + 5/30) = 116.67', () => {
    expect(r2(epley(w, r))).toBe(116.67);
  });

  it('Brzycki: 100 × 36/(37−5) = 112.50', () => {
    expect(r2(brzycki(w, r))).toBe(112.5);
  });

  it('Lombardi: 100 × 5^0.10 = 117.46', () => {
    expect(r2(lombardi(w, r))).toBe(117.46);
  });

  it('Mayhew: 100×100/(52.2 + 41.9e^(−0.055×5)) = 119.01', () => {
    expect(r2(mayhew(w, r))).toBe(119.01);
  });

  it("O'Conner: 100 × (1 + 0.025×5) = 112.50", () => {
    expect(r2(oconner(w, r))).toBe(112.5);
  });

  it('Wathan: 100×100/(48.8 + 53.8e^(−0.075×5)) = 116.58', () => {
    expect(r2(wathan(w, r))).toBe(116.58);
  });

  it('Average Estimate ≈ 115.8 and range 112.5–119.0', () => {
    const est = estimateAll(w, r);
    expect(est.rows).toHaveLength(6);
    expect(r2(est.average)).toBe(115.79);
    expect(r2(est.min)).toBe(112.5);
    expect(r2(est.max)).toBe(119.01);
  });
});

describe('exactly six formulas in v1 — no Lander', () => {
  it('exports six formula rows', () => {
    const est = estimateAll(100, 5);
    expect(est.rows.map((row) => row.id)).toEqual([
      'epley',
      'brzycki',
      'lombardi',
      'mayhew',
      'oconner',
      'wathan',
    ]);
  });
});

describe('1-rep edge case', () => {
  it('returns the weight unchanged with an explanation flag', () => {
    const est = estimateAll(100, 1);
    expect(est.oneRep).toBe(true);
    for (const row of est.rows) {
      expect(r2(row.value)).toBe(100);
      expect(row.estimated).toBe(false);
    }
    expect(confidenceNote(1)).toMatch(/no estimation was needed/i);
  });
});

describe('unit conversion', () => {
  it('100 kg = 220.46 lb', () => {
    expect(r2(fromKg(100, 'lb'))).toBe(220.46);
  });

  it('220.46 lb converts back to ~100 kg', () => {
    expect(r2(toKg(220.46, 'lb'))).toBe(100);
  });

  it('kg input is untouched', () => {
    expect(toKg(100, 'kg')).toBe(100);
    expect(fromKg(100, 'kg')).toBe(100);
  });

  it('conversion factor is the standard 2.20462', () => {
    expect(LB_PER_KG).toBe(2.20462);
  });
});

describe('input validation — plain-language errors, never NaN', () => {
  it('accepts valid input', () => {
    expect(validateInput('100', '5')).toEqual({ ok: true, weight: 100, reps: 5 });
  });

  it('rejects zero weight', () => {
    const v = validateInput('0', '5');
    expect(v.ok).toBe(false);
    expect(v.error).toMatch(/more than zero/i);
  });

  it('rejects negative weight', () => {
    expect(validateInput('-50', '5').ok).toBe(false);
  });

  it('rejects non-numeric weight', () => {
    const v = validateInput('heavy', '5');
    expect(v.ok).toBe(false);
    expect(v.error).toMatch(/as a number/i);
  });

  it('rejects empty weight', () => {
    expect(validateInput('', '5').ok).toBe(false);
  });

  it('rejects reps above 12 with a no-number explanation', () => {
    const v = validateInput('100', '15');
    expect(v.ok).toBe(false);
    expect(v.error).toMatch(/more than 12 reps/i);
  });

  it('rejects non-integer reps', () => {
    expect(validateInput('100', '5.5').ok).toBe(false);
  });

  it('rejects reps below 1', () => {
    expect(validateInput('100', '0').ok).toBe(false);
  });
});

describe('percentage table', () => {
  it('has the standard 10 steps from 100% to 50%', () => {
    const rows = percentageTable(116.67, 'kg');
    expect(rows.map((row) => row.pct)).toEqual([100, 95, 90, 85, 80, 75, 70, 65, 60, 50]);
  });

  it('95% of a 116.67 kg Epley result reads 110.8 raw (golden case)', () => {
    const rows = percentageTable(116.67, 'kg');
    expect(r2(rows[1].raw)).toBe(110.84);
  });

  it('rounds to loadable 2.5 kg increments', () => {
    const rows = percentageTable(116.67, 'kg');
    for (const row of rows) {
      expect(Number((row.loadable / 2.5).toFixed(6)) % 1).toBe(0);
    }
  });

  it('rounds to loadable 5 lb increments in lb mode', () => {
    const rows = percentageTable(257.2, 'lb');
    for (const row of rows) {
      expect(Number((row.loadable / 5).toFixed(6)) % 1).toBe(0);
    }
  });
});

describe('2RM–10RM estimates', () => {
  it('returns 9 rows, decreasing as reps rise', () => {
    const rows = repMaxTable(115.79);
    expect(rows).toHaveLength(9);
    expect(rows[0].reps).toBe(2);
    expect(rows[8].reps).toBe(10);
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].value).toBeLessThan(rows[i - 1].value);
    }
  });

  it('2RM of 115.79 ≈ 108.55 (Epley backwards)', () => {
    expect(r2(repMaxTable(115.79)[0].value)).toBe(108.55);
  });
});

describe('plate solver — round down, show the shortfall', () => {
  it('100 kg on a 20 kg bar: 40 kg/side, greedy fewest plates = 25 + 15', () => {
    const solved = solvePlates(100, 20, KG_PLATES);
    expect(r2(solved.loaded)).toBe(100);
    expect(solved.shortfall).toBe(0);
    expect(solved.perSide).toEqual([25, 15]);
  });

  it('never exceeds the target: 113 kg target loads 112.5 kg, shortfall shown', () => {
    const solved = solvePlates(113, 20, KG_PLATES);
    expect(solved.loaded).toBeLessThanOrEqual(113);
    expect(r2(solved.loaded)).toBe(112.5);
    expect(r2(solved.shortfall)).toBe(0.5);
  });

  it('respects plate availability: no 2.5s ticked changes the solution', () => {
    const full = solvePlates(107.5, 20, KG_PLATES);
    const limited = solvePlates(107.5, 20, [25, 20, 15, 10, 5]);
    expect(full.loaded).toBeGreaterThanOrEqual(limited.loaded);
  });

  it('respects bar weight: a 15 kg bar changes the plates used', () => {
    const solved = solvePlates(100, 15, KG_PLATES);
    expect(solved.perSide.reduce((s, p) => s + p, 0)).toBe(42.5);
  });

  it('target lighter than the bar: flags belowBar and never suggests the (heavier) bar', () => {
    const solved = solvePlates(10, 20, KG_PLATES);
    expect(solved.perSide).toEqual([]);
    expect(solved.belowBar).toBe(true);
    expect(solved.loaded).toBeLessThanOrEqual(10);
  });

  it('target equal to the bar: bar only, exact', () => {
    expect(solvePlates(20, 20, KG_PLATES)).toMatchObject({ loaded: 20, shortfall: 0, perSide: [], belowBar: false });
  });

  it('finds the best combination where largest-first fails (only 20s and 15s, 30 per side)', () => {
    // Greedy would load one 20 per side (60 kg); two 15s per side reaches 80 exactly.
    const solved = solvePlates(80, 20, [20, 15]);
    expect(solved.loaded).toBe(80);
    expect(solved.perSide).toEqual([15, 15]);
  });

  it('prefers the fewest plates, heaviest first, among exact answers', () => {
    expect(solvePlates(225, 45, LB_PLATES).perSide).toEqual([45, 45]);
    expect(solvePlates(315, 45, LB_PLATES).perSide).toEqual([45, 45, 45]);
  });

  it('works in pounds without float drift (lb plates in lb)', () => {
    const solved = solvePlates(137.5, 45, LB_PLATES);
    expect(solved.loaded).toBe(135);
    expect(solved.shortfall).toBe(2.5);
  });

  it('no plates ticked: bar only, shortfall shown', () => {
    expect(solvePlates(100, 20, [])).toMatchObject({ loaded: 20, shortfall: 80, perSide: [] });
  });

  it('supports fractional and custom plates, and ignores zero/negative/NaN sizes', () => {
    expect(solvePlates(101, 20, [...KG_PLATES, 0.5]).loaded).toBe(101);
    expect(solvePlates(100, 20, [25, 15, 0, -5, NaN, 0.0001]).perSide).toEqual([25, 15]);
  });

  it('custom bar of 0 (machine) works', () => {
    expect(solvePlates(50, 0, KG_PLATES).loaded).toBe(50);
  });

  it('never exceeds the target across many targets, bars and plate sets', () => {
    const sets = [KG_PLATES, [20, 15], [25, 10, 2.5], [15], [5, 1.25]];
    for (const plates of sets) {
      for (const bar of [0, 10, 15, 20]) {
        for (let t = 1; t <= 300; t += 0.75) {
          const s = solvePlates(t, bar, plates);
          if (!s.belowBar) {
            expect(s.loaded).toBeLessThanOrEqual(t + 1e-9);
            expect(r2(s.loaded + s.shortfall)).toBe(r2(t));
            expect(r2(bar + 2 * s.perSide.reduce((a, p) => a + p, 0))).toBe(r2(s.loaded));
          }
        }
      }
    }
  });

  it('rejects invalid targets instead of returning garbage', () => {
    expect(() => solvePlates(NaN, 20, KG_PLATES)).toThrow(RangeError);
    expect(() => solvePlates(-5, 20, KG_PLATES)).toThrow(RangeError);
    expect(() => solvePlates(100, -1, KG_PLATES)).toThrow(RangeError);
  });
});

describe('warm-up sets', () => {
  it('starts at the bar, climbs, and ends at the lifter’s own top set', () => {
    const sets = warmupSets({ topWeight: 100, topReps: 5, startWeight: 20, percents: [50, 70, 85], repsPerSet: [8, 5, 3, 1] });
    expect(sets.map((s) => s.weight)).toEqual([20, 50, 70, 85, 100]);
    expect(sets.map((s) => s.reps)).toEqual([8, 5, 3, 1, 5]);
    expect(sets[sets.length - 1]).toMatchObject({ label: 'Top set', weight: 100, reps: 5 });
  });

  it('never generates a warm-up heavier than the top set, and sorts/dedupes jumps', () => {
    const sets = warmupSets({ topWeight: 100, topReps: 3, startWeight: 20, percents: [85, 50, 50, 120, 100], repsPerSet: [] });
    const warmups = sets.slice(0, -1);
    expect(warmups.map((s) => s.weight)).toEqual([20, 50, 85]);
    for (const s of warmups) expect(s.weight).toBeLessThan(100);
  });

  it('skips jumps at or below the starting weight, so the ramp only climbs', () => {
    const sets = warmupSets({ topWeight: 100, topReps: 5, startWeight: 60, percents: [50, 60, 80], repsPerSet: [] });
    expect(sets.map((s) => s.weight)).toEqual([60, 80, 100]);
    for (let i = 1; i < sets.length; i += 1) expect(sets[i].weight).toBeGreaterThan(sets[i - 1].weight);
  });

  it('fills missing reps with fewer reps as the load climbs', () => {
    const sets = warmupSets({ topWeight: 200, topReps: 1, startWeight: 45, percents: [50, 70, 90], repsPerSet: [10] });
    expect(sets.map((s) => s.reps)).toEqual([10, 5, 3, 1, 1]);
  });

  it('start at or above the top set: just the top set', () => {
    expect(warmupSets({ topWeight: 40, topReps: 8, startWeight: 45, percents: [50], repsPerSet: [] }))
      .toEqual([{ label: 'Top set', weight: 40, reps: 8, pct: 100 }]);
  });

  it('start of 0 (no bar) skips the start set', () => {
    const sets = warmupSets({ topWeight: 100, topReps: 5, startWeight: 0, percents: [50], repsPerSet: [] });
    expect(sets.map((s) => s.label)).toEqual(['Warm-up 1', 'Top set']);
  });
});

describe('confidence notes match the actual formula spread', () => {
  const spread = Object.fromEntries(formulaGrid(1, 12).map((r) => [r.reps, r.spreadPct]));

  it('warns strongly on 11–12 reps, where the spread is largest', () => {
    expect(confidenceNote(11)).toMatch(/unreliable/i);
    expect(spread[12]).toBeGreaterThan(12);
    expect(spread[12]).toBeGreaterThan(Math.max(...[2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => spread[r])));
  });

  it('says formulas agree most closely at 4–6 reps — and that is true', () => {
    expect(confidenceNote(5)).toMatch(/agree most closely/i);
    const mid = Math.max(spread[5], spread[6]);
    for (const r of [2, 3, 9, 10, 11, 12]) expect(spread[r]).toBeGreaterThan(mid);
  });

  it('does NOT claim close agreement at 2–3 reps (Mayhew reads high there)', () => {
    expect(confidenceNote(3)).not.toMatch(/agree closely/i);
    expect(confidenceNote(3)).toMatch(/Mayhew/);
  });
});

describe('validation edge cases', () => {
  it('rejects weights above the sanity limit, Infinity and whitespace', () => {
    expect(validateInput('5000', '5').ok).toBe(false);
    expect(validateInput('Infinity', '5').ok).toBe(false);
    expect(validateInput('   ', '5').ok).toBe(false);
  });

  it('accepts decimal weights and trims whitespace', () => {
    expect(validateInput(' 102.5 ', ' 3 ')).toEqual({ ok: true, weight: 102.5, reps: 3 });
  });

  it('names the field to fix', () => {
    expect(validateInput('', '5').field).toBe('weight');
    expect(validateInput('100', '20').field).toBe('reps');
  });

  it('accepts exactly 12 reps and rejects 13', () => {
    expect(validateInput('100', '12').ok).toBe(true);
    expect(validateInput('100', '13').ok).toBe(false);
  });

  it('validateWeight handles null/undefined without throwing', () => {
    expect(validateWeight(null).ok).toBe(false);
    expect(validateWeight(undefined).ok).toBe(false);
  });
});

describe('estimates in pounds equal estimates in kilograms (unit-agnostic math)', () => {
  it('225 lb × 5 → same 1RM whether computed in lb or via kg', () => {
    const inLb = estimateAll(225, 5).average;
    const viaKg = fromKg(estimateAll(toKg(225, 'lb'), 5).average, 'lb');
    expect(r2(inLb)).toBe(r2(viaKg));
  });
});

describe('loadable rounding never rounds up', () => {
  it('rounds down to the step, with float-noise protection', () => {
    expect(loadableDown(112.49999999999, 2.5)).toBe(112.5);
    expect(loadableDown(114.9, 2.5)).toBe(112.5);
    expect(loadableDown(239.9, 5)).toBe(235);
  });

  it('percentage-table loadable is never above the exact value', () => {
    for (let e1rm = 40; e1rm < 400; e1rm += 1.37) {
      for (const unit of ['kg', 'lb']) {
        for (const row of percentageTable(e1rm, unit)) expect(row.loadable).toBeLessThanOrEqual(row.raw + 1e-9);
      }
    }
  });

  it('80% of 300 lb = 240 lb exactly (FAQ example)', () => {
    const row = percentOf(toKg(300, 'lb'), 80, 'lb');
    expect(r2(row.raw)).toBe(240);
    expect(row.loadable).toBe(240);
  });
});

describe('reps-at-percentage table', () => {
  it('Epley and Brzycki inverses agree at 75% (10 reps)', () => {
    const r = repsAtPercent(75);
    expect(r2(r.epley)).toBe(10);
    expect(r2(r.brzycki)).toBe(10);
  });

  it('round-trips: weight at implied reps gives back the 1RM', () => {
    for (const pct of [95, 90, 85, 80, 70]) {
      const { epley: re, brzycki: rb } = repsAtPercent(pct);
      expect(r2(epley(pct, re))).toBe(100);
      expect(r2(brzycki(pct, rb))).toBe(100);
    }
  });
});

describe('published claims about the formulas are true (src/data/formulas.ts, guides)', () => {
  const grid = formulaGrid(1, 12);
  const at = (reps) => grid.find((r) => r.reps === reps);
  const lowestIds = (reps) => {
    const row = at(reps);
    const min = Math.min(...Object.values(row.byFormula));
    return Object.keys(row.byFormula).filter((id) => Math.abs(row.byFormula[id] - min) < 1e-9);
  };
  const highestIds = (reps) => {
    const row = at(reps);
    const max = Math.max(...Object.values(row.byFormula));
    return Object.keys(row.byFormula).filter((id) => Math.abs(row.byFormula[id] - max) < 1e-9);
  };

  it('Mayhew is highest at 1–6 reps and gives ~109% for one rep', () => {
    for (let r = 1; r <= 6; r += 1) expect(highestIds(r)).toContain('mayhew');
    expect(Math.round(mayhew(100, 1))).toBe(109);
  });
  it('Wathan is highest at 7–10 reps and within ~1% of Epley at 3–8', () => {
    for (let r = 7; r <= 10; r += 1) expect(highestIds(r)).toContain('wathan');
    for (let r = 3; r <= 8; r += 1) expect(Math.abs(wathan(100, r) / epley(100, r) - 1)).toBeLessThan(0.01);
  });
  it('Brzycki is lowest at 2–5 (tied with O’Conner at 5), equals Epley at 10, highest at 11–12', () => {
    for (let r = 2; r <= 5; r += 1) expect(lowestIds(r)).toContain('brzycki');
    expect(lowestIds(5)).toContain('oconner');
    expect(r2(brzycki(100, 10))).toBe(r2(epley(100, 10)));
    for (const r of [11, 12]) expect(highestIds(r)).toContain('brzycki');
  });
  it('O’Conner is lowest at 6–10; Lombardi lowest at 11–12', () => {
    for (let r = 6; r <= 10; r += 1) expect(lowestIds(r)).toContain('oconner');
    for (const r of [11, 12]) expect(lowestIds(r)).toContain('lombardi');
  });
  it('Epley is never the lowest or highest from 2 to 10 reps', () => {
    for (let r = 2; r <= 10; r += 1) {
      expect(lowestIds(r)).not.toContain('epley');
      expect(highestIds(r)).not.toContain('epley');
    }
  });
  it('spread: under 6% at 5–7 reps, about 6–8% at 3–6, over 12% at 12', () => {
    for (const r of [5, 6, 7]) expect(at(r).spreadPct).toBeLessThan(6);
    for (const r of [3, 4, 5, 6]) expect(at(r).spreadPct).toBeGreaterThan(5.5);
    for (const r of [3, 4, 5, 6]) expect(at(r).spreadPct).toBeLessThan(8);
    expect(at(12).spreadPct).toBeGreaterThan(12);
  });
  it('one rep: raw formulas would add up to 9% (shown in the one-rep notice)', () => {
    const raw = FORMULAS.map((f) => f.fn(100, 1) - 100);
    expect(Math.min(...raw)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...raw)).toBeLessThan(9);
    expect(raw.filter((v) => v > 0).every((v) => v >= 1)).toBe(true);
  });
  it('worked examples quoted in page copy', () => {
    const range = (w, r) => [estimateAll(w, r).min, estimateAll(w, r).max].map((v) => Math.round(v));
    expect(range(185, 5)).toEqual([208, 220]); // bench page
    expect(range(225, 5)).toEqual([253, 268]); // squat page
    expect(range(315, 3)).toEqual([334, 359]); // deadlift page
    expect(range(115, 5)).toEqual([129, 137]); // overhead press page
    expect(range(135, 8)).toEqual([162, 172]); // row page
    expect(epley(225, 5)).toBe(262.5); // homepage FAQ
  });
});
