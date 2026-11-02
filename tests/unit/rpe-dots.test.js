/**
 * RPE (reps in reserve) and DOTS score verification.
 */
import { describe, it, expect } from 'vitest';
import {
  estimateAll, estimateFromRpe, validateRpeInput, rpeFraction, rirFromRpe, RPE_VALUES, epley,
} from '../../src/lib/onerepmax.js';
import { dotsScore, dotsDenominator, DOTS_COEFFICIENTS } from '../../src/lib/dots.js';

const r2 = (v) => Math.round(v * 100) / 100;

describe('RPE scale (RIR-based: RPE 10 = 0 RIR)', () => {
  it('maps RPE to reps in reserve', () => {
    expect(rirFromRpe(10)).toBe(0);
    expect(rirFromRpe(9)).toBe(1);
    expect(rirFromRpe(8.5)).toBe(1.5);
    expect(rirFromRpe(6)).toBe(4);
    expect(RPE_VALUES).toEqual([10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6]);
  });

  it('100 kg × 5 @ RPE 8 equals 100 kg × 7 to failure', () => {
    const rpe = estimateFromRpe(100, 5, 8);
    expect(rpe.effectiveReps).toBe(7);
    expect(r2(rpe.average)).toBe(r2(estimateAll(100, 7).average));
  });

  it('RPE 10 is the same as the normal calculator', () => {
    expect(estimateFromRpe(100, 5, 10).average).toBe(estimateAll(100, 5).average);
  });

  it('a single at RPE 10 is a tested max: returned unchanged', () => {
    const e = estimateFromRpe(140, 1, 10);
    expect(e.oneRep).toBe(true);
    expect(e.average).toBe(140);
  });

  it('a single at RPE 9 is estimated from 2 reps to failure (not returned unchanged)', () => {
    const e = estimateFromRpe(140, 1, 9);
    expect(e.oneRep).toBe(false);
    expect(e.average).toBeGreaterThan(140);
  });

  it('half RPE steps give fractional reps to failure', () => {
    expect(estimateFromRpe(100, 3, 8.5).effectiveReps).toBe(4.5);
    const v = estimateFromRpe(100, 3, 8.5).average;
    expect(v).toBeGreaterThan(estimateAll(100, 4).average);
    expect(v).toBeLessThan(estimateAll(100, 5).average);
  });
});

describe('RPE validation', () => {
  it('accepts a normal set', () => {
    expect(validateRpeInput('100', '5', '8')).toEqual({ ok: true, weight: 100, reps: 5, rpe: 8, effectiveReps: 7 });
  });
  it('rejects reps + RIR above 12', () => {
    const v = validateRpeInput('100', '10', '7');
    expect(v.ok).toBe(false);
    expect(v.error).toMatch(/13 reps to failure/);
  });
  it('accepts exactly 12 reps to failure', () => {
    expect(validateRpeInput('100', '8', '6').ok).toBe(true);
  });
  it('rejects unknown RPE values', () => {
    for (const bad of ['5', '11', '8.3', '', 'hard']) expect(validateRpeInput('100', '5', bad).field).toBe('rpe');
  });
  it('passes through weight/reps errors first', () => {
    expect(validateRpeInput('0', '5', '8').field).toBe('weight');
    expect(validateRpeInput('100', '0', '8').field).toBe('reps');
  });
});

describe('weight for reps at an RPE', () => {
  it('single at RPE 10 = 100%', () => {
    expect(rpeFraction(1, 10)).toBe(1);
  });
  it('5 reps at RPE 10 = Epley inverse at 5', () => {
    expect(rpeFraction(5, 10)).toBe(1 / (1 + 5 / 30));
  });
  it('5 reps at RPE 8 equals 7 reps at RPE 10', () => {
    expect(rpeFraction(5, 8)).toBe(rpeFraction(7, 10));
  });
  it('round-trips with Epley', () => {
    expect(r2(epley(100 * rpeFraction(6, 9), 7))).toBe(100);
  });
  it('lower RPE (more in reserve) means a lighter weight', () => {
    expect(rpeFraction(5, 7)).toBeLessThan(rpeFraction(5, 8));
  });
  it('returns null above 12 reps to failure', () => {
    expect(rpeFraction(10, 7)).toBeNull();
    expect(rpeFraction(8, 6)).not.toBeNull();
  });
});

describe('DOTS score', () => {
  it('coefficients are the published values', () => {
    expect(DOTS_COEFFICIENTS.male).toEqual([-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093]);
    expect(DOTS_COEFFICIENTS.female).toEqual([-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706]);
  });

  it('published worked example: 90 kg male → denominator ≈ 773.25', () => {
    expect(Math.round(dotsDenominator(90, 'male') * 100) / 100).toBeCloseTo(773.25, 1);
  });

  it('600 kg total at 90 kg male ≈ 388.0 (600 × 500 ÷ 773.25)', () => {
    expect(Math.round(dotsScore(600, 90, 'male').score * 10) / 10).toBe(388);
  });

  it('score scales linearly with the total', () => {
    const a = dotsScore(500, 75, 'female').score;
    const b = dotsScore(250, 75, 'female').score;
    expect(r2(a)).toBe(r2(2 * b));
  });

  it('a heavier lifter needs a bigger total for the same score (within range)', () => {
    expect(dotsScore(600, 100, 'male').score).toBeLessThan(dotsScore(600, 80, 'male').score);
  });

  it('clamps bodyweight outside the fitted range and reports it', () => {
    const heavy = dotsScore(800, 250, 'male');
    expect(heavy.clamped).toBe(true);
    expect(heavy.usedBodyweight).toBe(210);
    expect(heavy.score).toBe(dotsScore(800, 210, 'male').score);
    expect(dotsScore(300, 35, 'female')).toMatchObject({ clamped: true, usedBodyweight: 40 });
    expect(dotsScore(300, 160, 'female')).toMatchObject({ clamped: true, usedBodyweight: 150 });
    expect(dotsScore(300, 60, 'female').clamped).toBe(false);
  });

  it('denominator stays positive across the whole fitted range', () => {
    for (let bw = 40; bw <= 210; bw += 0.5) expect(dotsDenominator(bw, 'male')).toBeGreaterThan(0);
    for (let bw = 40; bw <= 150; bw += 0.5) expect(dotsDenominator(bw, 'female')).toBeGreaterThan(0);
  });

  it('rejects invalid input', () => {
    expect(() => dotsScore(0, 80, 'male')).toThrow(RangeError);
    expect(() => dotsScore(500, -1, 'male')).toThrow(RangeError);
    expect(() => dotsScore(500, 80, 'other')).toThrow();
  });
});
