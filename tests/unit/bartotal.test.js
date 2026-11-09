import { describe, it, expect } from 'vitest';
import { validatePlateCounts, barTotal } from '../../src/lib/bartotal.js';
import { solvePlates, LB_PLATES } from '../../src/lib/onerepmax.js';

describe('reverse plate calculator', () => {
  it('two 45s per side on a 45 lb bar is 225 lb', () => {
    const v = validatePlateCounts({ 45: '2', 25: '', 10: '0' });
    expect(v.ok).toBe(true);
    expect(barTotal(45, v.counts)).toEqual({ perSide: 90, total: 225 });
  });
  it('handles fractional plates', () => {
    const v = validatePlateCounts({ 20: '3', 2.5: '1', 1.25: '1' });
    expect(barTotal(20, v.counts).total).toBeCloseTo(20 + 2 * 63.75, 10);
  });
  it('bar only is the bar weight', () => {
    expect(barTotal(20, validatePlateCounts({ 25: '' }).counts).total).toBe(20);
  });
  it('round-trips with the plate solver', () => {
    const solved = solvePlates(315, 45, LB_PLATES);
    const raw = Object.fromEntries(LB_PLATES.map((p) => [p, String(solved.perSide.filter((x) => x === p).length)]));
    expect(barTotal(45, validatePlateCounts(raw).counts).total).toBeCloseTo(solved.loaded, 10);
  });
  it('rejects negative, fractional or absurd plate counts', () => {
    expect(validatePlateCounts({ 45: '-1' })).toMatchObject({ ok: false, size: 45 });
    expect(validatePlateCounts({ 45: '1.5' })).toMatchObject({ ok: false, size: 45 });
    expect(validatePlateCounts({ 45: 'abc' })).toMatchObject({ ok: false, size: 45 });
    expect(validatePlateCounts({ 45: '21' })).toMatchObject({ ok: false, size: 45 });
  });
  it('rejects a negative bar weight', () => {
    expect(() => barTotal(-1, [])).toThrow(RangeError);
  });
});
