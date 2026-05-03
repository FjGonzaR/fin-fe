import { useSyncExternalStore } from "react"

const STORAGE_KEY = "fin-fe:budgets:v1"

const SEED: Record<string, number> = {
  HOGAR: 5_500_000,
  RESTAURANTES: 1_750_000,
  DOMICILIOS: 500_000,
  OCIO: 1_250_000,
  CARRO: 1_200_000,
  TRANSPORTE: 300_000,
  ROPA: 300_000,
  SALUD: 1_900_000,
  EDUCACION: 800_000,
  TRABAJO: 120_000,
  PLATAFORMAS: 200_000,
  OTROS: 300_000,
  REGALOS: 100_000,
  PRESTACIONES: 500_000,
}

function load(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...SEED }
    const parsed = JSON.parse(raw) as Record<string, number>
    return { ...SEED, ...parsed }
  } catch {
    return { ...SEED }
  }
}

let state: Record<string, number> = load()
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function setBudget(slug: string, amount: number) {
  state = { ...state, [slug]: Math.max(0, Math.round(amount)) }
  persist()
  emit()
}

export function getBudget(slug: string): number {
  return state[slug] ?? 0
}

export function useBudgets(): Record<string, number> {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
    () => state,
  )
}
