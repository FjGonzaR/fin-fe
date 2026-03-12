/** Returns "YYYY-MM-01" (first day of month) */
export function monthToDateFrom(ym: string): string {
  return `${ym}-01`
}

/** Returns the last day of the month as "YYYY-MM-DD" */
export function monthToDateTo(ym: string): string {
  const [y, m] = ym.split("-").map(Number)
  const lastDay = new Date(y, m, 0).getDate()
  return `${ym}-${String(lastDay).padStart(2, "0")}`
}

/** Returns the number of calendar months covered by a date range (inclusive).
 *  e.g. "2026-01-01" → "2026-03-31" = 3 */
export function countMonths(date_from: string | undefined, date_to: string | undefined): number {
  if (!date_from || !date_to) return 1
  const [fy, fm] = date_from.slice(0, 7).split("-").map(Number)
  const [ty, tm] = date_to.slice(0, 7).split("-").map(Number)
  return (ty - fy) * 12 + (tm - fm) + 1
}

/** Returns the last N month strings in "YYYY-MM" format, ending at today */
export function getDefaultMonthRange(n = 3): { start: string; end: string } {
  const now = new Date()
  const end = toYearMonth(now)
  const startDate = new Date(now.getFullYear(), now.getMonth() - (n - 1), 1)
  const start = toYearMonth(startDate)
  return { start, end }
}

/** Generates last `count` months as "YYYY-MM" strings, most recent first */
export function getAvailableMonths(count = 24): string[] {
  const now = new Date()
  const months: string[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(toYearMonth(d))
  }
  return months
}

/** Formats "YYYY-MM" as "Ene 25" */
export function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split("-")
  const date = new Date(Number(year), Number(monthNum) - 1, 1)
  const label = date.toLocaleDateString("es-CO", { month: "short", year: "2-digit" })
  return label.replace(/\./g, "")
}

function toYearMonth(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}
