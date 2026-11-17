// Exercises offered in the calculator's dropdown. The choice does NOT change
// the math (the same six formulas apply to every lift: no published, validated
// per-lift version of them exists). It labels the result and shows one note
// about what the research says for that lift. Every note names its sources;
// each id must exist in src/data/sources.ts and is listed on /methodology/.
// Lifts with their own page link to it for lift-specific guidance.
export interface Exercise {
  id: string;
  label: string;
  page?: string;
  /** One short, sourced note shown under the result for this lift. */
  note: string;
  /** Label for the weight field when this exercise is chosen (default: "Weight lifted"). */
  weightLabel?: string;
  /** This lift's strength standards page, linked from the result once that page is live. */
  standards?: string;
  /** Source ids (src/data/sources.ts) the note relies on. Empty only for statements about our own search. */
  sources: string[];
}

export const EXERCISES: Exercise[] = [
  {
    id: 'bench-press', label: 'Bench Press', page: '/bench-press-calculator/', standards: '/bench-press-standards/',
    note: 'The bench press is the most-studied lift for these formulas. Studies agree they are most accurate from a set of 10 reps or fewer, but they disagree on which single formula comes closest.',
    sources: ['whisenant2003', 'mayhew2008', 'reynolds'],
  },
  {
    id: 'squat', label: 'Squat', page: '/squat-calculator/', standards: '/squat-standards/',
    note: 'At the same percentage of their max, lifters manage more reps on the squat than on the bench press, especially with lighter weights. The formulas assume the same pattern for every lift, so a heavier set of 3–6 reps gives the most reliable squat estimate.',
    sources: ['shimano2006', 'reynolds'],
  },
  {
    id: 'deadlift', label: 'Deadlift', page: '/deadlift-calculator/',
    note: 'In the one study that tested these formulas on the deadlift, every formula underestimated the lifters’ measured max (untrained college students). Your true deadlift max may be higher than shown.',
    sources: ['lesuer'],
  },
  {
    id: 'overhead-press', label: 'Overhead Press', page: '/overhead-press-calculator/',
    note: 'We found no study testing these formulas against a measured overhead press max. They were tested on the bench press, squat, deadlift and leg press, so treat this as a rough guide and use a set of 10 reps or fewer.',
    sources: ['reynolds'],
  },
  {
    id: 'barbell-row', label: 'Barbell Row', page: '/barbell-row-calculator/',
    note: 'We found no study testing these formulas against a measured barbell row max. One study on a seated machine row found the Epley and Brzycki formulas close to the tested max.',
    sources: ['meneses2013'],
  },
  {
    id: 'leg-press', label: 'Leg Press', page: '/leg-press-calculator/',
    note: 'Leg press results depend on the machine. In one study the formulas overestimated the max on a 45° leg press; in another, on a different machine, most of them underestimated it. Estimate from a heavy set of 10 reps or fewer on the machine you train on.',
    sources: ['meneses2013', 'reynolds'],
  },
  {
    id: 'dumbbell-bench', label: 'Dumbbell Bench Press', weightLabel: 'Weight of one dumbbell',
    note: 'We found no study testing these formulas against a measured dumbbell bench press max; they were tested on the barbell bench press. Enter the weight of one dumbbell, and the estimate is for one dumbbell too.',
    sources: [],
  },
  {
    id: 'incline-bench', label: 'Incline Bench Press', page: '/incline-bench-press-calculator/',
    note: 'We found no study testing these formulas against a measured barbell incline bench max. They were tested on the flat bench press, so treat this as a rough guide.',
    sources: [],
  },
  {
    id: 'front-squat', label: 'Front Squat', page: '/front-squat-calculator/',
    note: 'We found no study testing these formulas against a measured front squat max. They were tested on the back squat, so treat this as a rough guide.',
    sources: [],
  },
  {
    id: 'hip-thrust', label: 'Hip Thrust', page: '/hip-thrust-calculator/',
    note: 'We found no study testing these formulas against a measured hip thrust max. Hip thrusts are often done for high reps, so estimate from a heavier set of 10 reps or fewer.',
    sources: ['reynolds'],
  },
  {
    id: 'custom', label: 'Other / Custom Exercise',
    note: 'These formulas were tested mainly on the bench press, squat, deadlift and leg press. For other exercises, treat the number as a rough guide.',
    sources: ['lesuer', 'reynolds', 'meneses2013'],
  },
];
