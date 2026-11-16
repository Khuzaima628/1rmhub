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
  ipfgl: {
    id: 'ipfgl',
    text: 'International Powerlifting Federation (IPF). (2020). The IPF GL coefficients for relative scoring (Table 1: parameters of the equation).',
    url: 'https://www.powerlifting.sport/fileadmin/ipf/data/ipf-formula/IPF_GL_Coefficients-2020.pdf',
  },
  oplwilks: {
    id: 'oplwilks',
    text: 'The OpenPowerlifting Project. Wilks and GOODLIFT points source code and test values (crates/coefficients).',
    url: 'https://gitlab.com/openpowerlifting/opl-data/-/tree/main/crates/coefficients/src',
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
  ipfrules: {
    id: 'ipfrules',
    text: 'International Powerlifting Federation. (2026). IPF Technical Rulebook, effective 1 March 2026: 1.1 Age categories, 1.2 Bodyweight categories, and weigh-in procedure.',
    url: 'https://www.powerlifting.sport/rules/codes/info/technical-rules',
  },
  smolovwiki: {
    id: 'smolovwiki',
    text: 'Smolov Squat Routine. Wikipedia: origin credited to Sergey Smolov; popularized by Pavel Tsatsouline; base cycle of four squat sessions a week ending with a re-test of the 1RM.',
    url: 'https://en.wikipedia.org/wiki/Smolov_Squat_Routine',
  },
  liftvaultsmolov: {
    id: 'liftvaultsmolov',
    text: 'Lift Vault. Smolov squat program: base cycle 4x9 at 70%, 5x7 at 75%, 7x5 at 80%, 10x3 at 85%, plus 20 lb in week 2 (published program copy).',
    url: 'https://liftvault.com/programs/powerlifting/smolov/',
  },
  tadlocksmolov: {
    id: 'tadlocksmolov',
    text: 'Tadlock, J. (2011). Smolov base mesocycle: the same scheme with 20 lb (10 kg) added in week 2 and 30 lb (15 kg) in week 3 (independent published copy).',
    url: 'https://justintadlock.com/archives/2011/12/05/smolov-base-mesocycle',
  },
  opldata: {
    id: 'opldata',
    text: 'OpenPowerlifting. Powerlifting competition results database, released into the public domain. Raw full-power results; see the export date on the page.',
    url: 'https://www.openpowerlifting.org',
  },
  acsm2009: {
    id: 'acsm2009',
    text: 'American College of Sports Medicine. (2009). Position stand: Progression models in resistance training for healthy adults. Medicine & Science in Sports & Exercise, 41(3), 687–708.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
  },
  awasinclairmen: {
    id: 'awasinclairmen',
    text: 'Alberta Weightlifting Association. Male Sinclair Coefficients (2025–2028). Copy hosted by the Polish Weightlifting Federation (PZPC).',
    url: 'https://www.pzpc.pl/public/system/files/site_content/185/7343-2025_2028-Sinclair_coefficients-Men.pdf',
  },
  awasinclairwomen: {
    id: 'awasinclairwomen',
    text: 'Alberta Weightlifting Association. Female Sinclair Coefficients (2025–2028). Copy hosted by the Polish Weightlifting Federation (PZPC).',
    url: 'https://www.pzpc.pl/public/system/files/site_content/185/7344-2025_2028-Sinclair_coefficients-Women.pdf',
  },
  wikisinclair: {
    id: 'wikisinclair',
    text: 'Wikipedia. Sinclair coefficient: formula and use by the International Weightlifting Federation.',
    url: 'https://en.wikipedia.org/wiki/Sinclair_coefficient',
  },
  iwftcrr: {
    id: 'iwftcrr',
    text: 'International Weightlifting Federation. (2024). Technical and Competition Rules & Regulations, section 3.3.3 Barbell: bar, discs and collars. Copy hosted by the Polish Weightlifting Federation (PZPC).',
    url: 'https://pzpc.pl/download/file/7080',
  },
  whisenant2003: {
    id: 'whisenant2003',
    text: 'Whisenant, M. J., Panton, L. B., East, W. B., & Broeder, C. E. (2003). Validation of submaximal prediction equations for the 1 repetition maximum bench press test on a group of collegiate football players. Journal of Strength and Conditioning Research, 17(2), 221–227.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/12741856/',
  },
  mayhew2008: {
    id: 'mayhew2008',
    text: 'Mayhew, J. L., Johnson, B. D., LaMonte, M. J., Lauber, D., & Kemmler, W. (2008). Accuracy of prediction equations for determining one repetition maximum bench press in women before and after resistance training. Journal of Strength and Conditioning Research, 22(5), 1570–1577.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/18714223/',
  },
  meneses2013: {
    id: 'meneses2013',
    text: 'Menêses, A. L., Santana, F. S., Soares, A. H. G., et al. (2013). Validade das equações preditivas de uma repetição máxima varia de acordo com o exercício realizado em adultos jovens treinados [The validity of 1RM prediction equations varies with the exercise in trained young adults]. Revista Brasileira de Atividade Física & Saúde, 18(1), 95–104.',
    url: 'https://doi.org/10.12820/2317-1634.2013v18n1p95',
  },
  rogueplates: {
    id: 'rogueplates',
    text: 'Rogue Fitness. Color Echo Bumper Plates: pound plates sold in pairs from 10 lb to 55 lb (manufacturer product page).',
    url: 'https://www.roguefitness.com/rogue-color-echo-bumper-plate',
  },
  ipfequip: {
    id: 'ipfequip',
    text: 'International Powerlifting Federation. (2026). IPF Technical Rulebook, effective 1 March 2026, section 2: Equipment and specifications (bar, discs and collars).',
    url: 'https://www.powerlifting.sport/rules/codes/info/technical-rules',
  },
};
