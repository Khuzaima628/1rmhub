/**
 * Wilks and IPF GL points — two more powerlifting formulas that compare totals
 * across bodyweights (DOTS lives in dots.js). All inputs in KG. Pure functions.
 *
 * Wilks (original, 1995 coefficients):
 *   Wilks = total × 500 ÷ (a + b·x + c·x² + d·x³ + e·x⁴ + f·x⁵), x = bodyweight
 *   Coefficients and the bodyweight limits (men 40–201.9 kg, women 26.51–154.53 kg,
 *   which keep the curve away from its asymptote) match OpenPowerlifting's
 *   implementation, whose test values are reproduced in the unit tests.
 *   The 2020 "Wilks2" revision uses different coefficients and is not implemented.
 *
 * IPF GL (GOODLIFT) points:
 *   GL = total × 100 ÷ (A − B·e^(−C·x))
 *   A, B, C from the IPF document "The IPF GL Coefficients for Relative Scoring"
 *   (May 2020), Table 1, full powerlifting rows. Not defined below 35 kg
 *   bodyweight (OpenPowerlifting's rule), so the score is null there.
 */

export const WILKS_COEFFICIENTS = {
  male: [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8],
  female: [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8],
};

export const WILKS_BODYWEIGHT_RANGE = {
  male: { min: 40, max: 201.9 },
  female: { min: 26.51, max: 154.53 },
};

/** IPF GL parameters [A, B, C] for full powerlifting (squat + bench + deadlift). */
export const IPF_GL_PARAMETERS = {
  male: { classic: [1199.72839, 1025.18162, 0.00921], equipped: [1236.25115, 1449.21864, 0.01644] },
  female: { classic: [610.32796, 1045.59282, 0.03048], equipped: [758.63878, 949.31382, 0.02435] },
};

export const IPF_GL_MIN_BODYWEIGHT = 35;

function checkInputs(totalKg, bodyweightKg, sex, table) {
  if (!(totalKg > 0) || !(bodyweightKg > 0)) throw new RangeError('Points need a positive total and bodyweight');
  if (!table[sex]) throw new RangeError(`Unknown sex: ${sex}`);
}

/** Wilks score. Returns { score, clamped, usedBodyweight }. */
export function wilksScore(totalKg, bodyweightKg, sex) {
  checkInputs(totalKg, bodyweightKg, sex, WILKS_COEFFICIENTS);
  const range = WILKS_BODYWEIGHT_RANGE[sex];
  const x = Math.min(range.max, Math.max(range.min, bodyweightKg));
  const denominator = WILKS_COEFFICIENTS[sex].reduce((sum, c, i) => sum + c * x ** i, 0);
  return { score: (totalKg * 500) / denominator, clamped: x !== bodyweightKg, usedBodyweight: x };
}

/**
 * IPF GL points for a full powerlifting total. `equipment` is 'classic' (raw)
 * or 'equipped'. Returns { score } — score is null below 35 kg bodyweight.
 */
export function ipfGlScore(totalKg, bodyweightKg, sex, equipment) {
  checkInputs(totalKg, bodyweightKg, sex, IPF_GL_PARAMETERS);
  const params = IPF_GL_PARAMETERS[sex][equipment];
  if (!params) throw new RangeError(`Unknown equipment: ${equipment}`);
  if (bodyweightKg < IPF_GL_MIN_BODYWEIGHT) return { score: null };
  const [a, b, c] = params;
  return { score: (totalKg * 100) / (a - b * Math.exp(-c * bodyweightKg)) };
}
