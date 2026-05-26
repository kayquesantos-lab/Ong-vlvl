'use client'
import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  hint?: string
  showLockIcon?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { className, label, error, hint, showLockIcon = true, id, onKeyUp, onKeyDown, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const inputId = id || props.name

  function checkCapsLock(e: React.KeyboardEvent<HTMLInputElement>) {
    setCapsLock(e.getModifierState?.('CapsLock') ?? false)
  }

  return (
    <div className="w-full group">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-semibold transition-colors duration-200',
              error ? 'text-danger-500' : 'text-ink group-focus-within:text-brand-700',
            )}
          >
            {label}
          </label>
          {capsLock && (
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-warning-700 animate-slide-down">
              <AlertTriangle className="w-3 h-3" />
              Caps Lock
            </span>
          )}
        </div>
      )}
      <div className="relative">
        {showLockIcon && (
          <span
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200',
              error ? 'text-danger-500' : 'text-ink-faint group-focus-within:text-brand-500',
            )}
          >
            <Lock className="w-4 h-4" />
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          onKeyUp={(e) => {
            checkCapsLock(e)
            onKeyUp?.(e)
          }}
          onKeyDown={(e) => {
            checkCapsLock(e)
            onKeyDown?.(e)
          }}
          className={cn(
            'w-full h-11 rounded-lg border bg-surface-muted text-ink text-sm',
            'placeholder:text-ink-faint',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:bg-white focus:shadow-sm focus:shadow-brand-500/10',
            showLockIcon ? 'pl-10' : 'pl-3',
            'pr-11',
            error
              ? 'border-danger-500 focus:border-danger-500 focus:shadow-danger-500/15'
              : 'border-line focus:border-brand-500',
            className,
          )}
          {...props}
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-ink-faint hover:text-brand-500 hover:bg-brand-50 transition-all active:scale-90"
          aria-label={visible ? 'Esconder senha' : 'Mostrar senha'}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
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
