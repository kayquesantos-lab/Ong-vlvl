import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white shadow-sm hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shimmer-hover',
  secondary:
    'bg-accent-500 text-white shadow-sm hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shimmer-hover',
  outline:
    'bg-white text-ink-subtle border border-line hover:bg-surface-muted hover:text-ink hover:border-line-strong active:scale-[0.98]',
  ghost:
    'bg-transparent text-ink-subtle hover:bg-surface-muted hover:text-ink active:scale-[0.98]',
  danger:
    'bg-danger-500 text-white shadow-sm hover:bg-danger-700 hover:shadow-lg hover:shadow-danger-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg font-semibold',
        'transition-[transform,background-color,box-shadow,border-color] duration-200',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        'disabled:hover:translate-y-0 disabled:hover:shadow-sm',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
})
