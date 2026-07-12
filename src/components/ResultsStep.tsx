import { useMemo } from 'react'
import { accentFor, MONTHS, NICHES } from '../model/data'
import { cc, nf } from '../model/format'
import { aggregate, feeFor, monthlyFor } from '../model/projection'
import type { Payment, TariffKey } from '../model/types'
import { BreakdownTable } from './BreakdownTable'
import { ComparisonSection } from './ComparisonSection'
import { Eyebrow } from './Eyebrow'
import { LineChart } from './LineChart'
import { PillGroup } from './PillGroup'
import { ServicesSection } from './ServicesSection'

const TARIFF_PILLS = [
  { label: 'Starter', value: 'starter' },
  { label: 'Growth Partner', value: 'growth' },
  { label: 'Impact Partner', value: 'impact' },
] as { label: string; value: TariffKey }[]

const PAYMENT_PILLS = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' },
] as { label: string; value: Payment }[]

interface ResultsStepProps {
  niche: number
  tariff: TariffKey
  onTariff: (t: TariffKey) => void
  payment: Payment
  onPayment: (p: Payment) => void
}

export function ResultsStep({ niche, tariff, onTariff, payment, onPayment }: ResultsStepProps) {
  const accent = accentFor(payment)
  const nicheObj = NICHES[niche]

  const monthly = useMemo(() => monthlyFor(tariff, nicheObj), [tariff, nicheObj])
  const total = useMemo(() => aggregate(monthly, 0, MONTHS), [monthly])

  const fee24 = feeFor(tariff, payment) * MONTHS
  const roi = fee24 ? total.donUsd / fee24 : 0
  const net = total.donUsd - fee24

  // Net-gain uplift of the selected plan vs. the Starter plan (same niche +
  // billing). Shown as a badge on Growth / Impact only.
  const starterNet = useMemo(() => {
    const t = aggregate(monthlyFor('starter', nicheObj), 0, MONTHS)
    return t.donUsd - feeFor('starter', payment) * MONTHS
  }, [nicheObj, payment])
  const upliftPct = tariff !== 'starter' && starterNet > 0 ? (net / starterNet - 1) * 100 : null
  const badge =
    payment === 'annual'
      ? { bg: '#2D3A1C', ink: '#EAF6CC', sub: 'rgba(234,246,204,0.75)' }
      : { bg: '#3F5028', ink: '#C4ED82', sub: 'rgba(196,237,130,0.78)' }

  const cumDonations = useMemo(() => {
    let cum = 0
    return monthly.map((m) => (cum += m.donUsd))
  }, [monthly])
  const monthlySpend = useMemo(() => monthly.map((m) => m.spend), [monthly])

  const metricCards = [
    { label: 'Projected donations', value: cc(total.donUsd), sub: 'in donations over 24 months' },
    { label: 'Meaningful conversions', value: nf(total.conv), sub: 'volunteers, registrations, calls & more' },
    { label: 'Return on investment', value: `×${roi.toFixed(1)}`, sub: 'return on every $1 invested', color: accent.big },
  ]

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '64px 40px 40px' }}>
      {/* Step 3 · Key metrics by plan */}
      <section>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <Eyebrow>Choose your partnership plan</Eyebrow>
          <PillGroup items={TARIFF_PILLS} current={tariff} onPick={onTariff} accent={accent} />
          <PillGroup items={PAYMENT_PILLS} current={payment} onPick={onPayment} accent={accent} />
        </div>

        <div className="grid-3" style={{ marginTop: 32 }}>
          {metricCards.map((card) => (
            <div key={card.label} className="card" style={{ padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="mono-label">{card.label}</span>
              <span style={{ fontSize: 'clamp(36px, 8vw, 52px)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, color: card.color }}>
                {card.value}
              </span>
              <span style={{ fontSize: 15, fontWeight: 300, color: 'var(--ink-500)' }}>{card.sub}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            background: accent.banner,
            color: accent.bannerInk,
            borderRadius: 24,
            padding: '40px 48px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 32,
            transition: 'background .3s ease, color .3s ease',
          }}
        >
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Top row: eyebrow + the "+XX% vs. Starter plan" badge (Growth/Impact only). */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  opacity: 0.8,
                }}
              >
                Your net gain
              </span>
              {upliftPct != null && (
                <span
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    lineHeight: 1.02,
                    background: badge.bg,
                    borderRadius: 999,
                    padding: '8px 22px',
                    transition: 'background .3s ease, color .3s ease',
                  }}
                >
                  <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: badge.ink }}>
                    +{Math.round(upliftPct)}%
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: badge.sub, whiteSpace: 'nowrap' }}>
                    vs. Starter plan
                  </span>
                </span>
              )}
            </div>
            <span style={{ fontSize: 'clamp(44px, 10vw, 72px)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {cc(net)}
            </span>
          </div>
          <div style={{ width: 1, alignSelf: 'stretch', background: accent.rule }} />
          <div style={{ flex: '1 1 260px', minWidth: 0, fontSize: 26, fontWeight: 500, lineHeight: 1.28, letterSpacing: '-0.01em' }}>
            After our service fee, your nonprofit&rsquo;s{' '}
            <strong style={{ fontWeight: 700 }}>net gain in donations is {cc(net)}</strong> over 24 months.
          </div>
        </div>
      </section>

      {/* Step 4 · Detailed monthly breakdown */}
      <section style={{ marginTop: 64 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontWeight: 500, fontSize: 34, letterSpacing: '-0.02em' }}>
              Your month-by-month projection
            </h2>
            <p style={{ margin: '6px auto 0', maxWidth: 640, fontSize: 15, fontWeight: 300, color: 'var(--ink-500)' }}>
              Click any row, column header, or cell to highlight it. Gray spend cells mark months at the
              $10,000 Ad Grant cap.
            </p>
          </div>
          <PillGroup items={TARIFF_PILLS} current={tariff} onPick={onTariff} accent={accent} />
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: 20, boxShadow: 'inset 0 0 0 1px var(--cream-400)', overflow: 'hidden' }}>
          <BreakdownTable monthly={monthly} />
        </div>
      </section>

      {/* Step 5 · Charts */}
      <section className="grid-2" style={{ marginTop: 56 }}>
        <div className="card" style={{ padding: '26px 26px 18px' }}>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Projected donations growth</div>
          <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--ink-400)', marginBottom: 14 }}>
            Cumulative donations raised, months 1&ndash;24
          </div>
          <LineChart values={cumDonations} stroke="#3F5028" fillHi="#C4ED82" fillLo="#C4ED82" />
        </div>
        <div className="card" style={{ padding: '26px 26px 18px' }}>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Ad spend growth</div>
          <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--ink-400)', marginBottom: 14 }}>
            Monthly Google Ad Grant spend, months 1&ndash;24
          </div>
          <LineChart values={monthlySpend} stroke="#161514" fillHi="#CFCFCF" fillLo="#EBE9E0" />
        </div>
      </section>

      {/* Step 6 · Plan comparison */}
      <ComparisonSection payment={payment} onPayment={onPayment} niche={nicheObj} accent={accent} />

      {/* Step 7 · Services & what's included */}
      <ServicesSection payment={payment} />
    </div>
  )
}
