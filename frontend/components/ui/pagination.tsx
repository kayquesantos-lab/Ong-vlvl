'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onChange: (page: number) => void
  itemLabel?: string
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
  itemLabel = 'registros',
}: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  // Sliding window de no maximo 5 paginas centradas em "page"
  const windowSize = 5
  const startPage = Math.max(1, Math.min(page - 2, totalPages - windowSize + 1))
  const endPage = Math.min(totalPages, startPage + windowSize - 1)
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-line-subtle">
      <span className="text-xs font-medium text-ink-muted">
        Mostrando <span className="font-bold text-ink">{start}–{end}</span> de{' '}
        <span className="font-bold text-ink">{total}</span> {itemLabel}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-line bg-white text-ink-muted hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Pagina anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn(
              'min-w-8 h-8 px-2 rounded-md text-xs font-bold transition-colors',
              n === page
                ? 'bg-brand-500 text-white'
                : 'bg-transparent text-ink-subtle hover:bg-surface-muted',
            )}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-line bg-white text-ink-muted hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Proxima pagina"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
