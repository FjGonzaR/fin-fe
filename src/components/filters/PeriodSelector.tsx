import { useState } from "react"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { monthToDateFrom, monthToDateTo, formatMonthLabel } from "@/lib/dateUtils"

// Fixed range: Jan 2026 → current month
const MIN_YEAR = 2026
const MIN_MONTH = 1 // January

function toYearMonth(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`
}

function getNow() {
  const d = new Date()
  return { year: d.getFullYear(), month: d.getMonth() + 1 }
}

function parseYM(ym: string): { year: number; month: number } {
  const [y, m] = ym.split("-")
  return { year: Number(y), month: Number(m) }
}

function isInRange(year: number, month: number, now: { year: number; month: number }) {
  const v = year * 100 + month
  return v >= MIN_YEAR * 100 + MIN_MONTH && v <= now.year * 100 + now.month
}

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

interface MonthGridProps {
  year: number
  selected: string | null
  selectionStart: string | null
  selectionEnd: string | null
  onSelect: (ym: string) => void
  now: { year: number; month: number }
}

function MonthGrid({ year, selected, selectionStart, selectionEnd, onSelect, now }: MonthGridProps) {
  return (
    <div className="grid grid-cols-4 gap-1">
      {MONTH_LABELS.map((label, i) => {
        const month = i + 1
        const ym = toYearMonth(year, month)
        const enabled = isInRange(year, month, now)
        const isSelected = ym === selected || ym === selectionStart || ym === selectionEnd
        const isInSpan =
          selectionStart &&
          selectionEnd &&
          ym >= selectionStart &&
          ym <= selectionEnd

        return (
          <button
            key={ym}
            disabled={!enabled}
            onClick={() => enabled && onSelect(ym)}
            className={[
              "rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
              !enabled && "cursor-not-allowed text-gray-300",
              enabled && !isSelected && !isInSpan && "text-gray-700 hover:bg-gray-100",
              isSelected && "bg-gray-900 text-white",
              !isSelected && isInSpan && "bg-gray-100 text-gray-700",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

interface PeriodSelectorProps {
  date_from: string | undefined // "YYYY-MM-DD"
  date_to: string | undefined   // "YYYY-MM-DD"
  onChange: (date_from: string | undefined, date_to: string | undefined) => void
}

export function PeriodSelector({ date_from, date_to, onChange }: PeriodSelectorProps) {
  const now = getNow()
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(now.year)
  const [picking, setPicking] = useState<"start" | "end">("start")

  const start = date_from ? date_from.slice(0, 7) : ""
  const end = date_to ? date_to.slice(0, 7) : ""
  const startParsed = start ? parseYM(start) : null
  const endParsed = end ? parseYM(end) : null

  const canGoPrev = viewYear > MIN_YEAR
  const canGoNext = viewYear < now.year

  const label = start && end
    ? `${formatMonthLabel(start)} → ${formatMonthLabel(end)}`
    : "Seleccionar período"

  function handleSelect(ym: string) {
    if (picking === "start") {
      // Set temporary same-month range so span is visible; wait for second pick
      onChange(monthToDateFrom(ym), monthToDateTo(ym))
      setPicking("end")
    } else {
      // Second pick: ensure start <= end
      const current = start || ym
      const [s, e] = ym >= current ? [current, ym] : [ym, current]
      onChange(monthToDateFrom(s), monthToDateTo(e))
      setPicking("start")
      setOpen(false)
    }
  }

  // When popover opens, reset picking state
  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) setPicking("start")
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-none hover:bg-gray-50 focus:outline-none">
          <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
          <span>{label}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-4">
        {/* Year navigation */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => setViewYear((y) => y - 1)}
            disabled={!canGoPrev}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-gray-800">{viewYear}</span>
          <button
            onClick={() => setViewYear((y) => y + 1)}
            disabled={!canGoNext}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Instruction */}
        <p className="mb-2 text-center text-xs text-gray-400">
          {picking === "start" ? "Selecciona el mes de inicio" : "Selecciona el mes de fin"}
        </p>

        <MonthGrid
          year={viewYear}
          selected={picking === "start" ? null : (start || null)}
          selectionStart={startParsed ? toYearMonth(startParsed.year, startParsed.month) : null}
          selectionEnd={endParsed ? toYearMonth(endParsed.year, endParsed.month) : null}
          onSelect={handleSelect}
          now={now}
        />
      </PopoverContent>
    </Popover>
  )
}
