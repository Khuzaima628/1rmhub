import { describe, it, expect } from 'vitest';
import { validateBodyweightSet, estimateBodyweightLift, addedForReps } from '../../src/lib/bodyweight.js';
import { estimateAll } from '../../src/lib/onerepmax.js';

describe('weighted bodyweight lifts: validation', () => {
  it('accepts a normal weighted set', () => {
    expect(validateBodyweightSet('80', '20', '5')).toEqual({ ok: true, bodyweight: 80, added: 20, reps: 5 });
  });
  it('empty or zero added weight means bodyweight only', () => {
    expect(validateBodyweightSet('80', '', '8')).toMatchObject({ ok: true, added: 0 });
    expect(validateBodyweightSet('80', '0', '8')).toMatchObject({ ok: true, added: 0 });
  });
  it('rejects a missing bodyweight, negative or non-numeric added weight', () => {
    expect(validateBodyweightSet('', '20', '5')).toMatchObject({ ok: false, field: 'bodyweight' });
    expect(validateBodyweightSet('80', '-10', '5')).toMatchObject({ ok: false, field: 'added' });
    expect(validateBodyweightSet('80', 'abc', '5')).toMatchObject({ ok: false, field: 'added' });
    expect(validateBodyweightSet('80', 'Infinity', '5')).toMatchObject({ ok: false, field: 'added' });
  });
  it('applies the same 1–12 rep rule as every other estimate', () => {
    expect(validateBodyweightSet('80', '20', '13')).toMatchObject({ ok: false, field: 'reps' });
    expect(validateBodyweightSet('80', '20', '0')).toMatchObject({ ok: false, field: 'reps' });
    expect(validateBodyweightSet('80', '20', '2.5')).toMatchObject({ ok: false, field: 'reps' });
  });
  it('rejects an impossible total load', () => {
    expect(validateBodyweightSet('1000', '600', '3')).toMatchObject({ ok: false, field: 'added' });
  });
});

describe('weighted bodyweight lifts: estimate', () => {
  it('runs the formulas on bodyweight + added weight, then takes bodyweight off', () => {
    const r = estimateBodyweightLift(80, 20, 5);
    const full = estimateAll(100, 5);
    expect(r.total.average).toBeCloseTo(full.average, 10);
    expect(r.addedAverage).toBeCloseTo(full.average - 80, 10);
    expect(r.addedMin).toBeCloseTo(full.min - 80, 10);
    expect(r.addedMax).toBeCloseTo(full.max - 80, 10);
  });
  it('a single is a tested max: added weight returned unchanged', () => {
    expect(estimateBodyweightLift(80, 30, 1).addedAverage).toBeCloseTo(30, 10);
  });
  it('bodyweight-only reps still give a positive added 1RM', () => {
    expect(estimateBodyweightLift(80, 0, 8).addedAverage).toBeGreaterThan(0);
  });
});

describe('added weight for reps', () => {
  it('uses Epley backwards on the full load, minus bodyweight', () => {
    const rows = addedForReps(120, 80);
    expect(rows.map((r) => r.reps)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(rows[3].added).toBeCloseTo(120 / (1 + 5 / 30) - 80, 10);
  });
  it('goes below zero when bodyweight alone is heavier than needed', () => {
    expect(addedForReps(90, 80).at(-1).added).toBeLessThan(0);
  });
});
