# Google Ad Grants — Results Projection Calculator

React + TypeScript + Vite port of the dgtl-house "Results Projection" online calculator
(original single-file prototype: `../ResultsProjection.dc.html`).

An interactive projection tool for US nonprofits: pick a focus area (niche), get a
24-month projection of Google Ad Grants performance across three partnership plans —
donations, conversions, ROI, month-by-month breakdown, growth charts and a plan
comparison with monthly/annual billing.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

## Structure

```
src/
  model/
    types.ts        # shared domain types (Tariff, Niche, Metrics, MonthRow, …)
    data.ts         # niches (21), tariffs (3), conversion split, accent palettes
    projection.ts   # the math: logistic ramp-up, monthly rows, aggregation, fees
    format.ts       # number/currency/percent formatters
  components/
    NicheStep.tsx        # step 1 — hero, trust block, niche dropdown
    LoadingStep.tsx      # step 2 — animated progress transition
    ResultsStep.tsx      # steps 3–5 — metric cards, net-gain banner, table, charts
    BreakdownTable.tsx   # month-by-month table with click-to-highlight rows/cols/cells
    LineChart.tsx        # SVG line/area chart with hover tooltip
    ComparisonSection.tsx# step 6 — three plan cards, period & billing switches
    PillGroup.tsx, Eyebrow.tsx, Footer.tsx
  App.tsx           # step state machine (niche → loading → results)
```

## Model notes

- Ad spend ramps up along a logistic curve: ~16% of the plan's max spend in month 1
  → 100% by month 24 (inflection ≈ month 7).
- Max monthly spend = $10,000 grant cap × plan utilization (55% / 82% / 100%).
- Donation revenue = conversions × plan donation share × niche average check.
- Annual billing switches the accent to the dark-olive scheme and adds the savings row.

## Branding

Colors, favicon (`public/icon.png`), logo and the self-hosted Lexend font are ported
from the `nonprofit-next` project (`src/styles/global.css` design tokens): white page,
cream surfaces (#f8f7f3…#ebe9e0), ink text (#161514/#52504c/#7a7770), lime-olive accent
(#c4ed82 / #aac976 / #3f5028), CTA #b5e550. The brand has no blue — blue accents from
the original prototype are re-mapped to olive, matching nonprofit-next conventions.
