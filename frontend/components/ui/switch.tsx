'use client'
import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  id?: string
  disabled?: boolean
}

export function Switch({ checked, onChange, label, id, disabled }: SwitchProps) {
  const switchId = id || `switch-${Math.random().toString(36).slice(2)}`

  return (
    <label
      htmlFor={switchId}
      className={cn(
        'inline-flex items-center gap-2.5 cursor-pointer select-none group',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          checked ? 'bg-brand-500' : 'bg-line-strong',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm',
            'transition-transform duration-200 ease-in-out',
            'mt-0.5',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5',
          )}
        />
      </button>
      {label && (
        <span className="text-sm text-ink-subtle group-hover:text-ink transition-colors">
          {label}
        </span>
      )}
    </label>
  )
}
