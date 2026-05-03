import { Tags } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { getCategoryColor } from "@/lib/categoryColors"
import { useCategories } from "@/hooks/useCategories"

interface CategorySelectorProps {
  value: string | undefined
  onChange: (category: string | undefined) => void
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const { data: categories = [] } = useCategories(true)

  function handleChange(next: string) {
    onChange(next === "__all__" ? undefined : next)
  }

  const selected = categories.find((c) => c.slug === value)
  const label = selected ? selected.name : "TODAS"

  return (
    <Select value={value ?? "__all__"} onValueChange={handleChange}>
      <SelectTrigger className="w-auto min-w-0 gap-2 rounded-full border-slate-200 bg-white px-3 text-sm">
        {selected ? (
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: getCategoryColor(selected.slug) }}
          />
        ) : (
          <Tags className="h-3.5 w-3.5 text-slate-400" />
        )}
        <span className="truncate">{label}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">Todas las categorías</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.slug}>
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: getCategoryColor(cat.slug) }}
              />
              {cat.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
