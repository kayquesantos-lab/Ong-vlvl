'use client'
import { useEffect, useRef, useState } from 'react'

interface Options {
  duration?: number
  /**
   * Easing function que recebe progresso 0..1 e devolve 0..1.
   * Default: easeOutCubic (rapido no comeco, suave no final).
   */
  easing?: (t: number) => number
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Anima um numero de 0 (ou do valor anterior) ate `target`.
 * Refaz a animacao toda vez que `target` mudar.
 */
export function useCountUp(target: number, { duration = 900, easing = easeOutCubic }: Options = {}) {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const fromRef = useRef(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    fromRef.current = value
    startRef.current = null

    function step(t: number) {
      if (startRef.current === null) startRef.current = t
      const elapsed = t - startRef.current
      const progress = Math.min(1, elapsed / duration)
      const eased = easing(progress)
      const current = fromRef.current + (target - fromRef.current) * eased
      setValue(current)
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return value
}
