import { useState, type ReactNode } from 'react'
import { cc, cf, nf } from '../model/format'
import { TARIFF_ORDER, TARIFFS } from '../model/data'
import { aggregate, feeFor, monthlyFor, periodRange } from '../model/projection'
import type { Accent, Metrics, Niche, Payment, Period } from '../model/types'
import { Tip } from './InfoTip'
import { PillGroup } from './PillGroup'

// Hover interpretations — same plain, second-person voice as the source.
const TIPS = {
  impressions: 'How many times your ads were shown in Google search.',
  traffic: 'How many people clicked your ad and visited your website.',
  conversions: 'How many meaningful actions people took — donations, sign-ups, calls and more.',
  donationsUsd: 'Estimated donation revenue — donations multiplied by your average gift.',
  donationsQty: 'How many donations came in.',
  volunteers: 'How many people signed up to volunteer.',
  registrations: 'How many people registered for an event or program.',
  contactLeads: 'How many people submitted a contact form or enquiry.',
  newsletter: 'How many people subscribed to your newsletter.',
  phoneCalls: 'How many people called your organization from the ads.',
  other: 'Other tracked goal completions on your site.',
  serviceFee: 'What you pay dgtl-house over the selected period.',
  netGain: 'Your donation revenue after subtracting our service fee.',
  monthlyPayment: 'Your per-month price for this plan.',
} as const

const CONV_SUB: { key: keyof Metrics; label: string; money?: boolean; tip: string }[] = [
  { key: 'donUsd', label: 'Donations, $', money: true, tip: TIPS.donationsUsd },
  { key: 'donQty', label: 'Donations, qty', tip: TIPS.donationsQty },
  { key: 'volunteers', label: 'Volunteers', tip: TIPS.volunteers },
  { key: 'registrations', label: 'Registrations', tip: TIPS.registrations },
  { key: 'contactLeads', label: 'Contact Leads', tip: TIPS.contactLeads },
  { key: 'newsletter', label: 'Newsletter Sign-ups', tip: TIPS.newsletter },
  { key: 'phoneCalls', label: 'Phone Calls', tip: TIPS.phoneCalls },
  { key: 'other', label: 'Other', tip: TIPS.other },
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
  period: Period
  onPeriod: (p: Period) => void
  payment: Payment
  onPayment: (p: Payment) => void
  niche: Niche
  accent: Accent
}

export function ComparisonSection({ period, onPeriod, payment, onPayment, niche, accent }: ComparisonSectionProps) {
  const nicheLower = niche.title.toLowerCase()
  const [convOpen, setConvOpen] = useState(false)
  const [start, e2, count] = periodRange(period)

  const chevron = (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      style={{ marginLeft: 6, transition: 'transform .2s ease', transform: `rotate(${convOpen ? 180 : 0}deg)` }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

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
          const a = aggregate(monthlyFor(key, niche), start, e2)
          const fee = feeFor(key, payment)
          const serviceFee = fee * count
          const saveAmt = (p.feeM - p.feeA) * count
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

              <Row cls="cmp-plain" label="Impressions" tip={TIPS.impressions} value={nf(a.impressions)} />
              <Row cls="cmp-plain" label="Traffic" tip={TIPS.traffic} value={nf(a.clicks)} />

              {/* Conversions — same size as the rows above, toggles the details. */}
              <Row
                cls="cmp-plain"
                label="Conversions"
                tip={TIPS.conversions}
                value={nf(a.conv)}
                extra={chevron}
                onClick={() => setConvOpen((o) => !o)}
              />
              {convOpen &&
                CONV_SUB.map((s) => (
                  <Row
                    key={s.key}
                    cls="cmp-sub"
                    label={s.label}
                    tip={s.tip}
                    value={s.money ? cc(a[s.key]) : nf(a[s.key])}
                    caption={s.key === 'donUsd' ? `av check — $${niche.check}` : undefined}
                  />
                ))}

              <Row cls="cmp-feegap" label="Service fee" tip={TIPS.serviceFee} value={cf(serviceFee)} />

              {/* Net donation gain — subtle light-gray underlay strip. */}
              <Row
                cls="cmp-net"
                label="Net donation gain"
                tip={TIPS.netGain}
                value={cc(a.donUsd - serviceFee)}
                style={{
                  background: 'var(--cream-400)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  margin: '8px -12px 4px',
                }}
              />

              <Row cls="cmp-plain" label="Monthly payment" tip={TIPS.monthlyPayment} value={`${cf(fee)}/mo`} />

              {payment === 'annual' && (
                <div className="cmp-save">
                  <span className="cmp-label">You save with Annual plan</span>
                  <span className="cmp-value">{`${cf(saveAmt)}  ·  ${savePct.toFixed(0)}%`}</span>
                </div>
              )}
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
