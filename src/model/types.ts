export type Step = 'niche' | 'loading' | 'results'
export type TariffKey = 'starter' | 'growth' | 'impact'
export type Payment = 'monthly' | 'annual'
export type Period = 'y1' | 'y2' | 'total'

/**
 * Per-metric niche coefficients, relative to the reference niche
 * (Education & Scholarships = 1.00 across the board). Selecting a niche
 * multiplies each column of the base package table by these factors.
 */
export interface NicheCoef {
  spend: number
  impressions: number
  clicks: number
  conv: number
  donations: number
  volunteers: number
  registrations: number
  contactLeads: number
  newsletter: number
  phoneCalls: number
  other: number
}

export interface Niche {
  title: string
  desc: string
  /** Average donation, $ (Средний Донат) */
  check: number
  coef: NicheCoef
}

export interface Tariff {
  name: string
  tagline: string
  /** Service fee, $/mo on monthly billing (the package price) */
  feeM: number
  /** Service fee, $/mo on annual billing */
  feeA: number
}

/** Aggregated metrics (a month row without the month number) */
export interface Metrics {
  spend: number
  impressions: number
  /** Click-through rate, fraction (clicks / impressions) */
  ctr: number
  /** Cost per click, $ (spend / clicks) */
  cpc: number
  clicks: number
  conv: number
  /** Conversion rate, fraction (conv / clicks) */
  cr: number
  /** Cost per acquisition, $ (spend / conv) */
  cpa: number
  donQty: number
  donUsd: number
  volunteers: number
  registrations: number
  contactLeads: number
  newsletter: number
  phoneCalls: number
  other: number
}

export interface MonthRow extends Metrics {
  month: number
}

export interface Accent {
  pill: string
  pillInk: string
  banner: string
  bannerInk: string
  rule: string
  big: string
}
