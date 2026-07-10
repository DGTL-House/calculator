import { Fragment, useState } from 'react'
import { TARIFFS } from '../model/data'
import { cf } from '../model/format'
import { feeFor } from '../model/projection'
import type { Payment, TariffKey } from '../model/types'

const PLANS: { key: TariffKey; badge?: string; tagline: string }[] = [
  { key: 'starter', tagline: 'Get the full $10K/mo from Google — we handle everything' },
  { key: 'growth', badge: 'spend the full $10K faster', tagline: 'Maximize your grant spend, grow organic traffic' },
  { key: 'impact', badge: 'full-service marketing', tagline: 'Turn your grant into more donations' },
]

// Cumulative service groups (from the pricing page). `plans` marks which of
// [Starter, Growth, Impact] include the group.
const GROUPS: { title: string; plans: [boolean, boolean, boolean]; items: string[] }[] = [
  {
    title: 'Ad Grant management',
    plans: [true, true, true],
    items: [
      'Google for Nonprofits registration',
      'Google Ad Grant application & approval',
      'Conversion tracking setup',
      'Performance Max campaign setup',
      'Ongoing high-intent keyword research',
      'Campaign creation, testing & launch',
      'Optimization to the full $10K/mo',
      'Grant compliance monitoring',
      'Monthly performance reporting',
    ],
  },
  {
    title: 'SEO, analytics & support',
    plans: [false, true, true],
    items: [
      'SEO to lower your cost per click',
      'SEO to grow organic traffic',
      'Full web analytics setup',
      'GA4, GTM, GSC & Looker reports',
      'Heatmaps & visitor recordings',
      'Personal project manager',
      'Monthly strategy call',
    ],
  },
  {
    title: 'Full-service marketing',
    plans: [false, false, true],
    items: [
      'Local SEO & Google Business Profile',
      'AEO — Answer Engine Optimization',
      'CRO — conversion rate optimization',
      'Blog research, writing & publishing',
      'Social media content & posting',
      'Email marketing + donor sequences',
      'Extra 2 hrs/mo of SEO work',
    ],
  },
]

const VALUE_ROWS: { label: string; values: [string, string, string] }[] = [
  { label: 'Website support discount', values: ['—', '50% off', '70% off'] },
  { label: 'Free website build', values: ['✓', '✓', '✓'] },
]

function Check({ on }: { on: boolean }) {
  if (!on) return <span style={{ color: 'var(--cream-600)', fontSize: 15 }}>—</span>
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: 999,
        background: 'var(--lime-300)',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3F5028" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  )
}

const th: React.CSSProperties = { padding: '8px 16px', textAlign: 'center', verticalAlign: 'bottom' }
const cellLabel: React.CSSProperties = {
  padding: '11px 16px',
  fontSize: 14,
  color: 'var(--ink-700)',
  textAlign: 'left',
  position: 'sticky',
  left: 0,
  background: 'inherit',
}
const cellMark: React.CSSProperties = { padding: '11px 16px', textAlign: 'center' }

export function ServicesSection({ payment }: { payment: Payment }) {
  const [open, setOpen] = useState(false)

  return (
    <section style={{ marginTop: 48 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: '#FFFFFF',
          border: 'none',
          borderRadius: open ? '20px 20px 0 0' : 20,
          boxShadow: 'inset 0 0 0 1px var(--cream-400)',
          padding: '22px 28px',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>
            Services &amp; what&rsquo;s included
          </span>
          <span style={{ fontSize: 14, fontWeight: 300, color: 'var(--ink-400)' }}>
            See everything in each plan, side by side
          </span>
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flex: '0 0 auto', transition: 'transform .2s ease', transform: `rotate(${open ? 180 : 0}deg)` }}>
          <path d="M6 9l6 6 6-6" stroke="#3F5028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '0 0 20px 20px',
            boxShadow: 'inset 0 0 0 1px var(--cream-400)',
            borderTop: 'none',
            overflowX: 'auto',
          }}
        >
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: 'left', minWidth: 240 }} />
                {PLANS.map((pl) => {
                  const t = TARIFFS[pl.key]
                  return (
                    <th key={pl.key} style={{ ...th, minWidth: 150 }}>
                      {pl.badge && (
                        <div
                          style={{
                            display: 'inline-block',
                            background: 'var(--lime-100)',
                            color: 'var(--lime-700)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            letterSpacing: '0.03em',
                            textTransform: 'uppercase',
                            padding: '4px 9px',
                            borderRadius: 999,
                            marginBottom: 8,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {pl.badge}
                        </div>
                      )}
                      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink-900)' }}>{t.name}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--lime-700)', marginTop: 2 }}>
                        {cf(feeFor(pl.key, payment))}
                        <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--ink-400)' }}>/mo</span>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--ink-400)', marginTop: 4, whiteSpace: 'normal' }}>
                        {payment === 'annual' ? 'billed annually' : 'billed monthly'}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((g) => (
                <Fragment key={g.title}>
                  <tr style={{ background: 'var(--cream-100)' }}>
                    <td
                      colSpan={4}
                      style={{
                        padding: '10px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: 'var(--lime-700)',
                        borderTop: '1px solid var(--cream-400)',
                        borderBottom: '1px solid var(--cream-400)',
                      }}
                    >
                      {g.title}
                    </td>
                  </tr>
                  {g.items.map((item, i) => (
                    <tr key={g.title + i} style={{ background: i % 2 ? '#FBFAF7' : '#FFFFFF' }}>
                      <td style={cellLabel}>{item}</td>
                      {g.plans.map((on, ci) => (
                        <td key={ci} style={cellMark}>
                          <Check on={on} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
              {VALUE_ROWS.map((r, i) => (
                <tr key={r.label} style={{ background: i % 2 ? '#FBFAF7' : '#FFFFFF' }}>
                  <td style={{ ...cellLabel, fontWeight: 600, color: 'var(--ink-900)' }}>{r.label}</td>
                  {r.values.map((v, ci) => (
                    <td key={ci} style={{ ...cellMark, fontSize: 14, fontWeight: 600, color: v === '—' ? 'var(--cream-600)' : 'var(--lime-700)' }}>
                      {v === '✓' ? <Check on /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
