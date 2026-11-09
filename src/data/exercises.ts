// Exercises offered in the calculator's dropdown. The choice only labels the
// result (the same six formulas apply to every lift); lifts with their own
// page link to it so the lift-specific guidance is one click away.
export interface Exercise { id: string; label: string; page?: string }

export const EXERCISES: Exercise[] = [
  { id: 'bench-press', label: 'Bench Press', page: '/bench-press-calculator/' },
  { id: 'squat', label: 'Squat', page: '/squat-calculator/' },
  { id: 'deadlift', label: 'Deadlift', page: '/deadlift-calculator/' },
  { id: 'overhead-press', label: 'Overhead Press', page: '/overhead-press-calculator/' },
  { id: 'barbell-row', label: 'Barbell Row', page: '/barbell-row-calculator/' },
  { id: 'dumbbell-bench', label: 'Dumbbell Bench Press' },
  { id: 'incline-bench', label: 'Incline Bench Press', page: '/incline-bench-press-calculator/' },
  { id: 'front-squat', label: 'Front Squat', page: '/front-squat-calculator/' },
  { id: 'hip-thrust', label: 'Hip Thrust', page: '/hip-thrust-calculator/' },
  { id: 'custom', label: 'Other / Custom Exercise' },
];
