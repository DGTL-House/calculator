import { useState, type CSSProperties } from 'react'
import { cf, money2, nf, pf } from '../model/format'
import { aggregate } from '../model/projection'
import type { Metrics, MonthRow } from '../model/types'

type ColFmt = 'cf' | 'nf' | 'money2' | 'ctr' | 'cr'

interface Col {
  k: keyof Metrics
  h: string
  group: 'main' | 'conv'
  f: ColFmt
  alignLeft?: boolean
  first?: boolean
  divider?: boolean
}

const COLS: (Col | { k: 'month'; h: string; group: 'main'; alignLeft: true; first: true })[] = [
  { k: 'month', h: 'Month', group: 'main', alignLeft: true, first: true },
  { k: 'spend', h: 'Spend ($)', group: 'main', f: 'cf' },
  { k: 'impressions', h: 'Impressions', group: 'main', f: 'nf' },
  { k: 'ctr', h: 'CTR %', group: 'main', f: 'ctr' },
  { k: 'cpc', h: 'CPC', group: 'main', f: 'money2' },
  { k: 'clicks', h: 'Clicks', group: 'main', f: 'nf' },
  { k: 'conv', h: 'Total conv.', group: 'conv', f: 'nf', divider: true },
  { k: 'cr', h: 'CR %', group: 'conv', f: 'cr' },
  { k: 'cpa', h: 'CPA', group: 'conv', f: 'money2' },
  { k: 'donQty', h: 'Donations', group: 'conv', f: 'nf' },
  { k: 'volunteers', h: 'Volunteers', group: 'conv', f: 'nf' },
  { k: 'registrations', h: 'Registrations', group: 'conv', f: 'nf' },
  { k: 'contactLeads', h: 'Contact Leads', group: 'conv', f: 'nf' },
  { k: 'newsletter', h: 'Newsletter', group: 'conv', f: 'nf' },
  { k: 'phoneCalls', h: 'Phone Calls', group: 'conv', f: 'nf' },
  { k: 'other', h: 'Other', group: 'conv', f: 'nf' },
]

function fmtCell(col: (typeof COLS)[number], data: Metrics): string {
  if (!('f' in col)) return ''
  const v = data[col.k]
  switch (col.f) {
    case 'cf':
      return cf(v)
    case 'nf':
      return nf(v)
    case 'money2':
      return money2(v)
    case 'ctr':
      return pf(v * 100, 2)
    case 'cr':
      return pf(v * 100, 1)
  }
}

interface TableRow {
  data: Metrics
  label: string
  summary: boolean
  idx: number
}

function buildRows(monthly: MonthRow[]): TableRow[] {
  const rows: TableRow[] = []
  const push = (data: Metrics, label: string, summary: boolean) =>
    rows.push({ data, label, summary, idx: rows.length })
  for (let i = 0; i < 12; i++) push(monthly[i], String(i + 1), false)
  push(aggregate(monthly, 0, 12), 'First Year Total', true)
  for (let i = 12; i < 24; i++) push(monthly[i], String(i + 1), false)
  push(aggregate(monthly, 12, 24), 'Second Year Total', true)
  push(aggregate(monthly, 0, 24), 'Total (2 Years)', true)
  return rows
}

const groupHeadBase: CSSProperties = {
  padding: '13px 16px',
  textAlign: 'left',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  borderBottom: '1px solid #DBDBD8',
}

export function BreakdownTable({ monthly }: { monthly: MonthRow[] }) {
  const [hlRows, setHlRows] = useState<Set<number>>(new Set())
  const [hlCols, setHlCols] = useState<Set<number>>(new Set())
  const [hlCells, setHlCells] = useState<Set<string>>(new Set())

  const toggle = <T,>(set: Set<T>, setSet: (s: Set<T>) => void, key: T) => {
    const next = new Set(set)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setSet(next)
  }
  const isHi = (r: number, c: number) => hlRows.has(r) || hlCols.has(c) || hlCells.has(`${r}-${c}`)

  const rows = buildRows(monthly)

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 1480 }}>
      <thead>
        <tr>
          <th colSpan={6} style={{ ...groupHeadBase, color: '#3F5028', background: '#EAF6CC' }}>
            Main indicators
          </th>
          <th
            colSpan={10}
            style={{ ...groupHeadBase, color: '#52504C', background: '#F5F4F0', borderLeft: '1px solid #DBDBD8' }}
          >
            Conversions (meaningful results)
          </th>
        </tr>
        <tr>
          {COLS.map((col, c) => (
            <th
              key={col.k}
              title="Highlight column"
              onClick={() => toggle(hlCols, setHlCols, c)}
              style={{
                padding: '12px 16px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--ink-500)',
                whiteSpace: 'nowrap',
                borderBottom: '1px solid #DBDBD8',
                cursor: 'pointer',
                background: hlCols.has(c) ? '#D8F1A5' : 'var(--cream-100)',
                textAlign: 'alignLeft' in col && col.alignLeft ? 'left' : 'right',
                ...('first' in col && col.first ? { position: 'sticky', left: 0, zIndex: 2 } : null),
                ...('divider' in col && col.divider ? { borderLeft: '1px solid #DBDBD8' } : null),
              }}
            >
              {col.h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const stripe = row.idx % 2 === 1
          const baseBg = row.summary ? 'rgba(196,237,130,0.16)' : stripe ? '#F8F7F3' : '#FFFFFF'
          return (
            <tr key={row.idx}>
              {COLS.map((col, c) => {
                const first = 'first' in col && col.first
                const hi = isHi(row.idx, c)
                const value = first ? row.label : fmtCell(col, row.data)
                let bg = baseBg
                if (first) bg = row.summary ? '#F3F8E6' : stripe ? '#F8F7F3' : '#FFFFFF'
                if (hi) bg = first ? '#D8F1A5' : 'rgba(196,237,130,0.55)'
                return (
                  <td
                    key={col.k}
                    onClick={() =>
                      first ? toggle(hlRows, setHlRows, row.idx) : toggle(hlCells, setHlCells, `${row.idx}-${c}`)
                    }
                    style={{
                      padding: '13px 16px',
                      fontSize: 14,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      textAlign: 'alignLeft' in col && col.alignLeft ? 'left' : 'right',
                      fontWeight: row.summary ? 700 : first ? 600 : 400,
                      color: row.summary || first ? 'var(--ink-900)' : 'var(--ink-500)',
                      background: bg,
                      ...('divider' in col && col.divider ? { borderLeft: '1px solid #DBDBD8' } : null),
                      ...(first ? { position: 'sticky', left: 0, zIndex: 1 } : null),
                      ...(row.summary
                        ? {
                            borderTop: '1px solid rgba(63,80,40,0.18)',
                            borderBottom: '1px solid rgba(63,80,40,0.18)',
                          }
                        : null),
                    }}
                  >
                    {value}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
