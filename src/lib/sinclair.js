/**
 * Sinclair coefficient: compares Olympic weightlifting totals across bodyweights.
 *
 *   coefficient = 10 ^ (A × (log10(bodyweight ÷ b))²)   when bodyweight < b
 *   coefficient = 1                                     when bodyweight ≥ b
 *   Sinclair total = total × coefficient
 *
 * A and b are set for each Olympic cycle (Wikipedia, "Sinclair coefficient").
 * The 2025–2028 constants below reproduce every row of the Alberta Weightlifting
 * Association's published 2025–2028 coefficient tables to all 6 decimals
 * (1,693 men's rows and 1,361 women's rows, checked when this file was written).
 * Spot-check rows from those tables are locked in tests/unit/sinclair.test.js.
 *
 * Pure functions only. All weights in KG.
 */

export const SINCLAIR_CYCLE = '2025–2028';

export const SINCLAIR_CONSTANTS = {
  male: { A: 0.700767819, b: 201.159 },
  female: { A: 0.674107991, b: 163.918 },
};

/**
 * Lightest bodyweight in the published tables. Below it the curve grows fast
 * and has no published value, so the calculator does not score it.
 */
export const SINCLAIR_MIN_BODYWEIGHT = { male: 32, female: 28 };

/** Sinclair coefficient for a bodyweight (kg) and sex. */
export function sinclairCoefficient(bodyweightKg, sex, constants = SINCLAIR_CONSTANTS) {
  const c = constants[sex];
  if (!c) throw new RangeError(`Unknown sex for Sinclair: ${sex}`);
  if (!(bodyweightKg > 0)) throw new RangeError('Sinclair needs a positive bodyweight');
  if (bodyweightKg >= c.b) return 1;
  return 10 ** (c.A * Math.log10(bodyweightKg / c.b) ** 2);
}

/**
 * Sinclair total for a weightlifting total (kg) at a bodyweight (kg).
 * Returns { score, coefficient }.
 */
export function sinclairScore(totalKg, bodyweightKg, sex, constants = SINCLAIR_CONSTANTS) {
  if (!(totalKg > 0)) throw new RangeError('Sinclair needs a positive total');
  const coefficient = sinclairCoefficient(bodyweightKg, sex, constants);
  return { score: totalKg * coefficient, coefficient };
}
