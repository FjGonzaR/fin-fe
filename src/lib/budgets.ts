import type { Category } from "@/types/api";
export const CATEGORY_BUDGETS: Partial<Record<Category, number>> = {
  HOGAR: 5_500_000, // arriendo 3.2M
  RESTAURANTES: 1_500_000, // 2 veces por semana (max. 40.000) = 640_000 + 4 salidas por mes (max. 60.000) = 480_000 + 1 top = 300.000
  DOMICILIOS: 500_000, // 1 vez por semana (max. 50.000 c/u) = 400_000
  OCIO: 1_250_000, // 500k cada uno + 250k salidas juntos
  CARRO: 1_200_000, // 500k aprox en gasolina y parqueadero
  TRANSPORTE: 300_000, // 30 ubers al mes
  ROPA: 300_000, // 1 prenda top cada 3 meses
  SALUD: 1_900_000, // Incluye gym
  EDUCACION: 800_000, // Colombo + otros cursos de interes
  TRABAJO: 120_000, // AI
  PLATAFORMAS: 200_000, // Spotify, Netflix, etc.
  OTROS: 300_000,
  REGALOS: 100_000,
  PRESTACIONES: 500_000, // Independiente Lu
};

// 2.9M libres
