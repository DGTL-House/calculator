import { useState, type ReactNode } from 'react'

/**
 * Wraps a label with a dotted underline; on hover reveals a light tooltip
 * (white card, dark text, rounded, upward arrow) styled to match the source.
 * `align` picks which edge the card anchors to so it never spills out of a
 * scroll container (use 'right' for columns near the right edge).
 */
export function Tip({ children, text, align = 'left' }: { children: ReactNode; text: string; align?: 'left' | 'right' }) {
  const [show, setShow] = useState(false)
  const cardPos: React.CSSProperties = align === 'right' ? { right: 0 } : { left: 0 }
  const arrowPos: React.CSSProperties = align === 'right' ? { right: 22 } : { left: 22 }
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'help',
        borderBottom: '1px dotted var(--ink-300)',
        paddingBottom: 1,
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            zIndex: 60,
            width: 232,
            background: '#FFFFFF',
            color: 'var(--ink-900)',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.4,
            letterSpacing: 0,
            textTransform: 'none',
            padding: '12px 15px',
            borderRadius: 14,
            boxShadow: '0 14px 34px rgba(22,21,20,0.16)',
            border: '1px solid var(--cream-400)',
            textAlign: 'left',
            whiteSpace: 'normal',
            pointerEvents: 'none',
            ...cardPos,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: -6,
              width: 11,
              height: 11,
              background: '#FFFFFF',
              borderLeft: '1px solid var(--cream-400)',
              borderTop: '1px solid var(--cream-400)',
              transform: 'rotate(45deg)',
              ...arrowPos,
            }}
          />
          {text}
        </span>
      )}
    </span>
  )
}
