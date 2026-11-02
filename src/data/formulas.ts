// Plain-language notes for each formula. Every comparative statement here
// ("lowest at 2–5 reps", "highest at 11–12 reps", …) is asserted against the
// real formula outputs in tests/onerepmax.test.js — if the math and the words
// ever disagree, the test suite fails.
export const FORMULA_NOTES: Record<string, { origin: string; behaviour: string }> = {
  epley: {
    origin: 'Boyd Epley’s 1985 poundage chart — a coaching tool rather than a peer-reviewed study.',
    behaviour: 'Linear: adds 3.33% per rep. Sits in the middle of the six from 2 to 10 reps.',
  },
  brzycki: {
    origin: 'Matt Brzycki, Journal of Physical Education, Recreation & Dance (1993).',
    behaviour: 'Lowest of the six at 2–5 reps (tied with O’Conner at 5), identical to Epley at 10 reps, and highest at 11–12 reps as its curve steepens. Undefined at 37 reps.',
  },
  lombardi: {
    origin: 'V. P. Lombardi’s textbook Beginning Weight Training (1989).',
    behaviour: 'Power curve that flattens as reps rise: mid-pack at low reps, lowest of the six at 11–12 reps.',
  },
  mayhew: {
    origin: 'Mayhew and colleagues (1992), fitted to bench-press data from college men and women.',
    behaviour: 'Exponential. Highest of the six at 1–6 reps: it is not anchored to a single (it gives about 109% of the weight for 1 rep), so it reads high on very heavy sets.',
  },
  oconner: {
    origin: 'O’Conner, Simmons and O’Shea’s textbook Weight Training Today (1989).',
    behaviour: 'Linear: adds 2.5% per rep. Lowest of the six at 6–10 reps.',
  },
  wathan: {
    origin: 'Dan Wathen’s chapter in the NSCA textbook Essentials of Strength Training and Conditioning (1994); often spelled “Wathan”.',
    behaviour: 'Exponential. Within about 1% of Epley at 3–8 reps and highest of the six at 7–10 reps.',
  },
};
