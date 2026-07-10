/** 1234567 → "1,234,567" */
export function nf(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

/** 1234 → "$1,234" */
export function cf(n: number): string {
  return '$' + nf(n)
}

/** 30687.21 → "$30,687.21" — always 2 decimals, matching the reference sheet. */
export function cc(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** 1_250_000 → "$1.3M", 42_000 → "$42k" */
export function short(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'k'
  return '$' + Math.round(n)
}
