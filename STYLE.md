# STYLE.md — Finanzas Design System Migration

Migration target: clean fintech aesthetic (DeliFin reference). Source: current Finanzas dashboard (rough, salmon-heavy).

Stack: React 19 + Vite + Tailwind v4 (`@theme` inline in `src/index.css`) + shadcn/ui + Recharts + Lucide.

---

## 1. Design Tokens

Replace the oklch-based tokens in `src/index.css` `@theme` block with the table below. Keep oklch syntax if you want, but hex equivalents are authoritative.

### Colors

| CSS Variable | Value | Usage |
|---|---|---|
| `--color-bg-page` | `#F3F4F6` | App background (outside cards) |
| `--color-bg-surface` | `#FFFFFF` | Cards, sidebar, header |
| `--color-bg-muted` | `#F9FAFB` | Hovered rows, secondary buttons, chart fills |
| `--color-bg-subtle` | `#F1F5F9` | Pill backgrounds, dropdown bg |
| `--color-border` | `#E5E7EB` | Card borders, dividers, input borders |
| `--color-border-strong` | `#D1D5DB` | Hover borders |
| `--color-text-primary` | `#0F172A` | Numbers, headings |
| `--color-text-secondary` | `#475569` | Body text, table content |
| `--color-text-muted` | `#94A3B8` | Labels, captions, axis ticks |
| `--color-primary` | `#2563EB` | CTAs, active nav, primary line in charts |
| `--color-primary-hover` | `#1D4ED8` | CTA hover |
| `--color-primary-soft` | `#EFF6FF` | Active nav bg, badge bg |
| `--color-accent` | `#F59E0B` | Income line in cashflow, secondary chart series |
| `--color-success` | `#10B981` | Positive deltas, income amounts |
| `--color-success-soft` | `#D1FAE5` | Positive delta pill bg |
| `--color-success-text` | `#047857` | Positive delta pill text |
| `--color-danger` | `#EF4444` | Negative deltas, expense amounts |
| `--color-danger-soft` | `#FEE2E2` | Negative delta pill bg |
| `--color-danger-text` | `#B91C1C` | Negative delta pill text |

**Kill the salmon.** Current `#f87171` everywhere → only `--color-danger` for negative values. Bars, lines, KPI numbers default to `--color-text-primary` or `--color-primary`.

### Category palette (keep, but mute)

Existing palette in `src/lib/categoryColors.ts` is fine for donut. Only swap `COBRO_BANCARIO` from `#ef4444` (clashes with danger) → `#7C3AED`.

### Typography

| Token | Value |
|---|---|
| `--font-sans` | `'Inter', system-ui, -apple-system, sans-serif` |
| Base size | `14px` (Tailwind `text-sm` baseline for tables/body) |
| Numeric | Same family, `font-feature-settings: "tnum"` for tabular nums |

Add Inter via `<link>` in `index.html` or `@import` at top of `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

Scale:

| Use | Size | Weight | Line height |
|---|---|---|---|
| Hero number (KPI value) | `30px` (text-3xl) | 700 | 1.1 |
| Section title | `18px` (text-lg) | 600 | 1.3 |
| Card title | `14px` (text-sm) | 500 | 1.4 |
| Body | `14px` (text-sm) | 400 | 1.5 |
| Label / caption | `12px` (text-xs) | 500 | 1.4, color `--color-text-muted` |

### Spacing

Base `4px`. Common: `4, 8, 12, 16, 20, 24, 32`. Card padding `24px` (p-6). Card gap in grids `20px` (gap-5). Section vertical rhythm `24px` (space-y-6).

### Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `8px` | Inputs, small buttons, pills |
| `--radius-md` | `12px` | Buttons, dropdowns, badges-large |
| `--radius-lg` | `16px` | Cards (default) |
| `--radius-xl` | `20px` | Hero cards, modals |
| `--radius-full` | `9999px` | Avatars, progress bars, status dots |

Current `--radius: 0.625rem` (10px) → bump to `1rem` (16px) for cards.

### Shadow

| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.04)` | Default card |
| `--shadow-card-hover` | `0 4px 12px rgba(15, 23, 42, 0.08)` | Card hover |
| `--shadow-dropdown` | `0 8px 24px rgba(15, 23, 42, 0.12)` | Popover, select, tooltip |
| `--shadow-tooltip-dark` | `0 4px 12px rgba(0, 0, 0, 0.25)` | Chart tooltip (dark pill) |

No heavy shadows. Borders + soft shadows only.

