import { BASE_TABLES, GRANT_CAP, TARIFFS } from './data'
import type { Metrics, MonthRow, Niche, Payment, Period, TariffKey } from './types'

/**
 * Monthly rows for a package + niche: the package's static base table
 * (reference niche) with each column multiplied by the niche coefficient.
 *
 * Spend is special: the $10,000/mo cap cells are FIXED (gray in the sheet) —
 * the niche coefficient does NOT apply to them; they stay at $10,000. The
 * ramp-up cells (below the cap) DO get the coefficient, clamped at the cap.
 */
export function monthlyFor(key: TariffKey, niche: Niche): MonthRow[] {
  const c = niche.coef
  return BASE_TABLES[key].map((row, i) => {
    const [spend0, impressions0, clicks0, , , volunteers, registrations, contactLeads, newsletter, phoneCalls, other] = row
    return {
      month: i + 1,
      // Capped ($10k) cells stay fixed; ramp-up cells scale by the coefficient.
      spend: spend0 >= GRANT_CAP ? GRANT_CAP : Math.min(spend0 * c.spend, GRANT_CAP),
      impressions: impressions0 * c.impressions,
      clicks: clicks0 * c.clicks,
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

/** Free ad value minus the agency fee for the period. */
export function netAdValue(spend: number, fee: number): number {
  return spend - fee
}

/** Ad value per $1 of agency fee, rounded to 1 decimal. */
export function valueMultiplier(spend: number, fee: number): number {
  return fee ? Math.round((spend / fee) * 10) / 10 : 0
}
