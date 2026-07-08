import { BASE_TABLES, DONATIONS_2Y, GRANT_CAP, TARIFFS } from './data'
import type { Metrics, MonthRow, Niche, Payment, Period, TariffKey } from './types'

/**
 * Monthly rows for a package + niche: the package's static base table
 * (reference niche) with each column multiplied by the niche coefficient.
 * Ad spend is re-capped at the $10k/mo Google grant ceiling, and donation $
 * = donation count × the niche's average check.
 */
export function monthlyFor(key: TariffKey, niche: Niche): MonthRow[] {
  const c = niche.coef
  // Scale the rounded monthly donation integers so they sum to the exact
  // fractional 2-year total — keeps donation income accurate to the cent.
  const baseDonTotal = BASE_TABLES[key].reduce((s, r) => s + r[4], 0)
  const donScale = DONATIONS_2Y[key] / baseDonTotal
  return BASE_TABLES[key].map((row, i) => {
    const [spend0, impressions0, clicks0, conv0, donations, volunteers, registrations, contactLeads, newsletter, phoneCalls, other] = row
    const spend = Math.min(spend0 * c.spend, GRANT_CAP)
    const impressions = impressions0 * c.impressions
    const clicks = clicks0 * c.clicks
    const conv = conv0 * c.conv
    const donQty = donations * donScale * c.donations
    return {
      month: i + 1,
      spend,
      impressions,
      // Derived metrics per the formula doc: CTR%, CPC, CR%, CPA.
      ctr: impressions ? clicks / impressions : 0,
      cpc: clicks ? spend / clicks : 0,
      clicks,
      conv,
      cr: clicks ? conv / clicks : 0,
      cpa: conv ? spend / conv : 0,
      donQty,
      donUsd: donQty * niche.check,
      volunteers: volunteers * c.volunteers,
      registrations: registrations * c.registrations,
      contactLeads: contactLeads * c.contactLeads,
      newsletter: newsletter * c.newsletter,
      phoneCalls: phoneCalls * c.phoneCalls,
      other: other * c.other,
    }
  })
}

const SUM_KEYS = [
  'spend',
  'impressions',
  'clicks',
  'conv',
  'donQty',
  'donUsd',
  'volunteers',
  'registrations',
  'contactLeads',
  'newsletter',
  'phoneCalls',
  'other',
] as const

export function aggregate(monthly: MonthRow[], start: number, end: number): Metrics {
  const s: Metrics = {
    spend: 0,
    impressions: 0,
    ctr: 0,
    cpc: 0,
    clicks: 0,
    conv: 0,
    cr: 0,
    cpa: 0,
    donQty: 0,
    donUsd: 0,
    volunteers: 0,
    registrations: 0,
    contactLeads: 0,
    newsletter: 0,
    phoneCalls: 0,
    other: 0,
  }
  for (const r of monthly.slice(start, end)) for (const k of SUM_KEYS) s[k] += r[k]
  // Derived ratios recomputed from the period totals (not summed).
  s.ctr = s.impressions ? s.clicks / s.impressions : 0
  s.cpc = s.clicks ? s.spend / s.clicks : 0
  s.cr = s.clicks ? s.conv / s.clicks : 0
  s.cpa = s.conv ? s.spend / s.conv : 0
  return s
}

export function feeFor(key: TariffKey, payment: Payment): number {
  return payment === 'annual' ? TARIFFS[key].feeA : TARIFFS[key].feeM
}

/** [startMonth, endMonth, monthCount] for a comparison period */
export function periodRange(period: Period): [number, number, number] {
  if (period === 'y1') return [0, 12, 12]
  if (period === 'y2') return [12, 24, 12]
  return [0, 24, 24]
}
