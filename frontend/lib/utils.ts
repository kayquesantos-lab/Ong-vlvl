import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes Tailwind sem conflito (a ultima vence).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um numero como BRL.
 */
export function formatBRL(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? Number(value) : value ?? 0
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Formata uma data ISO (YYYY-MM-DD) ou Date como DD/MM/YYYY.
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value + 'T00:00:00') : value
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('pt-BR')
}

/**
 * Gera o ID display padrao da ONG: "VL-001".
 */
export function formatAnimalId(id: number): string {
  return `VL-${String(id).padStart(3, '0')}`
}

export function formatContaId(id: number): string {
  return `VL-${String(id).padStart(3, '0')}`
}
