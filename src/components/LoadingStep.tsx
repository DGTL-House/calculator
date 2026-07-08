interface LoadingStepProps {
  nicheName: string
  /** 0..3 — index of the message currently in progress */
  loadIdx: number
}

export function LoadingStep({ nicheName, loadIdx }: LoadingStepProps) {
  const messages = [
    `Finding current benchmarks for ${nicheName}…`,
    'Calculating your Year 1 projection…',
    'Calculating your Year 2 projection…',
    'Comparing results across partnership plans…',
  ]
  const pct = ((loadIdx + 1) / 4) * 100

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64 }}>
          <svg width="52" height="52" viewBox="0 0 50 50" style={{ animation: 'rp-spin 0.9s linear infinite' }}>
            <circle cx="25" cy="25" r="21" fill="none" stroke="#EBE9E0" strokeWidth="6" />
            <path d="M25 4a21 21 0 0 1 21 21" fill="none" stroke="#AAC976" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </span>
        <p
          className="mono-label"
          style={{ margin: '22px 0 4px', letterSpacing: '0.06em' }}
        >
          Building your projection
        </p>
        <div
          style={{
            width: '100%',
            height: 8,
            background: 'var(--cream-400)',
            borderRadius: 999,
            overflow: 'hidden',
            margin: '16px 0 26px',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'var(--lime-300)',
              borderRadius: 999,
              width: `${pct}%`,
              transition: 'width .5s ease',
            }}
          />
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((text, i) => {
            if (i > loadIdx) return null
            const done = i < loadIdx
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, animation: 'rp-fade .35s ease' }}>
                <span
                  style={{
                    flex: '0 0 auto',
                    width: 20,
                    height: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: done ? 'var(--lime-700)' : 'var(--lime-400)',
                    fontSize: done ? 15 : 11,
                    animation: done ? undefined : 'rp-pulse 1s ease-in-out infinite',
                  }}
                >
                  {done ? '✓' : '●'}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: done ? 400 : 500,
                    color: done ? 'var(--ink-400)' : 'var(--ink-900)',
                    textAlign: 'left',
                  }}
                >
                  {text}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
