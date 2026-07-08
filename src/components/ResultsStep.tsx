import { useMemo } from 'react'
import { accentFor, MONTHS, NICHES } from '../model/data'
import { cf, nf } from '../model/format'
import { aggregate, feeFor, monthlyFor } from '../model/projection'
import type { Payment, Period, TariffKey } from '../model/types'
import { BreakdownTable } from './BreakdownTable'
import { ComparisonSection } from './ComparisonSection'
import { Eyebrow } from './Eyebrow'
import { LineChart } from './LineChart'
import { PillGroup } from './PillGroup'

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
  period: Period
  onPeriod: (p: Period) => void
}

export function ResultsStep({ niche, tariff, onTariff, payment, onPayment, period, onPeriod }: ResultsStepProps) {
  const accent = accentFor(payment)
  const nicheObj = NICHES[niche]

  const monthly = useMemo(() => monthlyFor(tariff, nicheObj), [tariff, nicheObj])
  const total = useMemo(() => aggregate(monthly, 0, MONTHS), [monthly])

  const fee24 = feeFor(tariff, payment) * MONTHS
  const roi = fee24 ? total.donUsd / fee24 : 0
  const net = total.donUsd - fee24

  const cumDonations = useMemo(() => {
    let cum = 0
    return monthly.map((m) => (cum += m.donUsd))
  }, [monthly])
  const monthlySpend = useMemo(() => monthly.map((m) => m.spend), [monthly])

  const metricCards = [
    { label: 'Projected donations', value: cf(total.donUsd), sub: 'in donations over 24 months' },
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
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
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
            <span style={{ fontSize: 'clamp(44px, 10vw, 72px)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>{cf(net)}</span>
          </div>
          <div style={{ width: 1, alignSelf: 'stretch', background: accent.rule }} />
          <div style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.28, letterSpacing: '-0.01em' }}>
            After our service fee, your nonprofit&rsquo;s{' '}
            <strong style={{ fontWeight: 700 }}>net gain in donations is {cf(net)}</strong> over 24 months.
          </div>
        </div>
      </section>

      {/* Step 4 · Detailed monthly breakdown */}
      <section style={{ marginTop: 64 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontWeight: 500, fontSize: 34, letterSpacing: '-0.02em' }}>
              Your month-by-month projection
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 15, fontWeight: 300, color: 'var(--ink-500)' }}>
              Click any row, column header, or cell to highlight it. Gray spend cells mark months at the
              $10,000 Ad Grant cap.
            </p>
          </div>
          <PillGroup items={TARIFF_PILLS} current={tariff} onPick={onTariff} accent={accent} />
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: 20, boxShadow: 'inset 0 0 0 1px var(--cream-400)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <BreakdownTable monthly={monthly} />
          </div>
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
      <ComparisonSection
        period={period}
        onPeriod={onPeriod}
        payment={payment}
        onPayment={onPayment}
        niche={nicheObj}
        accent={accent}
      />
    </div>
  )
}
