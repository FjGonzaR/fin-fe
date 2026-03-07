/** Returns "YYYY-MM,YYYY-MM" string from two month strings */
export function buildMonthsParam(start: string, end: string): string {
  return `${start},${end}`
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
