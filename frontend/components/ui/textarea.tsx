import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  optional?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, error, optional, id, ...props },
  ref,
) {
  const textareaId = id || props.name
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-semibold text-ink mb-1.5">
          {label}{' '}
          {optional && <span className="text-ink-faint font-normal">(opcional)</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          'w-full rounded-lg border bg-surface-muted text-ink text-sm px-3 py-2.5',
          'placeholder:text-ink-faint resize-y',
          'transition-colors',
          'disabled:opacity-50',
          error
            ? 'border-danger-500 focus:border-danger-500'
            : 'border-line focus:border-brand-500 focus:bg-white',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
    </div>
  )
})
