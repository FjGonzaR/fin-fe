import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string
  subtitle?: string
  tone?: "default" | "success" | "danger"
  isLoading?: boolean
}

export function KpiCard({ title, value, subtitle, tone = "default", isLoading }: KpiCardProps) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="flex flex-col gap-2 p-6">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        {isLoading ? (
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <span
            className={cn(
              "text-2xl font-bold leading-tight tracking-tight tabular-nums lg:text-3xl",
              {
                "text-slate-900": tone === "default",
                "text-emerald-600": tone === "success",
                "text-red-500": tone === "danger",
              },
            )}
          >
            {value}
          </span>
        )}
        {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
      </CardContent>
    </Card>
  )
}
