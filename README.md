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
    types.ts        # shared domain types (Tariff, Niche, NicheCoef, Metrics, MonthRow, …)
    data.ts         # niches (21) + coefficients, 3 packages, static base tables, accents
    projection.ts   # base table × niche coefficient, spend cap, aggregation, fees
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

The numbers come from the client's reference spreadsheet, not a generative formula.

- **Packages** are three monthly service-fee tiers — $250 / $500 / $1000 (annual billing
  $200 / $350 / $650). The fee is what the nonprofit pays dgtl-house; ad spend is always
  the Google grant (capped at $10,000/mo). A higher fee buys a faster ramp-up and better
  conversion, encoded in each package's static 24-month base table (`BASE_TABLES` in
  `data.ts`, ported verbatim from the sheet's "Пакеты" tabs for the reference niche).
- **Reference niche** = Education & Scholarships (all coefficients 1.00, avg check $150).
  Selecting another niche multiplies each column of the base table by that niche's
  coefficient and uses its average donation check for donation $.
- **Spend is special.** The $10,000/mo cap cells (gray/static in the sheet) are FIXED —
  the niche coefficient does NOT apply, they stay at $10,000 for every niche. The ramp-up
  cells (below the cap) DO get the spend coefficient, clamped at $10,000 — so a high-spend
  niche reaches the cap sooner, a low-spend niche ramps slower but still caps at $10,000.
- **Donation precision**: the sheet's donation income comes from a *fractional* 2-year
  donation count ($30,687.21 = 204.5814 × $150, etc.), so `DONATIONS_2Y` holds those
  exact totals and the monthly integers are scaled to sum to them. Calculations carry the
  fractions (income / net gain / ROI match the sheet to the cent); the table rounds
  donations to whole numbers for display.
- **Screen 1**: Projected donations = donation count (2 yrs) × avg check; ROI = that ÷
  service fee (fee × 24); Net gain = donations $ − service fee.
- **Screen 2** (comparison): per period (Y1 / Y2 / Total) — donations $ = count × check;
  Net donation gain = donations $ − fee × months; Annual savings = (monthly − annual fee)
  × months.
- **Breakdown table columns**: Month, Spend, Impressions, Clicks, Total conv., Donations,
  Volunteers, Registrations, Contact Leads, Newsletter, Phone Calls, Other. Spend cells at
  the $10,000 cap are shaded light gray.
- **Comparison cards** (`ComparisonSection`): Impressions / Traffic / Conversions are one
  size; Conversions toggles the per-type breakdown (Donations, Volunteers, …); Net donation
  gain sits on a highlighted strip; metric labels carry hover tooltips (`TIPS`).
- **Net-gain badge**: on Screen 1, Growth / Impact show a rounded `+XX% vs. Starter plan`
  badge (uplift of the selected plan's net gain over Starter's, same niche + billing),
  recoloured with the monthly / annual accent.
- **Services & what's included** (`ServicesSection`): a collapsible feature matrix across
  the three plans (from the pricing page), with plan badges and prices.
- Annual billing switches the accent to the dark-olive scheme and adds the savings row.

## Branding

Colors, favicon (`public/icon.png`), logo and the self-hosted Lexend font are ported
from the `nonprofit-next` project (`src/styles/global.css` design tokens): white page,
cream surfaces (#f8f7f3…#ebe9e0), ink text (#161514/#52504c/#7a7770), lime-olive accent
(#c4ed82 / #aac976 / #3f5028), CTA #b5e550. The brand has no blue — blue accents from
the original prototype are re-mapped to olive, matching nonprofit-next conventions.
