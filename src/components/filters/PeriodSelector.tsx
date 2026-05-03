import { useEffect, useState } from "react"
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
  date_from: string | undefined
  date_to: string | undefined
  onChange: (date_from: string | undefined, date_to: string | undefined) => void
}

export function PeriodSelector({ date_from, date_to, onChange }: PeriodSelectorProps) {
  const [open, setOpen] = useState(false)
  const [draftFrom, setDraftFrom] = useState(date_from ?? "")
  const [draftTo, setDraftTo] = useState(date_to ?? "")
  const today = todayStr()

  useEffect(() => {
    if (open) {
      setDraftFrom(date_from ?? "")
      setDraftTo(date_to ?? "")
    }
  }, [open, date_from, date_to])

  const label =
    date_from && date_to
      ? `${formatDateLabel(date_from)} → ${formatDateLabel(date_to)}`
      : "Seleccionar período"

  function apply() {
    onChange(draftFrom || undefined, draftTo || undefined)
    setOpen(false)
  }

  function clear() {
    setDraftFrom("")
    setDraftTo("")
    onChange(undefined, undefined)
    setOpen(false)
  }

  const dirty = (draftFrom || "") !== (date_from ?? "") || (draftTo || "") !== (date_to ?? "")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-none hover:bg-slate-50 focus:outline-none">
          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
          <span>{label}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Desde</label>
            <input
              type="date"
              value={draftFrom}
              min={MIN_DATE}
              max={draftTo || today}
              onChange={(e) => setDraftFrom(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") apply() }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Hasta</label>
            <input
              type="date"
              value={draftTo}
              min={draftFrom || MIN_DATE}
              max={today}
              onChange={(e) => setDraftTo(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") apply() }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <button
              onClick={clear}
              className="rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
            >
              Limpiar
            </button>
            <button
              onClick={apply}
              disabled={!dirty}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Aplicar
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
