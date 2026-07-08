import type { Accent } from '../model/types'

interface PillGroupProps<T extends string> {
  items: { label: string; value: T }[]
  current: T
  onPick: (value: T) => void
  accent: Accent
}

export function PillGroup<T extends string>({ items, current, onPick, accent }: PillGroupProps<T>) {
  return (
    <div className="pill-group">
      {items.map((it) => (
        <button
          key={it.value}
          className="pill"
          style={it.value === current ? { background: accent.pill, color: accent.pillInk } : undefined}
          onClick={() => onPick(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}
