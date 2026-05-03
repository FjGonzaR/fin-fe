// Emoji por slug de categoría. Mapping fijo + emoji random persistido para slugs nuevos.
// TODO: backfill a BD (`Category.icon`) cuando exista en backend.

const FIXED: Record<string, string> = {
  HOGAR: "🏠",
  RESTAURANTES: "🍽️",
  DOMICILIOS: "🛵",
  OCIO: "🎮",
  CARRO: "🚗",
  TRANSPORTE: "🚕",
  ROPA: "👕",
  SALUD: "💊",
  EDUCACION: "🎓",
  TRABAJO: "💼",
  PLATAFORMAS: "📺",
  REGALOS: "🎁",
  PRESTACIONES: "💰",
  MOVIMIENTO_ENTRE_BANCOS: "🔄",
  OTROS: "🏷️",
  COBRO_BANCARIO: "🏦",
  PAGO: "✅",
  INGRESO: "💵",
  INVERSION: "📈",
  SIN_CATEGORIZAR: "❓",
}

// Pool para slugs no mapeados (categorías nuevas creadas en admin)
const POOL = [
  "🛒", "☕", "✈️", "📚", "🎵", "🎬", "🍔", "🍕", "🍣", "🍺",
  "🏋️", "⚽", "🚴", "🏖️", "🐶", "🐱", "🌱", "💡", "🔧", "🧰",
  "📱", "💻", "🎨", "🎤", "🛠️", "💎", "🧴", "🪑", "🛏️", "🧹",
  "🍰", "🍩", "🥗", "🥑", "🍎", "🌮", "🍦", "🧊", "🪣", "🧺",
]

const STORAGE_KEY = "fin-fe:catIcons:v1"

function load(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

let randomIcons: Record<string, string> = load()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(randomIcons))
  } catch {
    // ignore
  }
}

export function getCategoryIcon(slug: string | null): string {
  if (!slug) return FIXED.SIN_CATEGORIZAR
  if (FIXED[slug]) return FIXED[slug]
  if (randomIcons[slug]) return randomIcons[slug]
  const emoji = POOL[Math.floor(Math.random() * POOL.length)]
  randomIcons = { ...randomIcons, [slug]: emoji }
  persist()
  return emoji
}
