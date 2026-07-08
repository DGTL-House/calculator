import type { Accent, Niche, Payment, Tariff, TariffKey } from './types'

export const GRANT_CAP = 10_000 // $/mo Google Ad Grants budget cap
export const MONTHS = 24
export const DEFAULT_AVG_CHECK = 75

export const NICHES: Niche[] = [
  { title: 'Education & Scholarships', desc: 'Schools, literacy, tutoring, scholarships, higher education, research', check: 85 },
  { title: 'Youth & Family Services', desc: 'Mentoring, after-school programs, childcare, foster care, adoption, family support', check: 65 },
  { title: 'Health & Medical Support', desc: 'Healthcare access, community clinics, medical missions, rehabilitation, patient support', check: 90 },
  { title: 'Disease-Specific Organizations', desc: "Cancer, Alzheimer's, rare diseases, diabetes and other conditions", check: 110 },
  { title: 'Mental Health & Addiction Recovery', desc: 'Mental health, crisis support, suicide prevention, substance abuse and recovery', check: 70 },
  { title: 'Hunger & Basic Needs', desc: 'Food banks, clothing assistance, poverty relief and essential supplies', check: 45 },
  { title: 'Homelessness & Housing', desc: 'Shelters, affordable housing, transitional housing and housing assistance', check: 60 },
  { title: 'Domestic Violence & Victim Support', desc: 'Domestic violence, sexual assault, trafficking prevention and survivor assistance', check: 75 },
  { title: 'Veterans & Military Families', desc: 'Veteran services, military transition support, family assistance, PTSD support, benefits navigation', check: 95 },
  { title: 'Disability & Accessibility', desc: 'Developmental disabilities, physical disabilities, accessibility and adaptive programs', check: 80 },
  { title: 'Seniors & Aging Services', desc: 'Senior centers, elder care, in-home assistance, companionship programs, aging-in-place support', check: 85 },
  { title: 'Animals & Pet Rescue', desc: 'Shelters, rescues, adoption and animal welfare', check: 55 },
  { title: 'Wildlife & Environment', desc: 'Wildlife conservation, climate, sustainability, land and water protection', check: 70 },
  { title: 'Arts, Culture & History', desc: 'Museums, music, theater, cultural organizations and historical preservation', check: 120 },
  { title: 'Churches, Ministries & Faith-Based Organizations', desc: 'Religious congregations, ministries, faith-based outreach, community worship programs', check: 100 },
  { title: 'Civil Rights, Advocacy & Legal Aid', desc: 'Civil rights, social justice, legal assistance, civic education and victim advocacy', check: 85 },
  { title: 'International Aid & Global Development', desc: 'Humanitarian aid, global health, clean water, international education and refugee support', check: 95 },
  { title: 'Disaster Relief & Emergency Services', desc: 'Disaster response, fire and rescue, EMS and search-and-rescue organizations', check: 80 },
  { title: 'Community & Workforce Development', desc: 'Job training, employment assistance, financial literacy, entrepreneurship and community development', check: 70 },
  { title: 'Sports & Recreation', desc: 'Youth sports, community recreation and adaptive sports', check: 60 },
  { title: 'Other Nonprofit Organizations', desc: 'Any registered 501(c)(3) mission not listed above', check: 65 },
]

export const TARIFFS: Record<TariffKey, Tariff> = {
  starter: { name: 'Starter', tagline: 'Essential grant setup & management', util: 0.55, cpc: 1.65, ctr: 0.038, cr: 0.04, donShare: 0.42, feeM: 659, feeA: 549 },
  growth: { name: 'Growth Partner', tagline: 'Full optimization & donor targeting', util: 0.82, cpc: 1.55, ctr: 0.046, cr: 0.058, donShare: 0.45, feeM: 1199, feeA: 999 },
  impact: { name: 'Impact Partner', tagline: 'Maximum reach & advanced strategy', util: 1.0, cpc: 1.45, ctr: 0.052, cr: 0.075, donShare: 0.48, feeM: 1799, feeA: 1499 },
}

export const TARIFF_ORDER: TariffKey[] = ['starter', 'growth', 'impact']

/** Split of non-donation conversions by type */
export const SPLIT = {
  volunteers: 0.24,
  registrations: 0.17,
  contactLeads: 0.15,
  newsletter: 0.18,
  phoneCalls: 0.14,
  other: 0.12,
} as const

/**
 * The nonprofit-next brand has no blue: the annual accent uses the dark
 * olive scheme (like its switch-pill), monthly keeps the bright lime.
 */
export function accentFor(payment: Payment): Accent {
  return payment === 'annual'
    ? { pill: '#3F5028', pillInk: '#EAF6CC', banner: '#EAF6CC', bannerInk: '#3F5028', rule: 'rgba(63,80,40,0.20)', big: '#3F5028' }
    : { pill: '#C4ED82', pillInk: '#3F5028', banner: '#C4ED82', bannerInk: '#3F5028', rule: 'rgba(63,80,40,0.25)', big: '#3F5028' }
}
