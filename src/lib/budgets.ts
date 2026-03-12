import type { Category } from "@/types/api"
export const CATEGORY_BUDGETS: Partial<Record<Category, number>> = {
  HOGAR:        5_500_000,
  RESTAURANTES: 1_200_000,
  DOMICILIOS:   600_000,
  OCIO:         1_200_000,
  CARRO:        1_000_000,
  TRANSPORTE:   350_000,
  ROPA:         300_000,
  SALUD:        850_000,
  EDUCACION:    800_000,
  TRABAJO:      200_000,
  PLATAFORMAS:  150_000,
  OTROS:        100_000,
}