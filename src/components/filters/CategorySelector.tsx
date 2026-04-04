import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategoryColor } from "@/lib/categoryColors"
import { useCategories } from "@/hooks/useCategories"
import type { Category } from "@/types/api"

interface CategorySelectorProps {
  value: Category | undefined
  onChange: (category: Category | undefined) => void
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const { data: categories = [] } = useCategories(true)

  function handleChange(next: string) {
    onChange(next === "__all__" ? undefined : (next as Category))
  }

  return (
    <Select value={value ?? "__all__"} onValueChange={handleChange}>
      <SelectTrigger className="w-44 rounded-full border-gray-200 bg-white text-sm">
        <SelectValue placeholder="Categoría" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">Todas las categorías</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat} value={cat}>
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: getCategoryColor(cat) }}
              />
              {cat}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
