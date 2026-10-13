import type { Accent, Niche, NicheCoef, Payment, Tariff, TariffKey } from './types'

export const GRANT_CAP = 10_000 // $/mo Google Ad Grants budget cap
export const MONTHS = 24

/** Uniform niche coefficient — every metric scaled by the same factor. */
const uniform = (v: number): NicheCoef => ({
  spend: v,
  impressions: v,
  clicks: v,
  conv: v,
  donations: v,
  volunteers: v,
  registrations: v,
  contactLeads: v,
  newsletter: v,
  phoneCalls: v,
  other: v,
})

/**
 * Niches with per-metric coefficients, ported
 * verbatim from the reference sheet "КОЭФИЦИЕНТЫ ПО НИШАМ" (tab Показатели).
 * Reference niche = Education & Scholarships (all coefficients 1.00).
 */
export const NICHES: Niche[] = [
  { title: 'Education & Scholarships', desc: 'Schools, literacy, tutoring, scholarships, higher education, research', coef: uniform(1.0) },
  {
    title: 'Youth & Family Services',
    desc: 'Mentoring, after-school programs, childcare, foster care, adoption, family support',
   
    coef: { spend: 1.54, impressions: 1.25, clicks: 1.25, conv: 1.53, donations: 1.13, volunteers: 1.13, registrations: 1.17, contactLeads: 1.15, newsletter: 0.73, phoneCalls: 1.25, other: 1.25 },
  },
  { title: 'Health & Medical Support', desc: 'Healthcare access, community clinics, medical missions, rehabilitation, patient support', coef: { ...uniform(0.72), spend: 0.7 } },
  { title: 'Disease-Specific Organizations', desc: "Cancer, Alzheimer's, rare diseases, diabetes and other conditions", coef: uniform(0.75) },
  { title: 'Mental Health & Addiction Recovery', desc: 'Mental health, crisis support, suicide prevention, substance abuse and recovery', coef: uniform(0.8) },
  { title: 'Hunger & Basic Needs', desc: 'Food banks, clothing assistance, poverty relief and essential supplies', coef: uniform(0.95) },
  { title: 'Homelessness & Housing', desc: 'Shelters, affordable housing, transitional housing and housing assistance', coef: uniform(0.92) },
  { title: 'Domestic Violence & Victim Support', desc: 'Domestic violence, sexual assault, trafficking prevention and survivor assistance', coef: uniform(0.79) },
  { title: 'Veterans & Military Families', desc: 'Veteran services, military transition support, family assistance, PTSD support, benefits navigation', coef: uniform(0.68) },
  { title: 'Disability & Accessibility', desc: 'Developmental disabilities, physical disabilities, accessibility and adaptive programs', coef: { ...uniform(0.72), spend: 0.7 } },
  { title: 'Seniors & Aging Services', desc: 'Senior centers, elder care, in-home assistance, companionship programs, aging-in-place support', coef: uniform(0.8) },
  {
    title: 'Animals & Pet Rescue',
    desc: 'Shelters, rescues, adoption and animal welfare',
   
    coef: { spend: 1.5, impressions: 1.25, clicks: 1.25, conv: 1.5, donations: 1.1, volunteers: 1.1, registrations: 1.1, contactLeads: 1.1, newsletter: 0.7, phoneCalls: 1.25, other: 1.25 },
  },
  { title: 'Wildlife & Environment', desc: 'Wildlife conservation, climate, sustainability, land and water protection', coef: uniform(0.79) },
  { title: 'Arts, Culture & History', desc: 'Museums, music, theater, cultural organizations and historical preservation', coef: { ...uniform(0.72), spend: 0.7 } },
  { title: 'Churches, Ministries & Faith-Based Organizations', desc: 'Religious congregations, ministries, faith-based outreach, community worship programs', coef: uniform(0.68) },
  { title: 'Civil Rights, Advocacy & Legal Aid', desc: 'Civil rights, social justice, legal assistance, civic education and victim advocacy', coef: uniform(1.12) },
  { title: 'International Aid & Global Development', desc: 'Humanitarian aid, global health, clean water, international education and refugee support', coef: uniform(0.75) },
  { title: 'Disaster Relief & Emergency Services', desc: 'Disaster response, fire and rescue, EMS and search-and-rescue organizations', coef: uniform(0.92) },
  { title: 'Community & Workforce Development', desc: 'Job training, employment assistance, financial literacy, entrepreneurship and community development', coef: uniform(0.89) },
  {
    title: 'Sports & Recreation',
    desc: 'Youth sports, community recreation and adaptive sports',
   
    coef: { spend: 1.5, impressions: 1.25, clicks: 1.25, conv: 1.5, donations: 1.1, volunteers: 1.1, registrations: 1.1, contactLeads: 1.1, newsletter: 0.7, phoneCalls: 1.25, other: 1.25 },
  },
  { title: 'Other Nonprofit Organizations', desc: 'Any registered 501(c)(3) mission not listed above', coef: uniform(0.95) },
]

