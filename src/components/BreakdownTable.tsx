import { useEffect, useRef, useState } from "react";
import { GRANT_CAP } from "../model/data";
import { cc, cf, nf } from "../model/format";
import { aggregate } from "../model/projection";
import type { Metrics, MonthRow } from "../model/types";
import { Tip } from "./InfoTip";

// Column interpretations shown on hover, in plain second-person language.
const TIPS: Record<string, string> = {
  spend: "How much of your free Google Ad Grant budget was used that month.",
  impressions: "How many times your ads were shown to people searching online.",
  ctr: "The share of people who saw your ad and clicked on it.",
  cpc: "The average cost per click (covered by Google, not your budget).",
  clicks: "People who clicked your ad and visited your website.",
};

interface Col {
  k: string;
  h: string;
  /** hero metrics get an accent header and heavier weight */
  hero?: boolean;
  fmt?: (d: Metrics) => string;
  first?: boolean;
}

// Month | Spend | Impressions | CTR % | CPC | Relevant visitors
// CTR and CPC are derived from the aggregated row, so totals stay consistent.
const COLS: Col[] = [
  { k: "month", h: "Month", first: true },
  { k: "spend", h: "Spend ($)", fmt: (d) => cf(d.spend) },
  { k: "impressions", h: "Impressions", hero: true, fmt: (d) => nf(d.impressions) },
  {
    k: "ctr",
    h: "CTR %",
    fmt: (d) => (d.impressions ? ((d.clicks / d.impressions) * 100).toFixed(2) + "%" : "—"),
  },
  { k: "cpc", h: "CPC", fmt: (d) => (d.clicks ? cc(d.spend / d.clicks) : "—") },
  { k: "clicks", h: "Relevant visitors", hero: true, fmt: (d) => nf(d.clicks) },
];

const HERO_HEAD = "#E3F5B8";
const HERO_CELL = "rgba(196,237,130,0.12)";

interface TableRow {
  data: Metrics;
  label: string;
  summary: boolean;
  idx: number;
}

function buildRows(monthly: MonthRow[]): TableRow[] {
  const rows: TableRow[] = [];
  const push = (data: Metrics, label: string, summary: boolean) =>
    rows.push({ data, label, summary, idx: rows.length });
  for (let i = 0; i < 12; i++) push(monthly[i], String(i + 1), false);
  push(aggregate(monthly, 0, 12), "Year 1", true);
  for (let i = 12; i < 24; i++) push(monthly[i], String(i + 1), false);
  push(aggregate(monthly, 12, 24), "Year 2", true);
  push(aggregate(monthly, 0, 24), "Total", true);
  return rows;
}

export function BreakdownTable({ monthly }: { monthly: MonthRow[] }) {
  const [hlRows, setHlRows] = useState<Set<number>>(new Set());
  const [hlCols, setHlCols] = useState<Set<number>>(new Set());
  const [hlCells, setHlCells] = useState<Set<string>>(new Set());
  const tableRef = useRef<HTMLTableElement>(null);

  // Clear all highlights when clicking anywhere outside the table.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
        setHlRows(new Set());
        setHlCols(new Set());
        setHlCells(new Set());
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const toggle = <T,>(set: Set<T>, setSet: (s: Set<T>) => void, key: T) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSet(next);
  };
  const isHi = (r: number, c: number) =>
    hlRows.has(r) || hlCols.has(c) || hlCells.has(`${r}-${c}`);

  const rows = buildRows(monthly);

  return (
    <table
      ref={tableRef}
      style={{
        borderCollapse: "collapse",
        width: "100%",
        tableLayout: "fixed",
      }}
    >
      {/* Fixed column widths — Month pinned narrow, the rest share the rest. */}
      <colgroup>
        {COLS.map((col) => (
          <col
            key={col.k}
            style={col.k === "month" ? { width: 64 } : undefined}
          />
        ))}
      </colgroup>
      <thead>
        <tr>
          {COLS.map((col, c) => {
            const isMonth = col.k === "month";
            const tip = TIPS[col.k];
            return (
              <th
                key={col.k}
                title="Highlight column"
                onClick={() => toggle(hlCols, setHlCols, c)}
                style={{
                  padding: isMonth ? "16px 8px" : "16px 10px",
                  fontSize: col.hero ? 12 : 11,
                  fontWeight: col.hero ? 700 : 600,
                  color: "var(--ink-500)",
                  lineHeight: 1.2,
                  borderBottom: "1px solid #DBDBD8",
                  cursor: "pointer",
                  background: hlCols.has(c)
                    ? "#D8F1A5"
                    : col.hero
                      ? HERO_HEAD
                      : "var(--cream-100)",
                  textAlign: isMonth ? "left" : "right",
                }}
              >
                {tip ? (
                  <Tip text={tip} align={c >= 4 ? "right" : "left"}>
                    {col.h}
                  </Tip>
                ) : (
                  col.h
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const stripe = row.idx % 2 === 1;
          const baseBg = row.summary
            ? "rgba(196,237,130,0.16)"
            : stripe
              ? "#F8F7F3"
              : "#FFFFFF";
          return (
            <tr key={row.idx}>
              {COLS.map((col, c) => {
                const first = !!col.first;
                const hi = isHi(row.idx, c);
                const value = first ? row.label : col.fmt!(row.data);
                // Grant fully utilised this month → shade the spend cell gray.
                const atCap =
                  !row.summary &&
                  col.k === "spend" &&
                  row.data.spend >= GRANT_CAP - 0.5;
                let bg = baseBg;
                if (first)
                  bg = row.summary ? "#F3F8E6" : stripe ? "#F8F7F3" : "#FFFFFF";
                if (col.hero && !first && !hi) bg = row.summary ? "rgba(196,237,130,0.28)" : stripe ? "#F4F7EA" : HERO_CELL;
                if (atCap) bg = "#DBDBD8";
                if (hi) bg = first ? "#D8F1A5" : "rgba(196,237,130,0.55)";
                return (
                  <td
                    key={col.k}
                    onClick={() =>
                      first
                        ? toggle(hlRows, setHlRows, row.idx)
                        : toggle(hlCells, setHlCells, `${row.idx}-${c}`)
                    }
                    style={{
                      padding: first ? "16px 8px" : "16px 14px",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      textAlign: first ? "left" : "right",
                      fontSize: col.hero ? 14 : 13,
                      fontWeight: row.summary ? 700 : first ? 600 : col.hero ? 600 : 400,
                      color:
                        row.summary || first
                          ? "var(--ink-900)"
                          : "var(--ink-500)",
                      background: bg,
                      ...(row.summary
                        ? {
                            borderTop: "1px solid rgba(63,80,40,0.18)",
                            borderBottom: "1px solid rgba(63,80,40,0.18)",
                          }
                        : null),
                    }}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
