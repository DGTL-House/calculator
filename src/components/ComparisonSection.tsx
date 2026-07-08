import { cf, nf } from '../model/format'
import { TARIFF_ORDER, TARIFFS } from '../model/data'
import { aggregate, feeFor, monthlyFor, periodRange } from '../model/projection'
import type { Accent, Niche, Payment, Period, TariffKey } from '../model/types'
import { PillGroup } from './PillGroup'

type RowType = 'plain' | 'divider' | 'sub' | 'feegap' | 'net' | 'save'

interface CompRow {
  type: RowType
  label: string
  value: string
  caption?: string
}

function buildRows(key: TariffKey, period: Period, payment: Payment, niche: Niche): CompRow[] {
  const [start, end, count] = periodRange(period)
  const a = aggregate(monthlyFor(key, niche), start, end)
  const p = TARIFFS[key]
  const fee = feeFor(key, payment)
  const serviceFee = fee * count

  const rows: CompRow[] = [
    { type: 'plain', label: 'Impressions', value: nf(a.impressions) },
    { type: 'plain', label: 'Traffic', value: nf(a.clicks) },
    { type: 'divider', label: 'Conversions', value: nf(a.conv) },
    { type: 'sub', label: 'Donations, $', value: cf(a.donUsd), caption: `av check — $${niche.check}` },
    { type: 'sub', label: 'Donations, qty', value: nf(a.donQty) },
    { type: 'sub', label: 'Volunteers', value: nf(a.volunteers) },
    { type: 'sub', label: 'Registrations', value: nf(a.registrations) },
    { type: 'sub', label: 'Contact Leads', value: nf(a.contactLeads) },
    { type: 'sub', label: 'Newsletter Sign-ups', value: nf(a.newsletter) },
    { type: 'sub', label: 'Phone Calls', value: nf(a.phoneCalls) },
    { type: 'sub', label: 'Other', value: nf(a.other) },
    { type: 'feegap', label: 'Service fee', value: cf(serviceFee) },
    { type: 'net', label: 'Net donation gain', value: cf(a.donUsd - serviceFee) },
    { type: 'plain', label: 'Monthly payment', value: `${cf(fee)}/mo` },
  ]
  if (payment === 'annual') {
    const saveAmt = (p.feeM - p.feeA) * count
    const savePct = ((p.feeM - p.feeA) / p.feeM) * 100
    rows.push({ type: 'save', label: 'You save with Annual plan', value: `${cf(saveAmt)}  ·  ${savePct.toFixed(0)}%` })
  }
  return rows
}

interface ComparisonSectionProps {
  period: Period
  onPeriod: (p: Period) => void
  payment: Payment
  onPayment: (p: Payment) => void
  niche: Niche
  accent: Accent
}

export function ComparisonSection({ period, onPeriod, payment, onPayment, niche, accent }: ComparisonSectionProps) {
  const nicheLower = niche.title.toLowerCase()
  return (
    <section style={{ marginTop: 64 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 20px', fontWeight: 500, fontSize: 36, letterSpacing: '-0.02em' }}>
          Compare your projected results across plans
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <PillGroup
            items={[
              { label: 'Year 1', value: 'y1' },
              { label: 'Year 2', value: 'y2' },
              { label: 'Total 2 Years', value: 'total' },
            ]}
            current={period}
            onPick={onPeriod}
            accent={accent}
          />
          <PillGroup
            items={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Annual', value: 'annual' },
            ]}
            current={payment}
            onPick={onPayment}
            accent={accent}
          />
        </div>
      </div>

      <div className="grid-3" style={{ alignItems: 'start', paddingTop: 20 }}>
        {TARIFF_ORDER.map((key) => {
          const p = TARIFFS[key]
          const best = key === 'growth'
          return (
            <div
              key={key}
              style={{
                position: 'relative',
                background: '#FFFFFF',
                borderRadius: 24,
                padding: '26px 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: best
                  ? 'inset 0 0 0 2px #C4ED82, 0 14px 34px rgba(63,80,40,0.10)'
                  : 'inset 0 0 0 1px var(--cream-400)',
              }}
            >
              {best && (
                <div
                  style={{
                    position: 'absolute',
                    top: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'var(--lime-700)',
                    color: 'var(--lime-300)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '7px 14px',
                    borderRadius: 999,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#C4ED82">
                    <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5 20.7l1.4-6.8L1.3 9l6.9-.7z" />
                  </svg>
                  Best Value
                </div>
              )}
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>{p.name}</div>
              <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--ink-400)', marginBottom: 16 }}>{p.tagline}</div>
              {buildRows(key, period, payment, niche).map((r, i) => (
                <div key={i} className={`cmp-${r.type}`}>
                  <span className="cmp-label">
                    {r.label}
                    {r.caption && <span className="cmp-caption">{r.caption}</span>}
                  </span>
                  <span className="cmp-value">{r.value}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <p
        style={{
          margin: '40px auto 0',
          maxWidth: 860,
          textAlign: 'center',
          fontSize: 13,
          lineHeight: 1.6,
          fontWeight: 300,
          color: 'var(--ink-400)',
        }}
      >
        These projections are estimates based on industry benchmarks for {nicheLower}. Actual results depend on website
        quality, mission clarity, audience size, and other factors.
      </p>
    </section>
  )
}
