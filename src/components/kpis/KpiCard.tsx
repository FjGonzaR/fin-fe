import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string
  subtitle?: string
  valueColor?: "default" | "green" | "red"
  isLoading?: boolean
}

export function KpiCard({ title, value, subtitle, valueColor = "default", isLoading }: KpiCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {isLoading ? (
          <Skeleton className="mt-2 h-8 w-3/4" />
        ) : (
          <p
            className={cn("mt-1 text-sm font-bold tracking-tight sm:text-base lg:text-xl", {
              "text-gray-900": valueColor === "default",
              "text-green-600": valueColor === "green",
              "text-red-500": valueColor === "red",
            })}
          >
            {value}
          </p>
        )}
        {subtitle && (
          <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
