/**
 * Sinclair coefficient verification against published sources.
 */
import { describe, it, expect } from 'vitest';
import {
  sinclairCoefficient, sinclairScore, SINCLAIR_CONSTANTS, SINCLAIR_MIN_BODYWEIGHT,
} from '../../src/lib/sinclair.js';

const r6 = (v) => Math.round(v * 1e6) / 1e6;

describe('Sinclair coefficient (2025–2028)', () => {
  // Rows copied from the Alberta Weightlifting Association 2025–2028 tables.
  const men = [[32, 2.796968], [60, 1.561115], [71, 1.391066], [81, 1.286375], [88, 1.231244], [110, 1.117268], [196.9, 1.000139]];
  const women = [[28, 2.494911], [48, 1.555191], [58, 1.371624], [63, 1.306948], [69, 1.245059], [77, 1.181907], [160.5, 1.00013]];

  it.each(men)('men %s kg → %s (published table)', (bw, c) => {
    expect(r6(sinclairCoefficient(bw, 'male'))).toBe(c);
  });

  it.each(women)('women %s kg → %s (published table)', (bw, c) => {
    expect(r6(sinclairCoefficient(bw, 'female'))).toBe(c);
  });

  it('is exactly 1 at or above b', () => {
    expect(sinclairCoefficient(SINCLAIR_CONSTANTS.male.b, 'male')).toBe(1);
    expect(sinclairCoefficient(250, 'male')).toBe(1);
    expect(sinclairCoefficient(SINCLAIR_CONSTANTS.female.b, 'female')).toBe(1);
    expect(sinclairCoefficient(170, 'female')).toBe(1);
  });

  it('falls as bodyweight rises', () => {
    expect(sinclairCoefficient(70, 'male')).toBeGreaterThan(sinclairCoefficient(90, 'male'));
    expect(sinclairCoefficient(55, 'female')).toBeGreaterThan(sinclairCoefficient(75, 'female'));
  });

  it('81 kg man, 305 kg total → 392.34 Sinclair total', () => {
    expect(Math.round(sinclairScore(305, 81, 'male').score * 100) / 100).toBe(392.34);
  });

  it('matches the Wikipedia worked example with the 2017–2020 constants', () => {
    // A = 0.751945030, b = 175.508 kg; 61.9 kg man, 320 kg total → 456.234.
    const old = { male: { A: 0.75194503, b: 175.508 } };
    expect(Math.round(sinclairScore(320, 61.9, 'male', old).score * 1000) / 1000).toBe(456.234);
  });

  it('table minimums are the lightest published rows', () => {
    expect(SINCLAIR_MIN_BODYWEIGHT).toEqual({ male: 32, female: 28 });
  });

  it('rejects bad input', () => {
    expect(() => sinclairCoefficient(0, 'male')).toThrow(RangeError);
    expect(() => sinclairCoefficient(80, 'other')).toThrow(RangeError);
    expect(() => sinclairScore(0, 80, 'male')).toThrow(RangeError);
  });
});
