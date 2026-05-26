'use client'
import { useCountUp } from '@/hooks/use-count-up'

interface Props {
  value: number
  /** Funcao para formatar o numero (ex: formatBRL). Recebe o numero animado a cada frame. */
  format?: (n: number) => string
  /** Casas decimais quando nao ha format. Default 0. */
  decimals?: number
  duration?: number
  className?: string
}

export function CountUp({ value, format, decimals = 0, duration = 900, className }: Props) {
  const animated = useCountUp(value, { duration })
  const display = format
    ? format(animated)
    : animated.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
  return <span className={className}>{display}</span>
}
