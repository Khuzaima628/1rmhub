// Bibliography used across the site. Only sources whose details were checked
// are listed; URLs are given only where a stable official/DOI link is known.
export interface Source { id: string; text: string; url?: string }

export const SOURCES: Record<string, Source> = {
  epley: {
    id: 'epley',
    text: 'Epley, B. (1985). Poundage Chart. Boyd Epley Workout. Lincoln, NE: Body Enterprises. (A coaching chart, not a peer-reviewed study.)',
  },
  brzycki: {
    id: 'brzycki',
    text: 'Brzycki, M. (1993). Strength testing — predicting a one-rep max from reps-to-fatigue. Journal of Physical Education, Recreation & Dance, 64(1), 88–90.',
    url: 'https://doi.org/10.1080/07303084.1993.10606684',
  },
  lombardi: {
    id: 'lombardi',
    text: 'Lombardi, V. P. (1989). Beginning Weight Training: The Safe and Effective Way. Dubuque, IA: Wm. C. Brown.',
  },
  mayhew: {
    id: 'mayhew',
    text: 'Mayhew, J. L., Ball, T. E., Arnold, M. D., & Bowen, J. C. (1992). Relative muscular endurance performance as a predictor of bench press strength in college men and women. Journal of Applied Sport Science Research, 6(4), 200–206.',
  },
  oconner: {
    id: 'oconner',
    text: 'O’Conner, B., Simmons, J., & O’Shea, P. (1989). Weight Training Today. St. Paul, MN: West Publishing.',
  },
  wathan: {
    id: 'wathan',
    text: 'Wathen, D. (1994). Load assignment. In T. R. Baechle (Ed.), Essentials of Strength Training and Conditioning (pp. 435–446). Champaign, IL: Human Kinetics.',
  },
  lesuer: {
    id: 'lesuer',
    text: 'LeSuer, D. A., McCormick, J. H., Mayhew, J. L., Wasserstein, R. L., & Arnold, M. D. (1997). The accuracy of prediction equations for estimating 1-RM performance in the bench press, squat, and deadlift. Journal of Strength and Conditioning Research, 11(4), 211–213.',
  },
  reynolds: {
    id: 'reynolds',
    text: 'Reynolds, J. M., Gordon, T. J., & Robergs, R. A. (2006). Prediction of one repetition maximum strength from multiple repetition maximum testing and anthropometry. Journal of Strength and Conditioning Research, 20(3), 584–592.',
    url: 'https://www.unm.edu/~rrobergs/478RMStrengthPrediction.pdf',
  },
  hprc: {
    id: 'hprc',
    text: 'Human Performance Resources by CHAMP (HPRC), Uniformed Services University. What is a one-rep max?',
    url: 'https://hprc-online.org/articles/what-is-a-one-rep-max',
  },
  zourdos: {
    id: 'zourdos',
    text: 'Zourdos, M. C., Klemp, A., Dolan, C., et al. (2016). Novel resistance training–specific rating of perceived exertion scale measuring repetitions in reserve. Journal of Strength and Conditioning Research, 30(1), 267–275.',
    url: 'https://doi.org/10.1519/JSC.0000000000001049',
  },
  sbsrir: {
    id: 'sbsrir',
    text: 'Stronger by Science. Reps in reserve (RIR): research review and practical guide.',
    url: 'https://www.strongerbyscience.com/reps-in-reserve',
  },
  nsca: {
    id: 'nsca',
    text: 'Haff, G. G., & Triplett, N. T. (Eds.). (2016). Essentials of Strength Training and Conditioning (4th ed.). Champaign, IL: Human Kinetics.',
  },
};