/**
 * Packages are identified by monthly service fee. Ad spend always comes from
 * the Google grant (capped at $10k/mo); a higher fee buys faster ramp-up and
 * better conversion — encoded in each package's static base table below.
 * Annual monthly prices from the sheet: $250→$200, $500→$350, $1000→$650.
 */
export const TARIFFS: Record<TariffKey, Tariff> = {
  starter: { name: 'Starter', tagline: 'Essential grant setup & management', feeM: 250, feeA: 200 },
  growth: { name: 'Growth Partner', tagline: 'Full optimization & donor targeting', feeM: 500, feeA: 350 },
  impact: { name: 'Impact Partner', tagline: 'Maximum reach & advanced strategy', feeM: 1000, feeA: 650 },
}

export const TARIFF_ORDER: TariffKey[] = ['starter', 'growth', 'impact']

/**
 * Static base tables for the reference niche (Education & Scholarships), one
 * per package, ported verbatim from the reference sheet (tabs "Пакеты - $250 /
 * $500 / $1000"). 24 monthly rows, columns in order:
 * [spend, impressions, clicks, conv, donations, volunteers, registrations,
 *  contactLeads, newsletter, phoneCalls, other]
 */

export type BaseRow = [number, number, number, number, number, number, number, number, number, number, number]

