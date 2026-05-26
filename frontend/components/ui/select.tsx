import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, error, id, children, ...props },
  ref,
) {
  const selectId = id || props.name
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-bold text-ink-faint mb-1.5 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full h-10 appearance-none rounded-lg border bg-white text-ink text-sm',
            'pl-3 pr-9 cursor-pointer',
            'transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-danger-500 focus:border-danger-500'
              : 'border-line focus:border-brand-500',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none"
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
    </div>
  )
})
