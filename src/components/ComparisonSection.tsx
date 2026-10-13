import { useState, type ReactNode } from 'react'
import { cf, nf } from '../model/format'
import { TARIFF_ORDER, TARIFFS } from '../model/data'
import { aggregate, feeFor, monthlyFor, periodRange, valueMultiplier } from '../model/projection'
import type { Accent, Metrics, Niche, Payment, Period } from '../model/types'
import { Tip } from './InfoTip'
import { PillGroup } from './PillGroup'

// Hover interpretations — same plain, second-person voice as the source.
const TIPS = {
  impressions: 'How many times your ads were shown to people searching online.',
  visitors: 'People who clicked your ad and visited your website.',
  adValue: 'The advertising Google covers for you through the Ad Grants program.',
  serviceFee: 'What you pay dgtl-house over the selected period.',
  multiplier: 'Free ad value from Google divided by our agency fee.',
  monthlyPayment: 'Your per-month price for this plan.',
} as const

const ACTIONS: { key: keyof Metrics; label: string }[] = [
  { key: 'volunteers', label: 'Expected volunteers' },
  { key: 'registrations', label: 'Expected registrations' },
  { key: 'contactLeads', label: 'Expected contact leads' },
  { key: 'newsletter', label: 'Expected newsletter sign-ups' },
  { key: 'phoneCalls', label: 'Expected phone calls' },
  { key: 'other', label: 'Other expected actions' },
]

function Row({
  cls,
  label,
  tip,
  value,
  caption,
  extra,
  onClick,
  style,
}: {
  cls: string
  label: string
  tip?: string
  value: string
  caption?: string
  extra?: ReactNode
  onClick?: () => void
  style?: React.CSSProperties
}) {
  return (
    <div className={cls} style={{ ...(onClick ? { cursor: 'pointer' } : null), ...style }} onClick={onClick}>
      <span className="cmp-label">
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {tip ? <Tip text={tip}>{label}</Tip> : label}
          {extra}
        </span>
        {caption && <span className="cmp-caption">{caption}</span>}
      </span>
      <span className="cmp-value">{value}</span>
    </div>
  )
}

interface ComparisonSectionProps {
  payment: Payment
  niche: Niche
  accent: Accent
}

const chevronFor = (open: boolean) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    style={{ marginLeft: 6, transition: 'transform .2s ease', transform: `rotate(${open ? 180 : 0}deg)` }}
  >
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function ComparisonSection({ payment, niche, accent }: ComparisonSectionProps) {
  const nicheLower = niche.title.toLowerCase()
  const [actionsOpen, setActionsOpen] = useState(false)
  const [period, setPeriod] = useState<Period>('total')
  const [start, e2, count] = periodRange(period)

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
            onPick={setPeriod}
            accent={accent}
          />
        </div>
      </div>

      <div className="grid-3" style={{ alignItems: 'start', paddingTop: 20 }}>
        {TARIFF_ORDER.map((key) => {
          const p = TARIFFS[key]
          const best = key === 'growth'
          const a = aggregate(monthlyFor(key, niche), start, e2)
          const fee = feeFor(key, payment)
          const serviceFee = fee * count
          const saveAmt = (p.feeM - p.feeA) * count
          const multiplier = valueMultiplier(a.spend, serviceFee)
          const savePct = ((p.feeM - p.feeA) / p.feeM) * 100
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

              {/* Hero metrics */}
              <div className="cmp-hero">
                <div className="cmp-hero-item">
                  <span className="cmp-hero-label">
                    <Tip text={TIPS.impressions}>Ad reach (impressions)</Tip>
                  </span>
                  <span className="cmp-hero-value">{nf(a.impressions)}</span>
                </div>
                <div className="cmp-hero-item">
                  <span className="cmp-hero-label">
                    <Tip text={TIPS.visitors}>Relevant visitors</Tip>
                  </span>
                  <span className="cmp-hero-value">{nf(a.clicks)}</span>
                </div>
                <div className="cmp-hero-item">
                  <span className="cmp-hero-label">
                    <Tip text={TIPS.adValue}>Free ad value from Google</Tip>
                  </span>
                  <span className="cmp-hero-value">{cf(a.spend)}</span>
                </div>
              </div>

              <Row cls="cmp-feegap" label="Agency fee" tip={TIPS.serviceFee} value={cf(serviceFee)} />

              <Row
                cls="cmp-net"
                label={`×${multiplier.toFixed(1)} in ad value per $1 invested`}
                tip={TIPS.multiplier}
                value=""
                style={{ background: 'var(--lime-100)', borderRadius: 12, padding: '12px 14px', margin: '8px -12px 4px' }}
              />

              <Row cls="cmp-plain" label="Monthly payment" tip={TIPS.monthlyPayment} value={`${cf(fee)}/mo`} />

              {payment === 'annual' && (
                <div className="cmp-save">
                  <span className="cmp-label">You save with Annual plan</span>
                  <span className="cmp-value">{`${cf(saveAmt)}  ·  ${savePct.toFixed(0)}%`}</span>
                </div>
              )}

              {/* Secondary info — collapsed by default */}
              <Row
                cls="cmp-plain"
                label="What visitors might do on your site ↓"
                value=""
                extra={chevronFor(actionsOpen)}
                onClick={() => setActionsOpen((o) => !o)}
                style={{ marginTop: 10 }}
              />
              {actionsOpen &&
                ACTIONS.map((x) => (
                  <Row key={x.key} cls="cmp-sub cmp-small" label={x.label} value={nf(a[x.key])} />
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
        These projections are estimates based on industry benchmarks for {nicheLower} and our historical performance
        data. Actual results depend on your website quality, mission clarity, keyword targeting, and other factors.
      </p>
    </section>
  )
}
