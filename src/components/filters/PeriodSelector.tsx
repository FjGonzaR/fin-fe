import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDateLabel } from "@/lib/dateUtils"

const MIN_DATE = "2026-01-01"

function todayStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

interface PeriodSelectorProps {
  date_from: string | undefined // "YYYY-MM-DD"
  date_to: string | undefined   // "YYYY-MM-DD"
  onChange: (date_from: string | undefined, date_to: string | undefined) => void
}

export function PeriodSelector({ date_from, date_to, onChange }: PeriodSelectorProps) {
  const [open, setOpen] = useState(false)
  const today = todayStr()

  const label = date_from && date_to
    ? `${formatDateLabel(date_from)} → ${formatDateLabel(date_to)}`
    : "Seleccionar período"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-none hover:bg-gray-50 focus:outline-none">
          <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
          <span>{label}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Desde</label>
            <input
              type="date"
              value={date_from ?? ""}
              min={MIN_DATE}
              max={date_to ?? today}
              onChange={(e) => onChange(e.target.value || undefined, date_to)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Hasta</label>
            <input
              type="date"
              value={date_to ?? ""}
              min={date_from ?? MIN_DATE}
              max={today}
              onChange={(e) => {
                onChange(date_from, e.target.value || undefined)
                if (e.target.value) setOpen(false)
              }}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
