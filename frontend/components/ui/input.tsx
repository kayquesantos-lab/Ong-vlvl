import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  icon?: ReactNode
  label?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, icon, label, hint, id, ...props },
  ref,
) {
  const inputId = id || props.name
  return (
    <div className="w-full group">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-semibold mb-1.5 transition-colors duration-200',
            error
              ? 'text-danger-500'
              : 'text-ink group-focus-within:text-brand-700',
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200',
              error ? 'text-danger-500' : 'text-ink-faint group-focus-within:text-brand-500',
            )}
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-11 rounded-lg border bg-surface-muted text-ink text-sm',
            'placeholder:text-ink-faint',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:bg-white focus:shadow-sm focus:shadow-brand-500/10',
            icon ? 'pl-10 pr-3' : 'px-3',
            error
              ? 'border-danger-500 focus:border-danger-500 focus:shadow-danger-500/15'
              : 'border-line focus:border-brand-500',
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-danger-500 animate-slide-down flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-danger-500" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  )
})
