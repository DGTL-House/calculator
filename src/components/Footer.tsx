export function Footer() {
  return (
    <footer style={{ background: 'var(--cream-400)', borderTop: '1px solid var(--cream-500)', padding: '56px 24px' }}>
      <div
        style={{
          maxWidth: 1152,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24,
        }}
      >
        <img
          src="/nonprofit-logo.svg"
          alt="DGTL House — Google Ad Grants for Nonprofits"
          width={140}
          height={28}
          loading="lazy"
          decoding="async"
          style={{ height: 28, width: 'auto' }}
        />
        <span style={{ fontSize: 15, color: 'var(--ink-400)' }}>
          nonprofit@dgtl-house.com &middot; +1 (224) 584 8401
        </span>
      </div>
      <div
        style={{
          maxWidth: 1152,
          margin: '32px auto 0',
          paddingTop: 24,
          borderTop: '1px solid var(--cream-500)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 14, color: 'var(--ink-300)' }}>
          © {new Date().getFullYear()} DGTL House. All rights reserved.
        </span>
        <span style={{ fontSize: 14, color: 'var(--ink-300)' }}>
          Google for Nonprofits Partner <span style={{ color: 'var(--cream-600)' }}>·</span> Not affiliated with Google
          LLC
        </span>
      </div>
    </footer>
  )
}
