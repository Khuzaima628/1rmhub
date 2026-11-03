/**
 * DOTS score — a powerlifting points formula that compares totals across
 * bodyweights:  DOTS = total × 500 ÷ P(bodyweight), with
 *   P(x) = a + b·x + c·x² + d·x³ + e·x⁴   (x = bodyweight in kg)
 * using separate coefficient sets for men and women. All inputs in KG.
 * Coefficients and the "use the boundary value outside the range" rule are from
 * the formula's author: Konertz (2019), https://kraftsport-colonia.de/dots.
 * The 40–210 kg / 40–150 kg ranges are as given by German Wikipedia
 * ("DOTS-Relativwertung"), which attributes them to the author.
 *
 * Pure functions only. Coefficients are locked by tests (including a
 * published worked example), so a typo cannot ship silently.
 */

export const DOTS_COEFFICIENTS = {
  male: [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093],
  female: [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706],
};

/**
 * Bodyweight range the polynomials are fitted for. Outside it, bodyweight is
 * clamped to the nearest limit (and the UI says so), because the curves bend
 * the wrong way beyond their fitted range.
 */
export const DOTS_BODYWEIGHT_RANGE = {
  male: { min: 40, max: 210 },
  female: { min: 40, max: 150 },
};

/** The DOTS denominator P(bodyweight) for a sex, with clamping applied. */
export function dotsDenominator(bodyweightKg, sex) {
  const coeffs = DOTS_COEFFICIENTS[sex];
  const range = DOTS_BODYWEIGHT_RANGE[sex];
  if (!coeffs) throw new RangeError(`Unknown sex for DOTS: ${sex}`);
  const x = Math.min(range.max, Math.max(range.min, bodyweightKg));
  return coeffs.reduce((sum, c, i) => sum + c * x ** i, 0);
}

/**
 * DOTS score for a total (kg) at a bodyweight (kg).
 * Returns { score, clamped, usedBodyweight }.
 */
export function dotsScore(totalKg, bodyweightKg, sex) {
  if (!(totalKg > 0) || !(bodyweightKg > 0)) throw new RangeError('DOTS needs a positive total and bodyweight');
  const range = DOTS_BODYWEIGHT_RANGE[sex];
  const usedBodyweight = Math.min(range.max, Math.max(range.min, bodyweightKg));
  return {
    score: (totalKg * 500) / dotsDenominator(bodyweightKg, sex),
    clamped: usedBodyweight !== bodyweightKg,
    usedBodyweight,
  };
}
