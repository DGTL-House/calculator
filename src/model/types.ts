export type Step = 'niche' | 'loading' | 'results'
export type TariffKey = 'starter' | 'growth' | 'impact'
export type Payment = 'monthly' | 'annual'
export type Period = 'y1' | 'y2' | 'total'

export interface Niche {
  title: string
  desc: string
  /** Average donation check, $ */
  check: number
}

export interface Tariff {
  name: string
  tagline: string
  /** Share of the grant cap actually spent */
  util: number
  cpc: number
  ctr: number
  /** Conversion rate */
  cr: number
  /** Share of conversions that are donations */
  donShare: number
  /** Service fee, $/mo on monthly billing */
  feeM: number
  /** Service fee, $/mo on annual billing */
  feeA: number
}

/** Aggregated metrics (month row without the month number) */
export interface Metrics {
  spend: number
  clicks: number
  impressions: number
  ctr: number
  cpc: number
  conv: number
  cr: number
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
