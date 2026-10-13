import { useState } from 'react'
import { NICHES } from '../model/data'
import { Eyebrow } from './Eyebrow'

const TRUST_ITEMS = [
  { stat: '200+', label: 'NONPROFITS', sub: 'across the US', iconPath: 'M20 7l-9 9-4-4' },
  { stat: '10+', label: 'YEARS', sub: 'of grant management', iconPath: 'M12 7v5l3 3' },
  {
    stat: '',
    label: 'GOOGLE PARTNER',
    sub: 'official data access',
    iconPath: 'M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6L12 16.9 6.6 19.4 7.9 13.4 3.3 9.3l6.1-.6z',
  },
]

interface NicheStepProps {
  niche: number | null
  onSelectNiche: (index: number) => void
  onContinue: () => void
}

export function NicheStep({ niche, onSelectNiche, onContinue }: NicheStepProps) {
  const [open, setOpen] = useState(false)
  const hasNiche = niche != null
  const selected = hasNiche ? NICHES[niche] : null

  return (
    <section
      style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: '88px 40px 120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Eyebrow>Results projection</Eyebrow>
      <h1
        style={{
          margin: '18px 0 0',
          maxWidth: 920,
          fontWeight: 500,
          fontSize: 'clamp(34px, 5vw, 56px)',
          lineHeight: 1.04,
          letterSpacing: '-0.02em',
        }}
      >
        See the results your nonprofit can achieve with dgtl-house + Google Ad Grants
      </h1>
      <p style={{ margin: '18px 0 0', maxWidth: 720, fontSize: 18, fontWeight: 300, color: 'var(--ink-500)' }}>
        We estimate your ad spend, impressions, website visitors, and management fee &mdash; month by month.
      </p>

      {/* trust block */}
      <div className="card" style={{ marginTop: 36, maxWidth: 820, padding: '26px 20px' }}>
        <p style={{ margin: '0 0 22px', fontSize: 16, lineHeight: 1.55, fontWeight: 300, color: 'var(--ink-500)' }}>
          Projections are based on our historical performance data from{' '}
          <strong style={{ fontWeight: 600, color: 'var(--ink-900)' }}>200+ US nonprofits</strong> over 10+ years of
          managing Google Ad Grants, combined with CTR, CPC, and conversion-rate benchmarks shared directly by Google
          as our official partner. Each niche has its own calibrated baseline because search intent, cost per click,
          and audience behavior vary significantly across causes.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 16 }}>
          {TRUST_ITEMS.map((t, i) => (
            <div
              key={t.label}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                justifyContent: 'center',
                padding: '0 20px',
                borderLeft: i > 0 ? '1px solid var(--cream-400)' : undefined,
              }}
            >
              <span
                style={{
                  flex: '0 0 auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: 'var(--lime-300)',
                }}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3F5028"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={t.iconPath} />
                </svg>
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: 2 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.02em', color: 'var(--ink-900)' }}>
                  <strong style={{ fontWeight: 600 }}>{t.stat}</strong> {t.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 300, color: 'var(--ink-400)' }}>{t.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mono-label" style={{ margin: '44px 0 0' }}>
        Start by selecting your focus area
      </p>

      {/* niche dropdown */}
      <div style={{ width: '100%', maxWidth: 640, margin: '14px auto 0', position: 'relative' }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            width: '100%',
            padding: '16px 22px',
            background: '#FFFFFF',
            borderRadius: 16,
            border: 'none',
            boxShadow: `inset 0 0 0 1px ${open ? '#3F5028' : '#CFCFCF'}`,
            cursor: 'pointer',
            transition: 'box-shadow .16s ease',
          }}
        >
          <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: 2, minWidth: 0 }}>
            <span
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: selected ? 'var(--ink-900)' : 'var(--ink-400)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {selected ? selected.title : "Select your nonprofit's focus area"}
            </span>
            {selected && (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  color: 'var(--ink-400)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {selected.desc}
              </span>
            )}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{ flex: '0 0 auto', transition: 'transform .18s ease', transform: `rotate(${open ? 180 : 0}deg)` }}
          >
            <path d="M6 9l6 6 6-6" stroke="#161514" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                zIndex: 50,
                background: '#FFFFFF',
                borderRadius: 16,
                boxShadow: 'inset 0 0 0 1px var(--cream-400), 0 20px 48px rgba(22,21,20,0.16)',
                maxHeight: 360,
                overflowY: 'auto',
                padding: 6,
                textAlign: 'left',
              }}
            >
              {NICHES.map((n, i) => {
                const sel = niche === i
                return (
                  <button
                    key={n.title}
                    onClick={() => {
                      onSelectNiche(i)
                      setOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 14px',
                      border: 'none',
                      borderRadius: 11,
                      cursor: 'pointer',
                      background: sel ? 'var(--lime-300)' : 'transparent',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        color: sel ? 'var(--lime-700)' : 'var(--ink-900)',
                      }}
                    >
                      {n.title}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 300,
                        lineHeight: 1.4,
                        color: sel ? 'rgba(63,80,40,0.8)' : 'var(--ink-400)',
                      }}
                    >
                      {n.desc}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      <button className="btn-cta" onClick={onContinue} disabled={!hasNiche} style={{ marginTop: 22 }}>
        <span>See my projection</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  )
}
