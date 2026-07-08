import { useId, useState, type ReactNode } from 'react'
import { cf, short } from '../model/format'

interface LineChartProps {
  values: number[]
  stroke: string
  fillHi: string
  fillLo: string
}

const W = 560
const H = 250
const PAD_L = 56
const PAD_R = 16
const PAD_T = 16
const PAD_B = 30

export function LineChart({ values, stroke, fillHi, fillLo }: LineChartProps) {
  const gradientId = useId()
  const [hover, setHover] = useState<number | null>(null)

  const plotW = W - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B
  const baseY = PAD_T + plotH

  const maxV = Math.max(...values)
  const pow = Math.pow(10, Math.floor(Math.log10(maxV)))
  const step = maxV / pow > 5 ? pow * 2 : maxV / pow > 2 ? pow : pow / 2
  const yMax = Math.ceil(maxV / step) * step || 1

  const px = (i: number) => PAD_L + (i / (values.length - 1)) * plotW
  const py = (v: number) => PAD_T + (1 - v / yMax) * plotH

  const els: ReactNode[] = []
  const gridN = 4
  for (let g = 0; g <= gridN; g++) {
    const v = (yMax * g) / gridN
    const y = py(v)
    els.push(<line key={`g${g}`} x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#EBE9E0" strokeWidth={1} />)
    els.push(
      <text key={`yl${g}`} x={PAD_L - 8} y={y + 4} textAnchor="end" fontSize={11} fill="#7A7770" fontFamily="Lexend, sans-serif">
        {short(v)}
      </text>,
    )
  }
  for (const m of [1, 6, 12, 18, 24]) {
    els.push(
      <text key={`xl${m}`} x={px(m - 1)} y={H - 8} textAnchor="middle" fontSize={11} fill="#7A7770" fontFamily="Lexend, sans-serif">
        {m}
      </text>,
    )
  }

  let line = `M${px(0)},${py(values[0])}`
  for (let i = 1; i < values.length; i++) line += ` L${px(i)},${py(values[i])}`
  const area = `${line} L${px(values.length - 1)},${baseY} L${px(0)},${baseY} Z`

  els.push(
    <defs key="d">
      <linearGradient id={gradientId} x1={0} y1={0} x2={0} y2={1}>
        <stop offset="0%" stopColor={fillHi} stopOpacity={0.5} />
        <stop offset="100%" stopColor={fillLo} stopOpacity={0.04} />
      </linearGradient>
    </defs>,
  )
  els.push(<path key="area" d={area} fill={`url(#${gradientId})`} stroke="none" />)
  els.push(
    <path key="line" d={line} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />,
  )
  els.push(<circle key="end" cx={px(values.length - 1)} cy={py(values[values.length - 1])} r={4} fill={stroke} />)

  const stepX = plotW / (values.length - 1)
  for (let i = 0; i < values.length; i++) {
    els.push(
      <rect
        key={`ht${i}`}
        x={px(i) - stepX / 2}
        y={PAD_T}
        width={stepX}
        height={plotH}
        fill="transparent"
        style={{ cursor: 'crosshair' }}
        onMouseEnter={() => setHover(i)}
      />,
    )
  }

  if (hover != null) {
    const i = hover
    const x = px(i)
    const y = py(values[i])
    els.push(<line key="gd" x1={x} y1={PAD_T} x2={x} y2={baseY} stroke="#CFCFCF" strokeWidth={1} strokeDasharray="3 3" />)
    els.push(<circle key="hr" cx={x} cy={y} r={6} fill="#FFFFFF" stroke={stroke} strokeWidth={2.5} />)
    const tw = 140
    const th = 48
    let tx = x - tw / 2
    tx = Math.max(PAD_L, Math.min(tx, W - PAD_R - tw))
    let ty = y - th - 12
    if (ty < PAD_T) ty = y + 14
    els.push(
      <g key="tt">
        <rect x={tx} y={ty} width={tw} height={th} rx={10} fill="#161514" />
        <text x={tx + 14} y={ty + 19} fontSize={11} fill="rgba(255,255,255,0.65)" fontFamily="Chivo Mono, monospace">
          MONTH {i + 1}
        </text>
        <text x={tx + 14} y={ty + 37} fontSize={16} fontWeight={700} fill="#FFFFFF" fontFamily="Lexend, sans-serif">
          {cf(values[i])}
        </text>
      </g>,
    )
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      onMouseLeave={() => setHover(null)}
    >
      {els}
    </svg>
  )
}
