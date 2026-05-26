import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'violet'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-accent-50 text-accent-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
  info: 'bg-info-50 text-info-700',
  neutral: 'bg-surface-subtle text-ink-muted',
  violet: 'bg-violet-50 text-violet-700',
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full',
        'text-xs font-bold uppercase tracking-tight whitespace-nowrap',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