---

## 2. Component Patterns

### KPI / Stat Card (`components/kpis/KpiCard.tsx`)

Anatomy: title row (label left, optional date pill right) → big number → delta pill + comparison text.

```tsx
<div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 flex flex-col gap-3">
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-slate-600">Monthly Spent</span>
    <DatePill>July 16</DatePill>
  </div>
  <div className="text-3xl font-bold text-slate-900 tabular-nums">$45,623.48</div>
  <div className="flex items-center gap-2">
    <DeltaPill direction="up">16.5%</DeltaPill>
    <span className="text-xs text-slate-500">Compared to last month</span>
  </div>
</div>
```

DeltaPill:
- positive → `bg-emerald-50 text-emerald-700` + `↑`
- negative → `bg-red-50 text-red-700` + `↓`
- shape: `rounded-full px-2 py-0.5 text-xs font-semibold`

### Sidebar Nav (new — currently top header in `components/layout/Header.tsx`)

Move nav to left sidebar. Width `240px`, bg `white`, border-right `1px solid var(--color-border)`.

Item:
```tsx
<a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
              text-slate-600 hover:bg-slate-50">
  <Icon className="h-5 w-5" />
  Overview
</a>
```

Active state: `bg-blue-50 text-blue-700` + icon inherits color. NOT `bg-gray-100` (current).

Section labels above groups: `text-xs uppercase tracking-wider text-slate-400 px-3 py-2`.

### Header (top bar)

White bg, `64px` tall, border-bottom `1px solid var(--color-border)`. Left: page title (`text-lg font-semibold`). Right: search icon button, notification bell button, avatar+name pill.

Icon buttons: `h-10 w-10 rounded-xl border border-gray-200 grid place-items-center hover:bg-slate-50`.

### Chart Container (`components/charts/*`)

```tsx
<div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-slate-900">Cashflow</h3>
    <Select>This Month ▾</Select>  {/* rounded-full border bg-white px-3 py-1.5 text-sm */}
  </div>
  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
    <Legend dotColor="#2563EB">Expense</Legend>
    <Legend dotColor="#F59E0B">Income</Legend>
  </div>
  <ResponsiveContainer height={260}>...</ResponsiveContainer>
</div>
```

Recharts config:
- Line series: `stroke="#2563EB"` (expense), `stroke="#F59E0B"` (income), `strokeWidth={2.5}`, `dot={false}`, `activeDot={{ r: 5 }}`.
- Bars: `fill="#2563EB"`, `radius={[6, 6, 0, 0]}`. Kill `#f87171` in `HistogramChart.tsx`.
- Grid: `stroke="#F1F5F9"`, `strokeDasharray="3 3"`, `vertical={false}`.
- Axis ticks: `tick={{ fill: '#94A3B8', fontSize: 12 }}`, `axisLine={false}`, `tickLine={false}`.
- Tooltip: dark pill — `contentStyle={{ background: '#0F172A', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, padding: '6px 10px' }}`.

### Transaction Row (`components/transactions/TransactionsList.tsx`)

Replace dense table with airy rows. Each row `py-3`, divider via `border-b border-gray-100` (last:border-0).

Columns: avatar/logo (40×40 rounded-full bg `--color-primary-soft`, brand initial or icon) | name + masked acct (`text-sm font-medium` / `text-xs text-slate-400`) | date (`text-sm text-slate-600`) | amount (right-aligned, `tabular-nums font-semibold`, color = `text-emerald-600` for +, `text-red-500` for −).

Sticky header: `bg-white text-xs uppercase tracking-wide text-slate-400 font-medium`.

### Progress Bar (`components/budget/BudgetProgress.tsx`)

Card per goal with title, target line, current amount, then bar:
- Track: `h-2 rounded-full bg-slate-100`
- Fill: `h-2 rounded-full` width `${pct}%`, color by status:
  - healthy: `bg-blue-600`
  - warn (80%+): `bg-amber-500`
  - exceeded: `bg-red-500` + diagonal stripe overlay
- Pct label inside or to the right: `text-xs font-semibold text-white` (if fits) or `text-slate-600`.

### Buttons

| Variant | Class |
|---|---|
| Primary CTA | `bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold inline-flex items-center gap-2` |
| Secondary | `bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold` |
| Icon | `h-10 w-10 rounded-xl border border-gray-200 grid place-items-center text-slate-600 hover:bg-slate-50` |
| Ghost / dropdown trigger | `rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50` |

