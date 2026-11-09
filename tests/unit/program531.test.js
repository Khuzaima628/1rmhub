import { describe, it, expect } from 'vitest';
import { WEEKS_531, plan531, tmIncrease } from '../../src/lib/program531.js';

describe('5/3/1 percentages (Wendler)', () => {
  it('uses the standard weeks', () => {
    expect(WEEKS_531.map((w) => w.sets.map((s) => `${s.pct}x${s.reps}${s.amrap ? '+' : ''}`))).toEqual([
      ['65x5', '75x5', '85x5+'],
      ['70x3', '80x3', '90x3+'],
      ['75x5', '85x3', '95x1+'],
      ['40x5', '50x5', '60x5'],
    ]);
  });
});

describe('plan531', () => {
  it('percentages are of the training max, rounded down to a loadable weight', () => {
    const plan = plan531(200, 5);
    const top = plan[2].sets[2];
    expect(top.weight).toBeCloseTo(190, 10);
    expect(top.loadable).toBe(190);
    expect(plan[0].sets[0].weight).toBeCloseTo(130, 10);
    const p = plan531(123, 2.5);
    expect(p[0].sets[0].weight).toBeCloseTo(79.95, 10);
    expect(p[0].sets[0].loadable).toBe(77.5);
  });
  it('never rounds above the exact weight', () => {
    for (const set of plan531(147.3, 2.5).flatMap((w) => w.sets)) {
      expect(set.loadable).toBeLessThanOrEqual(set.weight);
      expect(set.weight - set.loadable).toBeLessThan(2.5);
    }
  });
  it('rejects bad input', () => {
    expect(() => plan531(0, 5)).toThrow(RangeError);
    expect(() => plan531(100, 0)).toThrow(RangeError);
  });
});

describe('training max increase per cycle', () => {
  it('lower body +10 lb / +5 kg, upper body +5 lb / +2.5 kg', () => {
    expect(tmIncrease('squat', 'lb')).toBe(10);
    expect(tmIncrease('deadlift', 'kg')).toBe(5);
    expect(tmIncrease('bench', 'lb')).toBe(5);
    expect(tmIncrease('press', 'kg')).toBe(2.5);
  });
});
