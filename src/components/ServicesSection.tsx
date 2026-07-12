import { Fragment, useState } from 'react'
import { TARIFFS } from '../model/data'
import { cf } from '../model/format'
import { feeFor } from '../model/projection'
import type { Payment, TariffKey } from '../model/types'
import { Tip } from './InfoTip'

// Plain-language explanation shown on hover for each service row, keyed by the
// row label. Rows without an entry render no tooltip.
const SERVICE_TIPS: Record<string, string> = {
  'Google for Nonprofits registration':
    "We get your organization verified and approved for Google's nonprofit programs.",
  'Google Ad Grant application & approval':
    'We apply for your free $10K/month Google ad budget and get it approved.',
  'Conversion tracking setup':
    'We set up tracking so you can see which ads actually lead to donations or sign-ups.',
  'Performance Max campaign setup':
    "We build Google's all-in-one ad campaigns that show your nonprofit across Search, Maps, and more.",
  'Ongoing high-intent keyword research':
    'We keep finding the exact search terms your future donors and supporters are typing in.',
  'Campaign creation, testing & launch':
    'We continuously build, test, and launch new ads to improve results.',
  'Optimization to the full $10K/mo':
    'We fine-tune your campaigns so you use your entire free budget, not just part of it.',
  'Grant compliance monitoring':
    "We keep an eye on Google's rules so your free account never gets suspended.",
  'Monthly performance reporting':
    "A simple monthly summary showing what's working and what we're improving.",
  'SEO to grow organic traffic':
    "We improve your website's content and pages so more people find you on Google for free.",
  'Full web analytics setup':
    'We connect the tools that track your website traffic and turn the data into easy reports.',
  'GA4, GTM, GSC & Looker reports':
    'We connect the tools that track your website traffic and turn the data into easy reports.',
  'Heatmaps & visitor recordings': 'Tools that show how people move around and click on your website.',
  'Personal project manager': 'A dedicated person you can reach anytime with questions or requests.',
  'Local SEO & Google Business Profile':
    'We help your nonprofit show up in local Google searches and Google Maps.',
  'AEO — Answer Engine Optimization':
    'We optimize your content so AI tools like ChatGPT and Google AI recommend your organization.',
  'CRO — conversion rate optimization':
    'We improve your website so more visitors actually donate or take action.',
  'Blog research, writing & publishing':
    'We research, write, and publish blog articles that attract supporters and improve your SEO.',
  'Social media content & posting': 'We create and post content on your social media accounts.',
  'Email marketing + donor sequences':
    'We send email campaigns and set up automatic emails to keep donors engaged.',
  'Website support discount': 'Help with fixes, updates, and small changes to your website.',
}

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
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          background: '#FFFFFF',
          border: 'none',
          borderRadius: open ? '20px 20px 0 0' : 20,
          boxShadow: 'inset 0 0 0 1px var(--cream-400)',
          padding: '22px 28px',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>
            Services &amp; what&rsquo;s included
          </span>
          <span style={{ fontSize: 14, fontWeight: 300, color: 'var(--ink-400)' }}>
            See everything in each plan, side by side
          </span>
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', right: 28, flex: '0 0 auto', transition: 'transform .2s ease', transform: `rotate(${open ? 180 : 0}deg)` }}>
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
          }}
        >
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: 'left', width: '34%' }} />
                {PLANS.map((pl) => {
                  const t = TARIFFS[pl.key]
                  return (
                    <th key={pl.key} style={th}>
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
                      <td style={cellLabel}>
                        {SERVICE_TIPS[item] ? <Tip text={SERVICE_TIPS[item]}>{item}</Tip> : item}
                      </td>
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
                  <td style={{ ...cellLabel, fontWeight: 600, color: 'var(--ink-900)' }}>
                    {SERVICE_TIPS[r.label] ? <Tip text={SERVICE_TIPS[r.label]}>{r.label}</Tip> : r.label}
                  </td>
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
