// Fixed color palette per category for consistent chart + badge colors
export const CATEGORY_COLORS: Record<string, string> = {
  HOGAR: "#6366f1",
  DOMICILIOS: "#f97316",
  CARRO: "#0ea5e9",
  TRANSPORTE: "#14b8a6",
  OCIO: "#a855f7",
  RESTAURANTES: "#f59e0b",
  ROPA: "#ec4899",
  SALUD: "#10b981",
  PRESTACIONES: "#3b82f6",
  REGALOS: "#e11d48",
  EDUCACION: "#8b5cf6",
  TRABAJO: "#64748b",
  COBRO_BANCARIO: "#ef4444",
  PAGO: "#22c55e",
  PLATAFORMAS: "#06b6d4",
  INGRESO: "#16a34a",
  INVERSION: "#0d9488",
  OTROS: "#94a3b8",
  SIN_CATEGORIZAR: "#d1d5db",
}

export function getCategoryColor(category: string | null): string {
  if (!category) return CATEGORY_COLORS.SIN_CATEGORIZAR
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.OTROS
}
