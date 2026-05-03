// Fixed color palette + persisted random color for unknown categories
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
  MOVIMIENTO_ENTRE_BANCOS: "#f59e0b",
  OTROS: "#94a3b8",
  SIN_CATEGORIZAR: "#d1d5db",
}

const RANDOM_KEY = "fin-fe:catColors:v1"

function loadRandom(): Record<string, string> {
  try {
    const raw = localStorage.getItem(RANDOM_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

let randomColors: Record<string, string> = loadRandom()

function persistRandom() {
  try {
    localStorage.setItem(RANDOM_KEY, JSON.stringify(randomColors))
  } catch {
    // ignore
  }
}

function randomHex(): string {
  // HSL → hex with pleasant saturation/lightness
  const h = Math.floor(Math.random() * 360)
  const s = 60 + Math.floor(Math.random() * 25) // 60-85
  const l = 45 + Math.floor(Math.random() * 15) // 45-60
  return hslToHex(h, s, l)
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100
  const lN = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sN * Math.min(lN, 1 - lN)
  const f = (n: number) => {
    const color = lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function getCategoryColor(category: string | null): string {
  if (!category) return CATEGORY_COLORS.SIN_CATEGORIZAR
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category]
  if (randomColors[category]) return randomColors[category]
  const color = randomHex()
  randomColors = { ...randomColors, [category]: color }
  persistRandom()
  return color
}
