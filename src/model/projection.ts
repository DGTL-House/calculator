import { BASE_TABLES, GRANT_CAP, TARIFFS } from './data'
import type { Metrics, MonthRow, Niche, Payment, Period, TariffKey } from './types'

/**
 * Monthly rows for a package + niche: the package's static base table
 * (reference niche) with each column multiplied by the niche coefficient.
 * Ad spend is re-capped at the $10k/mo Google grant ceiling, and donation $
 * = donation count × the niche's average check.
 */
export function monthlyFor(key: TariffKey, niche: Niche): MonthRow[] {
  const c = niche.coef
  return BASE_TABLES[key].map((row, i) => {
    const [spend, impressions, clicks, conv, donations, volunteers, registrations, contactLeads, newsletter, phoneCalls, other] = row
    const donQty = donations * c.donations
    return {
      month: i + 1,
      spend: Math.min(spend * c.spend, GRANT_CAP),
      impressions: impressions * c.impressions,
      clicks: clicks * c.clicks,
      conv: conv * c.conv,
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
    clicks: 0,
    conv: 0,
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
