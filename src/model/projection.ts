import { GRANT_CAP, MONTHS, SPLIT, TARIFFS } from './data'
import type { Metrics, MonthRow, Payment, Period, TariffKey } from './types'

/**
 * Logistic ramp-up curve: month 1 starts at 16% of the max ad spend and
 * approaches 100% by month 24 (inflection around month 7).
 */
const RAMP: number[] = (() => {
  const L = (m: number) => 1 / (1 + Math.exp(-0.34 * (m - 7)))
  const min = L(1)
  const max = L(MONTHS)
  const out: number[] = []
  for (let m = 1; m <= MONTHS; m++) out.push(0.16 + (0.84 * (L(m) - min)) / (max - min))
  return out
})()

export function monthlyFor(key: TariffKey, avgCheck: number): MonthRow[] {
  const p = TARIFFS[key]
  const maxSpend = GRANT_CAP * p.util
  const rows: MonthRow[] = []
  for (let i = 0; i < MONTHS; i++) {
    const spend = maxSpend * RAMP[i]
    const clicks = spend / p.cpc
    const impressions = clicks / p.ctr
    const conv = clicks * p.cr
    const donQty = conv * p.donShare
    const nonDon = conv * (1 - p.donShare)
    rows.push({
      month: i + 1,
      spend,
      clicks,
      impressions,
      ctr: p.ctr,
      cpc: p.cpc,
      conv,
      cr: clicks ? conv / clicks : 0,
      cpa: conv ? spend / conv : 0,
      donQty,
      donUsd: donQty * avgCheck,
      volunteers: nonDon * SPLIT.volunteers,
      registrations: nonDon * SPLIT.registrations,
      contactLeads: nonDon * SPLIT.contactLeads,
      newsletter: nonDon * SPLIT.newsletter,
      phoneCalls: nonDon * SPLIT.phoneCalls,
      other: nonDon * SPLIT.other,
    })
  }
  return rows
}

const SUM_KEYS = [
  'spend',
  'clicks',
  'impressions',
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
  const rows = monthly.slice(start, end)
  const s: Metrics = {
    spend: 0,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    cpc: 0,
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
  for (const r of rows) for (const k of SUM_KEYS) s[k] += r[k]
  s.ctr = s.impressions ? s.clicks / s.impressions : 0
  s.cr = s.clicks ? s.conv / s.clicks : 0
  s.cpc = s.clicks ? s.spend / s.clicks : 0
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