export const BASE_TABLES: Record<TariffKey, BaseRow[]> = {
  // ── $250 / mo ──
  starter: [
    [339, 790, 38, 10, 0, 0, 2, 2, 2, 2, 4],
    [902.12, 2067, 99, 14, 0, 0, 2, 2, 2, 2, 6],
    [2687.27, 6157, 296, 21, 0, 1, 3, 4, 2, 2, 9],
    [4147.3, 9502, 457, 44, 0, 2, 6, 8, 6, 5, 18],
    [5556.95, 12732, 612, 55, 0, 3, 6, 9, 7, 5, 24],
    [7632.13, 15632, 841, 78, 1, 5, 8, 11, 7, 6, 41],
    [8921.0, 16732, 845, 98, 2, 6, 8, 11, 8, 8, 54],
    [9762.0, 17693, 851, 124, 4, 8, 10, 15, 9, 9, 69],
    [10000, 17982, 865, 149, 9, 10, 11, 18, 11, 13, 78],
    [10000, 18234, 877, 171, 11, 11, 11, 21, 11, 12, 92],
    [10000, 18234, 888, 197, 11, 13, 11, 22, 14, 12, 113],
    [10000, 18234, 872, 218, 12, 15, 12, 22, 14, 13, 131],
    [10000, 18234, 876, 219, 12, 15, 12, 22, 14, 13, 131],
    [10000, 18234, 879, 228, 12, 15, 12, 22, 14, 12, 141],
    [10000, 18534, 890, 248, 12, 14, 12, 22, 14, 12, 162],
    [10000, 18534, 889, 281, 13, 15, 12, 22, 13, 13, 193],
    [10000, 18578, 862, 307, 13, 15, 13, 22, 13, 13, 218],
    [10000, 18673, 891, 310, 12, 16, 13, 21, 13, 13, 222],
    [10000, 18782, 902, 320, 12, 16, 13, 22, 14, 13, 230],
    [10000, 18763, 910, 334, 13, 16, 12, 21, 14, 14, 244],
    [10000, 18798, 912, 350, 13, 15, 12, 23, 13, 14, 260],
    [10000, 18753, 910, 362, 14, 15, 13, 23, 14, 13, 270],
    [10000, 18767, 911, 372, 14, 15, 13, 23, 14, 14, 279],
    [10000, 18711, 921, 377, 14, 16, 13, 22, 14, 14, 284],
  ],
  // ── $500 / mo (reference package) ──
  growth: [
    [452, 1036, 50, 13, 0, 0, 2, 2, 2, 2, 5],
    [1182, 2708, 130, 18, 0, 0, 3, 3, 2, 2, 8],
    [3521, 8067, 388, 28, 0, 1, 4, 5, 3, 3, 12],
    [5434, 12450, 599, 59, 1, 3, 8, 10, 8, 6, 23],
    [7281, 16682, 802, 73, 1, 4, 8, 12, 9, 7, 32],
    [10000, 22912, 1102, 103, 2, 6, 10, 14, 9, 8, 54],
    [10000, 23023, 1107, 128, 3, 8, 11, 14, 11, 10, 71],
    [10000, 23182, 1115, 167, 10, 10, 13, 19, 12, 12, 91],
    [10000, 23561, 1133, 195, 12, 13, 14, 23, 14, 17, 102],
    [10000, 23891, 1149, 227, 14, 15, 15, 28, 15, 19, 121],
    [10000, 24191, 1164, 263, 15, 17, 15, 29, 18, 21, 148],
    [10000, 24981, 1202, 306, 19, 19, 16, 30, 23, 28, 171],
    [10000, 25478, 1225, 314, 21, 23, 18, 30, 23, 28, 171],
    [10000, 26192, 1260, 330, 22, 24, 18, 30, 23, 28, 185],
    [10000, 26388, 1269, 357, 22, 24, 18, 30, 23, 28, 212],
    [10000, 26781, 1288, 398, 22, 24, 18, 30, 23, 28, 253],
    [10000, 27891, 1341, 434, 22, 25, 19, 31, 23, 29, 285],
    [10000, 27932, 1343, 441, 23, 25, 19, 31, 23, 29, 291],
    [10000, 28172, 1355, 454, 23, 26, 19, 31, 24, 30, 301],
    [10000, 29112, 1400, 474, 23, 26, 20, 31, 24, 30, 320],
    [10000, 29562, 1422, 497, 23, 26, 20, 32, 24, 31, 341],
    [10000, 30921, 1487, 510, 23, 26, 20, 32, 24, 31, 354],
    [10000, 31892, 1534, 527, 24, 27, 21, 32, 25, 32, 366],
    [10000, 32123, 1545, 534, 24, 27, 21, 33, 25, 32, 372],
  ],
  // ── $1000 / mo ──
  impact: [
    [497, 1139, 55, 14, 0, 0, 2, 2, 2, 2, 6],
    [2364, 3067, 147, 20, 0, 0, 3, 3, 2, 2, 9],
    [6338, 9538, 459, 33, 0, 1, 5, 6, 4, 4, 14],
    [8721, 15314, 737, 73, 1, 4, 10, 12, 10, 7, 28],
    [10000, 20769, 999, 91, 1, 5, 10, 15, 11, 9, 40],
    [10000, 35353, 1700, 159, 3, 9, 15, 22, 14, 12, 83],
    [10000, 35524, 1709, 198, 5, 12, 17, 22, 17, 15, 110],
    [10000, 35770, 1720, 258, 15, 15, 20, 29, 19, 19, 140],
    [10000, 36355, 1749, 301, 19, 20, 22, 35, 22, 26, 157],
    [10000, 36864, 1773, 350, 22, 23, 23, 43, 23, 29, 187],
    [10000, 37327, 1795, 406, 23, 26, 23, 45, 28, 32, 228],
    [10000, 38546, 1854, 472, 29, 29, 25, 46, 35, 43, 264],
    [10000, 39313, 1891, 485, 32, 35, 28, 46, 35, 43, 264],
    [10000, 40414, 1944, 509, 34, 37, 28, 46, 35, 43, 285],
    [10000, 40717, 1958, 553, 36, 37, 28, 46, 35, 43, 327],
    [10000, 41323, 1988, 616, 36, 37, 28, 46, 35, 43, 390],
    [10000, 43036, 2070, 675, 39, 39, 29, 48, 35, 45, 440],
    [10000, 43099, 2073, 684, 39, 39, 29, 48, 35, 45, 449],
    [10000, 43469, 2091, 706, 41, 40, 29, 48, 37, 46, 464],
    [10000, 44920, 2161, 737, 41, 40, 31, 48, 37, 46, 494],
    [10000, 45614, 2194, 773, 42, 40, 31, 49, 37, 48, 526],
    [10000, 47711, 2295, 793, 42, 40, 31, 49, 37, 48, 546],
    [10000, 49209, 2367, 820, 44, 42, 32, 49, 39, 49, 565],
    [10000, 53612, 2561, 833, 46, 42, 32, 51, 39, 49, 574],
  ],
}

/**
 * The nonprofit-next brand has no blue: the annual accent uses the dark
 * olive scheme (like its switch-pill), monthly keeps the bright lime.
 */
export function accentFor(payment: Payment): Accent {
  return payment === 'annual'
    ? { pill: '#3F5028', pillInk: '#EAF6CC', banner: '#EAF6CC', bannerInk: '#3F5028', rule: 'rgba(63,80,40,0.20)', big: '#3F5028' }
    : { pill: '#C4ED82', pillInk: '#3F5028', banner: '#C4ED82', bannerInk: '#3F5028', rule: 'rgba(63,80,40,0.25)', big: '#3F5028' }
}
