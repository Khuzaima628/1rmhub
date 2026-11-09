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
    url: 'https://www.hprc-online.org/physical-fitness/training-performance/what-one-rep-max',
  },
  zourdos: {
    id: 'zourdos',
    text: 'Zourdos, M. C., Klemp, A., Dolan, C., et al. (2016). Novel resistance training–specific rating of perceived exertion scale measuring repetitions in reserve. Journal of Strength and Conditioning Research, 30(1), 267–275.',
    url: 'https://doi.org/10.1519/JSC.0000000000001049',
  },
  sbsrir: {
    id: 'sbsrir',
    text: 'Stronger by Science. Reps in reserve (RIR): research review and practical guide.',
    url: 'https://www.strongerbyscience.com/reps-in-reserve/',
  },
  wendler: {
    id: 'wendler',
    text: 'Wendler, J. (2017). 5/3/1 Forever: Simple and Effective Programming for Size, Speed and Strength. Jim Wendler LLC.',
  },
  liftvaulttm: {
    id: 'liftvaulttm',
    text: 'Lift Vault. 5/3/1 training max: definition and examples.',
    url: 'https://liftvault.com/resources/531-training-max-definition-examples/',
  },
  helms2018: {
    id: 'helms2018',
    text: 'Helms, E. R., Byrnes, R. K., Cooke, D. M., et al. (2018). RPE vs. percentage 1RM loading in periodized programs matched for sets and repetitions. Frontiers in Physiology, 9, 247.',
    url: 'https://doi.org/10.3389/fphys.2018.00247',
  },
  konertz: {
    id: 'konertz',
    text: 'Konertz, T. (2019). Die DOTS-Formeln – die neuen Wilks [The DOTS formulas – the new Wilks]. Kraftsport Colonia. (The author’s own description of the formula, in German.)',
    url: 'https://kraftsport-colonia.de/dots',
  },
  bvdkdots: {
    id: 'bvdkdots',
    text: 'Bundesverband Deutscher Kraftdreikämpfer (BVDK). (2019). DOTS Punkte für Mannschaftswettkämpfe ab 2020 [DOTS points for team competitions from 2020]. Archived copy.',
    url: 'https://web.archive.org/web/20191112082015/https://bvdk.de/dots-punkte-f%C3%BCr-mannschaftswettk%C3%A4mpfe-ab-2020',
  },
  nsca: {
    id: 'nsca',
    text: 'Haff, G. G., & Triplett, N. T. (Eds.). (2016). Essentials of Strength Training and Conditioning (4th ed.). Champaign, IL: Human Kinetics.',
  },
  shimano2006: {
    id: 'shimano2006',
    text: 'Shimano, T., Kraemer, W. J., Spiering, B. A., et al. (2006). Relationship between the number of repetitions and selected percentages of one repetition maximum in free weight exercises in trained and untrained men. Journal of Strength and Conditioning Research, 20(4), 819–823.',
  },
  ralston2017: {
    id: 'ralston2017',
    text: 'Ralston, G. W., Kilgore, L., Wyatt, F. B., & Baker, J. S. (2017). The effect of weekly set volume on strength gain: a meta-analysis. Sports Medicine, 47(12), 2585–2601.',
    url: 'https://doi.org/10.1007/s40279-017-0762-7',
  },
  grgic2018: {
    id: 'grgic2018',
    text: 'Grgic, J., Schoenfeld, B. J., Davies, T. B., et al. (2018). Effect of resistance training frequency on gains in muscular strength: a systematic review and meta-analysis. Sports Medicine, 48(5), 1207–1220.',
  },
  schoenfeld2017: {
    id: 'schoenfeld2017',
    text: 'Schoenfeld, B. J., Grgic, J., Ogborn, D., & Krieger, J. W. (2017). Strength and hypertrophy adaptations between low- vs. high-load resistance training: a systematic review and meta-analysis. Journal of Strength and Conditioning Research, 31(12), 3508–3523.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/28834797/',
  },
  morton2018: {
    id: 'morton2018',
    text: 'Morton, R. W., Murphy, K. T., McKellar, S. R., et al. (2018). A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults. British Journal of Sports Medicine, 52(6), 376–384.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5867436/',
  },
  knowles2018: {
    id: 'knowles2018',
    text: 'Knowles, O. E., Drinkwater, E. J., Urwin, C. S., Lamon, S., & Aisbett, B. (2018). Inadequate sleep and muscle strength: implications for resistance training. Journal of Science and Medicine in Sport, 21(9), 959–968.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/29422383/',
  },
  acsm2026: {
    id: 'acsm2026',
    text: 'American College of Sports Medicine. (2026). ACSM Position Stand: Resistance training prescription for muscle function, hypertrophy, and physical performance in healthy adults: an overview of reviews. Medicine & Science in Sports & Exercise, 58(4), 851–872.',
    url: 'https://doi.org/10.1249/MSS.0000000000003897',
  },
  acsm2009: {
    id: 'acsm2009',
    text: 'American College of Sports Medicine. (2009). Position stand: Progression models in resistance training for healthy adults. Medicine & Science in Sports & Exercise, 41(3), 687–708.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
  },
};
