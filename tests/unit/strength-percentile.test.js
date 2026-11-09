/**
 * Strength percentile: IPF weight classes, percentile lookup, input checks,
 * and the shape of the generated OpenPowerlifting data file.
 */
import { describe, it, expect } from 'vitest';
import { CLASSES, classFor, percentileOf, validateStrengthInput } from '../../src/lib/strength-percentile.js';
import data from '../../src/data/opl-percentiles.json';

const ramp = Array.from({ length: 99 }, (_, i) => (i + 1) * 10); // p1 = 10 ... p99 = 990

describe('IPF weight classes', () => {
  it('puts a bodyweight on the limit in that class, and just over it in the next', () => {
    expect(classFor('M', 83).id).toBe('83');
    expect(classFor('M', 83.01).id).toBe('93');
    expect(classFor('F', 63).id).toBe('63');
    expect(classFor('F', 63.1).id).toBe('69');
  });
  it('uses the lightest class for very light lifters and the + class above the top limit', () => {
    expect(classFor('M', 40).id).toBe('59');
    expect(classFor('M', 140).id).toBe('120+');
    expect(classFor('F', 100).id).toBe('84+');
  });
  it('rejects an unknown category', () => {
    expect(() => classFor('X', 80)).toThrow();
  });
});

describe('percentileOf', () => {
  it('finds the percentile at and between the listed values', () => {
    expect(percentileOf(ramp, 500)).toEqual({ pct: 50, edge: null });
    expect(percentileOf(ramp, 505)).toEqual({ pct: 50, edge: null });
    expect(percentileOf(ramp, 509.9)).toEqual({ pct: 50, edge: null });
    expect(percentileOf(ramp, 510)).toEqual({ pct: 51, edge: null });
  });
  it('flags values below the 1st and at or above the 99th percentile', () => {
    expect(percentileOf(ramp, 5)).toEqual({ pct: 1, edge: 'below' });
    expect(percentileOf(ramp, 990)).toEqual({ pct: 99, edge: 'above' });
    expect(percentileOf(ramp, 5000)).toEqual({ pct: 99, edge: 'above' });
  });
  it('handles repeated values (flat stretches) without going backwards', () => {
    const flat = ramp.map((v) => (v >= 300 && v <= 500 ? 300 : v));
    expect(percentileOf(flat, 300).pct).toBe(50);
    expect(percentileOf(flat, 299).pct).toBe(29);
  });
  it('requires exactly 99 values', () => {
    expect(() => percentileOf([1, 2, 3], 2)).toThrow();
  });
});

describe('validateStrengthInput', () => {
  it('accepts a normal input', () => {
    expect(validateStrengthInput({ sex: 'M', bwKg: 83, liftKg: 180 }).ok).toBe(true);
  });
  it('rejects missing or out-of-range values', () => {
    expect(validateStrengthInput({ sex: 'M', bwKg: NaN, liftKg: 180 }).field).toBe('bodyweight');
    expect(validateStrengthInput({ sex: 'M', bwKg: 20, liftKg: 180 }).field).toBe('bodyweight');
    expect(validateStrengthInput({ sex: 'F', bwKg: 60, liftKg: 0 }).field).toBe('lift');
    expect(validateStrengthInput({ sex: 'F', bwKg: 60, liftKg: NaN }).field).toBe('lift');
    expect(validateStrengthInput({ sex: 'X', bwKg: 60, liftKg: 100 }).field).toBe('sex');
  });
});

describe('OpenPowerlifting percentile data', () => {
  it('has an export date and a lifter count', () => {
    expect(data.exportDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(data.lifters).toBeGreaterThan(100000);
  });
  it('covers every class for both sexes with 99 ascending values per lift', () => {
    for (const sex of ['M', 'F']) {
      for (const c of [...CLASSES[sex].map((x) => x.id), 'all']) {
        const g = data.groups[sex][c];
        expect(g.count, `${sex} ${c}`).toBeGreaterThan(1000);
        for (const lift of ['squat', 'bench', 'deadlift', 'total']) {
          const q = g[lift];
          expect(q).toHaveLength(99);
          for (let i = 1; i < 99; i++) expect(q[i]).toBeGreaterThanOrEqual(q[i - 1]);
        }
      }
    }
  });
  it('class counts add up to the all-classes count', () => {
    for (const sex of ['M', 'F']) {
      const sum = CLASSES[sex].reduce((a, c) => a + data.groups[sex][c.id].count, 0);
      expect(sum).toBe(data.groups[sex].all.count);
    }
  });
});