### Badges / Pills

Category badge in transaction row: `inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium`, bg = category color @ 12% opacity, text = category color @ 100%. Helper: convert hex to rgba(.., 0.12).

---

## 3. Motion

| Element | Transition |
|---|---|
| Card hover | `transition-shadow duration-200 ease-out` (shadow only, no transform) |
| Button hover | `transition-colors duration-150 ease-out` |
| Nav item active swap | `transition-colors duration-150` |
| Dropdown open | `transition-opacity duration-150` + Radix default scale |
| Chart tooltip | Recharts default (no overrides) |

No bouncy springs. No `transform: scale` on cards. Subtle.

---

## 4. Do / Don't

| Do | Don't |
|---|---|
| Use `--color-danger` (red) **only** for negative values & errors | Don't paint all bars/lines red — that's the current bug |
| Anchor primary actions in `--color-primary` (blue) | Don't introduce a third primary; secondary actions are gray |
| Keep cards `bg-white` on `bg-gray-50` page | Don't put cards on white page — lose separation |
| Use `rounded-2xl` (16px) for cards consistently | Don't mix `rounded-lg` (8) and `rounded-2xl` in same row |
| Tabular nums (`tabular-nums`) on all amounts | Don't proportional-space numbers — columns misalign |
| Borders + `shadow-sm` together | Don't use `shadow-lg` on cards — too heavy |
| Pills for deltas (`+16.8%` in soft bg) | Don't put deltas as plain colored text — no separation |
| Sidebar nav, top header for page title only | Don't keep horizontal nav tabs in header — wastes vertical hierarchy |

---

## 5. Tailwind v4 `@theme` snippet

Replace the current block in `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;

  --color-background: #F3F4F6;
  --color-foreground: #0F172A;
  --color-card: #FFFFFF;
  --color-card-foreground: #0F172A;
  --color-muted: #F9FAFB;
  --color-muted-foreground: #94A3B8;
  --color-border: #E5E7EB;
  --color-input: #E5E7EB;
  --color-ring: #2563EB;

  --color-primary: #2563EB;
  --color-primary-foreground: #FFFFFF;
  --color-secondary: #F1F5F9;
  --color-secondary-foreground: #0F172A;
  --color-accent: #F59E0B;
  --color-accent-foreground: #FFFFFF;
  --color-destructive: #EF4444;
  --color-destructive-foreground: #FFFFFF;
  --color-success: #10B981;

  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.25rem;
  --radius: 1rem;

  --shadow-card: 0 1px 2px rgba(15,23,42,.04), 0 1px 3px rgba(15,23,42,.04);
  --shadow-card-hover: 0 4px 12px rgba(15,23,42,.08);
  --shadow-dropdown: 0 8px 24px rgba(15,23,42,.12);
}

body {
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}

.tabular-nums { font-variant-numeric: tabular-nums; }
```

Drop existing oklch palette + `--destructive: oklch(0.577 0.245 27.325)`.

---

## 6. Migration Priority

Order maximizes visual impact per PR. Each step ships independently.

1. **Tokens swap** (`src/index.css`) — 1 file, instantly recolors everything via shadcn primitives. Single biggest win.
2. **HistogramChart** (`components/charts/HistogramChart.tsx`) — change bar fill `#f87171` → `#2563EB`, grid `#F1F5F9`, axis `#94A3B8`. Kills the salmon shock.
3. **KpiCard + KpiGrid** — add delta pills, bump radius to `rounded-2xl`, reorganize layout per anatomy above. Now top of dashboard reads as fintech.
4. **Buttons** (shadcn `button.tsx` variants) — primary blue, rounded-xl, restyle ghost/secondary. Affects all CTAs.
5. **TransactionsList** — airy rows, avatar circles, tabular amounts with green/red. High-density component, big perceived polish.
6. **Layout shell** — extract sidebar from `Header.tsx` into `Sidebar.tsx`, keep top header for title + search/bell/avatar. Restructure `DashboardLayout.tsx` to flex row (sidebar + main).
7. **CategoryDonut** — light gray center, dark pill tooltip, legend dots. Recharts `Tooltip` content style swap.
8. **BudgetProgress** — bars per palette above, hatched overlay for exceeded.
9. **Form inputs / Select / Popover** (shadcn) — radius `rounded-xl`, border `--color-border`, focus ring `--color-primary`.
10. **Empty states + skeletons** — last polish pass; muted gray illustrations, no salmon.

After step 4, dashboard already looks like the reference.
