import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { OwnerEnum } from "@/types/api"

interface OwnerSelectorProps {
  value: OwnerEnum | undefined
  onChange: (value: OwnerEnum | undefined) => void
}

// Use a sentinel string instead of "" so ToggleGroup works correctly
const GENERAL = "GENERAL"

const OPTIONS: Array<{ label: string; value: string }> = [
  { label: "General", value: GENERAL },
  { label: "Pacho", value: "PACHO" },
  { label: "Lu", value: "LU" },
]

export function OwnerSelector({ value, onChange }: OwnerSelectorProps) {
  const current = value ?? GENERAL

  function handleChange(next: string) {
    // ToggleGroup sends "" when clicking the active item — keep current selection
    if (!next) return
    onChange(next === GENERAL ? undefined : (next as OwnerEnum))
  }

  return (
    <ToggleGroup
      type="single"
      value={current}
      onValueChange={handleChange}
      className="gap-1"
    >
      {OPTIONS.map((opt) => (
        <ToggleGroupItem
          key={opt.value}
          value={opt.value}
          className="rounded-full px-4 text-sm font-medium transition-colors data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:shadow-sm"
        >
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
