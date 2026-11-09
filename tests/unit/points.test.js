// Wilks and IPF GL points. Expected values come from OpenPowerlifting's own
// test cases (crates/coefficients/src/wilks.rs and goodlift.rs), so a typo in
// a coefficient fails here.
import { describe, it, expect } from 'vitest';
import { wilksScore, ipfGlScore, WILKS_COEFFICIENTS, IPF_GL_PARAMETERS } from '../../src/lib/points.js';

describe('Wilks score (original coefficients)', () => {
  it('coefficients are the published values', () => {
    expect(WILKS_COEFFICIENTS.male).toEqual([-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8]);
    expect(WILKS_COEFFICIENTS.female).toEqual([594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8]);
  });
  it('OpenPowerlifting test values', () => {
    expect(wilksScore(1000, 100, 'male').score).toBeCloseTo(608.58907, 4);
    expect(wilksScore(500, 60, 'female').score).toBeCloseTo(557.4434, 3);
  });
  it('clamps bodyweight outside the fitted range and says so', () => {
    const heavy = wilksScore(800, 230, 'male');
    expect(heavy.clamped).toBe(true);
    expect(heavy.usedBodyweight).toBe(201.9);
    expect(heavy.score).toBeCloseTo(wilksScore(800, 201.9, 'male').score, 10);
    expect(wilksScore(500, 90, 'male').clamped).toBe(false);
  });
  it('rejects bad input', () => {
    expect(() => wilksScore(0, 80, 'male')).toThrow(RangeError);
    expect(() => wilksScore(500, -1, 'male')).toThrow(RangeError);
    expect(() => wilksScore(500, 80, 'other')).toThrow(RangeError);
  });
});

describe('IPF GL points', () => {
  it('parameters are the IPF Table 1 values (full powerlifting)', () => {
    expect(IPF_GL_PARAMETERS).toEqual({
      male: { classic: [1199.72839, 1025.18162, 0.00921], equipped: [1236.25115, 1449.21864, 0.01644] },
      female: { classic: [610.32796, 1045.59282, 0.03048], equipped: [758.63878, 949.31382, 0.02435] },
    });
  });
  it('published example: 1035 kg equipped total at 92.04 kg (2019 IPF Worlds) → 112.85', () => {
    expect(ipfGlScore(1035, 92.04, 'male', 'equipped').score).toBeCloseTo(112.85, 2);
  });
  it('classic total matches the formula by hand', () => {
    const expected = (700 * 100) / (1199.72839 - 1025.18162 * Math.exp(-0.00921 * 90));
    expect(ipfGlScore(700, 90, 'male', 'classic').score).toBeCloseTo(expected, 10);
  });
  it('a heavier total scores higher; classic and equipped differ', () => {
    expect(ipfGlScore(600, 80, 'female', 'classic').score).toBeGreaterThan(ipfGlScore(500, 80, 'female', 'classic').score);
    expect(ipfGlScore(600, 80, 'male', 'classic').score).not.toBeCloseTo(ipfGlScore(600, 80, 'male', 'equipped').score, 1);
  });
  it('is not defined below 35 kg bodyweight', () => {
    expect(ipfGlScore(200, 34.9, 'female', 'classic').score).toBeNull();
    expect(ipfGlScore(200, 35, 'female', 'classic').score).not.toBeNull();
  });
  it('rejects bad input', () => {
    expect(() => ipfGlScore(500, 80, 'male', 'raw')).toThrow(RangeError);
    expect(() => ipfGlScore(0, 80, 'male', 'classic')).toThrow(RangeError);
  });
});
