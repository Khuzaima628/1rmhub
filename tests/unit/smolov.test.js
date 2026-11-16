/**
 * Smolov base mesocycle: the published scheme, the weekly add-ons and
 * loadable rounding.
 */
import { describe, it, expect } from 'vitest';
import { smolovBase, SMOLOV_DAYS } from '../../src/lib/smolov.js';

describe('Smolov base mesocycle', () => {
  it('uses 4x9 @70%, 5x7 @75%, 7x5 @80% and 10x3 @85%', () => {
    expect(SMOLOV_DAYS.map((d) => `${d.sets}x${d.reps}@${d.pct}`)).toEqual(['4x9@70', '5x7@75', '7x5@80', '10x3@85']);
  });
  it('week 1 for a 200 kg squat: 140, 150, 160, 170 kg', () => {
    const { weeks } = smolovBase(200, 'kg');
    expect(weeks[0].days.map((d) => d.weight)).toEqual([140, 150, 160, 170]);
  });
  it('adds 10 kg in week 2 and 15 kg in week 3', () => {
    const { weeks } = smolovBase(200, 'kg');
    expect(weeks[1].days.map((d) => d.weight)).toEqual([150, 160, 170, 180]);
    expect(weeks[2].days.map((d) => d.weight)).toEqual([155, 165, 175, 185]);
  });
  it('adds 20 lb and 30 lb in pounds, rounding down to 5 lb', () => {
    const { weeks } = smolovBase(315, 'lb');
    expect(weeks[0].days.map((d) => d.weight)).toEqual([220, 235, 250, 265]); // 220.5, 236.25, 252, 267.75
    expect(weeks[1].days[0].weight).toBe(240);
    expect(weeks[2].days[3].weight).toBe(295);
  });
  it('never prescribes more than the exact figure', () => {
    const { weeks } = smolovBase(143, 'kg');
    weeks.forEach((w) => w.days.forEach((d) => expect(d.weight).toBeLessThanOrEqual((d.pct / 100) * 143 + w.add)));
  });
  it('counts 136 working reps per week and rejects an unknown unit', () => {
    expect(smolovBase(100, 'kg').repsPerWeek).toBe(136);
    expect(() => smolovBase(100, 'st')).toThrow();
  });
});
